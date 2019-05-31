---
slug: creating-a-commit-with-multiple-files-to-github-with-js-on-the-web
date: 2019-05-24T11:10:02.642Z
title: 'Creating a commit with multiple files to Github with JS on the web'
tags: [hugo, serverless, octokat]
---
Trang web của tôi là [entirely static](https://github.com/PaulKinlan/paul.kinlan.me) . Nó được xây dựng với [Hugo](https://gohugo.io) và được lưu trữ với [Zeit](https://zeit.co) . Tôi khá hài lòng với thiết lập, tôi nhận được các bản dựng gần và phân phối nội dung CDN siêu nhanh và tôi có thể làm tất cả những việc tôi cần vì tôi không phải quản lý bất kỳ trạng thái nào.

Tôi đã tạo một [simple UI](https://github.com/PaulKinlan/paul.kinlan.me/tree/main/static/share/image) cho trang web này và cả [podcast creator](https://github.com/PaulKinlan/podcastinabox-editor) của tôi cho phép tôi nhanh chóng đăng nội dung mới lên trang web được lưu trữ tĩnh của mình.

<figure><img src="/images/2019-05-24-creating-a-commit-with-multiple-files-to-github-with-js-on-the-web-0.jpeg"></figure>

Vì thế. Làm thế nào tôi làm điều đó?

Đó là sự kết hợp giữa Firebase Auth với Github Repo của tôi, EditorJS để tạo chỉnh sửa nội dung (gọn gàng) và Octokat.js để cam kết repo và sau đó tích hợp Github của Zeit để xây dựng hugo của tôi. Với thiết lập này, tôi có thể có một CMS tĩnh hoàn toàn tự lưu trữ, tương tự như cách người dùng có thể tạo các bài đăng trong một cơ sở dữ liệu CMS được hỗ trợ như Wordpress.

Trong bài đăng này, tôi chỉ tập trung vào một phần của cơ sở hạ tầng - cam kết nhiều tệp cho Github vì tôi phải mất một ít thời gian để xử lý.

Toàn bộ mã có thể được nhìn thấy trên [repo](https://github.com/PaulKinlan/podcastinabox-editor/blob/master/record/javascripts/main.mjs#L90) của tôi.

Nếu bạn đang xây dựng một giao diện người dùng web cần cam kết trực tiếp với Github, thư viện tốt nhất mà tôi đã tìm thấy là Octokat - nó hoạt động với CORS và dường như xử lý toàn bộ bề mặt API của Github API.

Git có thể là một con thú phức tạp khi hiểu được cách thức cây, cành và các mảnh khác hoạt động nên tôi đã đưa ra một số quyết định giúp nó dễ dàng hơn.

1. Tôi sẽ chỉ có thể đẩy đến nhánh chính được gọi là `heads/master` .
1. Tôi sẽ biết nơi lưu trữ một số tệp nhất định (Hugo buộc tôi phải có cấu trúc thư mục cụ thể)


Với ý nghĩ đó, quy trình chung để tạo một cam kết với nhiều tệp như sau:

Nhận một tài liệu tham khảo cho repo.

1. Lấy tham chiếu đến ngọn cây trên nhánh `heads/master` .
1. Đối với mỗi tệp mà chúng tôi muốn cam kết, hãy tạo một `blob` và sau đó lưu các tham chiếu đến `sha` định danh, đường dẫn, chế độ `sha` trong một mảng.
1. Tạo một `tree` mới chứa tất cả các đốm màu để thêm vào tham chiếu đến đầu của cây `heads/master` và lưu con trỏ `sha` mới vào cây này.
1. Tạo một cam kết trỏ đến cây mới này và sau đó đẩy đến nhánh `heads/master` .

Các mã khá nhiều theo dòng chảy đó. Bởi vì tôi có thể giả định cấu trúc đường dẫn cho một số đầu vào nhất định, tôi không cần xây dựng bất kỳ giao diện người dùng hoặc quản lý phức tạp nào cho các tệp.

```JavaScript
const createCommit = async (repositoryUrl, filename, data, images, commitMessage, recording) => {
  try {
    const token = localStorage.getItem('accessToken');
    const github = new Octokat({ 'token': token });
    const [user, repoName] = repositoryUrl.split('/');

    if(user === null || repoName === null) {
      alert('Please specifiy a repo');
      return;
    }
    
    const markdownPath = `site/content/${filename}.markdown`.toLowerCase();
    let repo = await github.repos(user, repoName).fetch();
    let main = await repo.git.refs('heads/master').fetch();
    let treeItems = [];

    for(let image of images) {
      let imageGit = await repo.git.blobs.create({ content: image.data, encoding: 'base64' });
      let imagePath = `site/static/images/${image.name}`.toLowerCase();
      treeItems.push({
        path: imagePath,
        sha: imageGit.sha,
        mode: "100644",
        type: "blob"
        });
    }

    if (recording) {
      let audioGit = await repo.git.blobs.create({ content: recording.data, encoding: 'base64' });
      let audioPath = `site/static/audio/${recording.name}.${recording.extension}`.toLowerCase();
      treeItems.push({
        path: audioPath,
        sha: audioGit.sha,
        mode: "100644",
        type: "blob"
        });
    }

    let markdownFile = await repo.git.blobs.create({ content: btoa(jsonEncode(data)), encoding: 'base64' });
    treeItems.push({
      path: markdownPath,
      sha: markdownFile.sha,
      mode: "100644",
      type: "blob"
    });

    let tree = await repo.git.trees.create({
      tree: treeItems,
      base_tree: main.object.sha
    });
  
    let commit = await repo.git.commits.create({
      message: `Created via Web - ${commitMessage}`,
      tree: tree.sha,
      parents: [main.object.sha]});

    main.update({sha: commit.sha})

    logToToast('Posted');
  } catch (err) {
    console.error(err);
    logToToast(err);
  }
}
```

Hãy cho tôi biết nếu bạn đã làm bất cứ điều gì tương tự với lưu trữ tĩnh. Tôi rất vui mừng rằng tôi có thể xây dựng một lối vào hiện đại cho cơ sở hạ tầng lưu trữ hoàn toàn không có máy chủ.

Zeit thì sao?

Chà, bây giờ chỉ là tự động thôi. Tôi sử dụng `static-builder` để chạy lệnh hugo và đó là khá nhiều. :)