---
slug: a-simple-video-insertion-tool-for-editorjs
date: 2019-11-05T00:48:57.389Z
title: A simple video insertion tool for EditorJS
link: 'https://github.com/PaulKinlan/simple-video'
tags: [links, editor]
---

Eu realmente gosto do [EditorJS](https://editorjs.io/) . Permiti-me criar uma interface hospedada na web muito simples para o meu blog estático do Hugo.

O EditorJS tem a maior parte do que eu preciso em um editor simples baseado em bloco. Possui um plug-in para cabeçalhos, código e até uma maneira simples de adicionar imagens ao editor sem exigir infraestrutura de hospedagem. Até agora, não há uma maneira simples de adicionar vídeos ao editor.

Tomei a [simple-image](https://github.com/editor-js/simple-image) repositório de plug-in e mudou-se (apenas um pouco) para criar um [simple-video](https://github.com/PaulKinlan/simple-video) plug-in ( [npm module](https://www.npmjs.com/package/simple-video-editorjs) ). Agora eu posso incluir vídeos facilmente neste blog.

Se você conhece o EditorJS, é bastante simples incluir em seus projetos. Basta instalá-lo da seguinte maneira

```
npm i simple-video-editorjs
```

Depois, basta incluí-lo no seu projeto como achar melhor.

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

O editor possui algumas opções simples que permitem configurar como o vídeo deve ser hospedado na página:

1. Reprodução automática - o vídeo será reproduzido automaticamente quando a página for carregada
1. mudo - o vídeo não terá som por padrão (necessário para reprodução automática)
1. Controles - o vídeo terá os controles HTML padrão.

Abaixo está um exemplo rápido de um vídeo incorporado (e mostrando algumas das opções).

<figure><video src="/videos/2019-11-06-a-simple-video-insertion-tool-for-editorjs-0.mp4" alt="Showing Options for EditorJS simple video." autoplay muted></video></figure>

Enfim, me diverti criando esse pequeno plug-in - não foi tão difícil de criar e a única coisa que fiz foi adiar a conversão para base64 que as imagens simples usam e, em vez disso, apenas usar os URLs do Blob.