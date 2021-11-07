---
slug: a-simple-DOM-template-language
date: 2018-01-27T13:20:31.000Z
title: "A simple clientside templating langauge"
tags: ["templating", 'javascript']
description: "Templating libraries needn't be so hard"
---


[最近のプロジェクト](https://webgdedeck.com/)では、ライブラリをインポートせずにJSONデータをDOM要素にバインドする簡単な方法を望んでいました。私はかなりきちんとした解決策を思いつきました）私のプロジェクトのすべてのニーズに合っています。

このソリューションは、データセットプロパティのDOM要素からアクセス可能な `data-bind- *`という名前のDOMデータ属性内のテンプレート命令をエンコードします。属性を自動的にキャラブルケースにするだけです（つまり、 `innerText` `data-bind_inner-text`  - ハイフンに注意してください。

プロジェクトのサンプルテンプレートは次のとおりです。


```html
<template id="itemTemplate">
  <div class="item new" data-bind_id="guid" id="">
    <h3><span data-bind_inner-text="title"></span></h3>
    <p class="description" data-bind_inner-text="content:encoded|description"></p>
    <div>
      <a data-bind_href="link" data-bind_inner-text="pubDate" data-bind_title="title" href="" title=""></a>
      <svg class="share" url="" title="" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
        <path fill="none" d="M0 0h24v24H0z"></path><path d="M18 16c-.8 0-1.4.4-2 .8l-7-4v-1.5l7-4c.5.4 1.2.7 2 .7 1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3v.7l-7 4C7.5 9.4 6.8 9 6 9c-1.7 0-3 1.3-3 3s1.3 3 3 3c.8 0 1.5-.3 2-.8l7.2 4.2v.6c0 1.6 1.2 3 2.8 3 1.6 0 3-1.4 3-3s-1.4-3-3-3z"></path>
      </svg>
    </div>
  </div>
</template>
```


ご覧のとおり、私たちは ` <template> DOM内にHTMLを保持し、それを不活性に保つことができるようにします（これは本当にオーサリングの経験を向上させます）。テンプレート要素である必要はなく、DOM内にあるものはすべて取り込めることに注意してください。

上記のDOMをすべてのライブデータが適用された実際の要素にマップするには、次の基本的なアルゴリズムを使用します。

1.にデータをバインドする要素をクローンします。 2.要素と要素ごとに繰り返します：1. `data-bind_`の形式の属性を持っているかどうかを確認します。2.` | 'で区切られた `data`を検索するキーを取得します。 3.最初に見つかったキーの値を入力 `data`から` data-bind_`で定義されたノードの属性に直接マッピングします。3.新しいノードを返します。

もしこれが簡潔であれば、このコードはかなりシンプルです。


```javascript
const applyTemplate = (templateElement, data) => {
  const element = templateElement.content.cloneNode(true);    
  const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, () => NodeFilter.FILTER_ACCEPT);

  while(treeWalker.nextNode()) {
    const node = treeWalker.currentNode;
    for(let bindAttr in node.dataset) {
      let isBindableAttr = (bindAttr.indexOf('bind_') == 0) ? true : false;
      if(isBindableAttr) {
        let dataKeyString = node.dataset[bindAttr];
        let dataKeys = dataKeyString.split("|");
        let bindKey = bindAttr.substr(5);
        for(let dataKey of dataKeys) {
          if(dataKey in data && data[dataKey] !== "") {
            node[bindKey] = data[dataKey];
            break;
          }
        }
      }
    }
  }

  return element;
}
```


誰もがこれを使用するとは思っていませんが、完全なライブラリやフレームワークに頼ることなく、単純なタスク用のデータバインディングツールを構築する方法を示したかったのです。