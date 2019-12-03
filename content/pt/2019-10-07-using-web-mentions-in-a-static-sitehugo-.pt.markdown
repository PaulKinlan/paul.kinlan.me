---
slug: using-web-mentions-in-a-static-sitehugo-
date: 2019-10-07T20:11:30.489Z
title: 'Using Web Mentions in a static site (Hugo)'
link: ''
tags: [webmentions, hugo]
---

Meu blog é um site totalmente estático, construído com Hugo e hospedado com Zeit. Esta é uma ótima solução para mim, um blog simples tem um processo de implantação bastante simples e carrega incrivelmente rápido.

Sites gerados estaticamente têm algumas desvantagens, a maior delas é quando você precisa de algo dinâmico para ser integrado à sua página (comentários, por exemplo). Não poder hospedar conteúdo dinâmico com facilidade significa que você acaba confiando no JavaScript de terceiros que obterá acesso total à sua página e você não saberá o que está fazendo - isso pode estar rastreando seus usuários ou tornando sua página mais lenta carga.

Recentemente, tirei meu widget de comentários atual (Disqus) do caminho crítico de renderização, carregando-o apenas quando o usuário rolar para os comentários (usando `IntersectionObserver` ) e, embora essa fosse uma solução razoável para os problemas de desempenho e rastreamento de carga, eu realmente queria remover Disqus todos juntos.

Digite o <a <span class="notranslate">href=&quot;https://webmention.net/draft/&quot; &gt;Webmention</a> especificação da <a <span class="notranslate">href=&quot;https://webmention.net/draft/&quot; &gt;Webmention</a> . Webmention é uma especificação que descreve como um autor de site pode ser contatado quando outro site &#39;menciona&#39; (ou gosta) de conteúdo em seu site. Em última análise, isso permite um método descentralizado para a descoberta de conteúdo vinculado ao seu site, com esperança de fornecer valor e insight.

A especificação da descrição da web não descreve nenhum formato de dados que deva ser usado para comunicar o que o &#39;site de menção&#39; disse, que resta para você analisar usando microformatos padrão ou outros mecanismos para entender o conteúdo da página. Isso é ótimo, no entanto, acredito que leva a serviços centralizados, como o <a <span class="notranslate">href=&quot;https://webmention.io/&quot; &gt;webmention.io</a> fornecendo a infraestrutura necessária para obter o significado da página.

Gostei da ideia de usar a Webmention, mas requer uma configuração do servidor para receber (e possivelmente armazenar) notificações de quando alguém menciona seu site, isso nem sempre é possível com um construtor estático como eu tenho no meu site. O restante deste post descreverá rapidamente como recebi curtidas, menções e republicações hospedadas em minha compilação Hugo, do Zeit, hospedada.

### Etapa um - encontre um hub de menção na web

Encontrei webmention.io e ele faz o truque. Ele lida com os pingbacks e menções recebidos, também validará que o site de chamada está realmente vinculado ao seu conteúdo e, por fim, analisará os dados da página para que você entenda o contexto.

O Webmention.io validará que você é o proprietário do site através de um processo de autenticação aberto (foi interessante procurar rel = me que aponta para um provedor de autenticação)

### Etapa dois - diga às páginas que você pode lidar com menções

Isso é tão simples quanto adicionar as duas seguintes tags `link`

```html
<link rel="webmention" href="https://webmention.io/paul.kinlan.me/webmention">
<link rel="pingback" href="https://webmention.io/paul.kinlan.me/xmlrpc">
```

### Etapa três - integre a API webmention.io ao seu site

Você tem duas opções aqui, é possível adicionar um widget à sua página que chamará a API webmention.io ou integrar a API webmention.io em sua etapa de construção. Eu gostaria do mínimo possível de JS hospedado por terceiros, então escolhi o último. Integrei as menções ao meu processo de implantação.

