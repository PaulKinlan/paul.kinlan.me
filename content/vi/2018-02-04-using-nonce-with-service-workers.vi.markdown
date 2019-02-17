---
slug: using-nonce-with-service-workers
date: 2018-02-04T13:20:31+01:00
title: "Using CSP Nonces effectively with service worker"
tags: ['service worker', 'csp', 'security', 'google analytics']
description: "CSP nonce values can help you securely run inline content on you site. But it can 
be hard to get it working with Service Workers... until now."
---


Trong một [dự án gần đây](https://webgdedeck.com/), tôi muốn chia sẻ càng nhiều logic càng tốt giữa máy chủ, nhân viên dịch vụ và khách hàng. Dự án cơ bản là một trình đọc nguồn cấp dữ liệu RSS đơn giản, nó lấy nguồn cấp dữ liệu RSS, phân tích dữ liệu và kết hợp chúng thành một tập hợp các cột tốt (giống như TweetDeck) và cũng là một danh sách được hợp nhất.

Bởi vì tôi đang sử dụng nguồn cấp dữ liệu RSS và hiển thị trên trang của mình, tôi cần phải chắc chắn rằng nó không làm bất cứ điều gì bất chính. Tôi có thể khử trùng đầu vào nhiều như tôi muốn, tuy nhiên tôi biết khả năng của riêng mình, và tôi là người nhất định có thể điều khiển nguồn cấp dữ liệu RSS theo cách mà tôi sẽ chạy kịch bản, nhập hình ảnh hoặc bất kỳ bên thứ ba nào khác trong ngữ cảnh của trang web của tôi.

Nền tảng web cung cấp khả năng khóa một trang web thông qua Content-Security-Policy (CSP). CSP có thể khóa các nguồn bên ngoài mà từ đó chúng ta có thể yêu cầu các bối cảnh như kịch bản, kiểu dáng, hình ảnh… Bạn thậm chí có thể khóa khả năng cho một trang chạy các kịch bản trực tuyến - có thể ngăn chặn tất cả các dạng tấn công XSS.

Nó đã được khá đơn giản để thêm nó vào ứng dụng.


```
`default-src 'self';`
```


Tuy nhiên .... Tôi đã có một số vấn đề.

1. Tôi tạo kiểu nội tuyến trên trang và do đó tôi cần chạy nội tuyến tập lệnh. 2. Tôi cần bao gồm Google Analytics yêu cầu một tập lệnh nội tuyến để chạy trên trang.

CSP cho phép bạn chạy tập lệnh và kiểu nội dòng bằng cách cho phép bạn bật tùy chọn có tên là 'unsafe-eval` của tập lệnh, tuy nhiên điều này khá nhiều bằng cách vượt qua mọi bảo vệ mà CSP dành cho.

Để chạy các tập lệnh nội dòng và vẫn có sự bảo vệ của CSP, CSP cung cấp một vài công cụ. Cái tôi sử dụng được gọi là 'nonce'. Nonce là một id ngẫu nhiên mà bạn đặt trên tiêu đề HTTP CSP và bạn kiểm đếm với một tập lệnh nội tuyến liên quan.

** Chuỗi CSP trên tiêu đề HTTP **


```
`default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'nonce-script-${nonce.analytics}'; connect-src 'self'; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'nonce-style-${nonce.style}'
```


** Tập lệnh nội tuyến sử dụng nonce **


```html
<script src="https://www.googletagmanager.com/gtag/js?id=1111"></script>
<script nonce="script-{nonce.analytics}">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '{{=it.config.then(config=>config.site.googleAnalytics)}}');
</script>
```


Đoạn mã trên hoạt động tốt và giúp đơn giản hóa việc phân tích hoạt động chính xác khi chúng tôi bảo mật trang web bằng CSP.

Đối với mỗi yêu cầu web đơn, bạn cần phải có một giá trị 'nonce' duy nhất và tôi thực hiện điều này thông qua `{nonce.analytics}` là một giá trị mà tôi tạo trên máy chủ và áp dụng thông qua một mẫu. Nếu bạn sử dụng lại giá trị nonce, trình duyệt sẽ từ chối thực thi nội dung trong tập lệnh.

Tôi có một chút rắc rối khi tạo ra các giá trị nonce. Tôi cần một cái gì đó mà sẽ tạo ra một giá trị duy nhất mà sẽ không được tái sử dụng bởi cùng một người dùng. Tôi cảm thấy rằng giá trị nonce của định dạng '[source] - [date.now + request-count]' sẽ đủ.

'Nguồn' cho phép tôi thêm một không gian tên vào nonce và date.now () + một số lượng yêu cầu ngày càng tăng cho tôi một tập hợp các giá trị không lặp lại tương đối ổn định.

Tôi tạo ra nonce bằng cách sử dụng hàm sau:


```javascript
function generateIncrementalNonce(source) {
  let val = 0;
  let max = Math.pow(10, 3); // Date + pow 3 gets us close to max number;

  const generate = () => {
    let now = max * +new Date();
    if(val >= max) val = 0;
    else val++;
    return (source !== undefined ? source : '') + (now + val).toString();
  }

  return generate;
};
```


Có vẻ tốt. Tuy nhiên, tôi cache tất cả các trang của tôi trong một service worker, có nghĩa là nếu tôi chỉ đơn giản là phục vụ nội dung từ cache thì các giá trị nonce sẽ được tái sử dụng và do đó không được thực thi.

May mắn thay, tôi chia sẻ logic giữa máy chủ và nhân viên dịch vụ của mình, điều này cho phép tôi tạo bất kỳ thứ gì mà tôi cần ở một vị trí trung tâm của mã của tôi. Tôi sử dụng tham số 'nguồn' trong hàm `generateIncrementalNonce` để thêm 'server' hoặc 'service-worker' vào giá trị nonce và tôi đã thực hiện điều này trong mỗi trình xử lý yêu cầu trong cả máy chủ và nhân viên dịch vụ. Sử dụng tham số nguồn này có nghĩa là tôi có thể đảm bảo một giá trị nonce được tạo thông qua máy chủ sẽ không bao giờ đụng độ với một trang được tải thông qua nhân viên dịch vụ.

Mô hình này đã phục vụ tôi tốt. Nó cho phép tôi cho phép các tập lệnh nội tuyến bắt buộc cho Google Analytics trong khi dừng bất kỳ bên thứ ba nào từ việc tiêm hoặc chạy mã không đáng tin cậy trong trang của tôi.

Dưới đây là mã mà tôi đã sử dụng trong dự án. Có một số vị trí khác nhau trong các trang của tôi mà tôi cần giá trị nonce, tôi tạo chúng cho mỗi yêu cầu và sau đó áp dụng nó vào chức năng templating của tôi và tiêu đề HTTP cùng một lúc.

#### common.js - logic được chia sẻ


```javascript
function generateCSPPolicy(nonce) {
  return `default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'nonce-script-${nonce.analytics}'; connect-src 'self'; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'nonce-style-${nonce.style}' 'nonce-style-${nonce.inlinedcss}';`;
};

