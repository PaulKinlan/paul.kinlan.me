---
slug: hosting-puppeteer-in-a-docker-container
date: 2018-03-13T13:20:31+01:00
title: "Hosting Puppeteer in a Docker container"
tags: ['docker', 'puppeteer', 'headless chrome']
description: "A simple docker container that can host an instance of puppeteer and a custom app."
---


எரிக் பிடல்மேன் எனக்கு வழங்கிய ஸ்கிரிப்ட் (அல்லது என்னை உருவாக்க உதவியது & mdash; நான் மிகவும் நினைவு கூரலாம்).

Puppeteer ஏபிஐ மீது தலைமையின் குரோம் ஒன்றை இணைக்கக்கூடிய தனிப்பயன் வலைப் பயன்பாட்டை ஹோஸ்ட் செய்ய ஒரு எளிய வழி தேவை. இந்த கட்டுரை பெரும்பாலும் எதிர்காலத்திற்கான குறிப்பு ஆகும்.

துறைமுக கொள்கலன் ஒப்பீட்டளவில் நேராக முன்னோக்கி உள்ளது:

1. கணு பயன்படுத்தவும்: 8-மெலிந்த 2. குரோம் உட்பட தேவையான அனைத்து சார்புகளையும் நிறுவுக. 3. சூழலை துவக்குதல் 4. நடப்பு அடைவில் இருந்து என் பயன்பாட்டை நகலெடுக்கவும் (டாக்ஸர் கோப்பும் பயன்பாடும் ஒரே கோப்புறையில் இருக்கும்) 5. பயனர் மற்றும் அனுமதிகள் அமைக்கவும் 6. துறைமுகத்தை அம்பலப்படுத்தி பயன்பாட்டைத் தொடங்கவும்.


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


அதை எளிமையாக வைத்துக்கொள்வதற்கு, நான் தர்க்கத்தை மிக அரிதாக எடுத்துவிட்டேன், ஒரு புதிய டாக்ஸர் கொள்கலன் ஸ்கிரிப்ட்டாக `கின்லான்: கைப்பைகள்` என்று அழைப்பீர்கள், இது உங்கள் விண்ணப்பத்தை நீங்கள் எப்படி பயன்படுத்துகிறீர்கள் என்பதை தனிப்பயனாக்க அனுமதிக்கிறது.


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


நான் இதை சரியாக பயன்படுத்துவது பற்றி விரைவில் ஒரு கூடுதல் புதுப்பிப்பை இடுகிறேன்.