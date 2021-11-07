---
slug: building-a-pubsub-api-in-javascript
date: 2016-12-08T13:20:31.000Z
title: "Building a simple PubSub system in JavaScript"
tags: ['pubsub', 'javascript']
---


最近のプロジェクトでは、[Webプッシュ](/ design-a-webpush-service /)サービスを構築する際に、アプリケーションレベルのイベントに応じてUIを応答させたいと思っていました。システムには依存しておらず、ビジネスロジックとは独立して自分自身を管理できるようにしたいと考えていました。

私は多くのさまざまなツールを見て回っていましたが、NIH症候群が頻繁に起こり、人々が自分たちのインフラストラクチャ要素をかなり早く実装できると思うという事実が頻繁にあるため、サイドPubSubサービス＆mdash;それは私の必要性のためにかなりよく働いた。

カスタムDOMの「イベント」を使用し、DOMが既に開発者に提供している既存のインフラストラクチャを使用する必要があるかどうかを議論しました。 `addEventListener`を使ってイベントを処理し、イベントを消費する機能。唯一の問題は、EventTargetで継承または混合するモデルを持つことができないため、DOM要素またはウィンドウからイベントハンドラをハングする必要があることでした。

_ **考え方：** EventTargetをオブジェクトとして使用すると、カスタムPubSubシステムを作成する必要がなくなります。

この制約を念頭に置いて、何かをコーディングする意志と私が自分で作ったバグを気にしない傾向があるので、私は大まかな計画を描いた：


```javascript
/* When a user is added, do something useful (like update UI) */
EventManager.subscribe('useradded', function(user) {
  console.log(user)
});

/* The UI submits the data, lets publish the event. */
form.onsubmit(function(e) {
  e.preventDefault();

  // do something with user fields

  EventManager.publish('useradded', user);
})
```


このすべては新しいものではありません。 Reduxと他の多くのシステムではこれがすでに行われており、多くの場合、状態の管理にも役立ちます。私の頭の中では、私は実際にブラウザに既に状態にseptateモデルを必要とする状態を持っていません。

実装は非常に簡単で、抽象化は私にとっては非常に便利です。


```javascript
var EventManager = new (function() {
  var events = {};

  this.publish = function(name, data) {
    var handlers = events[name];
    if(!!handlers === false) return;
    handlers.forEach(function(handler) {
      handler.call(this, data);
    });
  };

  this.subscribe = function(name, handler) {
    var handlers = events[name];
    if(!!handlers === false) {
      handlers = events[name] = [];
    }
    handlers.push(handler);
  };

  this.unsubscribe = function(name, handler) {
    var handlers = events[name];
    if(!!handlers === false) return;

    var handlerIdx = handlers.indexOf(handler);
    handlers.splice(handlerIdx);
  };
});
```
編集：約束の使用を削除しました。

そして、私たちはそこにいる。バグの可能性が高い単純なpubsubシステムですが、私はそれが好きです。 :)興味があれば、[github](https://github.com/PaulKinlan/EventManager)に入れました。