---
slug: debugging-web-pages-on-the-nokia-8110-with-kaios
date: 2019-03-21T21:41:53.555Z
title: 'Debugging Web Pages on the Nokia 8110 with KaiOS'
link: ''
tags: [links, kaios, debugging, firefox]
---
Nós temos feito muito desenvolvimento em feature phones recentemente e tem sido difícil, mas divertido. O mais difícil é que no KaiOS achamos impossível depurar páginas da web, especialmente no hardware que tínhamos (o Nokia 8110). A Nokia é um ótimo dispositivo, é construído com KaiOS que sabemos que é baseado em algo semelhante ao Firefox 48, mas está bloqueado, não há modo de desenvolvedor tradicional como você entrar em outros dispositivos Android, o que significa que você não pode conectar o Firefox WebIDE facilmente.

Através de uma combinação de leitura de alguns blogs, e sabendo um pouco sobre `adb` eu trabalhei como fazer isso. Note, outros podem ter sido capazes de fazer isso, mas não estão documentados em um lugar de forma limpa.

<figure>
  <img src="/images/2019-03-21-debugging-web-pages-on-the-nokia-8110-with-kaios.jpeg">
</figure>

(A imagem acima mostra o DevTools e também a saída da ferramenta de captura de tela)

Aqui estão os passos:

1. Conecte um cabo USB. Certifique-se de ter o `adb` instalado na sua máquina principal.
2. Faça o download de uma cópia de [Firefox 48](https://archive.mozilla.org/pub/firefox/releases/48.0.2/) (esta é a única que eu poderia trabalhar)
3. Ative o &#39;Modo de Desenvolvedor&#39; digitando `*#*#33284#*#*` no seu telefone (note, não use o discador). Você verá um pequeno ícone de &#39;bug&#39; no topo da tela. [[Source](https://groups.google.com/forum/#!topic/bananahackers/MIpcrSXTRBk) ]
4. Conecte seu cabo USB
5. Na sua máquina de desenvolvimento, execute os seguintes comandos
1. `adb start-server`
2. `adb devices` para verificar se o seu telefone está conectado.
3. `adb forward tcp:6000 localfilesystem:/data/local/debugger-socket` isso configura um canal da sua máquina para um soquete no telefone. Isso é o que o Web IDE usa.
6. Inicie o `Web IDE` abrindo o Firefox, vá para Ferramentas e depois IDE da Web
7. Web IDE será aberto, clique em &#39;Remote Runtime&#39; e clique no botão de abertura que tem &#39;localhost: 6000&#39; pol. (Esta é a porta de encaminhamento TCP).
8. Abra uma página no telefone e você deverá vê-la à esquerda. Voila
