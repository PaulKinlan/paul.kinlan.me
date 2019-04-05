---
slug: offline-fallback-page-with-service-worker
date: 2019-04-05T18:17:22.207Z
title: 'Offline fallback page with service worker'
link: 'https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/index.html:6:9'
tags: [links, pwa, offline]
---
Nhiều năm trước, tôi đã thực hiện một số nghiên cứu về cách các ứng dụng gốc phản ứng với việc thiếu kết nối mạng. Mặc dù tôi đã mất liên kết đến phân tích (tôi có thể thề là trên Google+), câu chuyện bao quát là nhiều ứng dụng gốc gắn bó chặt chẽ với internet mà chúng chỉ cần từ chối hoạt động. Nghe có vẻ giống như rất nhiều ứng dụng web, điều khiến chúng khác biệt so với web là trải nghiệm vẫn là &#39;thương hiệu&#39;, Bart Simpson sẽ nói với bạn rằng bạn cần phải trực tuyến (ví dụ), và cho phần lớn các trải nghiệm web bạn nhận được &#39;Dino&#39; (xem chrome: // dino).

Chúng tôi đã làm việc với Service Worker từ lâu và trong khi chúng tôi thấy ngày càng nhiều trang có các trang được kiểm soát bởi Worker, thì phần lớn các trang web thậm chí không có trải nghiệm dự phòng cơ bản khi mạng không có sẵn.

Tôi đã hỏi Jake tốt bụng của tôi nếu chúng tôi có bất kỳ hướng dẫn nào về cách xây dựng một trang dự phòng chung chung với giả định rằng bạn không muốn tạo ra trải nghiệm ngoại tuyến hoàn toàn đầu tiên, và trong vòng 10 phút anh ấy đã tạo ra nó. [Check it out](https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/sw.js:6:9) .

Để cho ngắn gọn, tôi đã dán mã bên dưới vì nó chỉ dài khoảng 20 dòng. Nó lưu trữ các tài sản ngoại tuyến, và sau đó với mỗi lần tìm nạp là &#39;điều hướng&#39;, nó sẽ xem nếu nó bị lỗi (vì mạng) và sau đó hiển thị trang ngoại tuyến thay cho nội dung gốc.

```JavaScript
addEventListener('install', (event) => ; {
  event.waitUntil(async function() {
    const cache = await caches.open('static-v1');
    await cache.addAll(['offline.html', 'styles.css']);
  }());
});

addEventListener('fetch', (event) => {
  const { request } = event;

  // Always bypass for range requests, due to browser bugs
  if (request.headers.has('range')) return;
  event.respondWith(async function() {
    // Try to get from the cache:
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    try {
      // Otherwise, get from the network
      return await fetch(request);
    } catch (err) {
      // If this was a navigation, show the offline page:
      if (request.mode === 'navigate') {
        return caches.match('offline.html');
      }

      // Otherwise throw
      throw err;
    }
  }());
});
```

Đó là tất cả. Khi người dùng trực tuyến, họ sẽ thấy trải nghiệm mặc định.

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-woker.jpeg"></figure>

Và khi người dùng ngoại tuyến, họ sẽ nhận được trang dự phòng.

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-worker-1.jpeg"></figure>

Tôi thấy tập lệnh đơn giản này cực kỳ mạnh mẽ và vâng, trong khi nó vẫn có thể được cải thiện, tôi tin rằng ngay cả một thay đổi đơn giản trong cách chúng ta nói với người dùng của mình khi có vấn đề với mạng có khả năng cải thiện cơ bản nhận thức của web cho người dùng trên toàn cầu.


