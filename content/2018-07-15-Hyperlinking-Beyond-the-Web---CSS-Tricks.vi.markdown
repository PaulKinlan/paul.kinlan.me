---
slug: hyperlinking-beyond-the-web---css-tricks
date: 2018-07-15T17:28:21.103Z
title: Hyperlinking Beyond the Web - CSS-Tricks
link: https://css-tricks.com/hyperlinking-beyond-the-web/
tags: ['link', 'intents']
---
Atishay Jain trên CSS Tricks viết về một khu vực gần gũi với trái tim tôi, liên kết:

> Hyperlinks are the oldest and the most popular feature of the web. The word hypertext (which is the ht in http/s) means text having hyperlinks. The ability to link to other people&#x2019;s hypertext made the web, a web &#x2014; a set of connected pages. This fundamental feature has made the web a very powerful platform and it is obvious that the world of apps needs this feature. All modern platforms support a way for apps to register a URI (custom protocol) and also have universal links (handling web links in an app).
> 
> Let&#x2019;s see why we&#x2019;d want to take advantage of this feature and how to do it.


[Đọc toàn bộ bài đăng](https://css-tricks.com/hyperlinking-beyond-the-web/).

Đây là một bài viết tuyệt vời bao gồm tất cả các loại siêu liên kết khác nhau có sẵn cho các ứng dụng và trang web. Tôi đã thực hiện rất nhiều nghiên cứu về không gian này kể từ khi Web Intents và trạng thái liên kết nâng cao trên web để lại rất nhiều điều mong muốn, imo.

Một trong những lý do tại sao tôi yêu web, đằng sau liên kết là truy cập trực tiếp vào tài nguyên, tôi không biết bất kỳ nền tảng nào khác có thể kết hợp liên kết và tài nguyên thực tế theo cùng một cách, nhưng có thể rất nhiều hơn. Liên kết tiêu chuẩn cung cấp cơ bản một mục đích VIEW có chứa trạng thái (url) và ngữ cảnh (văn bản giữa các neo), và bạn có thể hack về với nó các giao thức tùy chỉnh nhưng chúng ta cần phải đi xa hơn rất nhiều.

* Chúng tôi cần mở rộng vốn từ vựng thành `registerProtocolHandler` để truy cập nhiều hơn vào nhiều sơ đồ gốc * Bất kỳ thứ gì được đăng ký với trình xử lý giao thức đều cần phải có hệ thống rộng. * Chúng tôi cần để có thể có các trang web để có thể xử lý mở một loạt các loại nội dung và có các trang có sẵn để được đăng ký như một trình xử lý tệp hệ thống. * Chúng tôi cần có các hành động đặt hàng cao hơn dành cho nhà phát triển, VIEW rất tuyệt, chúng tôi cần một bộ hành động cốt lõi đã thỏa thuận như PICK, SAVE, EDIT để chúng tôi có thể hiểu rõ hơn khả năng của ứng dụng hoặc trang web và khả năng mở rộng chúng với ngữ nghĩa bậc cao hơn. Android có điều này, Siri là nhận được nó, cả hai đều sử dụng 'Intents', Web nên có nó quá.

Đây là một trong những lý do tại sao tôi rất vui mừng về việc trừu tượng hóa tin nhắn như [Comlink](https://github.com/GoogleChromeLabs/comlink) để loại bỏ gánh nặng của sự điên cuồng postMessage và cho phép bạn suy nghĩ về việc phơi bày chức năng với ứng dụng, và sau đó một khi bạn phơi bày chức năng bạn cần để dễ dàng hơn cho phép phát hiện ra chức năng đó ... và đó là những gì liên kết cho phép.
