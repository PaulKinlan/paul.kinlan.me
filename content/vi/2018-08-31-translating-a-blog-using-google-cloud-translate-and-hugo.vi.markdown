---
slug: translating-a-blog-using-google-cloud-translate-and-hugo
date: 2018-08-31T12:51:51.745Z
title: 'Translating a blog using Google Cloud Translate and Hugo'
link: https://github.com/PaulKinlan/paul.kinlan.me/blob/master/translate.js
tags: [links, hugo, cloud, translate]
---
Gần đây tôi đã trở về từ một chuyến đi đến Ấn Độ để tham dự sự kiện [Google4India](https://twitter.com/hashtag/google4india) (báo cáo sớm) và gặp gỡ nhiều doanh nghiệp và nhà phát triển. Một trong những thay đổi thú vị nhất được thảo luận là thúc đẩy nhiều nội dung hơn bằng ngôn ngữ của người dùng trong nước và đặc biệt rõ ràng trên tất cả các sản phẩm của Google, giúp tìm kiếm bằng ngôn ngữ người dùng dễ dàng hơn, để tìm nội dung, và cũng có thể đọc lại cho người dùng dưới dạng văn bản hoặc giọng nói.

Toàn bộ chuyến đi khiến tôi suy nghĩ. Blog của tôi được xây dựng với Hugo. Hugo hiện hỗ trợ nội dung bằng nhiều ngôn ngữ. Hugo hoàn toàn tĩnh, vì vậy việc tạo nội dung mới là vấn đề chỉ tạo một tệp mới và cho phép hệ thống xây dựng thực hiện phép thuật của nó. Vì vậy, có lẽ tôi có thể xây dựng thứ gì đó sẽ làm cho nội dung của tôi có sẵn cho nhiều người hơn bằng cách chạy nội dung tĩnh của tôi thông qua một công cụ dịch vì bản dịch nội dung của con người rất tốn kém.

Một vài giờ trước khi chuyến bay của tôi trở lại Vương quốc Anh, tôi đã tạo một tập lệnh nhỏ sẽ lấy các tệp đánh dấu và chạy chúng thông qua [Google Cloud Translate](https://cloud.google.com/translate/) để tạo nhanh dịch của trang mà tôi có thể nhanh chóng lưu trữ. Toàn bộ giải pháp được trình bày dưới đây. Đó là một bộ xử lý tương đối cơ bản, nó bỏ qua phần mở đầu của Hugo nó bỏ qua 'mã' và nó bỏ qua các trích dẫn kéo - giả định của tôi là ở chỗ chúng luôn được để lại như cách chúng được viết.

Lưu ý: Có vẻ như phần mềm học tập của chúng tôi dành cho bản dịch sử dụng nên điều quan trọng là [đánh dấu trang của bạn để công cụ học tập không sử dụng nội dung được dịch của Google làm đầu vào cho thuật toán của nó](https://cloud.google.com/translate/ đánh dấu).




```Javascript
// Imports the Google Cloud client library
const Translate = require('@google-cloud/translate');
const program = require('commander');
const fs = require('fs');
const path = require('path');

program
  .version('0.1.0')
  .option('-s, --source [path]', 'Add in the source file.')
  .option('-t, --target [lang]', 'Add target language.')
  .parse(process.argv);

// Creates a client
const translate = new Translate({
  projectId: 'html5rocks-hrd'
});

const options = {
  to:  program.target,
};

async function translateLines(text) {
  if(text === ' ') return ' ';
  const output = [];
  let results = await translate.translate(text, options);

  let translations = results[0];
  translations = Array.isArray(translations)
    ? translations
    : [translations];

  translations.forEach((translation, i) => {
    output.push(translation)
  });

  return output.join('\n');
};

// Translates the text into the target language. "text" can be a string for
// translating a single piece of text, or an array of strings for translating
// multiple texts.
(async function (filePath, target) {

  const text = fs.readFileSync(filePath, 'utf8');

  const lines = text.split('\n');
  let translateBlock = [];
  const output = [];

  let inHeader = false;
  let inCode = false;
  let inQuote = false;
  for (const line of lines) {
    // Don't translate preampble
    if (line.startsWith('---') && inHeader) { inHeader = false; output.push(line); continue; }
    if (line.startsWith('---')) { inHeader = true; output.push(line); continue; }
    if (inHeader) { output.push(line); continue; }

    // Don't translate code
    if (line.startsWith('```') && inCode) { inCode = false; output.push(line); continue; }
    if (line.startsWith('```')) { inCode = true; output.push(await translateLines(translateBlock.join(' '))); translateBlock = []; output.push(line); continue; }
    if (inCode) { output.push(line); continue; }

    // Dont translate quotes
    if (inQuote && line.startsWith('>') === false) { inQuote = false; }
    if (line.startsWith('>')) { inQuote = true; output.push(await translateLines(translateBlock.join(' '))); translateBlock = []; output.push(line); }
    if (inQuote) { output.push(line); continue; }

    if (line.charAt(0) === '\n' || line.length === 0) { output.push(await translateLines(translateBlock.join(' '))); output.push(line); translateBlock = []; continue;} 

    translateBlock.push(line);
  }

  if(translateBlock.length > 0) output.push(await translateLines(translateBlock.join(' ')))

  const result = output.join('\n');
  const newFileName = path.parse(filePath);
  fs.writeFileSync(`content/${newFileName.name}.${target}${newFileName.ext}`, result);

})(program.source, program.target);
```
Nói chung, tôi rất hài lòng với quy trình này. Tôi hiểu rằng bản dịch máy không hoàn hảo nhưng suy nghĩ của tôi là tôi có thể tăng khả năng tiếp cận nội dung của mình với những người có thể đang tìm kiếm bằng ngôn ngữ của riêng họ và không phải bằng tiếng Anh tôi có thể tăng diện tích bề mặt khám phá nội dung của mình và những người.

Nó sẽ mất một lúc để xem nếu điều này thực sự giúp mọi người, vì vậy tôi sẽ báo cáo lại khi tôi có thêm dữ liệu .... Bây giờ để chạy kịch bản của tôi trên nhiều trang web của tôi :)
