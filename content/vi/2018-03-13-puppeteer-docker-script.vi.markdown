---
slug: hosting-puppeteer-in-a-docker-container
date: 2018-03-13T13:20:31.000Z
title: "Hosting Puppeteer in a Docker container"
tags: ['docker', 'puppeteer', 'headless chrome']
description: "A simple docker container that can host an instance of puppeteer and a custom app."
---


Đây là một kịch bản mà Eric Bidelman đã cho tôi (hoặc đã giúp tôi tạo & mdash; tôi hoàn toàn có thể nhớ lại).

Tôi cần một cách đơn giản để lưu trữ một ứng dụng web tùy chỉnh có thể kết nối với một phiên bản Chrome không đầu trên API Puppeteer. Bài viết này chủ yếu là một tài liệu tham khảo cho tương lai.

Các docker container tương đối thẳng về phía trước:

1. Sử dụng nút: 8-slim 2. Cài đặt tất cả các phụ thuộc bắt buộc, bao gồm Chrome. 3. Khởi tạo môi trường 4. Sao chép ứng dụng của tôi từ thư mục hiện tại (tệp docker và ứng dụng nằm trong cùng thư mục) 5. Thiết lập người dùng và các quyền 6. Hiển thị cổng và khởi động ứng dụng.


```docker
FROM node:8-slim
LABEL name "puppeteraas"

# See https://crbug.com/795759
RUN apt-get update && apt-get install -yq libgconf-2-4

# Install latest chrome dev package and fonts to support major 
# charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version 
# of Chromium that Puppeteer
# installs, work.
RUN apt-get update && apt-get install -y wget --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge --auto-remove -y curl \
    && rm -rf /src/*.deb

# It's a good idea to use dumb-init to help prevent zombie chrome processes.
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

# Uncomment to skip the chromium download when installing puppeteer. 
# If you do, you'll need to launch puppeteer with:
#     browser.launch({executablePath: 'google-chrome-unstable'})
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Copy the app
COPY . /app/
#COPY local.conf /etc/fonts/local.conf
WORKDIR app
RUN npm i

# Add user so we don't need --no-sandbox.
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser ./node_modules

# Run everything after as non-privileged user.
USER pptruser

EXPOSE 8084
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start"]
```


Để giữ cho nó đơn giản, tôi đã trừu tượng hóa hầu hết logic vào một kịch bản container docker mới gọi là `kinlan: puppets` cho phép bạn tùy chỉnh cách bạn triển khai ứng dụng của mình.


```docker
FROM kinlan/puppets:latest

# Copy the app
COPY . /app/
#COPY local.conf /etc/fonts/local.conf
WORKDIR app
RUN npm i

# Add user so we don't need --no-sandbox.
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser ./node_modules

# Run everything after as non-privileged user.
USER pptruser

EXPOSE 8084
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start"]
```


Tôi sẽ đăng một bản cập nhật bổ sung sớm về chính xác nơi tôi sử dụng.