---
slug: a-simple-video-insertion-tool-for-editorjs
date: 2019-11-05T00:48:57.389Z
title: A simple video insertion tool for EditorJS
link: 'https://github.com/PaulKinlan/simple-video'
tags: [links, editor]
---

Мне очень нравится <a <span class="notranslate">href=&quot;https://editorjs.io/&quot; &gt;EditorJS</a> . Это позволило мне создать очень простой веб-интерфейс для моего статичного блога Hugo.

EditorJS содержит большую часть того, что мне нужно, в простом блочном редакторе. Он имеет плагин для заголовков, кода и даже простой способ добавления изображений в редактор без необходимости размещения инфраструктуры. До сих пор не было простого способа добавить видео в редактор.

Я взял <a <span class="notranslate">href=&quot;https://github.com/editor-js/simple-image&quot; &gt;simple-image</a> репозиторий плагинов для <a <span class="notranslate">href=&quot;https://github.com/editor-js/simple-image&quot; &gt;simple-image</a> и изменил его (просто немного), чтобы создать <a <span class="notranslate">href=&quot;https://github.com/PaulKinlan/simple-video&quot; &gt;simple-video</a> плагин <a <span class="notranslate">href=&quot;https://github.com/PaulKinlan/simple-video&quot; &gt;simple-video</a> (модуль <a <span class="notranslate">href=&quot;https://www.npmjs.com/package/simple-video-editorjs&quot; &gt;npm module</a> ). Теперь я могу легко включить видео в этот блог.

Если вы знакомы с EditorJS, это довольно просто включить в ваши проекты. Просто установите его следующим образом

```
npm i simple-video-editorjs
```

А затем просто включите его в свой проект, как считаете нужным.

```
const SimpleVideo = require('simple-video-editorjs');

var editor = EditorJS({
  ...
  
  tools: {
    ...
    video: SimpleVideo,
  }
  
  ...
});
```

В редакторе есть несколько простых опций, которые позволяют вам настроить способ размещения видео на странице:

1. Автозапуск - будет ли видео воспроизводиться автоматически при загрузке страницы
1. muted - по умолчанию звук в видео не будет включен (необходим для автозапуска)
1. элементы управления - будут ли у видео стандартные элементы управления HTML.

Ниже приведен быстрый пример встроенного видео (и показаны некоторые параметры).

<figure><video src="/videos/2019-11-06-a-simple-video-insertion-tool-for-editorjs-0.mp4" alt="Showing Options for EditorJS simple video." autoplay muted></video></figure>

В любом случае, я получал удовольствие от создания этого маленького плагина - его было не так сложно создать, и единственное, что я сделал, - это отложил преобразование в base64, которое использует simple-images, и вместо этого просто использовал URL-адреса BLOB-объектов.