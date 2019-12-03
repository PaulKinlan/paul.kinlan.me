---
slug: using-web-mentions-in-a-static-sitehugo-
date: 2019-10-07T20:11:30.489Z
title: 'Using Web Mentions in a static site (Hugo)'
link: ''
tags: [webmentions, hugo]
---

Blog của tôi là một trang hoàn toàn tĩnh, được xây dựng với Hugo và được lưu trữ với Zeit. Đây là một giải pháp tuyệt vời cho tôi, một blog đơn giản có quy trình triển khai khá đơn giản và nó tải rất nhanh.

Các trang web được tạo tĩnh có một số nhược điểm, lớn nhất là khi bạn cần bất kỳ thứ gì động để được tích hợp vào trang của bạn (ví dụ như nhận xét). Không thể dễ dàng lưu trữ nội dung động sẽ có nghĩa là bạn cuối cùng dựa vào JavaScript của bên thứ 3, sau đó sẽ có toàn quyền truy cập vào trang của bạn và bạn sẽ không biết nó đang làm gì - nó có thể theo dõi người dùng của bạn hoặc làm chậm trang của bạn tải trọng.

Gần đây tôi đã gỡ bỏ tiện ích nhận xét hiện tại (Disqus) khỏi đường dẫn kết xuất quan trọng bằng cách chỉ tải nó khi người dùng cuộn đến các nhận xét (sử dụng `IntersectionObserver` ) và trong khi đây là giải pháp hợp lý cho hiệu suất tải và theo dõi sự cố, tôi thực sự muốn xóa Disqus tất cả cùng nhau.

Nhập <a <span class="notranslate">href=&quot;https://webmention.net/draft/&quot; &gt;Webmention</a> thông số <a <span class="notranslate">href=&quot;https://webmention.net/draft/&quot; &gt;Webmention</a> . Webmention là một đặc tả mô tả cách liên hệ với một tác giả trang web khi một trang web khác &#39;đề cập&#39; (hoặc thích) nội dung trên trang web của bạn. Điều này cuối cùng cho phép một phương pháp phi tập trung để khám phá nội dung liên kết đến trang web của bạn, hy vọng cung cấp giá trị và cái nhìn sâu sắc.

Thông số webmention không mô tả bất kỳ định dạng dữ liệu nào nên được sử dụng để truyền đạt những gì &#39;trang web đề cập&#39; đã nói, khiến bạn phải phân tích cú pháp bằng cách sử dụng các vi định chuẩn hoặc các cơ chế khác để hiểu nội dung của trang. Điều này thật tuyệt, tuy nhiên tôi tin rằng nó dẫn đến các dịch vụ tập trung như <a <span class="notranslate">href=&quot;https://webmention.io/&quot; &gt;webmention.io</a> cung cấp cơ sở hạ tầng rất cần thiết để thoát khỏi ý nghĩa của trang.

Tôi thích ý tưởng sử dụng Webmention, nhưng nó yêu cầu thiết lập phía máy chủ để nhận thông báo (và có thể lưu trữ) khi ai đó đề cập đến trang web của bạn, điều này không phải lúc nào cũng có thể với trình tạo tĩnh như tôi có trên trang web của mình. Phần còn lại của bài đăng này sẽ nhanh chóng mô tả cách tôi nhận được lượt thích, đề cập và đăng lại được lưu trữ trên bản dựng Hugo được lưu trữ trên Zeit của tôi.

### Bước một - tìm một trung tâm webmention

Tôi tìm thấy webmention.io và nó thực hiện các mẹo. Nó xử lý các pingback và đề cập đến, nó cũng sẽ xác nhận rằng trang gọi điện thực sự đang liên kết với nội dung của bạn và cuối cùng nó sẽ phân tích dữ liệu ra khỏi trang để bạn hiểu được ngữ cảnh.

Webmention.io sẽ xác thực rằng bạn sở hữu trang web thông qua quy trình xác thực mở (thật gọn gàng, nó tìm kiếm rel = me chỉ đến nhà cung cấp xác thực)

### Bước hai - nói với các trang mà bạn có thể xử lý đề cập

Điều này đơn giản như việc thêm hai thẻ `link` sau

```html
<link rel="webmention" href="https://webmention.io/paul.kinlan.me/webmention">
<link rel="pingback" href="https://webmention.io/paul.kinlan.me/xmlrpc">
```

### Bước ba - tích hợp API webmention.io vào trang web của bạn

Bạn có hai tùy chọn ở đây, bạn có thể thêm một tiện ích vào trang của mình sẽ gọi API webmention.io hoặc bạn có thể tích hợp API webmention.io vào bước xây dựng của mình. Tôi muốn càng ít bên thứ 3 lưu trữ JS càng tốt, vì vậy tôi đã chọn cái thứ hai. Tôi đã tích hợp webmentions vào quá trình triển khai của mình.

