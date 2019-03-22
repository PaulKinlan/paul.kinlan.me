---
slug: pinch-zoom-element
date: 2019-01-13T17:21:19.288Z
title: 'pinch-zoom-element'
link: https://www.webcomponents.org/element/pinch-zoom-element
tags: [links, web components, custom element]
---
Jake e a equipe criaram esse elemento personalizado bastante impressionante para gerenciar o zoom de pinch em qualquer conjunto de HTML fora da própria dinâmica de zoom de pinça do navegador (pense no zoom da viewport móvel). O elemento foi um dos componentes centrais que precisávamos para o aplicativo [squoosh](https://squoosh.app/) que criamos e lançamos no Chrome Dev Summit (... eu digo &quot;lançado no Chrome Dev Summit&quot; - Jake estava mostrando para todos no Dia do Desenvolvedor do Google na China mesmo que o resto da equipe estivesse sob embargo;) ...)

> install: `npm install --save-dev pinch-zoom-element`
> 
> ```HTML
> <pinch-zoom>
>   <h1>Hello!</h1>
> </pinch-zoom>
> ```

[Read full post](https://www.webcomponents.org/element/pinch-zoom-element) .

Acabei de adicioná-lo ao meu blog (demorou apenas alguns minutos), você pode conferir na minha seção &#39; [life](https://paul.kinlan.me/life/img_20170711_063830/) &#39; onde eu compartilho fotos que tirei. Se você estiver em um dispositivo habilitado para toque, poderá aumentar rapidamente o zoom no elemento, se estiver usando um trackpad que possa manipular entradas de vários dedos que funcionem também.

Esse elemento é um ótimo exemplo do motivo pelo qual eu amo os componentes da web como um modelo para a criação de componentes da interface do usuário. O elemento `pinch-zoom` é de pouco menos de 3kb nas dependências wire (descompactado) e mínimas para compilar e faz apenas um trabalho excepcionalmente bem, sem vincular qualquer lógica de nível de aplicativo personalizado que dificultaria o uso (eu tenho alguns pensamentos sobre lógica de UI vs Componentes lógicos de aplicativos que compartilharei com base nos meus aprendizados do aplicativo Squoosh).

Eu adoraria ver elementos como estes obter mais consciência e uso, por exemplo, eu poderia imaginar que este elemento poderia substituir ou padronizar a funcionalidade de zoom de imagem que você vê em muitos sites de comércio e para sempre tirar essa dor dos desenvolvedores.
