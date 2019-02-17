---
slug: hosting-puppeteer-in-a-docker-container
date: 2018-03-13T13:20:31+01:00
title: "Hosting Puppeteer in a Docker container"
tags: ['docker', 'puppeteer', 'headless chrome']
description: "A simple docker container that can host an instance of puppeteer and a custom app."
---


これは、Eric Bidelmanが私に与えたスクリプトです（または作成するのを助けました;私はかなり思い出すことができます）。

Puppeteer APIを使用してHeadless Chromeのインスタンスに接続できるカスタムWebアプリケーションを簡単にホストする必要がありました。この記事は主に将来の参考資料です。

ドッカーのコンテナは比較的まっすぐです：

1. node：8-slimを使用します。2. Chromeを含む必要なすべての依存関係をインストールします。 3.環境を初期化する4.現在のディレクトリからアプリケーションをコピーする（ドッカーファイルとアプリケーションは同じフォルダにある）5.ユーザと権限を設定する6.ポートを公開してアプリケーションを起動する。


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


簡単にするために、ほとんどのロジックを `kinlan：puppets`という新しいdockerコンテナスクリプトに抽象化しました。このスクリプトを使用すると、アプリケーションの展開方法をカスタマイズできます。


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


私はこれを使う場所についてまもなく追加のアップデートをすぐに投稿する予定です。