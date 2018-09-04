---
slug: configuring-hugo-server-to-servermjses-modules
date: 2018-07-20T14:17:29.072Z
title: "Configuring hugo server to serve 'mjs' ES modules"
link: https://github.com/PaulKinlan/paul.kinlan.me/commit/43224a694d420fa5ede1e9e6eda042a562d5a6c5
tags: [links, hugo, es modules, javascript]
---
Theo mặc định, Hugo không phân phối tệp .mjs với loại nội dung chính xác. Trong thực tế nó đã không được cho đến gần đây mà hugo có thể phục vụ nhiều hơn một phần mở rộng tập tin cho mỗi loại mime. Dường như với v0.43 điều này đã được sửa.

> [mediaTypes]
>   [mediaTypes."text/javascript"]
>      suffixes = ["js", "mjs"]


[Đọc toàn bộ bài đăng](https://github.com/PaulKinlan/paul.kinlan.me/commit/43224a694d420fa5ede1e9e6eda042a562d5a6c5).

Đoạn mã trên cho phép tôi phục vụ các tệp mjs cho các Mô-đun ES với kiểu mime chính xác (các mô-đun ghi chú cần được phân phát bằng 'văn bản / javascript'). Điều này chỉ cần thiết cho thử nghiệm địa phương, lưu trữ là một vấn đề khác :)
