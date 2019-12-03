---
slug: creating-a-popout-iframe-with-adoptnode-and-magic-iframes
date: 2019-10-06T20:58:16.791Z
title: 'Creating a pop-out iframe with adoptNode and "magic iframes"'
tags: [iframe, popout, adoptNode]
---

Cập nhật ### : ngày 8 tháng 10 - Các vấn đề quan trọng với tài liệu này.

Tôi đã bắt kịp với [Jake Archibald](https://jakearchibald.com/) về bài đăng này vì tôi nghĩ rằng tôi có một cuốn tiểu thuyết, trong cuộc trò chuyện, chúng tôi đã phát hiện ra rất nhiều điều làm cho một số bài đăng này không hợp lệ và tôi cũng đã học được rất nhiều trong quá trình mà tôi không nghĩ rằng hầu hết các nhà phát triển biết

* Gọi `.append()` và `.appendChild()` thông qua nút. Điều này làm cho việc sử dụng `adoptNode` trong trường hợp này trở nên vô dụng vì Thuật toán nối thêm đảm bảo rằng nút được thông qua. Điều này đã không được đề cập trong các tài liệu MDN, nhưng là trong [spec](https://dom.spec.whatwg.org/#concept-node-append) . Tôi cần phải quay lại và tập luyện tại sao tôi gặp vấn đề sớm hơn, nhưng tôi nghi ngờ đó là do tôi đã cố gắng nối thêm một `DocumentFragment` . Điều này có nghĩa là cả `w.document.body.appendChild(document.adoptNode(airhornerIframe));` và `w.document.body.appendChild(airhornerIframe);` sẽ có cùng tác dụng.
* Trong khi các phần tử DOM sẽ giữ trạng thái của chúng (kiểm tra phần tử tùy chỉnh), nếu iframe được di chuyển trong DOM, nó sẽ được tải lại. Giai đoạn. Điều này có nghĩa là việc di chuyển nó giữa các iframe sẽ không giữ trạng thái như tôi đã thử nghiệm ban đầu, tôi tin rằng điều này là do thực tế là SW đã tải trang cực kỳ nhanh chóng. API cổng có thể không bị ảnh hưởng bởi điều này - vì vậy trong tương lai trải nghiệm này sẽ hoạt động :)

Khái niệm về các yếu tố di chuyển giữa các tài liệu vẫn còn hiệu lực và thú vị, nhưng lợi ích của iframe không có ở đó. Tôi nhận thấy rằng các yếu tố video đã được đặt lại khi được di chuyển giữa các cửa sổ và tôi nên cẩn thận hơn khi xác minh iframe không thực sự đặt lại trạng thái của nó.

Như mọi khi, bạn có thể thấy [commit history for this post](https://github.com/PaulKinlan/paul.kinlan.me/commits/main/content/en/2019-10-06-creating-a-popout-iframe-with-adoptnode-and-magic-iframes.markdown) .

### Bài đăng gốc Khi tôi gia nhập Google năm 2010, tôi tình cờ thấy một tài liệu đề cập đến một khái niệm trong gmail có tên là &#39; [magic iframes](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf) &#39;, nó có một cái tên rất hay và khái niệm này là tiểu thuyết.

> * Targeted at apps with multiple windows
> * All code and data go into an IFRAME
> * If window hosting the IFRAME unloads, it gets adopted by another of the windows
> * In Gmail for example:
>   * Tearoff / pop-out compose creates bare window that is filled by code in IFRAME in main window
>   * If you close the main window, the code looks for a tear-off that can accept the IFRAME and moves it
>   * You finish your compose and can still send the email
> * Old way: create new instance of Gmail tailored to the task.

- [Adam de Boor](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf)

Khái niệm là nhiều ứng dụng phải tải rất nhiều JavaScript phức tạp ngay cả đối với một &#39;thành phần nhỏ&#39; như cửa sổ soạn thảo trong gmail, bạn có thể tải các thành phần của ứng dụng trong `iframe` mà người dùng có thể tương tác trong cửa sổ chính, sau đó bạn có thể &#39;xé&#39; và chuyển sang cửa sổ mới khi sử dụng nút bấm &#39;soạn trong cửa sổ mới&#39;. Tôi không đủ tự tin để nói chuyện với tác giả (và tôi vẫn chưa hiểu, tôi cũng chưa xem nguồn gmail để xem nó có thực sự được sử dụng không) nhưng nó vẫn ở trong tâm trí tôi vì cái tên này rất khó hiểu .

Bắt đầu 10 năm và tôi đã đi xe lửa dài và bắt đầu điều tra một khu vực mà tôi không biết nhiều về API `adoptNode` . Tôi đã chơi với [lot of ideas](https://nifty-meadowlark.glitch.me/) và tôi nhận ra rằng có thể di chuyển các phần tử DOM, trạng thái hiện tại và trình xử lý sự kiện đính kèm của chúng vào các cửa sổ mới. Điều này nhắc nhở tôi về &#39;ma thuật iframe&#39; và cuối cùng dẫn đến ý tưởng rằng bạn có thể tạo một iframe bật ra (iframe bật ra là hình ảnh trong video Ảnh nhưng đối với các yếu tố iframe)

Mã cho iframe bật ra khá đơn giản:

```html
<iframe src="https://airhorner.com" id="airhorner"> </iframe>

<button id="adoptIframeButton">
  Popout iframe into new window (adoptNode)
</button>

<script>
 adoptIframeButton.addEventListener("click", () => {
    const airhornerIframe = document.getElementById("airhorner");
    const width = airhornerIframe.clientWidth;
    const height = airhornerIframe.clientHeight;
    const w = window.open("blank.html", "", `top=100,width=${width},height=${height}`);
    w.addEventListener("load", () => {
      w.document.body.appendChild(airhornerIframe);
    });
 });
</script>
```

<iframe src="https://airhorner.com" id="airhorner"> </iframe>

<button id="adoptIframeButton">
  Popout iframe into new window (adoptNode)
</button>

<script>
 adoptIframeButton.addEventListener("click", () => {
    const airhornerIframe = document.getElementById("airhorner");
    const width = airhornerIframe.clientWidth;
    const height = airhornerIframe.clientHeight;
    const w = window.open("/blank.html", "", `top=100,width=${width},height=${height}`);
    w.addEventListener("load", () => {
      w.document.body.appendChild(airhornerIframe);
    });
 });
</script>

`adoptNode` cho phép bạn di chuyển các phần tử DOM với trạng thái hiện tại của chúng trong khi duy trì các trình xử lý sự kiện ràng buộc hiện có của chúng, giữa các tài liệu trong trình duyệt - đó có thể là một DOM mới bên trong cửa sổ hiện tại hoặc như trong trường hợp của bản demo này, nó có thể đang di chuyển đã tải `iframe` vào một cửa sổ khác có cùng nguồn gốc. (Xem cập nhật ở trên).

Di chuyển iframe rất thú vị bởi vì điều đó có nghĩa là bạn không phải khởi động lại nội dung của iframe, thể hiện mới được di chuyển. Có một vài nhược điểm:

1. URL vẫn ở nguồn gốc hiện tại chứ không phải nguồn gốc iframe, mặc dù đây có thể là điều mà API `<portal>` có thể giải quyết.
2. Nếu bạn đang di chuyển một yếu tố tùy chỉnh hoặc thứ gì đó có logic được lưu trữ trên dụng cụ mở - nếu bạn đóng công cụ mở, việc thực thi sẽ dừng lại.

Nhược điểm sang một bên, tôi nghĩ cơ chế IPC cấp DOM này rất rất thú vị. Chơi với [demo page](https://nifty-meadowlark.glitch.me/) ( [src](https://glitch.com/edit/#!/nifty-meadowlark?path=script.js) ) và cho tôi biết nếu bạn có bất kỳ ý tưởng thú vị nào về việc có thể sử dụng cái này ở đâu.

