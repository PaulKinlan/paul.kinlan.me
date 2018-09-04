---
slug: thoughts-on-importing-npm-modules-to-the-web-as-javascript-modules
date: 2018-07-20T12:39:24.232Z
title: 'Thoughts on importing npm modules to the web as JavaScript modules'
link: https://paul.kinlan.me/importing-npm-modules-to-the-web-as-es6-modules/
tags: [links, npm, mjs, modules, javascript]
---
Tôi đã có những suy nghĩ về bài đăng tôi đã làm hôm qua về ES Module

> I needed a quick way import a simple module get-urls into my project. The module is well tested and it does what I needed &#x2026; ignore the fact that it&#x2019;s pretty easy to implement in a couple of lines of JavaScript. The problem I had is that my project is built in ES6, uses modules and I didn&#x2019;t want to have to bundle up using CommonJS (require).
> 
> I couldn&#x2019;t find a lot of guidance on what to do here, so I went to experiement and this solution is the solution I came across:
> 
> 1. Create a file that imports the npm module I needed. module.exports = require('get-urls'); This module will be what&#x2019;s converted to ES6 style.
> 2. Create a rollup config that
>     1. Imports the node globals, and builtins.
>     2. Resolves all npm modules required for my usage of this module.
>     3. Pass the results through the commonjs plugin so that it&#x2019;s now in JavaScript module format.
>     4. Compress the output, because it&#x2019;s huge :
> 3. Include the bundled file in your project and rejoice.


[Đọc toàn bộ bài đăng](https://paul.kinlan.me/importing-npm-modules-to-the-web-as-es6-modules/).

Một trong những điều mà tôi muốn thử và nói rõ trong bài viết gốc nhưng tôi quyết định rút ra là có một lượng lớn mã trong hệ sinh thái Nút mà không thực sự cụ thể với Node nhưng vẫn được kết hợp chặt chẽ với Node thông qua Common JS và các API Node đặc biệt khác (Buffer, old URL, vv ..) sẽ mất rất nhiều công sức để kéo bản thân lên và do đó thay đổi được yêu cầu để tạo ES Module ở khắp mọi nơi sẽ có khả năng khá đau đớn và thay đổi hệ sinh thái, chúng ta sẽ cần phải sử dụng rất nhiều công cụ chuyển đổi và bó để có thể chia sẻ mã một cách rõ ràng trên nhiều nền tảng (web / server).

Chúng tôi là nơi chúng tôi có, không có câu chuyện nhập trên web, chúng tôi không có một đống nguyên thủy mà Node đã giới thiệu và giờ đây nhiều người sẽ xem xét các yêu cầu nền tảng thực tế, vì vậy tôi hy vọng rằng đây là nhiều sự thừa nhận về tình hình hơn là một lời chỉ trích.

Ngoài ra còn có một di chuyển để sử dụng '.mjs' như là một phần mở rộng tập tin đó là tiêu chuẩn trên cả hai nút và web. Tôi cảm thấy hoàn toàn thoải mái với điều này, tuy nhiên .msj không phải là một tập tin mà bất kỳ cơ sở hạ tầng nào được công nhận là 'text / javascript' và tôi mong đợi điều này chỉ được sắp xếp để nó tự động suy ra bởi mọi máy chủ web trên hành tinh, vì vậy Tôi không phải triển khai thêm nhiều thay đổi cấu hình cho cơ sở hạ tầng phân phát của mình.

Rất nhiều thời gian thú vị phía trước, tôi cho một người đang mong muốn có thể mang lại nhiều chức năng hơn cho trang web.
