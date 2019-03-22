---
slug: ricky-mondelloadoption-of-well-known-url-for-changing-passwords
date: 2019-01-31T22:02:32.092Z
title: 'Ricky Mondello: Adoption of Well-Known URL for Changing Passwords'
link: https://twitter.com/rmondello/status/1090702498220961793
tags: [links, safari, specs]
---
Recentemente Ricky Mondello, do time Safari, compartilhou uma nota sobre como o Twitter está usando a especificação ./well-known/change-password.

> I just noticed that Twitter has adopted the Well-Known URL for Changing Passwords! Is anyone aware of other sites that have adopted it?
> 
> Twitter's implementation: https://twitter.com/.well-known/change-password;
> Github's: https://github.com/.well-known/change-password;
> Specification :https://github.com/WICG/change-password-url

[Read full post](https://twitter.com/rmondello/status/1090702498220961793) .

O recurso passou completamente por mim, mas é uma boa ideia: dado um arquivo em um local bem conhecido, o navegador pode oferecer uma interface do usuário que permita a rápida redefinição da senha sem ter que navegar pela interface do usuário complexa dos sites.

A especificação é enganosamente simples: o arquivo conhecido simplesmente contém a URL para direcionar o usuário para quando ele deseja executar a ação. Isso me levou a pensar, podemos oferecer mais desses recursos:

* Um local bem conhecido para modelos de consentimento baseados em GDPR (consentimento do cookie) - os proprietários do site podem oferecer um link para a página em que um usuário pode gerenciar e potencialmente revogar todos os cookies e outros itens de consentimento de dados.
* Um local bem conhecido para o gerenciamento de permissão do navegador - os proprietários de sites podem oferecer um local rápido para que os usuários possam revogar permissões para itens como localização geográfica, notificações e outras primitivas.
* Um caminho bem conhecido para exclusão e alterações de conta
* Um caminho bem conhecido para o gerenciamento de assinaturas de listas de discussão

A lista continua ... Eu realmente gosto da idéia de arquivos de redirecionamento simples para ajudar os usuários a descobrirem ações comuns do usuário, e de uma maneira de o navegador aparecer.

* Atualização: * Eu adicionei uma [issue to Chrome to see if we can get a similar implementation](https://bugs.chromium.org/p/chromium/issues/detail?id=927473) .