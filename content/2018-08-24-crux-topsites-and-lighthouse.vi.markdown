---
slug: crux-topsites-and-lighthouse-scores-for-india
date: 2018-08-24T08:19:10.405Z
title: Using HTTPArchive and Chrome UX report to get Lighthouse score for top visited sites in India.
description: A quick dive in to how to use Lighthouse,HTTPArchive and Chrome UX report to try and understand how users in a country might experience the web.
tags: [webdev, bigquery, lighthouse, crux]
---


Như tôi đã đề cập trong [bài đăng trước] của tôi (/ lighthouse-score-for-in-domains /), tôi bắt đầu lên kế hoạch cho Quan hệ nhà phát triển hơn ở Ấn Độ và tôi muốn hiểu rõ hơn về cách người dùng ở Ấn Độ trải nghiệm web . Trong bài viết đó tôi đã có một heuristic rất đơn giản để xác định một trang web ở Ấn Độ, nó là một tên miền '.in'. Tôi biết rằng đây không phải là cách tốt nhất để nhìn vào nó, nhưng nó cảm thấy như là một đi đầu tiên tốt.

Những gì tôi thực sự muốn là một cách để hiểu các trang web mà người dùng ở Ấn Độ truy cập và sau đó nhận được điểm số của họ được xếp hạng theo mức độ phổ biến của trang web.

May mắn là [báo cáo UX Chrome](https://developers.google.com/web/tools/chrome-user-experience-report/) có một số dữ liệu đó. Báo cáo UX Chrome có một loạt các bảng trong BigQuery chứa danh sách nhiều nguồn gốc hàng đầu mà người dùng ở Ấn Độ truy cập (bảng là `chrome-ux-report.country_in.20180` & mdash; lưu ý '_in' biểu thị Quốc gia). Báo cáo UX Chrome có nhiều dữ liệu hơn cho mỗi nguồn gốc, chẳng hạn như tốc độ tổng hợp của trang web cho người dùng thực tế, nhưng tôi thực sự chỉ cần URL.

Sử dụng dữ liệu từ báo cáo UX Chrome và kết hợp nó với bảng xếp hạng Alexa trong Lưu trữ HTTP cùng với các điểm ngọn hải đăng HTTPArchive đã đề cập trước đó, chúng tôi có thể có được bức tranh tốt hơn về những gì người dùng ở Ấn Độ thực sự thấy.




```sql
SELECT
  url, rank,
  JSON_EXTRACT(report, '$.categories.seo.score') AS seo_score,
  JSON_EXTRACT(report, '$.categories.pwa.score') AS pwa_score,
  JSON_EXTRACT(report, '$.categories.performance.score') AS speed_score,
  JSON_EXTRACT(report, '$.categories.accessibility.score') AS accessibility_score
FROM
  `httparchive.lighthouse.2018_08_01_mobile`
JOIN (
  SELECT
    DISTINCT origin,
    Alexa_rank AS rank
  FROM
    `httparchive.urls.20170315`
  JOIN
    `chrome-ux-report.country_in.201807`
  ON
    NET.REG_DOMAIN(origin) = Alexa_domain) AS crux
  ON
    url = CONCAT(origin, '/')
ORDER BY
  rank ASC, url ASC
```


Chạy truy vấn trên trả về rất nhiều dữ liệu, quá nhiều cho Google Trang tính, vì vậy tôi chỉ phân tích khoảng 16.000 trang web hàng đầu (tối đa khoảng 7k trong Xếp hạng Alexa). Dưới đây là dữ liệu được tổng hợp mà không có bình luận.

#### 7k hàng đầu

<table><thead><th> Phạm vi điểm </th><th> Điểm SEO </th><th> Điểm số PWA </th><th> Điểm tốc độ </th><th> Điểm A11Y </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 25 </td><td> 149 </td><td> 10 </td></tr><tr><td> 0,5 </td><td> 45 </td><td> 12253 </td><td> 7841 </td><td> 3925 </td></tr><tr><td> 0,7 </td><td> 1907 </td><td> 3609 </td><td> 2725 </td><td> 6498 </td></tr><tr><td> 0,8 </td><td> 1713 </td><td> 54 </td><td> 1188 </td><td> 2610 </td></tr><tr><td> 0,9 </td><td> 3016 </td><td> 30 </td><td> 1180 </td><td> 1788 </td></tr><tr><td> 1 </td><td> 9278 </td><td> 21 </td><td> 2283 </td><td> 1157 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

#### Alexa Top 100

<table><thead><th> Phạm vi điểm </th><th> Điểm SEO </th><th> Điểm số PWA </th><th> Điểm tốc độ </th><th> Điểm A11Y </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 0 </td><td> 3 </td><td> 2 </td></tr><tr><td> 0,5 </td><td> 0 </td><td> 2279 </td><td> 1231 </td><td> 519 </td></tr><tr><td> 0,7 </td><td> 87 </td><td> 703 </td><td> 484 </td><td> 1348 </td></tr><tr><td> 0,8 </td><td> 199 </td><td> 0 </td><td> 198 </td><td> 587 </td></tr><tr><td> 0,9 </td><td> 375 </td><td> 0 </td><td> 261 </td><td> 302 </td></tr><tr><td> 1 </td><td> 2316 </td><td> 0 </td><td> 694 </td><td> 219 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

#### Alexa Top 1000

<table><thead><th> Phạm vi điểm </th><th> Điểm SEO </th><th> Điểm số PWA </th><th> Điểm tốc độ </th><th> Điểm A11Y </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 1 </td><td> 19 </td><td> 2 </td></tr><tr><td> 0,5 </td><td> 16 </td><td> 5471 </td><td> 3517 </td><td> 1942 </td></tr><tr><td> 0,7 </td><td> 546 </td><td> 1867 </td><td> 1272 </td><td> 2941 </td></tr><tr><td> 0,8 </td><td> 757 </td><td> 9 </td><td> 507 </td><td> 1212 </td></tr><tr><td> 0,9 </td><td> 1077 </td><td> 16 </td><td> 567 </td><td> 719 </td></tr><tr><td> 1 </td><td> 4962 </td><td> 6 </td><td> 1241 </td><td> 550 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

Tôi nghĩ các nhà phát triển công cụ và doanh nghiệp hiện có trong tay họ có thể tạo sự khác biệt lớn cho khả năng đưa ra các quyết định lý luận và nguyên tắc về cách người dùng thực sự cảm nhận trải nghiệm của web trên toàn cầu. Đối với tôi, dữ liệu này cho tôi đường cơ sở mà tôi có thể xem xét để xem chiến lược của chúng tôi cho công việc của chúng tôi có ảnh hưởng đến hệ sinh thái trong dài hạn hay không.