---
slug: got-web-performance-problemsjust-wait
date: 2019-03-09T08:10:52.804Z
title: 'Got web performance problems? Just wait...'
link: 'https://twitter.com/kosamari/status/1104021989881270272'
tags: [links, performance, developing markets]
---
Eu vi um tweet de um bom amigo e colega, [Mariko](https://twitter.com/kosamari) , sobre testes em uma série de dispositivos de baixo custo, mantendo você realmente ancorado.

O contexto do tweet é que estamos vendo como é o desenvolvimento da Web ao criar para usuários que vivem diariamente nessas classes de dispositivos.

<figure>
  <img src="/images/2019-03-09-got-web-performance-problemsjust-wait.jpeg">
</figure>

A equipe está fazendo muito trabalho agora neste espaço, mas passei um dia construindo um site e foi incrivelmente difícil fazer qualquer coisa funcionar em um nível um pouco razoável de desempenho - aqui estão alguns dos problemas que encontrei:

* Esquisitices na porta de visualização e misteriosa reintrodução de 300ms de atraso de clique (pode funcionar).
* Enormes repaints de tela inteira, e é lento.
* Rede é lenta
* A memória é restrita e os GCs subsequentes bloqueiam o thread principal por vários segundos
* Execução JS incrivelmente lenta
* A manipulação de DOM é lenta

Para muitas das páginas que eu estava criando, mesmo em uma conexão rápida, as páginas demoravam vários segundos para serem carregadas, e as interações subsequentes eram simplesmente lentas. Foi difícil, envolvi tentar obter o máximo possível do tópico principal, mas também foi incrivelmente gratificante em nível técnico ver mudanças nos algoritmos e na lógica que eu não teria feito em todo o meu desenvolvimento tradicional da Web, rendimento grandes melhorias no desempenho.

Não sei o que fazer a longo prazo, suspeito que uma grande quantidade de desenvolvedores com quem trabalhamos nos mercados mais desenvolvidos terá uma reação: &quot;Não estou construindo sites para usuários em [inserir país x]&quot; e De alto nível, é difícil argumentar com essa afirmação, mas não posso ignorar o fato de que 10 milhões de novos usuários estão chegando à computação todos os anos e eles usarão esses dispositivos e queremos que a Web seja a * plataforma * de escolha para conteúdo e aplicativos para que não fiquemos felizes com o [rise of the meta platform](https://paul.kinlan.me/rise-of-the-meta-platforms/) .

Precisamos continuar pressionando o desempenho por muito tempo. Continuaremos criando ferramentas e orientações para ajudar os desenvolvedores a carregar rapidamente e ter interfaces de usuário suaves :)
