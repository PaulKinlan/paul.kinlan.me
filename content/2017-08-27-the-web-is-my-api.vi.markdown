---
slug: the-web-is-my-api
date: 2017-08-27T13:20:31+01:00
title: "The Web is my API"
image_header: /images/bridges.png
tags: ["intents"]
---


[Michael Mahemoff](http://softwareas.com) đã dạy tôi rất nhiều về khả năng của web. Trước khi làm việc với Mike tôi đã xây dựng trên web và tôi hiểu những lợi ích như khả năng liên kết và khám phá, nhưng tôi chưa bao giờ thực sự có một bức tranh đầy đủ về những gì có thể.

Một điều mà Mike nói là "[Web là API của tôi](http://softwareas.com/cors-scraping-and-microformats/)", nơi anh ta nói về việc có thể hiển thị trang web và dữ liệu của bạn trong một trang qua microformats và dữ liệu có cấu trúc khác và có thể truy cập trực tiếp từ một bối cảnh trình duyệt khác, bằng cách sử dụng một XMLHttpRequest đơn giản và API CORS:

>Anyway, what’s cool about this is you can treat the web as an API. The Web is
>my API. "Scraping a web page" may sound dirtier than "consuming a web service",
>but it’s the cleaner approach in principle. A website sitting in your browser
>is a perfectly human-readable depiction of a resource your program can get hold
>of, so it’s an API that’s self-documenting. The best kind of API. But a whole
>HTML document is a lot to chew on, so we need to make sure it’s structured
>nicely, and that’s where microformats come in, gloriously defining lightweight
>standards for declaring info in your web page. There’s another HTML5 tie-in
>here, because we now have a similar concept in the standard, microdata.


Đó là khoảng thời gian mà tôi đã bắt đầu làm việc trên [Web Intents](https://en.wikipedia.org/wiki/Web_Intents), tinh thần tương tự & mdash; cấp cho người dùng quyền truy cập vào dữ liệu và dịch vụ từ một nguồn gốc khác & mdash; nhưng nó phức tạp hơn nhiều. Tôi muốn cho phép khám phá các dịch vụ và sau đó tương tác với các trang đó. Và Mike muốn di chuyển trang web để cung cấp quyền truy cập vào dữ liệu và dịch vụ. Nó bị mắc kẹt với tôi. [Ngay cả khi tôi đã quên thuộc tính ban đầu](https://twitter.com/Paul_Kinlan/status/913000817170534400).

Gần đây tôi đã nói chuyện với Nordic JS, nơi tôi nhấn mạnh rằng chúng tôi không xây dựng các dịch vụ kết nối thực sự trên web và khi chúng tôi thực hiện theo mô hình chủ yếu là tương tác giữa máy chủ và máy chủ. Đó là một trang web sẽ tích hợp với một dịch vụ bên thứ 3 bằng cách định tuyến tất cả các yêu cầu API thông qua máy chủ của họ đến dịch vụ từ xa và quản lý tất cả các phức tạp đi kèm với điều đó.

{{<figure src = "/ images / server-server.png" title = "Máy chủ đến Máy chủ - như xây dựng đường hầm giữa các dịch vụ">}}

Nó hoạt động, chúng tôi có toàn bộ web được xây dựng với điều này, nhưng nó có thể cực kỳ phức tạp khi bạn xem xét authenticaion, ủy quyền, giao thức vận tải và các phương pháp RPC khác nhau (REST, GraphQL vv). Mike đã đề xuất một cái gì đó thanh lịch hơn, với CORS cho phép các trang web và một chút JavaScript, chúng ta có thể nói chuyện trực tiếp với dịch vụ từ xa bằng cách sử dụng trang web.

{{<figure src = "/ images / server-rpc.png" title = "Bản vẽ khủng khiếp của tôi mà tôi đã sử dụng để mô tả Client to Server">}}

Đã có một số vấn đề được cắt ở giữa. Vấn đề chính là mặc dù CORS được hỗ trợ rộng rãi trong các trình duyệt, các nhà phát triển hiếm khi sử dụng nó. CORS là một sự bảo vệ mà chúng ta cần trên web nhưng khó thiết lập và gỡ lỗi và "Web dưới dạng API" chưa thực sự bị đẩy quá nhiều.

{{<figure src="/ hình ảnh / máy chủ-rpc-nope.png" title="CORS bị cản trở">}}

Chúng tôi đang chuyển sang một thế giới nơi các trang web được tạo ra trong ứng dụng khách với JS và các phiên và trạng thái cho người dùng được quản lý hoàn toàn trên ứng dụng khách.

Chúng tôi vẫn cần khả năng giao tiếp từ trang web của mình đến dịch vụ từ xa và tôi vẫn tin rằng chúng tôi cần phân quyền tích hợp với các trang web và ứng dụng khác, nhưng điều đầu tiên chúng tôi cần làm là kết nối các trang web và ứng dụng của chúng ta với nhau không chỉ là một liên kết. Chúng tôi cần các trang web của chúng tôi để lộ khả năng và chức năng của họ trực tiếp đến các cửa sổ khác trên hệ thống người dùng.

Mỗi trang web sẽ có thể hiển thị một API mà chủ sở hữu của trang web đó kiểm soát, trực tiếp cho các khách hàng khác.

{{<figure src="/ hình ảnh/khách hàng-rpc.png" title= "Khách hàng cho khách hàng">}}

Tin tốt là chúng tôi đã có thể làm điều đó, chúng tôi đã có các bản gốc trên nền tảng trong ít nhất 7 năm (`postMessage` và` MessageChannel`), và mãi mãi kể từ `window.open`, nhưng chúng tôi không sử dụng Các công cụ này tương tác với các trang web vì lý do tương tự tại sao chúng tôi không sử dụng CORS: Thật khó và gần như không thể xác định một API sane đơn giản và nhất quán để sử dụng và không yêu cầu kéo các thư viện của bên thứ ba lớn cho mỗi dịch vụ mà bạn muốn tương tác với.

Nền tảng này chỉ cho phép bạn giao tiếp giữa các trang web bằng cách sử dụng tính năng nhắn tin có nghĩa là chủ sở hữu dịch vụ nếu bạn muốn tạo API, bạn phải tạo một máy trạng thái để tuần tự hóa thông báo ở một số trạng thái, phản ứng với nó và sau đó gửi thông điệp trở lại máy khách và sau đó bạn phải tạo một thư viện làm điều đó cho nhà phát triển tiêu thụ dịch vụ của bạn. Nó vô cùng phức tạp và phức tạp và tôi tin rằng đây là một trong những lý do chính khiến chúng tôi không thấy sự chấp nhận nhiều hơn của các Web Worker và API phía máy khách.

{{<figure src = "/ images / window-dx.png" title = "Cửa sổ postMessage kinh nghiệm nhà phát triển">}}

Chúng tôi có một thư viện giúp: [Comlink](https://github.com/GoogleChromeLabs/comlink).

Comlink là một API nhỏ tóm tắt API `MessageChannel` và` postMessage` trong API có vẻ như bạn đang khởi tạo các lớp và hàm từ xa trong ngữ cảnh cục bộ. Ví dụ:


**Trang mạng**


```javascript
// Set up.
const worker = w.open('somesite');
const api = Comlink.proxy(w);

// Use the API.
const work = await new api.Test();
const str = await work.say('Yo!');
console.log(str);
```



** Nhân viên Web **


```javascript
class Test {
  say() {
    return `Hi ${this.x++}, ${msg}`;
  }
}

// Expose the API to anyone who connects.
Comlink.expose({Test}, window);
```


{{<figure src = "/ images / comlink.png" title = "Comlink">}}

Chúng tôi trưng ra một API trên dịch vụ, chúng tôi tiêu thụ API trong ứng dụng khách qua proxy.

### Có ví dụ nào tốt hơn không?

Tôi đã xây dựng một [trang web đăng ký một điểm cuối pubsubhubbub và khi nó nhận được một ping nó sẽ gửi một thông báo JSON](https://rss-to-web-push.glitch.me/) đến một điểm cuối do người dùng xác định. Tôi không muốn quản lý cơ sở hạ tầng thông báo đẩy cho ứng dụng nhỏ này, một trang web khác mà tôi đã xây dựng ([webpush.rocks](https://webpush.rocks/)) có thể làm tất cả những điều đó, tôi chỉ muốn sử dụng tích hợp với dịch vụ đó ..

Nhưng làm cách nào để tôi nhận được URL đăng ký (phần dữ liệu tôi cần để có thể gửi thông báo) được lưu trữ trong ứng dụng của webpush.rocks vào trang web của tôi?

Khi tôi xây dựng trang web này ban đầu, tất cả những gì bạn có thể làm là cho phép người dùng mở trang web và sau đó sao chép và dán URL giữa các trang. Tại sao không chỉ hiển thị API mà bất kỳ trang web nào có thể sử dụng? Đó là những gì tôi đã làm.

webpush.rocks định nghĩa một API có tên là 'PushManager` có một phương thức duy nhất trên nó `subscriptionId`. Khi tải trang, nó sẽ hiển thị API này cho cửa sổ như sau:


```javascript
class PushManager {
  constructor() {
  }

  async subscriptionId() {
    //global var ick...
    let reg = await navigator.serviceWorker.getRegistration();
    let sub = await reg.pushManager.getSubscription();
    if(sub) {
        return `${location.origin}/send?id=${sub.endpoint}`;
    }
    else {
        return ``;
    }
  }
}

Comlink.expose({PushManager}, window);
```


API tương tác với API `PushSubscriptionManager` trong DOM và trả về URL tùy chỉnh cho trang web gọi điện. Điều quan trọng ở đây là bởi vì nó đang chạy không đồng bộ, tôi có thể đợi cho người dùng xác minh rằng họ muốn thực hiện hành động (hay không).

Quay lại trang web khách hàng gọi điện (ứng dụng muốn nhận đăng kýId). Khi người dùng nhấp vào liên kết, chúng tôi có được một tham chiếu đến cửa sổ chúng tôi vừa mở và kết nối proxy `Comlink` với nó. API dịch vụ hiện đang được tiếp xúc với máy khách của chúng tôi và chúng tôi có thể khởi tạo API `PushManager` như là một dịch vụ cục bộ, nhưng tất cả đều tương tác với dịch vụ cá thể từ xa trong cửa sổ khác.


```javascript
let endpointWindow = window.open('', 'endpointUrlWindow');

let pushAPI = Comlink.proxy(endpointWindow);
let pm = await new pushAPI.PushManager();
let id = await pm.subscriptionId();

// Update the UI.
endpointUrlEl.value = id;
```


Đây là một đoạn video rất nhanh về những gì đang xảy ra. Một tương tác rất đơn giản và trọng lượng nhẹ, nó sẽ mở dịch vụ và sau đó nhận được ID mà nó cần.

{{<youtube vTYZXx31EHc>}}

Là một nhà cung cấp dịch vụ, tôi đã tiếp xúc với một bộ chức năng hạn chế chỉ có trên máy khách với một trang khác và tôi có thể bảo mật nó và yêu cầu sự đồng ý của người dùng cùng một lúc trước khi tôi trả lại dữ liệu cho người dùng, để sử dụng API.

_Web là API._

Hoàn toàn đúng, chúng tôi không cho phép các trang web kiểm tra hoặc điều chỉnh DOM hoặc trạng thái của một nguồn gốc khác, nhưng tôi cho rằng nếu bạn có quyền kiểm soát các dịch vụ và chức năng của trang web của mình và cách người dùng tương tác với trang web thì bạn có thể hiển thị thông tin quan trọng nhất và các dịch vụ cho bất kỳ khách hàng nào muốn sử dụng dịch vụ của bạn một cách an toàn (bạn có quyền kiểm soát) và nó cho phép bạn:


* Tập trung vào những gì bạn giỏi.
* Truyền dữ liệu nhanh giữa các trang web và ứng dụng vì tất cả đều nằm trong ứng dụng khách.
* IPC ngay cả khi ngoại tuyến.
* Chạy mã trong ngữ cảnh gốc

### Trang web nào của API nên hiển thị?

Đây là điều mà tôi muốn khám phá thêm. Tôi đã giới thiệu một số chức năng cơ bản cho dịch vụ Thông báo đẩy vì đó là mục đích của trang web, nhưng phần quan trọng đối với tôi là tôi kiểm soát những phần nào của DOM mà tôi muốn trả lại cho các nhà phát triển khác.

Tôi muốn đến một nơi mà mỗi trang web có thể trưng ra một API nhất quán cho người dùng và một cách để khám phá các chức năng và dịch vụ khác.

Mỗi chủ sở hữu trang web có thể chỉ hiển thị chức năng cốt lõi cho dịch vụ của họ để chúng tôi có thể thực hiện các hoạt động dựa trên CRUD. Chúng ta có thể có những tương tác phức tạp.

Chúng tôi có thể truy cập vào một trang web nơi chúng tôi có các dịch vụ giống như Unix thực hiện một điều tốt và người dùng sẽ liên kết tất cả chúng với nhau trên máy khách.

Mỗi trang web có thể hiển thị một `VDOM` của một tập hợp con của trang được xác định bởi chủ sở hữu dịch vụ để chúng tôi có cách nhất quán để kéo dữ liệu di chuyển dựa trên DOM giữa các trang web một cách an toàn.

Tôi có thể tưởng tượng rằng chúng tôi có thể muốn truy cập nhanh vào tất cả các đối tượng dựa trên schema.org hoặc dữ liệu có cấu trúc khác trên trang (chúng có thể được tạo động) như Mike đã làm trong bài đăng gốc của mình.

[Comlink](https://github.com/GoogleChromeLabs/comlink) cho chúng ta một cách để phơi bày và tiêu thụ các dịch vụ một cách nhanh chóng và dễ dàng trên các nền tảng nguyên thủy đã tồn tại trong nhiều năm. Cuối cùng, chúng tôi có rất nhiều phần tại chỗ cho phép chúng tôi tạo Web API.

_Web là API của tôi. Biến nó thành của bạn nữa._