Tôi sử dụng Hugo vì quá trình xây dựng rất nhanh và với suy nghĩ đó, tôi đã phải tìm ra cách tích hợp API webmention vào Hugo một cách tối ưu. Hạn chế khó khăn là không gọi điểm cuối API cho mỗi trang trên trang web của tôi, tôi có rất nhiều trang và chưa có nhiều nhận xét.

May mắn thay, trang Webmention.io cung cấp một điểm cuối tiện dụng sẽ cho phép bạn nhận được tất cả các đề cập cho tên miền của bạn. Điều không may mắn là tệp này chứa một mục nhập cho mọi hành động đã được thực hiện đối với trang web của bạn.

Hugo cũng có khái niệm về các tệp Dữ liệu có thể được kéo trực tiếp vào mẫu cho bất kỳ trang nào, vì vậy bạn phải ánh xạ tệp dữ liệu Webmention sang cấu trúc mới để dễ đọc bên trong mẫu Hugo.

Quy trình tôi chọn ở bên dưới, nhưng tóm tắt là tôi chuyển mảng từ danh sách hành động sang từ điển URL mà mỗi hành động chứa API (như, đăng lại và trả lời), và bước cuối cùng là chia từ điển URL thành các tệp riêng lẻ được đặt tên là băm md5 của url.

```javascript
"use strict";

const fs = require('fs');
const fetch = require('node-fetch');
const md5 = require('md5');

const processMentionsJson = (data) => {
  const urlData = {};
  data.children.forEach(item => {
    const wmProperty = item["wm-property"];
    const url = item[wmProperty];

    if(url in urlData === false) urlData[url] = {};
    const urlDataItem = urlData[url];

    if(wmProperty in urlDataItem === false) urlDataItem[wmProperty] = [];
    urlDataItem[wmProperty].push(item);
  });

  console.log(urlData);

  // For each URL in the blog we now have a JSON stucture that has all the like, mentions and reposts
  if(fs.existsSync('./data') === false) fs.mkdirSync('./data');
  Object.keys(urlData).forEach(key => {
    const item = urlData[key];
    const md5url = md5(key);
    console.log(key, md5url)
    fs.writeFileSync(`./data/${md5url}.json`, JSON.stringify(item));
  });
}

(async () => {
  const mentionsUrl = new URL(process.argv[2]); // Fail hard if it's not a uRL

  const mentionsResponse = await fetch(mentionsUrl);
  const mentiosnJson = await mentionsResponse.json();

  processMentionsJson(mentiosnJson);
})();
```

Sau khi dữ liệu được phân tích cú pháp và lưu chính xác, đó là một quá trình nhanh chóng để thiết lập mẫu để có thể đọc nó vào thuộc tính Dữ liệu của mẫu.

```html
{{ $urlized := .Page.Permalink | md5 }}
{{ if index .Site.Data $urlized }}
  {{ $likes := index (index .Site.Data $urlized) "like-of" }}
  {{ $replys := index (index .Site.Data $urlized) "in-reply-to" }}
  {{ $reposts := index (index .Site.Data $urlized) "repost-of"}}
  <h4>Likes</h4>
  {{ range $i, $like := $likes }}
    <a href="{{$like.url}}"><img src="{{ $like.author.photo}}" alt="{{ $like.author.name }}" class="profile photo"></a>
  {{end}}

  <h4>Reposts</h4>
  {{ range $i, $repost := $reposts }}
    <a href="{{$repost.url}}"><img src="{{ $repost.author.photo}}" alt="{{ $repost.author.name }}" class="profile photo"></a>
  {{end}}

  <h4>Comments and Replies</h4>
  {{ range $i, $reply := $replys }}
    <a href="{{$reply.url}}"><img src="{{ $reply.author.photo}}" alt="{{ $reply.author.name }}" class="profile photo"></a>
  {{end}}
{{end}}
```

Nếu mọi việc suôn sẻ, bạn sẽ thấy một số biểu tượng ở cuối trang là những người thực sự tương tác với trang web.

### Bước 4 - xuất bản trang web khi bình luận xảy ra

Mặc dù các bước trên sẽ cho phép tôi tổng hợp các đề cập và hiển thị chúng trong đầu ra của trang web, tôi vẫn phải đảm bảo rằng trang web được xây dựng lại thường xuyên để các bình luận xuất hiện công khai.

Tôi đã chọn sử dụng một dịch vụ cron đơn giản sẽ gọi API triển khai của Zeit để buộc phải hủy đăng ký lại trang web mỗi giờ hoặc lâu hơn.
