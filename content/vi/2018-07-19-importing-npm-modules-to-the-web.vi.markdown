---
slug: importing-npm-modules-to-the-web-as-es6-modules
date: 2018-07-19T18:06:53.251Z
title: 'Importing npm modules to the web as JavaScript modules'
tags: [npm, rollup, javascript]
---


Tôi đã làm việc trên một cách để làm cho nó dễ dàng hơn để đẩy nội dung vào trang web tĩnh của tôi và đó là một bài tập nhỏ vui nhộn mà tôi sẽ chia sẻ nhiều hơn trong một bài đăng khác. Trong bài này tôi muốn chia sẻ cấu hình `rollup` mà tôi đã sử dụng để nhập gần như bất kỳ mô-đun npm nào vào một dự án lối vào bằng cách sử dụng các mô-đun JavaScript.

Tôi cần một cách nhanh chóng nhập khẩu một mô-đun đơn giản `get-urls` vào dự án của tôi. Mô-đun này được kiểm tra tốt và nó thực hiện những gì tôi cần ... bỏ qua thực tế là nó khá dễ thực hiện trong một vài dòng mã JavaScript. Vấn đề tôi có là dự án của tôi được xây dựng trong ES6, sử dụng các mô-đun và tôi không muốn phải kết hợp với CommonJS (`require`).

Tôi không thể tìm thấy rất nhiều hướng dẫn về những gì cần làm ở đây, vì vậy tôi đã đi đến experiement và giải pháp này là giải pháp tôi đã gặp:

1. Tạo một tệp nhập mô-đun npm mà tôi cần. `module.exports = require ('get-url');` Module này sẽ là những gì được chuyển đổi thành kiểu ES6. 2. Tạo cấu hình rollup 1. Nhập các hình cầu nút và nội trang dựng sẵn. 1. Giải quyết tất cả các mô-đun npm cần thiết cho việc sử dụng mô-đun này của tôi. 1. Chuyển các kết quả thông qua plugin `commonjs` để nó có định dạng mô-đun JavaScript. 1. Nén đầu ra, bởi vì nó rất lớn: \ 3. Bao gồm các tập tin đi kèm trong dự án của bạn và vui mừng.


``` javascript
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import closure from 'rollup-plugin-closure-compiler-js';

export default {
  input: 'static/javascripts/get-urls.js',
  output: {
      file: 'static/javascripts/get-urls.bundle.mjs',
      format: 'es',
      browser: true
    },
  plugins: [
    globals(),
    builtins(),
    resolve({
      preferBuiltins: false,
      browser: true,
      // pass custom options to the resolve plugin
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    commonjs(),
    closure({
      compilationLevel: 'WHITESPACE',
      languageIn: 'ES6',
      languageOut: 'ES6'
    })
  ]
};
```


Tôi nghĩ rằng có lẽ cách tốt hơn thế này, đầu ra cho một chức năng tương đối đơn giản là rất lớn (70kb), nhưng bây giờ có nghĩa là tôi có thể sử dụng các mô đun từ npm trực tiếp trong trang của mình.


```
<script type="module">
    import getUrls from '/javascripts/get-urls.bundle.mjs';
    ...
```


Khéo léo...
