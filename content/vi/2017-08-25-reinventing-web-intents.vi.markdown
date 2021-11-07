---
slug: reinventing-web-intents
date: 2017-08-25T13:20:31.000Z
title: "Reinventing Web Intents"
description: ""
tags: ["intents"]
image_header: /images/bridges.png
---
Tôi chưa bao giờ vượt qua [cái chết của Web Intents](/what-happened-to-web-intents/). Tôi luôn cảm thấy rằng vẫn còn một vấn đề nghiêm trọng trên web, chúng tôi xây dựng [silo](/unintended-silos/) khóa người dùng vào một trang web và chúng tôi không kết nối các ứng dụng của mình với nhau để xây dựng trải nghiệm phong phú hơn. Chúng tôi có các liên kết cho phép chúng tôi điều hướng đến một trang web khác, nhưng chúng tôi không kết nối các ứng dụng của mình với chức năng mà chúng tôi có thể sử dụng trong các trang web của mình. Có thể chọn hình ảnh từ dịch vụ đám mây để sử dụng trong ứng dụng của bạn hoặc chỉnh sửa hình ảnh trong trình chỉnh sửa người dùng ưa thích; chúng tôi không liên kết các dịch vụ của mình theo cách chúng tôi liên kết các trang của mình.

[Web Intents](https://en.wikipedia.org/wiki/Web_Intents) là một nỗ lực không thành công để sửa lỗi đó. [Share API](/navigator.share/) giải quyết một trường hợp sử dụng để kết nối các trang web và ứng dụng, nhưng nói chung IPC và phát hiện dịch vụ chưa bao giờ được giải quyết và tôi nghĩ rằng tôi có giải pháp ... Ok, tôi không có giải pháp, tôi có một thử nghiệm mà tôi vô cùng phấn khởi.

Trong vài tháng qua Surma trong nhóm của tôi và Ian Kilpatrick đã làm việc trên một shim cho [Tasklets API](https://github.com/GoogleChromeLabs/tasklets). API Tasklets được thiết kế để cho phép API đa luồng có trọng lượng nhẹ tồn tại trên web. Một lớp ES6 có thể được tiếp xúc như một 'tasklet' và bạn có thể gọi nó mà không chặn luồng chính - tuyệt vời cho giao diện người dùng. Bản thân API nhiệm vụ rất thú vị, nhưng phần thú vị nhất đối với tôi là họ đã xây dựng một Polyfill bằng cách sử dụng một Web Worker và phát triển một cách để trưng ra các chức năng của lớp ES6 đã được định nghĩa trong Worker. Họ đã tóm tắt tất cả các phức tạp của API postMessage đi vào một gói gọn gàng và một mô hình lành mạnh cho các nhà phát triển JS.

Một trong những lý do mà chúng tôi xây dựng API Intents Web là vì trải nghiệm của nhà phát triển về tạo API và dịch vụ làm việc với API postMessage vô cùng phức tạp, bạn phải xử lý API postMessage và sau đó bạn phải quản lý một thông báo phức tạp hệ thống xử lý và máy trạng thái kết hợp.

<figure><img src="/images/worker-dx.png"><figcaption> Công nhân truyền thống </figcaption></figure>

Nó rất phức tạp. Nó trở nên tồi tệ hơn nếu bạn muốn có hai cửa sổ tương tác với nhau. Cửa sổ bạn mở phải báo hiệu lại `mở 'rằng nó đã sẵn sàng trước khi bạn có thể bắt đầu gửi tin nhắn. TL; DR - `window.open` mở` about: blank` trước khi nó điều hướng đến URL bạn định nghĩa.

<figure><img src="/images/window-dx.png"><figcaption> Cửa sổ postMessage kinh nghiệm </figcaption></figure>

Nó thậm chí còn phức tạp hơn khi bạn muốn truyền thông điệp giữa nhiều cửa sổ hoặc công nhân trong các cửa sổ khác.

<figure><img src="/images/complex-workers.png"><figcaption> Thậm chí phức tạp hơn ... </figcaption></figure>

Tôi nghĩ đây là một trong những lý do chính khiến mọi người phơi bày API của phía khách hàng. Nó quá khó.

Polyfill của tasklet có một giải pháp được chôn bên trong nó và tôi đã hỏi Surma một cách táo bạo nếu anh ta có thể cấu trúc lại API nhiệm vụ thành một API Proxy đơn giản, một vài giờ sau đó xuất hiện [Comlink](https://github.com/GoogleChromeLabs/comlink/). Comlink là một API nhỏ trừu tượng hóa MessageChannel và API postMessage trong một API có vẻ như bạn đang instantiating các lớp và các hàm từ xa trong ngữ cảnh cục bộ. Ví dụ:


**Trang mạng**


```javascript
const worker = new Worker('worker.js');
const api = Comlink.proxy(worker);
const work = await new api.HardWork();
const results = await work.expensive();
```



** Nhân viên Web **


```javascript
class HardWork {
  expensive() {
    for(let i = 0; i < 1e12; i++)
      sum += /* …omg so much maths… */
    return sum;
  }
}

Comlink.expose({HardWork}, self);
```


Chúng tôi trưng ra một API trên dịch vụ, chúng tôi tiêu thụ API trong ứng dụng khách qua proxy.

Tôi nghĩ nó cực kỳ hấp dẫn và Comlink có khả năng cách mạng hóa việc sử dụng nhân viên Web bằng cách cải thiện đáng kể trải nghiệm của nhà phát triển bằng cách cung cấp một API đơn giản cho nhóm của họ để có thể sử dụng.

Làm điều tương tự giữa các cửa sổ cũng dễ dàng như vậy.

<figure><img src="/images/comlink.png"><figcaption> Comlink </figcaption></figure>

Nhưng tôi đã có một suy nghĩ khác ... Tôi có thể tái tạo lại một phần nhỏ của Web Intents được cho là: cải thiện phát hiện dịch vụ và giúp các nhà phát triển dễ dàng tương tác với các dịch vụ.

### Ý định web?

Một trong những điều gọn gàng về API Comlink là nó sẽ tự động cố gắng sử dụng các đối tượng `Transferable` để truyền dữ liệu giữa máy khách và dịch vụ, và nó chỉ ra rằng` MessagePorts` có thể truyền được. Ý tưởng mà tôi có là nếu tôi có thể tạo một API đơn giản được thiết kế để chỉ trả về một MessagePort dựa trên một số tiêu chí (như động từ) thì là khách hàng, tôi sẽ không quan tâm đến MessagePort đó đến từ đâu.

Đây là suy nghĩ của tôi: Tôi sẽ có một trang web hoạt động như một người trung gian và sẽ duy trì một danh sách các dịch vụ và nơi họ sống và sẽ có thể kết nối các khách hàng yêu cầu các loại dịch vụ, loại như vậy.


* Một trang web dịch vụ sẽ có thể nói với người đàn ông trung gian "Tôi cung cấp dịch vụ X hoạt động trên dữ liệu Y và sống ở trang Z"
* Một trang web của khách hàng sẽ có thể nói với người đàn ông trung gian "Tôi cần một dịch vụ X trên dữ liệu này Y. Bạn có gì?"

Lập bản đồ này trở lại thiết kế thô, tôi cần một Dịch vụ cho thấy hai phương thức: `register` và` pick`.

`register`, sẽ, cũng đăng ký dịch vụ với người đàn ông trung gian. `pick` mặt khác thú vị hơn một chút và tôi đã chia nó thành một vài bước.

<figure><img src="/images/webintents-step-1.png"><figcaption> Kết nối các trang web </figcaption></figure>

Dòng chảy không quá phức tạp khi bạn đi sâu vào nó. Tôi đã viết một [trình bao bọc cơ bản mà bạn bao gồm trong mọi ứng dụng dịch vụ và ứng dụng khách](https://web-intents.glitch.me/scripts/service.js). Trình bao bọc xử lý tương tác đầu tiên với người trung gian và thực hiện một số dịch vụ dọn dẹp cơ bản bằng cách gói các sự phức tạp của việc mở một cửa sổ đến bộ chọn dịch vụ tại 'https://web-intents.glitch.me/pick'.

Khi bộ chọn mở, nó sẽ tìm tất cả các dịch vụ phù hợp với tiêu chí mà người dùng cần, sau đó nó sẽ hiển thị cho người dùng dưới dạng danh sách đơn giản. Người dùng mở trang web ưa thích của họ và đằng sau hậu trường mà trang web hiển thị API của nó trở lại ứng dụng khách gốc thông qua người trung gian. Cuối cùng, khi kết nối hoàn tất và chúng ta đang nói chuyện với dịch vụ đã chọn, chúng ta có thể loại bỏ người trung gian.

<figure><img src="/images/webintents-step-2.png"><figcaption> Đang xóa người trung gian </figcaption></figure>

Quá trình này thực sự phức tạp hơn một chút so với tôi cho phép. Dưới mui xe chúng tôi đang đi qua rất nhiều MessagePorts giữa các cửa sổ nhưng người tiêu dùng của API không bao giờ thấy bất kỳ phức tạp này. Điều tốt là khi khách hàng và dịch vụ được kết nối và họ nói chuyện trực tiếp thông qua một API được xác định dịch vụ tốt đẹp và họ không thực sự biết ai ở hai đầu. Khéo léo.

Dưới đây là một cách nhanh chóng đi sâu vào mã để hiển thị nó đơn giản như thế nào.


** Dịch vụ ** ([demo](https://web-intents-service-1.glitch.me/))

Dịch vụ tương đối đơn giản, nó có một lớp tương tác với DOM và ghi lại một số đầu ra.

Chúng ta trưng ra lớp `Test` cho` ServiceRegistry` và chúng ta cung cấp một cách để đăng ký các khả năng của dịch vụ này.


```javascript
class Test {
  constructor() {}

  outputToPre(msg) {
    let output = document.getElementById('output');
    output.innerText += msg + '\n';
  }
}

let registry = new ServiceRegistry({ Test })
register.onclick = async () => {    
  let resolvedService = await registry.register('test-action','*', location.href);  
};
```



** Khách hàng ** ([demo](https://web-intents-client.glitch.me/))

Máy khách đơn giản, chúng ta tạo một thể hiện của sổ đăng ký và gọi `chọn`.

`pick` kết nối với người trung gian và chờ người dùng chọn dịch vụ. Sau khi người dùng chọn dịch vụ, người trung gian (`ServiceRegistry`) chuyển giao API mà dịch vụ từ xa đã tiếp xúc với máy khách. Sau đó chúng ta có thể khởi tạo một thể hiện của API từ xa và gọi các phương thức trên nó.


```javascript
let registry = new ServiceRegistry();
let resolvedService = await registry.pick('test-action','image/*');
remote = await new resolvedService.Test();
remote.outputToPre('calling from window.');
```


Tôi khá hài lòng với điều này như là một thử nghiệm. Đây là video của Dịch vụ khám phá và yêu cầu mã trên.

<figure> {{&lt;youtube 1igal-ehMB4&gt;}} <figcaption> bản trình diễn kết thúc </figcaption></figure>

Cho tôi biết bạn nghĩ gì. Quá nhiều?