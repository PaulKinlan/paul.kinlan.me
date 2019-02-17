---
slug: lighthouse-scores-for-in-domains
date: 2018-08-24T08:09:10.405Z
title: Getting Lighthouse scores from HTTPArchive for sites in India.
description: A quick dive in to how to use Lighthouse to try and understand how users in a country might experience the web.
tags: [webdev, bigquery, lighthouse, india]
---


Tôi sắp đi một chuyến đi ngắn đến Ấn Độ, và tôi đã suy nghĩ về mối quan hệ nhà phát triển lâu dài hơn cho Chrome và Web trong khu vực. Như với hầu hết các chuyến đi, tôi muốn làm một chút nghiên cứu trước thời hạn để tôi có thể hiểu rõ hơn về trang web trông như thế nào từ quan điểm của quốc gia mà tôi đang truy cập.

Tôi đã theo dõi một loạt các cập nhật cho [HTTPArchive](https://httparchive.org/) trong vài tháng qua và thật tuyệt vời khi thấy các cải tiến đối với các loại dữ liệu mà nó thu thập và lưu trữ trong [ BigQuery](https://github.com/HTTPArchive/legacy.httparchive.org/blob/master/docs/bigquery-gettingstarted.md) bảng. Một phần thông tin cụ thể mà tôi quan tâm lớn là dữ liệu [Lighthouse](https://developers.google.com/web/tools/lighthouse/) được tạo trên mỗi lần chạy HTTPArchive. Với dữ liệu này, tôi rất muốn xem liệu tôi có thể sử dụng nó để có được ảnh chụp nhanh dữ liệu và hiểu rõ hơn về cách mọi người có thể trải nghiệm web ở trong nước hay không.

Tin tốt là không quá khó để phân tích dữ liệu Lighthouse trong HTTPArchive.

Tuy nhiên, với những nhu cầu của tôi, phần khó khăn hơn là có được một khóa về 'trang web hàng đầu' ở bất kỳ quốc gia cụ thể nào, đặc biệt là khi tôi đang suy nghĩ về mối quan hệ của nhà phát triển mà chúng ta có thể và nên làm.

Đây là cách tôi đã phá vỡ vấn đề. Ở mỗi quốc gia có nhiều loại nhà phát triển xây dựng cho web và cá nhân tôi có xu hướng gộp chúng vào 3 nhóm: Những người có dự án hiện tại nhắm mục tiêu đến thị trường địa phương; Những người nhắm vào thị trường nước ngoài (tôi xây dựng để xuất khẩu); và những người nhắm mục tiêu đến khán giả toàn cầu.

Khi tôi nghĩ về ba nhóm trên, gần như không thể tìm ra mục đích của trang web và những người đứng đằng sau nó. Nhưng có một số chẩn đoán mà bạn có thể sử dụng để ít nhất giúp bạn lý luận và hiểu dữ liệu.

Đối với phân tích của tôi, tôi không nghĩ rằng tôi có thể nhận được danh sách các trang web hàng đầu được người dùng truy cập ở Ấn Độ, vì vậy tôi đã giả định rằng các miền '.in' là * có khả năng * được xây dựng cho những người ở Ấn Độ. Độ nhạy và tính đặc hiệu của câu hỏi ‘trang web Ấn Độ’ không phải là 100% bằng cách tập trung vào ‘.in’ ’& mdash; người dùng trên toàn thế giới muốn sử dụng những trải nghiệm không chỉ bị khóa cho các quốc gia TLD & mdash; nhưng nó có vẻ giống như thước đo của nhà nước của các trang web của Ấn Độ như là một vượt qua đầu tiên.

Loại phân tích này trở nên khá dễ dàng. Bạn mở [BigQuery](https://github.com/HTTPArchive/legacy.httparchive.org/blob/master/docs/bigquery-gettingstarted.md) và tìm bảng mới nhất chứa dữ liệu Lighthouse chạy [httparchive: ngọn hải đăng .2018_08_01_mobile] trong trường hợp này và chạy truy vấn sau.


```sql
SELECT
  url,
  JSON_EXTRACT(report, '$.categories.seo.score') AS [seo_score],
  JSON_EXTRACT(report, '$.categories.pwa.score') AS [pwa_score],
  JSON_EXTRACT(report, '$.categories.performance.score') AS [speed_score],
  JSON_EXTRACT(report, '$.categories.accessibility.score') AS [accessibility_score]
FROM
  [httparchive:lighthouse.2018_08_01_mobile]
WHERE
  url LIKE '%.in/'
```


Truy vấn trên được lọc trên các tên miền kết thúc bằng '.in' và nó trả về điểm số Lighthouse cho từng danh mục kiểm tra Lighthouse. Dữ liệu Lighthouse được lưu trữ như một đối tượng JSON, mà bạn phải trích xuất các thành phần cần thiết thông qua một cú pháp giống như XPath cho JSON.

Số lượng kết quả thực sự khá lớn và không được sử dụng nhiều để trình bày ở đây, nhưng tôi đã xoay các kết quả này thành một biểu đồ.

<table><thead><th> Phạm vi điểm </th><th> Điểm SEO </th><th> Điểm số PWA </th><th> Điểm tốc độ </th><th> Điểm A11Y </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 46 </td><td> 279 </td><td> 25 </td></tr><tr><td> 0,5 </td><td> 84 </td><td> 13992 </td><td> 6502 </td><td> 3973 </td></tr><tr><td> 0,7 </td><td> 3391 </td><td> 1400 </td><td> 2222 </td><td> 7585 </td></tr><tr><td> 0,8 </td><td> 1438 </td><td> 19 </td><td> 1147 </td><td> 2374 </td></tr><tr><td> 0,9 </td><td> 2762 </td><td> 9 </td><td> 1545 </td><td> 1069 </td></tr><tr><td> 1 </td><td> 7752 </td><td> 13 </td><td> 3189 </td><td> 434 </td></tr></tbody></table>

Việc xem xét sâu hơn và phân tích dữ liệu cần phải diễn ra, để hiểu chính xác vấn đề cụ thể nào đang ảnh hưởng đến điểm số, tuy nhiên trong một số trường hợp như 'Điểm PWA' tôi đã thấy đủ số điểm trong quá khứ để biết những vấn đề gì ảnh hưởng đến điểm số tổng thể và tôi có thể thấy một số thách thức phía trước chúng ta bây giờ.

Tiếp theo. Hãy thử và tìm cách để có được các trang web mà người dùng Ấn Độ thường xuyên .... Gợi ý, đó là [ở đây](/ crux-topsites-và-ngọn hải đăng-điểm-cho-ấn độ /)