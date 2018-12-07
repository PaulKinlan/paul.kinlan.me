---
slug: test-translation
public: false
title: test transalation
description: test translation
date: 2015-01-01T09:00:00.000Z
---

# 標準化:TensorFlow 2.0でのハイレベルAPIのガイダンス

TensorFlowチームに代わってSandeep Gupta、Josh Gordon、Karmel Allisonによって投稿されました

TensorFlowはのために準備している[the release of version 2.0](https://groups.google.com/a/tensorflow.org/forum/#!topic/discuss/bgug1G6a89A) 。この記事では、TensorFlowの高水準APIの方向性をプレビューし、よくある質問に答えます。

[Keras](https://www.tensorflow.org/guide/keras)は、深い学習モデルを構築し、訓練するための非常に普及している高水準APIです。高速プロトタイプ作成、最先端の研究、生産に使用されています。 TensorFlowは現在Kerasをサポートしていますが、2.0ではKerasを他のTensorFlowプラットフォームと密接に統合しています。

TensorFlowの高水準APIとしてKerasを確立することにより、TensorFlowを始めるための新しい機械学習の開発者が簡単になります。 1つの高レベルAPIが混乱を減らし、研究者に高度な機能を提供することに集中することができます。

私たちが行っているのと同じくらい楽しんでいただければ幸いです。

Kerasにはいくつかの重要な利点があります。

* **ユーザーフレンドリー性:** Kerasは、一般的な使用事例に最適化されたシンプルで一貫したインターフェースを備えています。ユーザーのエラーを明確かつ実用的にフィードバックし、エラーメッセージを理解しやすくします。よく役立つアドバイスを提供します。

* **モジュール化および構成可能:** Kerasモデルは、設定可能なビルディングブロックをいくつかの制限なしで接続することによって作成されます。 Kerasの一部は、フレームワークが提供するすべてのものを採用したり、知ることなく再利用することができます。たとえば、トレーニング用にKerasモデルを使用せずにレイヤーまたはオプティマイザを使用できます。

* **簡単に拡張できます:**最新のアイデアを開発するために、新しいレイヤー、損失関数、[あなたのアイデアをここに挿入する]など、研究のための新しいアイデアを表現するカスタムビルディングブロックを作成できます。

* **初心者、専門家向け:**深い学習開発者は多くのバックグラウンドと経験レベルから来ています.Cerasは、あなたが始めているかどうか、あるいは長年の経験があるかどうかにかかわらず有用なAPIを提供します。

これらにより、MLの学習から、研究、アプリケーション開発、導入まで、幅広いユースケースにわたって、ワークフローをより簡単かつ生産的にすることができます。

まず、私たちはいくつかの質問に答えます。次に、TensorFlowに付属しているKerasのバージョンで可能なことを詳しく見ていきます。

## よくある質問

### は別のライブラリだと思った？

何よりも、KerasはAPI仕様です。 [www.keras.io](http://www.keras.io)のリファレンス実装は独立したオープンソースプロジェクトとして維持されています。このプロジェクトは[www.keras.io](http://www.keras.io)ます。このプロジェクトはTensorFlowから独立しており、貢献者とユーザーの積極的なコミュニティを持っています。 TensorFlowには、TensorFlow特有の拡張機能を備えた[tf.keras](https://www.tensorflow.org/guide/keras) API（ [tf.keras](https://www.tensorflow.org/guide/keras)モジュール内）の完全実装が含まれて[tf.keras](https://www.tensorflow.org/guide/keras)ます。

### はTensorFlowや他のライブラリのラッパーですか？

いいえ、これは一般的な（しかし理解できる）誤解です。 Kerasは、機械学習モデルの定義と訓練のための** API標準**です。ケラスは特定の実装に結び付けられていません:Keras APIには、TensorFlow、MXNet、TypeScript、JavaScript、CNTK、Theano、PlaidML、Scala、CoreML、およびその他のライブラリの実装があります。

### 組み込まれているKerasのバージョンとkeras.ioで見つかるバージョンの違いは何ですか？

TensorFlowには、TensorFlow固有の拡張機能を備えた[tf.keras](https://www.tensorflow.org/guide/keras) API（ [tf.keras](https://www.tensorflow.org/guide/keras)モジュール内）の実装が含まれて[tf.keras](https://www.tensorflow.org/guide/keras)ます。これらには、次のサポートが含ま[eager execution](https://www.tensorflow.org/guide/eager)直感的なデバッグと高速の繰り返しのため、TensorFlow SavedModelモデル交換フォーマットのサポート、のTPUに関する研修を含む分散訓練のための統合サポートを。

eagerの実行は、tf.keras [model subclassing](https://www.tensorflow.org/guide/keras#model_subclassing) APIを使用するときに特に便利です。このAPIは[Chainer](https://chainer.org/)に触発され、モデルの順方向パスを必須に書くことができます。 tf.kerasはTensorFlowエコシステムに緊密に統合されており、以下のサポートも含まれています。

* [tf.data](https://www.tensorflow.org/guide/datasets)により、高性能の入力パイプラインを構築できます。必要に応じて、NumPy形式のデータを使用してモデルを訓練するか、規模とパフォーマンスを考慮してtf.dataを使用することができます。

* [Distribution strategies](https://github.com/tensorflow/tensorflow/tree/master/tensorflow/contrib/distribute) :多くのマシンに分散しているGPUやTPUなど、さまざまなコンピューティング構成にわたってトレーニングを配布します。

*モデルのエクスポート。 tf.keras APIで作成されたモデルは、TensorFlow [SavedModel](https://www.tensorflow.org/tutorials/keras/save_and_restore_models)形式でシリアル化され、 [TensorFlow Serving](https://www.tensorflow.org/serving/)または他の言語バインディング（Java、Go、Rust、C#など）を使用して提供されます。

*エクスポートされたモデルは、 [TensorFlow Lite](https://www.tensorflow.org/lite/)してモバイルデバイスや組み込みデバイスに[TensorFlow Lite](https://www.tensorflow.org/lite/)することも、 [TensorFlow.js](https://js.tensorflow.org)と[TensorFlow.js](https://js.tensorflow.org)することもできます（注意: [TensorFlow.js](https://js.tensorflow.org) APIを使用してJavaScriptで直接モデルを開発することもできます）。

* [Feature columns](https://www.tensorflow.org/guide/feature_columns) 、構造化データを効果的に表現および分類するためのものです。

*そして、より多くの作品。

## どのようにインストールしますか？ pipを使ってKerasもインストールする必要がありますか？

tf.kerasはTensorFlowに含まれています。 Kerasを別途インストールする必要はありません。たとえば、 [Colab](https://colab.research.google.com)ノートブックの中に[Colab](https://colab.research.google.com)を実行するとします。

    !pip install tensorflow

    import tensorflow as tf

    Dense = tf.keras.layers.Dense

これで、tf.kerasが使用されます。輸入品を[tutorials](https://www.tensorflow.org/tutorials)場合は、最新の[tutorials](https://www.tensorflow.org/tutorials)の例を[tutorials](https://www.tensorflow.org/tutorials)ください。

### TensorFlowは、初心者や専門家のためのさまざまなAPIスタイルを提供しているとお伝えしました。これらはどのように見えるのですか？

TensorFlowの開発者は、MLを初めて学ぶ学生からMLの専門家や研究者まで、多くの経験レベルを持っています。同様に、TensorFlowの強みの1つは、さまざまなワークフローと目標をサポートするためのAPIがいくつか用意されていることです。同様に、TensorFlowのKeras統合の主な設計目標は、ユーザーが全体のフレームワークを採用することなくより効果的なKerasの一部を選択して選択できることです。

## Sequential API

あなたがMLを学ぶ学生なら、tf.keras [Sequential API](https://www.tensorflow.org/guide/keras#build_a_simple_model)始めることをお勧めします。直感的で簡潔で、ML問題の95％に適しています。このAPIを使用すると、約10行のコードで最初のニューラルネットワークを作成できます。

！あなたの最初のニューラルネットワークを数行のコードでトレーニングする例は[*Click [here](https://colab.research.google.com/github/tensorflow/docs/blob/master/site/en/tutorials/_index.ipynb)です。*]（https://cdn-images-1.medium.com/max/3160/0*XdVOKuyDWYHHzKvM）** [here](https://colab.research.google.com/github/tensorflow/docs/blob/master/site/en/tutorials/_index.ipynb)をクリックしてくださいほんの数行のコードで最初のニューラルネットワークをトレーニングすることができます。**

モデルを定義する最も一般的な方法は、深い学習について考えるときに通常使用する精神モデルに対応するレイヤーのグラフを作成することです。モデルの最も単純なタイプは、複数のレイヤーのスタックです。このようなSequential APIを使用すると、次のようなモデルを定義できます。

    model = tf.keras.Sequential()

    model.add(layers.Dense(64, activation=’relu’))

    model.add(layers.Dense(64, activation=’relu’))

    model.add(layers.Dense(10, activation=’softmax’))

    Such a model can then be compiled and trained in a few lines:

    model.compile(optimizer=’adam’,
                  loss=’sparse_categorical_crossentropy’,
                  metrics=[‘accuracy’])

    model.fit(x_train, y_train, epochs=5)

    model.evaluate(x_test, y_test)

[tensorflow.org/tutorials](https://www.tensorflow.org/tutorials/)でSequential APIを使用する例の詳細は、「学習と使用ML」セクションを参照してください。

！ Sequential APIを使用してファッションMNISTデータセットで最初のニューラルネットワークをトレーニングするチュートリアルのための[*Click [here](https://colab.research.google.com/github/tensorflow/docs/blob/master/site/en/tutorials/keras/basic_classification.ipynb) *]（https://cdn-images-1.medium.com/max/2000/0*ewHaMHirePgDye4U）** [here](https://colab.research.google.com/github/tensorflow/docs/blob/master/site/en/tutorials/keras/basic_classification.ipynb)をクリックすると、Sequential APIを使用してファッションMNISTデータセットの最初のニューラルネットワークをトレーニングするチュートリアルが[here](https://colab.research.google.com/github/tensorflow/docs/blob/master/site/en/tutorials/keras/basic_classification.ipynb)れます。**

## 機能的API

もちろん、順次モデルは、任意のモデルを表現できない単純なレイヤーのスタックです。より高度なモデルは[Functional API](https://www.tensorflow.org/guide/keras#functional_api)を使用して[Functional API](https://www.tensorflow.org/guide/keras#functional_api)できます[Functional API](https://www.tensorflow.org/guide/keras#functional_api)を使用すると、マルチ入力モデルやマルチ出力モデル、共有レイヤーモデル、残差接続モデルなどの複雑なトポロジーを定義できます。

関数APIを使用してモデルを構築する場合、レイヤは呼び出し可能（テンソル）であり、出力としてテンソルを返します。これらの入力テンソルと出力テンソルを使用してモデルを定義することができます。例えば:

    inputs = tf.keras.Input(shape=(32,))

    # A layer instance is callable on a tensor, and returns a tensor.

    x = layers.Dense(64, activation=’relu’)(inputs)

    x = layers.Dense(64, activation=’relu’)(x)

    predictions = layers.Dense(10, activation=’softmax’)(x)

    # Instantiate the model given inputs and outputs.

    model = tf.keras.Model(inputs=inputs, outputs=predictions)

そのようなモデルは、上の同じ簡単なコマンドを使用してコンパイルし訓練することができます。 Functional API [here](https://www.tensorflow.org/guide/keras#functional_api)詳細については、 [here](https://www.tensorflow.org/guide/keras#functional_api) 。

## モデルサブクラス化API

完全にカスタマイズ可能なモデルは、 [Model Subclassing API](https://www.tensorflow.org/guide/keras#model_subclassing)を使って構築することができます。クラスメソッドの本体で、このスタイルで必須の独自の順方向パスを定義します。例えば:

    class MyModel(tf.keras.Model):

     def __init__(self):
       super(MyModel, self).__init__()
       # Define your layers here.
       self.dense_1 = layers.Dense(32, activation=’relu’)
       self.dense_2 = layers.Dense(num_classes, activation=’sigmoid’)

     def call(self, inputs):
       # Define your forward pass here,
       # using layers you previously defined in `__init__`
       x = self.dense_1(inputs)
       return self.dense_2(x)

これらのモデルはより柔軟ですが、デバッグするのが難しい場合があります。上記の単純なコンパイルおよびフィットコマンドを使用して、3種類のモデルをコンパイルしてトレーニングすることも、完全な制御のために独自のカスタムトレーニングループを作成することもできます。

例えば:

    model = MyModel()

    with tf.GradientTape() as tape:
      logits = model(images, training=True)
      loss_value = loss(logits, labels)

    grads = tape.gradient(loss_value, model.variables)
    optimizer.apply_gradients(zip(grads, model.variables))

Model Subclassingスタイルの例については、以下のリンクを参照するか、 [tensorflow.org/tutorials](http://tensorflow.org/tutorials)参照してください（「研究と実験」セクションを参照）。

！ Model Subclassing APIを使用して実装された[[*Neural Machine Translation with Attention](https://colab.research.google.com/github/tensorflow/tensorflow/blob/master/tensorflow/contrib/eager/python/examples/nmt_with_attention/nmt_with_attention.ipynb) *]（https://cdn-images-1.medium.com/max/2000/1*_S6e6TbT6Hsc_1s8h8Dbww.png）* Model Subclassing APIを使用して実装された[*Neural Machine Translation with Attention](https://colab.research.google.com/github/tensorflow/tensorflow/blob/master/tensorflow/contrib/eager/python/examples/nmt_with_attention/nmt_with_attention.ipynb) **

！ Model Subclassing APIを使用して実装された[*A [GAN](https://github.com/tensorflow/tensorflow/blob/master/tensorflow/contrib/eager/python/examples/generative_examples/dcgan.ipynb) *]（https://cdn-images-1.medium.com/max/2000/1*U5UDkZwAQkJ4lemvs7oSJA.png）** Model Subclassing APIを使用して実装された[GAN](https://github.com/tensorflow/tensorflow/blob/master/tensorflow/contrib/eager/python/examples/generative_examples/dcgan.ipynb) **

## 私の研究がこれらのスタイルに適合しない場合はどうなりますか？

アプリケーションエリアを制限するtf.kerasがある場合、多くの選択肢があります。あなたはできる:

* Kerasモデル定義とは別にtf.keras.layersを使用し、独自のグラデーションとトレーニングコードを記述します。同様に、tf.keras.optimizers、tf.keras.initializers、tf.keras.losses、またはtf.keras.metricsを別々に、独立して使用できます。

* tf.kerasを完全に無視し、低レベルのTensorFlow、Python、 [AutoGraph](https://www.tensorflow.org/guide/autograph)を使用して、必要な結果を得る。

それはあなた次第です！ tf.layersのオブジェクト指向でない層は推奨されなくなり、tf.contrib.slimやtf.contrib.learnのような高レベルのAPIを含むtf.contrib。*はTF 2.0で利用できなくなることに注意してください。

## エスティメーターはどうなりますか？

[Estimators](https://www.tensorflow.org/guide/estimators)は、Googleと広範なTensorFlowコミュニティの両方で広く使用されています。リニアクラシファイア、DNNクラシファイア、複合DNNリニアクラシファイア（ワイドおよびディープモデルとも呼ばれます）、グラディエントブーストツリーなど、いくつかのモデルが[Premade Estimators](https://www.tensorflow.org/guide/premade_estimators)としてパッケージ化されています。これらのモデルは、実績のある、幅広く導入されています。これらの理由から、Premade Estimatorを含むEstimator APIはTensorFlow 2.0に含まれます。

Premade Estimatorのユーザーにとっては、Kerasと熱心な実行に対する新しい焦点の影響は最小限に抑えられます。 Premade Estimatorの実装を変更し、APIサーフェスを同じに保つことができます。 Premade Estimatorとして実装されたモデルのKerasバージョンの追加にも取り組む予定で、Kerasを拡張して大規模な制作要件をよりよく満たすようにします。

つまり、カスタムアーキテクチャーで作業している場合、Estimatorの代わりにtf.kerasを使用してモデルを構築することをお勧めします。エスティメーターが必要なインフラストラクチャで作業している場合は、 [model_to_estimator()](https://www.tensorflow.org/api_docs/python/tf/keras/estimator/model_to_estimator)を使用してモデルを変換し、KerasがTensorFlowエコシステム全体で機能するようにすることができます。

## TensorFlow 2.0以降！

tf.kerasを使って楽しんでいただければ幸いです。今後数ヶ月にわたって、TensorFlowチームは開発者の経験を磨くことに集中します。私たちのドキュメントとチュートリアルには、この道筋が反映されます。あなたの考えやフィードバック（ [community resources](https://www.tensorflow.org/community/)チェックして[community resources](https://www.tensorflow.org/community/) ）、そしてGitHubの問題やPRを通しての貢献を楽しみにしています。みんな、ありがとう！
