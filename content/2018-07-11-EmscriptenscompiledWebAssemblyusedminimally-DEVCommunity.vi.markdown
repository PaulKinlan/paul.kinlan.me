---
slug: EmscriptenscompiledWebAssemblyusedminimally-DEVCommunity
date: 2018-07-11T21:05:59.091Z
title: Emscripten's compiled Web Assembly, used minimally
link: https://dev.to/samthor/emscriptens-compiled-web-assembly-used-minimally-4fd4
tags: ['link', 'wasm']
---
Sam Thorogood trên Dev.to viết,

> Why did I write this post? Emscripten is a wonderful tool, but it has a long history (for asm.js), and isn't perfect. I think it errs too much on the side of "magic", and many posts rave about how it's so easy to EM_ASM_ or use binding-fu, but this all comes at a cost, and can introduce huge amounts of inadvertent overhead&#x2014;think copying huge memory buffers around because we're trying to make them immutable or easily exposed.
> 
> Every language that is being compiled to Web Assembly needs a runtime&#x2014;whether it be Go, or Rust, or C/C++ as we have here. I don't believe that we'll ever really be able to directly import Web Assembly via ES2015 modules, at least not without changes on the JS side. But it behooves us to write the smallest one we possibly can.


[Đọc toàn bộ bài đăng](https://dev.to/samthor/emscriptens-compiled-web-assembly-used-minimally-4fd4).

Tôi nghĩ tất cả chúng ta đều thấy tiềm năng của thế giới, nhiều người trong chúng ta rất nhiều nền tảng khác hiện có thể truy cập web hoàn toàn xa lạ với chúng tôi và chúng tôi thực sự cần phải tìm hiểu những công cụ đó, cải thiện trải nghiệm nhà phát triển và imo cung cấp các thư viện dựng sẵn mà 'devs web truyền thống' chỉ có thể sử dụng.
