---
slug: hosting-puppeteer-in-a-docker-container
date: 2018-03-13T13:20:31+01:00
title: "Hosting Puppeteer in a Docker container"
tags: ['docker', 'puppeteer', 'headless chrome']
description: "A simple docker container that can host an instance of puppeteer and a custom app."
---


यह एक स्क्रिप्ट है कि एरिक बिडलमैन ने मुझे दिया (या मुझे बनाने में मदद की; मैं काफी याद कर सकता हूं)।

मुझे एक कस्टम वेब ऐप होस्ट करने का एक आसान तरीका चाहिए जो Puppeteer API पर हेडलेस क्रोम के उदाहरण से कनेक्ट हो सके। यह लेख ज्यादातर भविष्य के लिए एक संदर्भ है।

डॉकर कंटेनर अपेक्षाकृत सीधे आगे है:

1. नोड का प्रयोग करें: 8-स्लिम 2. क्रोम सहित सभी आवश्यक निर्भरताओं को स्थापित करें। 3. पर्यावरण शुरू करें 4. मेरे ऐप को वर्तमान निर्देशिका से कॉपी करें (डॉकर फ़ाइल और ऐप एक ही फ़ोल्डर में हैं) 5. उपयोगकर्ता और अनुमतियां सेट करें 6. बंदरगाह का पर्दाफाश करें और ऐप शुरू करें।


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


इसे सरल रखने के लिए, मैंने अधिकांश तर्कों को 'किनलान: कठपुतली' नामक एक नई डॉकर कंटेनर स्क्रिप्ट में समझाया है जो आपको अपने एप्लिकेशन को कैसे तैनात करने के लिए अनुकूलित करने की अनुमति देता है।


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


मैं जल्द ही एक अतिरिक्त अपडेट पोस्ट करूँगा जहां मैं इसका उपयोग करता हूं।