Eu uso o Hugo porque a compilação é rápida e, com isso em mente, tive que descobrir como integrar a API da webmention no Hugo da maneira ideal. A principal restrição foi não chamar o ponto de extremidade da API para todas as páginas do meu site, tenho muitas páginas e ainda não tenho muitos comentários.

Felizmente, o site Webmention.io fornece um ponto de extremidade útil, permitindo que você receba todas as menções para o seu domínio. O azar é que esse arquivo contém uma entrada para cada ação que foi executada no seu site.

O Hugo também possui a noção de arquivos de dados que podem ser puxados diretamente para o modelo em qualquer página, portanto, é necessário mapear o arquivo de dados da Webmention para uma nova estrutura que facilita a leitura dentro de um modelo da Hugo.

O processo que escolhi está abaixo, mas o resumo é que eu mudo a matriz de uma lista de ações para um dicionário de URLs, cada um contendo as ações expostas pela API (como reposicionar e responder), e a etapa final é divida o dicionário de URLs em arquivos individuais nomeados como o hash md5 do URL.

```javascript
"use strict";

const fs = require('fs');
const fetch = require('node-fetch');
const md5 = require('md5');

const processMentionsJson = (data) => {
  const urlData = {};
  data.children.forEach(item => {
    const wmProperty = item["wm-property"];
    const url = item[wmProperty];

    if(url in urlData === false) urlData[url] = {};
    const urlDataItem = urlData[url];

    if(wmProperty in urlDataItem === false) urlDataItem[wmProperty] = [];
    urlDataItem[wmProperty].push(item);
  });

  console.log(urlData);

  // For each URL in the blog we now have a JSON stucture that has all the like, mentions and reposts
  if(fs.existsSync('./data') === false) fs.mkdirSync('./data');
  Object.keys(urlData).forEach(key => {
    const item = urlData[key];
    const md5url = md5(key);
    console.log(key, md5url)
    fs.writeFileSync(`./data/${md5url}.json`, JSON.stringify(item));
  });
}

(async () => {
  const mentionsUrl = new URL(process.argv[2]); // Fail hard if it's not a uRL

  const mentionsResponse = await fetch(mentionsUrl);
  const mentiosnJson = await mentionsResponse.json();

  processMentionsJson(mentiosnJson);
})();
```

Depois que os dados são analisados e salvos corretamente, é um processo rápido de configurar o modelo para que possa ser lido no atributo Dados do modelo.

```html
{{ $urlized := .Page.Permalink | md5 }}
{{ if index .Site.Data $urlized }}
  {{ $likes := index (index .Site.Data $urlized) "like-of" }}
  {{ $replys := index (index .Site.Data $urlized) "in-reply-to" }}
  {{ $reposts := index (index .Site.Data $urlized) "repost-of"}}
  <h4>Likes</h4>
  {{ range $i, $like := $likes }}
    <a href="{{$like.url}}"><img src="{{ $like.author.photo}}" alt="{{ $like.author.name }}" class="profile photo"></a>
  {{end}}

  <h4>Reposts</h4>
  {{ range $i, $repost := $reposts }}
    <a href="{{$repost.url}}"><img src="{{ $repost.author.photo}}" alt="{{ $repost.author.name }}" class="profile photo"></a>
  {{end}}

  <h4>Comments and Replies</h4>
  {{ range $i, $reply := $replys }}
    <a href="{{$reply.url}}"><img src="{{ $reply.author.photo}}" alt="{{ $reply.author.name }}" class="profile photo"></a>
  {{end}}
{{end}}
```

Se tudo correr bem, você verá alguns ícones na parte inferior da página que são pessoas reais interagindo com o site.

### Passo 4 - publicar o site quando ocorrem comentários

Embora as etapas acima permitam agregar as menções e renderizá-las na saída dos sites, ainda tenho que garantir que o site seja reconstruído regularmente para que os comentários apareçam publicamente.

Optei por usar um serviço cron simples que chamará a API de implantação do Zeit para forçar uma redistribuição do site a cada hora, aproximadamente.
