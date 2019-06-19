#! /bin/bash

yum install -y wget

npm install

sh install-hugo.sh

cp -r node_modules/comlink static/javascripts/
cp -r node_modules/@editorjs/editorjs/dist static/javascripts/editorjs/
cp -r node_modules/@editorjs/raw/dist/bundle.js static/javascripts/editorjs/raw.js
cp -r node_modules/@editorjs/quote/dist/bundle.js static/javascripts/editorjs/quote.js
cp -r node_modules/@editorjs/header/dist/bundle.js static/javascripts/editorjs/header.js
cp -r node_modules/@editorjs/paragraph/dist/bundle.js static/javascripts/editorjs/paragraph.js
cp -r node_modules/@editorjs/code/dist/bundle.js static/javascripts/editorjs/code.js
cp -r node_modules/@editorjs/list/dist/bundle.js static/javascripts/editorjs/list.js
cp -r node_modules/@editorjs/link/dist/bundle.js static/javascripts/editorjs/link.js
cp -r node_modules/@editorjs/simple-image/dist/bundle.js static/javascripts/editorjs/simple-image.js
cp -r node_modules/pinch-zoom-element/dist static/javascripts/pinch-zoom-element

./hugo -d dist

npx webmention dist/index.xml --limit 0 --send
