---
slug: building-a-pubsub-api-in-javascript
date: 2016-12-08T13:20:31+01:00
title: "Building a simple PubSub system in JavaScript"
tags: ['pubsub', 'javascript']
---


Trong một dự án gần đây xây dựng một dịch vụ [web push](/design-a-webpush-service/) tôi muốn giao diện người dùng của tôi phản hồi các sự kiện cấp ứng dụng (ngữ nghĩa nếu bạn muốn) vì có một vài thành phần yêu cầu thông tin từ hệ thống nhưng không phụ thuộc lẫn nhau và tôi muốn họ có thể tự quản lý độc lập với 'logic nghiệp vụ'.

Tôi nhìn xung quanh rất nhiều công cụ khác nhau để giúp tôi, nhưng vì tôi thường xuyên có trường hợp nặng của hội chứng NIH và thực tế là tôi nghĩ mọi người có thể thực hiện các yếu tố cơ sở hạ tầng của mình khá nhanh, tôi quyết định đánh nhanh một khách hàng đơn giản- dịch vụ PubSub bên & mdash; nó hoạt động khá tốt cho nhu cầu của tôi.

Tôi đã tranh luận liệu tôi có nên sử dụng DOM `Sự kiện tùy chỉnh` và sử dụng cơ sở hạ tầng hiện có mà DOM đã cung cấp cho nhà phát triển & mdash hay không; khả năng các sự kiện và sự kiện tiêu thụ bằng `addEventListener` & mdash; nhưng vấn đề duy nhất là bạn phải treo trình xử lý sự kiện ra khỏi DOM Element hoặc cửa sổ vì bạn không thể có một mô hình kế thừa hoặc trộn trong `EventTarget`.

_ ** Tư tưởng: ** có `EventTarget` làm đối tượng sẽ giúp giảm bớt nhu cầu tạo hệ thống PubSub tùy chỉnh._

Với sự hạn chế này trong tâm trí, một ý chí để mã hóa một cái gì đó lên, và một xu hướng không chú ý đến lỗi mà tôi tạo ra bản thân mình, tôi phác thảo ra một kế hoạch thô:


```javascript
/* When a user is added, do something useful (like update UI) */
EventManager.subscribe('useradded', function(user) {
  console.log(user)
});

/* The UI submits the data, lets publish the event. */
form.onsubmit(function(e) {
  e.preventDefault();

  // do something with user fields

  EventManager.publish('useradded', user);
})
```


Tất cả điều này không phải là mới. Redux và nhiều hệ thống khác đã làm điều này và trong nhiều trường hợp, chúng cũng giúp bạn quản lý trạng thái. Trong đầu của tôi, tôi không thực sự có nhà nước mà cần một mô hình đó là septate cho nhà nước đã có trong trình duyệt.

Việc triển khai thực hiện khá đơn giản và việc trừu tượng hóa khá hữu ích đối với tôi ít nhất.


```javascript
var EventManager = new (function() {
  var events = {};

  this.publish = function(name, data) {
    var handlers = events[name];
    if(!!handlers === false) return;
    handlers.forEach(function(handler) {
      handler.call(this, data);
    });
  };

  this.subscribe = function(name, handler) {
    var handlers = events[name];
    if(!!handlers === false) {
      handlers = events[name] = [];
    }
    handlers.push(handler);
  };

  this.unsubscribe = function(name, handler) {
    var handlers = events[name];
    if(!!handlers === false) return;

    var handlerIdx = handlers.indexOf(handler);
    handlers.splice(handlerIdx);
  };
});
```
Chỉnh sửa: Đã xóa sử dụng lời hứa.

Và chúng tôi đang có. Một hệ thống pubsub đơn giản có khả năng đầy đủ các lỗi, nhưng tôi thích nó. :) Tôi đã đặt nó trên [github](https://github.com/PaulKinlan/EventManager) nếu bạn quan tâm đến nó.