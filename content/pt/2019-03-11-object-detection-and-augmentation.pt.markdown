---
slug: object-detection-and-augmentation
date: 2019-03-11T20:32:18.307Z
title: 'Object Detection and Augmentation'
link: 'https://github.com/jeeliz/jeelizFaceFilter/blob/master/README.md#features'
tags: [links, qrcode, shapedetection]
---
Eu tenho tocado muito com o [Shape Detection API](https://paul.kinlan.me/face-detection/ https://paul.kinlan.me/barcode-detection/ https://paul.kinlan.me/detecting-text-in-an-image/) no Chrome e eu realmente gosto do potencial que ele tem, por exemplo, um [QRCode detector](https://qrsnapper.com) muito simples que escrevi há muito tempo tem um polyfill JS, mas usa a API `new BarcodeDetector()` se estiver disponível.

Você pode ver algumas das outras demos que construí aqui usando os outros recursos da API de detecção de formas: [Face Detection](https://paul.kinlan.me/face-detection/) , [Barcode Detection](https://paul.kinlan.me/barcode-detection/) e [Text Detection](https://paul.kinlan.me/detecting-text-in-an-image/) .

Fiquei agradavelmente surpreso quando tropecei no [Jeeliz](https://jeeliz.com) no fim de semana e fiquei incrivelmente impressionado com o desempenho de seu kit de ferramentas - sabendo que estava usando um Pixel3 XL, mas a detecção de rostos pareceu significativamente mais rápida do que é possível com a API `FaceDetector` .

[Checkout some of their demos](https://jeeliz.com/sunglasses) .

<figure>
  <img src="/images/2019-03-11-object-detection-and-augmentation.jpeg">
</figure>

Isso me fez pensar muito. Esse kit de ferramentas para Detecção de Objetos (e outros) usa APIs amplamente disponíveis na Web, especificamente acesso à câmera, WebGL e WASM, que, ao contrário da API de Detecção de Forma do Chrome (que é apenas no Chrome e não consistente em todas as plataformas em que o Chrome está) ) pode ser usado para criar experiências ricas facilmente e alcançar bilhões de usuários com uma experiência consistente em todas as plataformas.

Aumento é onde fica interessante (e realmente o que eu queria mostrar neste post) e onde você precisa de bibliotecas de middleware que estão chegando agora à plataforma, podemos construir os divertidos aplicativos de filtro de face sem os usuários instalarem aplicativos MASSIVE que coletam uma enorme quantidade de dados do dispositivo do usuário (porque não há acesso subjacente ao sistema).

Fora das demonstrações divertidas, é possível resolver casos de uso muito avançados de forma rápida e simples para o usuário, como:

* Seleção de texto diretamente da câmera ou foto do usuário
* Tradução ao vivo de idiomas da câmera
* Detecção Inline QRCode para que as pessoas não precisem abrir o WeChat o tempo todo :)
* Auto extrair URLs do site ou endereço de uma imagem
* Detecção de cartão de crédito e extração de números (faça com que os usuários se inscrevam em seu site com mais rapidez)
* Pesquisa visual de produtos na aplicação Web da sua loja.
* Pesquisa de código de barras para mais detalhes do produto em seu aplicativo da web de lojas.
* Recorte rápido de fotos de perfil no rosto das pessoas.
* Recursos simples do A11Y para permitir que o usuário ouça o texto encontrado nas imagens.

Eu passei apenas 5 minutos pensando nesses casos de uso - eu sei que há muito mais -, mas me ocorreu que não vemos muitos sites ou aplicativos da web usando a câmera, em vez disso, vemos muitos sites perguntando por eles. os usuários fazem o download de um aplicativo, e acho que não precisamos mais fazer isso.

** Atualização ** Thomas Steiner em nossa equipe mencionou em nosso bate-papo da equipe que parece que eu não gosto da API atual do `ShapeDetection` . Eu adoro o fato de que essa API nos dá acesso às implementações nativas de envio de cada um dos respectivos sistemas, no entanto, como escrevi em [The Lumpy Web](/the-lumpy-web/) , os desenvolvedores da Web desejam consistência na plataforma e há vários problemas com a API de detecção de forma que podem ser resumido como:

1. A API é apenas no Chrome
2. A API no Chrome é muito diferente em todas as plataformas porque suas implementações subjacentes são diferentes. O Android só tem pontos para pontos de referência como boca e olhos, onde o macOS tem contornos. No Android o `TextDetector` retorna o texto detectado, onde como no macOS ele retorna um indicador &#39;Presença de Texto&#39; ... Isso sem mencionar todos os bugs que o Surma encontrou.

A web como plataforma de distribuição faz tanto sentido para experiências como essas que acho que seria negligente não fazê-lo, mas os dois agrupamentos de questões acima me levam a questionar a necessidade de longo prazo de implementar todos os recursos em a plataforma web nativamente, quando pudemos implementar boas soluções em um pacote que é enviado usando os recursos da plataforma hoje, como WebGL, WASM e no futuro Web GPU.

De qualquer forma, eu amo o fato de que podemos fazer isso na web e eu estou olhando para a frente para ver sites enviados com eles.