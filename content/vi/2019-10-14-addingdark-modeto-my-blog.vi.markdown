---
slug: adding-dark-mode-to-my-blog
date: 2019-10-14T12:17:17.251Z
title: 'Adding "dark mode" to my blog'
link: ''
tags: [links]
---

Tôi đã thấy [post about adding dark mode to his blog](https://adactio.com/journal/15941) của Jeremy Keith và nó có vẻ đơn giản, vì vậy tôi quyết định cho nó một vòng xoáy.

Đây là [diff of the work](https://github.com/PaulKinlan/paul.kinlan.me/compare/00862927187ef8b36433ee59679cb6367a21793a...main) cho tất cả mọi người xem. Đó là dễ dàng đáng ngạc nhiên (bên ngoài các lỗi ngớ ngẩn về phía tôi). Có một bộ tái cấu trúc nhỏ để hỗ trợ các biến CSS và đảm bảo tôi có dự phòng nếu có một trình duyệt không hỗ trợ các thuộc tính tùy chỉnh CSS, nhưng đó là về nó. Tôi đã làm khá nhiều điều tương tự như Jeremy đã làm.

Không có hỗ trợ DevTools trong Chrome cho phép tôi mô phỏng chế độ tối được đặt ( [I hear it's coming](https://bugs.chromium.org/p/chromium/issues/detail?id=1004246) ), vì vậy tôi đã tạo một lớp CSS đơn giản mà tôi có thể thêm vào phần tử HTML của mình để nhanh chóng kiểm tra nó hoạt động (như được thấy bên dưới).

```CSS
@media (prefers-color-scheme: dark) {
  html {
    --background-color: rgb(36, 36, 36);
    --text-color: #fefefe;
    --block-quote-before-color: #333;
    --link-color-visited: #7ad857;
    --post-shadow: #333;
  }

  .post.moi a[rel=me] img {
    filter: invert(0.8);
  }
}

html.dark {
  --background-color: rgb(36, 36, 36);
  --text-color: #fefefe;
  --block-quote-before-color: #333;
  --link-color: #1bcba2;
  --link-color-visited: #7ad857;
  --post-shadow: #333;
}

html.dark .post.moi a[rel=me] img {
  filter: invert(0.8);
}
```

### Không ở chế độ tối

<figure><img src="/images/2019-10-14-addingdark-modeto-my-blog-0.jpeg"></figure>

Chế độ tối ###

<figure><img src="/images/2019-10-14-addingdark-modeto-my-blog-1.jpeg"></figure>