function generateIncrementalNonce(source) {
  let val = 0;
  let max = Math.pow(10, 3); // Date + pow 3 gets us close to max number;

  const generate = () => {
    let now = max * +new Date();
    if(val >= max) val = 0;
    else val++;
    return (source !== undefined ? source : '') + (now + val).toString();
  }

  return generate;
};
```


#### service-worker.js - tìm nạp trình xử lý


```javascript
const generator = generateIncrementalNonce('service-worker');
let nonce = {
  analytics: generator(),
  inlinedcss: generator(),
  style: generator()
};

// Call the route handler with all data needed
let response = all(nonce, {
  dataPath: paths.dataPath,
  assetPath: paths.assetPath
}).then(r => setHeader(r, 'Content-Security-Policy', generateCSPPolicy(nonce)));;
e.respondWith(response);
```


#### server.js - trình xử lý yêu cầu


```javascript
const generator = generateIncrementalNonce('server');

let nonce = {
  analytics: generator(),
  inlinedcss: generator(),
  style: generator()
};

res.setHeader('Content-Security-Policy', generateCSPPolicy(nonce));

// Call the route handler with all data needed
all(nonce, {
      dataPath: `${paths.dataPath}${hostname}.`,
      assetPath: paths.assetPath 
    })
    .then(response => {
      node.responseToExpressStream(res, response.body)
    });
```