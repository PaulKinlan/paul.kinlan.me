---
slug: pwa-progressive-web-all-the-things
date: 2018-08-02T14:56:13.506Z
title: 'PWA: Progressive Web All-the-things'
description: ""
tags: ['pwa']
---


PWA. Ứng dụng web nâng cao. Frances Berriman và Alex Russell đặt ra thuật ngữ "ứng dụng web tiến bộ" vào năm 2015 với những gì tôi nghĩ là bài đăng chủ đề "[Progressive Web Apps: Escaping Tabs mà không mất linh hồn của chúng tôi](https://infrequently.org/2015/06/progressive -apps-escaping-tabs-without-lose-our-soul /) ".

3 năm sau, chúng tôi đã đi một chặng đường dài. Từ một bộ sưu tập công nghệ lỏng lẻo - Service Worker, Manifest, Add to Homescreen, Web Push - ban đầu chỉ được triển khai trong một trình duyệt, đến một thương hiệu đã bắt đầu gắn bó với ngành công nghiệp và các nhà phát triển, và tất cả các nhà cung cấp trình duyệt thực hiện phần lớn ngăn xếp 'PWA'.

Chúng tôi đã có [ứng dụng](https://appsco.pe/) [thư mục](https://pwa-directory.appspot.com/), [công cụ](https://blog.tomayac.com/ 2018/07/09 / progressive-web-apps-in-the-http-archive-143748) giúp chúng tôi hiểu được có bao nhiêu PWA có trong tự nhiên và một loạt các nghiên cứu điển hình về lợi ích của PWA (https://developers.google.com/web/showcase/). Nhưng điều gì định nghĩa một PWA? Frances và Alex đã đưa ra danh sách các đặc điểm này:

> **[Responsive](http://alistapart.com/article/responsive-web-design)**[:](http://alistapart.com/article/responsive-web-design) 
> to fit any form factor  
> **Connectivity independent**: Progressively-enhanced with [Service 
> Workers](http://www.html5rocks.com/en/tutorials/service-worker/introduction/) 
> to let them work offline  
> **App-like-interactions**: Adopt a Shell + Content application model to create 
> appy navigations & interactions  
> **Fresh**: Transparently always up-to-date thanks to the Service Worker update 
> process  
> **Safe**: Served via TLS (a Service Worker requirement) to prevent snooping  
> **Discoverable**: Are identifiable as "applications" thanks to 
> [W3C](https://w3c.github.io/manifest/) 
> [Manifests](https://developers.google.com/web/updates/2014/11/Support-for-installable-web-apps-with-webapp-manifest-in-chrome-38-for-Android) 
> and Service Worker registration scope allowing search engines to find them  
> **Re-engageable**: Can access the re-engagement UIs of the OS; e.g. [Push 
> Notifications](https://developers.google.com/web/updates/2015/03/push-notificatons-on-the-open-web)  
> **[Installable](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android?hl=en)**[: 
> to the home screen through browser-provided 
> prompts](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android?hl=en), 
> allowing users to "keep" apps they find most useful without the hassle of an 
> app store  
> **Linkable**: meaning they're zero-friction, zero-install, and easy to share.
> The social [power of
> URLs](http://www.theatlantic.com/technology/archive/2012/10/dark-social-we-have-the-whole-history-of-the-web-wrong/263523/)
> _matters_.


Quan trọng hơn, mô tả này đánh dấu thời điểm chúng tôi hiểu rõ hơn về cách chúng tôi muốn xem web và chúng tôi có [công cụ](https://developers.google.com/web/tools/lighthouse/) đã giúp chúng tôi hiểu rằng trang web của chúng tôi có phải là 'PWA' hay không. Alex đã đi xa hơn và định nghĩa một số [khía cạnh kỹ thuật tạo ra một PWA 'một PWA](https://infrequently.org/2016/09/what-exactly-makes-something-a-progressive-web-app/ ).

Với cường điệu của bài đăng này trên đường đi, tại sao mọi người không xây dựng những thứ này? [Vâng, nó có thể là khó khăn. Rất khó](/ thách thức dành cho nhà phát triển web /). Chúng tôi yêu cầu các nhà phát triển và doanh nghiệp làm rất nhiều. Trong một số trường hợp, tập trung vào AppShell có thể là một kiến ​​trúc hoàn chỉnh của một trang web, trong các trường hợp khác ['AppShell' không phải là kiến ​​trúc chính xác](/ progressive-progressive-web-apps /). Và trong nhiều trường hợp, giá trị hay câu chuyện không phải lúc nào cũng rõ ràng.

Tôi đã may mắn có thể nói chuyện trực tiếp với các doanh nghiệp và nhà phát triển về mối quan tâm của họ trên web, cụ thể những điều mà tôi đã nghe nói về các doanh nghiệp và nhà phát triển nói về PWA, là:

> We've got our site... but we are also making a PWA.


> &mdash; Many B2B sites we spoke (actually, I saw this a lot in India)


Hấp dẫn. Chúng có khác nhau không? Thường thì không, nhưng PWA là một 'điều' mà họ đã nghe nói và đó là một sản phẩm khác để ra mắt. Giống như trang web m. * Là phiên bản di động của trang web dành cho máy tính để bàn, PWA có thể là một thứ khác mà chúng phải khởi chạy.

> I've got a PWA. It just does Push notifications.


> &mdash; Too many people.


Wah. Đó không phải là PWA, đó chỉ là sử dụng một phần công nghệ mà ứng dụng gốc đã có.

> I'm only building a blog... it's not a PWA


> &mdash; Many bloggers we spoke to.


Hừm. Đó là một trường hợp rõ ràng rằng chúng tôi đã không thể nói rõ lý do tại sao điều quan trọng đối với các trang nội dung là phải di chuyển.

> I don't care about making it installable.. I don't need a Service Worker.


> &mdash; Many publishers we spoke to.


Huh. Mọi người liên kết ứng dụng với lượt cài đặt và ý nghĩ rằng một trang web hoặc trải nghiệm phải hoạt động như một lượt cài đặt ứng dụng sẽ khiến một số người rời khỏi khái niệm nói chung. Trong năm 2015 đã có một cuộc thảo luận rất thú vị về [cà rốt](https://trib.tv/2015/10/11/progressive-apps/) mà tôi khuyến khích bạn để disect.

> I don't need an app on desktop. I just need users to click 'checkout'


> &mdash; Many retailers we spoke to.


Được. Điều đó khá rõ ràng. Giá trị cho người dùng hoặc doanh nghiệp không có ở đó và đủ để ngăn một doanh nghiệp ưu tiên các đặc điểm của PWA.

> Progressive Web Apps are just better sites.


> &mdash; Many developers we speak to.


Thực ra tôi nghe thấy điều này rất nhiều từ rất nhiều nhà phát triển web tuyệt vời.

Tôi khuyến khích các bạn kiểm tra các tác phẩm của [Jeremy Keith](https://adactio.com/), người đã từng đẩy "PW" vào PWA trong một thời gian dài và trong một cuộc nói chuyện gần đây đã nói điều tương tự:

> There's a common misconception that making a Progressive Web App means
> creating a Single Page App with an app-shell architecture. But the truth is
> that literally any website can benefit from the performance boost that results
> from the combination of HTTPS + Service Worker + Web App Manifest.


> &mdash; Jeremy Keith. "[Any Site can be a Progressive Web 
> App](https://noti.st/adactio/d1zSa7/any-site-can-be-a-progressive-web-app)" 


Cảm giác cá nhân của tôi là tất cả mọi người thực sự bị treo lên A trong PWA: 'App'. Đó là sự thành công và thất bại của việc xây dựng thương hiệu của khái niệm; 'Ứng dụng' có trong tên, 'Ứng dụng' là trong ý thức của nhiều người dùng và doanh nghiệp và do đó các hiệp hội khá rõ ràng.

Để hoàn toàn rõ ràng, bản thân tôi và nhiều người khác trong nhóm của chúng tôi đã đẩy mạnh về thuật ngữ 'Ứng dụng' trong ngữ cảnh của PWA, đặc biệt liên quan đến cạnh tranh với trải nghiệm gốc di động. [Bài đăng của Andrew Betts](https://trib.tv/2016/06/05/progressively-less-progressive/) có một bản tóm tắt tốt chống lại vị trí ban đầu của chúng tôi, và trong khi tôi không nghĩ chúng tôi đã sai, chúng tôi đã làm bỏ lỡ cơ hội để giúp câu chuyện rộng hơn đặc biệt xung quanh các yếu tố hình thức không phải là trung tâm di động.

Tôi đã từng hỏi khán giả điều này khi chúng tôi nói về Cửa hàng Chrome trực tuyến. Gmail có phải là ứng dụng hoặc trang web không? Một ứng dụng, thật dễ dàng. Twitter có phải là ứng dụng hoặc trang web không? Một ứng dụng .. là nó? Nếu tôi chỉ đọc nội dung, nó vẫn cảm thấy giống như một trang web. Wikipedia là một ứng dụng hoặc trang web? Một trang web, hoàn toàn; là nó mặc dù? Là một biên tập viên, nó cảm thấy rất giống một công cụ.

Cuối cùng, tôi không nghĩ rằng nó thực sự quan trọng quá nhiều nếu một trang web là một ứng dụng hoặc một ứng dụng là một trang web. Mọi người có thể và tạo mọi thứ trên web: 'ứng dụng', trò chơi, bobbins VR, cửa hàng bán lẻ hoặc chỉ 'trang web' truyền thống và có thể cho mọi trường hợp sử dụng cụ thể - phương tiện, giải trí, xuất bản, tiện ích, thương mại ...

Nếu bạn trêu chọc định nghĩa ban đầu của PWA, ngoại trừ 'khả năng cài đặt' (xem 'túi cà rốt'), tôi không nghĩ ai có thể tranh luận rằng nếu nhà phát triển cải thiện trang web của họ trong bất kỳ một trong những điểm mà Alex tham chiếu thì người dùng có trải nghiệm tốt hơn và khi người dùng có được trải nghiệm tốt hơn, họ coi trọng trang web ngày càng nhiều người tham gia có ý nghĩa với web và tiếp tục sử dụng web. Vậy làm thế nào chúng ta có thể áp dụng câu chuyện PWA theo cách mà mọi doanh nghiệp và nhà phát triển đều biết những gì họ nên tập trung vào?

---

Tôi đã nghĩ đến một trục xoay nhỏ dựa trên những thách thức mà chúng tôi đã thấy trong ngành và tôi đã cố gắng ưu tiên tầm quan trọng của việc các nhà phát triển và doanh nghiệp có thể tập trung nỗ lực của họ vào đâu. (Lưu ý: Tôi có thể kênh [BizKin](https://twitter.com/business_kinlan))

Chúng tôi muốn các doanh nghiệp và nhà phát triển thành công bằng cách tận dụng khả năng độc đáo của web cho phép họ: Tiếp cận nhiều người dùng nhất có thể bằng cách nhấp vào nút; Giữ chân người dùng bằng cách mang lại trải nghiệm tốt nhất của họ trên các thiết bị với một bộ mã duy nhất; và có ý nghĩa tương tác với người dùng của họ bằng cách xây dựng mối quan hệ trực tiếp và có thể sở hữu với họ.

Tôi đã cố gắng để nói rõ điều này như một bộ nguyên tắc mà người dùng nên cảm nhận khi sử dụng web. Kinh nghiệm của bạn nên là: KHÁM PHÁ, AN TOÀN, NHANH, NHỎ, ĐÁNG TIN CẬY, ĐÁNH GIÁ

Làm cho nó có thể khám phá: Cho phép người dùng tìm thấy trải nghiệm của bạn. Web được tạo thành từ các liên kết và trang. Lý tưởng nhất là mọi trang và tiểu bang phải có liên kết sâu để bất kỳ ai cũng có thể được gửi tới trang web đó từ bất kỳ trang web nào, có thể là tập hợp, thư, email hoặc bảng quảng cáo. Nội dung phải được phân phối để bất kỳ trình kết xuất nào có thể đọc được.

Đảm bảo an toàn: Người dùng và chủ sở hữu nội dung có thể tin tưởng các trải nghiệm được xây dựng trên web, bảo vệ danh tính, bảo mật và toàn vẹn dữ liệu.

Làm cho nó nhanh: Khi người dùng có liên kết đến trang web của bạn, sau đó ngay lập tức họ nhấn vào đó là trải nghiệm của bạn và có thể bắt đầu sử dụng nó bất kể mạng hoặc thiết bị mà người dùng có.

Làm cho nó mượt mà: Khi người dùng ở trên trang web của bạn, trải nghiệm là phản hồi và tương tác với tất cả các cử chỉ của người dùng. Ảnh động cảm thấy mượt mà và sắc nét, phản hồi tức thì, cuộn mượt, điều hướng tức thì. Lý tưởng nhất là nếu bạn nghĩ về hiệu suất web về [RAIL](https://developers.google.com/web/fundamentals/performance/rail), bạn đang tập trung vào 'RAI'.

Làm cho trang web đáng tin cậy: Người dùng trang web của bạn cảm thấy ít bị gián đoạn nhất có thể khi phải đối mặt với mạng hoặc thiết bị không đáng tin cậy. Trải nghiệm sẽ hoạt động và đáp ứng mọi lúc mọi nơi.

Làm cho nó có ý nghĩa: Bạn phải cung cấp giá trị và đáp ứng nhu cầu của người dùng thông qua trải nghiệm chất lượng cao mang lại giá trị. Điều này có vẻ khá mịn, nhưng [Dion Almaer mô tả nó tốt](https://medium.com/ben-and-dion/mission-improve-the-web-ecosystem-for-developers-3a8b55f46411). Trọng tâm thực sự là về trang web của bạn giải quyết nhu cầu cho người dùng, có thể là giải trí, làm mịn mua hàng, thăng tiến kiến ​​thức hoặc hoàn thành nhanh công việc. Đó là tất cả về UX.

Một trải nghiệm hiện đại đáp ứng các mục tiêu chính của ** nhanh chóng, đáng tin cậy, an toàn và mượt mà **. Nó dần dần trở nên có khả năng ** hơn bằng cách sử dụng các API hiện đại và có khả năng phát hiện cao ** bằng cách khai thác phạm vi của trang web mở và cốt lõi của nó. Một PWA nên tự nhiên đáp ứng từng "mục tiêu nguyên tắc" này dựa trên kỳ vọng của người dùng và tiếp tục xây dựng dựa trên kinh nghiệm khi có nhiều công nghệ và khả năng hơn. Nhưng vì vậy, bất kỳ trải nghiệm hiện đại nào trên web ngày nay ...

<span><span id=name>Ứng dụng</span> <span id='pw'>web tiến bộ</span></span> - Progressive Web All-the-things.

Đây là nơi tôi muốn thúc đẩy PWA trong năm tới. Bạn nghĩ sao?

_Cảm ơn Harleen Batra._

{{ <html> }}

<style> dt {   font-weight: 600;   margin-bottom: 0.8em; } dd {   margin-bottom: 1em; } #pw {   font-weight: 700;   font-size: 1em; } #name {   font-size: 1em;   font-weight: 100; } </style><script>   const nameEl = document.getElementById('name');   const names = ['Apps', 'Sites', 'Stores', 'Blogs', 'Forums', 'Magazines', 'Block-chain doo-dads', 'Experiences', 'Wikis', 'Utilities', 'Games'];   let counter = 1;   setInterval(()=> {      nameEl.textContent = names[counter];     counter = (counter + 1) % names.length;     nameEl.animate([{opacity: 0}, {opacity: 1}], {duration: 1000, easing: 'cubic-bezier(1,.01,1,.99)'})   }, 2000) </script> {{ </html> }}