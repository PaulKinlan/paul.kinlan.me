---
slug: webmention-app
date: 2019-06-20T12:33:04.370Z
title: 'Webmention.app'
link: 'https://remysharp.com/2019/06/18/send-outgoing-webmentions'
tags: [links, webmention, zeit, hugo]
---
Adoro a ideia do [Webmentions](https://www.w3.org/TR/webmention/) , mas ainda não tive tempo de implementá-la no meu site. Em um alto nível, as menções na web permitem que você comente, curta e responda a outros conteúdos na web e faça com que fique visível para esse conteúdo sem ser centralizado com ferramentas como o Disqus (que tenho o desejo de remover do meu site).

As Menções na Web são divididas em dois componentes, o remetente e o destinatário. O destinatário é o site sobre o qual estou escrevendo um post e eles podem ter algo no site que mostra links de entrada ou reações ao blog; e o remetente sou, bem, eu. Eu preciso deixar o site remoto que eu escrevi ou reagir a algum conteúdo que eles criaram.

O impressionante [Remy Sharp](https://remysharp.com) criou o [webmention.app](https://webmention.app/) para resolver uma parte do problema: enviar pings. A ferramenta de Remy facilita o envio de &#39;pings&#39; para potenciais receptores aos quais eu me vinculei, simplesmente chamando um script CLI.

Eu hospedo meu blog usando Zeit usando Hugo e a ferramenta static-builder, então foi [relatively trivial for me to add in support for webmention app](https://github.com/PaulKinlan/paul.kinlan.me/commit/541cf5db0b48b1eb75bedfa326406f887e57e1a9) . Eu apenas `npm i webmention` e depois chamo a versão CLI da ferramenta do meu arquivo `build.sh` - é realmente simples assim.

Agora, quando eu criar uma postagem, ela deverá enviar um ping rápido a todos os novos URLs que eu criei algum conteúdo sobre o site deles.

