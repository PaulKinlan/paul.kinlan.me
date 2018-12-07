---
slug: test-translation
public: false
title: test transalation
description: test translation
date: 2015-01-01T09:00:00.000Z
---


＃Kerasの標準化：TensorFlow 2.0でのハイレベルAPIのガイダンス

TensorFlowチームに代わってSandeep Gupta、Josh Gordon、Karmel Allisonによって投稿されました

TensorFlowは[バージョン2.0のリリース](https://groups.google.com/a/tensorflow.org/forum/#!topic/discuss/bgug1G6a89A)を準備中です。この記事では、TensorFlowの高水準APIの方向性をプレビューし、よくある質問に答えます。

[Keras](https://www.tensorflow.org/guide/keras)は、深い学習モデルの構築と訓練のために非常に普及している高水準APIです。高速プロトタイプ作成、最先端の研究、生産に使用されています。 TensorFlowは現在Kerasをサポートしていますが、2.0ではKerasを他のTensorFlowプラットフォームと密接に統合しています。

TensorFlowの高水準APIとしてKerasを確立することにより、TensorFlowを始めるための新しい機械学習の開発者が簡単になります。 1つの高レベルAPIが混乱を減らし、研究者に高度な機能を提供することに集中することができます。

私たちが行っているのと同じくらい楽しんでいただければ幸いです。

Kerasにはいくつかの重要な利点があります。


* **ユーザーフレンドリー性：** Kerasは、一般的な使用事例に最適化されたシンプルで一貫したインターフェースを備えています。ユーザーのエラーを明確かつ実用的にフィードバックし、エラーメッセージを理解しやすくします。よく役立つアドバイスを提供します。


* **モジュール化および構成可能：** Kerasモデルは、設定可能なビルディングブロックをいくつかの制限なしで接続することによって作成されます。 Kerasの一部は、フレームワークが提供するすべてのものを採用したり、知ることなく再利用することができます。たとえば、トレーニング用にKerasモデルを使用せずにレイヤーまたはオプティマイザを使用できます。


* **簡単に拡張できます：**最新のアイデアを開発するために、新しいレイヤー、損失関数、[あなたのアイデアをここに挿入する]など、研究のための新しいアイデアを表現するカスタムビルディングブロックを作成できます。


* **初心者、専門家向け：**深い学習開発者は多くのバックグラウンドと経験レベルから来ています.Cerasはあなたが始めているかどうか、あるいは長年の経験を持っているかどうかにかかわらず有用なAPIを提供します。

これにより、MLの学習から研究、アプリケーション開発、導入まで、幅広いユースケースにわたって、ワークフローをより簡単かつ生産的にすることができます。

まず、私たちはいくつかの質問に答えます。次に、TensorFlowに付属しているKerasのバージョンで可能なことを詳しく見ていきます。

＃＃ よくある質問

### Kerasは別のライブラリだと思いましたか？

何よりも、KerasはAPI仕様です。 Kerasのリファレンス実装は、独立したオープンソースプロジェクトとして維持されています。これは[www.keras.io](http://www.keras.io)にあります。このプロジェクトはTensorFlowから独立しており、貢献者とユーザーの積極的なコミュニティを持っています。 TensorFlowには、TensorFlow特有の拡張機能を備えたKeras API（[tf.keras](https://www.tensorflow.org/guide/keras)モジュール内）の完全な実装が含まれています。

### KerasはTensorFlowまたは他のライブラリのラッパーですか？

いいえ、これは一般的な（しかし理解できる）誤解です。 Kerasは、機械学習モデルの定義と訓練のための** API標準**です。ケラスは特定の実装に結び付けられていません：Keras APIには、TensorFlow、MXNet、TypeScript、JavaScript、CNTK、Theano、PlaidML、Scala、CoreML、およびその他のライブラリの実装があります。

### TensorFlowに組み込まれているKerasのバージョンとkeras.ioで見つかるバージョンの違いは何ですか？

TensorFlowには、TensorFlow特有の拡張機能を備えたKeras API（[tf.keras](https://www.tensorflow.org/guide/keras)モジュール内）の実装が含まれています。直感的なデバッグと高速反復、TensorFlow SavedModelモデル交換フォーマットのサポート、およびTPUのトレーニングを含む分散型トレーニングの統合サポートの[eager execution](https://www.tensorflow.org/guide/eager)のサポートが含まれます。

eagerの実行は、tf.keras [model subclassing](https://www.tensorflow.org/guide/keras#model_subclassing)APIを使用するときに特に便利です。このAPIは[Chainer](https://chainer.org/)に触発され、モデルの順方向パスを必須に書くことができます。 tf.kerasはTensorFlowエコシステムに緊密に統合されており、以下のサポートも含まれています。


* [tf.data](https://www.tensorflow.org/guide/datasets)を使用すると、高性能の入力パイプラインを構築できます。必要に応じて、NumPy形式のデータを使用してモデルを訓練するか、規模とパフォーマンスを考慮してtf.dataを使用することができます。


* [ディストリビューション戦略](https://github.com/tensorflow/tensorflow/tree/master/tensorflow/contrib/distribute)：多くのマシンに分散しているGPUやTPUなど、さまざまなコンピューティング構成に亘ってトレーニングを配布します。


*モデルのエクスポート。 tf.keras APIで作成されたモデルは、TensorFlow [SavedModel](https://www.tensorflow.org/tutorials/keras/save_and_restore_models)形式でシリアル化され、[TensorFlow Serving](https://www.tensorflow.org/serving/)または他の言語バインディング（Java、Go、Rust、C＃など）を使用して提供されます。


*エクスポートされたモデルは、[TensorFlow Lite](https://www.tensorflow.org/lite/)を使用してモバイルデバイスや組み込みデバイスにデプロイすることも、[TensorFlow.js](https://js.tensorflow.org)で作業することもできます（JavaScriptは、 。


* [フィーチャー列](https://www.tensorflow.org/guide/feature_columns)：構造化データを効果的に表現および分類するためのものです。


*そして、より多くの作品。

## tf.kerasをインストールするには？ pipを使ってKerasもインストールする必要がありますか？

tf.kerasはTensorFlowに含まれています。 Kerasを別途インストールする必要はありません。たとえば、[Colab](https://colab.research.google.com)ノートブックの中で次のように実行すると、

    ！pip install tensorflow

    テンソルフローをtfとしてインポートする

    密度= tf.keras.layers.Dense

これで、tf.kerasが使用されます。輸入品を初めてお持ちの場合は、最新の[チュートリアル](https://www.tensorflow.org/tutorials)の例をご覧ください。

### TensorFlowは、初心者や専門家のためのさまざまなAPIスタイルを提供しています。これらはどのように見えるのですか？

TensorFlowの開発者は、MLを初めて学ぶ学生からMLの専門家や研究者まで、多くの経験レベルを持っています。同様に、TensorFlowの強みの1つは、さまざまなワークフローと目標をサポートするためのAPIがいくつか用意されていることです。同様に、TensorFlowのKeras統合の主な設計目標は、ユーザーが全体のフレームワークを採用することなくより効果的なKerasの一部を選択して選択できることです。

## Sequential API

MLを学ぶ生徒の場合は、tf.keras [Sequential API](https://www.tensorflow.org/guide/keras#build_a_simple_model)を使い始めることをお勧めします。直感的で簡潔で、ML問題の95％に適しています。このAPIを使用すると、約10行のコードで最初のニューラルネットワークを作成できます。

！[*ここをクリックすると、最初のニューラルネットワークを数行のコードでトレーニングする例が得られます。*](https://cdn-images-1.medium.com/max/3160/0* XdVOKuyDWYHHzKvM)**わずか数行のコードで最初のニューラルネットワークをトレーニングする例については、[here](https://colab.research.google.com/github/tensorflow/docs/blob/master/site/en/tutorials/_index.ipynb)をクリックしてください。**

モデルを定義する最も一般的な方法は、深い学習について考えるときに通常使用する精神モデルに対応するレイヤーのグラフを作成することです。モデルの最も単純なタイプは、複数のレイヤーのスタックです。このようなSequential APIを使用すると、次のようなモデルを定義できます。

    model = tf.keras.Sequential（）

    model.add（layers.Dense（64、activation = 'relu'））

    model.add（layers.Dense（64、activation = 'relu'））

    model.add（layers.Dense（10、activation = 'softmax'）））

    そのようなモデルは、コンパイルして、いくつかの行で訓練することができます：

    model.compile（オプティマイザ= 'adam'、損失= 'sparse_categorical_crossentropy'、メトリック= ['精度']）

    model.fit（x_train、y_train、epochs = 5）

    model.evaluate（x_test、y_test）

シーケンシャルAPIを使用する他の例は、「Learn and Use ML」のセクションの[tensorflow.org/tutorials](0）]を参照してください。

！[* Sequential APIを使用してファッションMNISTデータセットで最初のニューラルネットワークをトレーニングするチュートリアルについては、[ここをクリック（0）]をクリックしてください。*]（https://cdn-images-1.medium.com/max / 2000/0 * ewHaMHirePgDye4U）**シーケンシャルAPIを使用してファッションMNISTデータセットで最初のニューラルネットワークをトレーニングするチュートリアルについては、[here](https://colab.research.google.com/github/tensorflow/docs/blob/master/site/en/tutorials/keras/basic_classification.ipynb)をクリックしてください。**

##機能的API

もちろん、順次モデルは、任意のモデルを表現できない単純なレイヤーのスタックです。さらに高度なモデルは、[Functional API](https://www.tensorflow.org/guide/keras#functional_api)を使用して構築することができます。複雑なトポロジを定義することができます。複数の入力モデルや複数の出力モデル、共有レイヤーモデル、

関数APIを使用してモデルを構築する場合、レイヤは呼び出し可能（テンソル）であり、出力としてテンソルを返します。これらの入力テンソルと出力テンソルを使用してモデルを定義することができます。例えば：

    inputs = tf.keras.Input（shape =（32、））

    ＃層インスタンスはテンソルで呼び出し可能であり、テンソルを返します。

    x = layers.Dense（64、activation = 'relu'）（入力）

    x = layers.Dense（64、activation = 'relu'）（x）

    予測=レイヤー.Dense（10、activation = 'softmax'）（x）

    入力と出力を与えられたモデルをインスタンス化する。

    model = tf.keras.Model（inputs =入力、outputs =予測）

そのようなモデルは、上の同じ簡単なコマンドを使用してコンパイルし訓練することができます。 Functional API [here](https://www.tensorflow.org/guide/keras#functional_api)について詳しく知ることができます。

##モデルサブクラス化API

[Model Subclassing API](https://www.tensorflow.org/guide/keras#model_subclassing)を使用することで、完全にカスタマイズ可能なモデルを構築できます。クラスメソッドの本体で、このスタイルで必須の独自の順方向パスを定義します。例えば：

    クラスMyModel（tf.keras.Model）：

     def __init __（self）：super（MyModel、self）.__ init __（）＃ここにレイヤーを定義します。 self.dense_1 = layers.Dense（32、activation = 'relu'）self.dense_2 = layers.Dense（num_classes、activation = 'sigmoid'）

     （self、inputs）：＃あなたの順方向パスをここで定義する、＃ `__init__`で前に定義したレイヤーを使うx = self.dense_1（inputs）return self.dense_2（x）

これらのモデルはより柔軟ですが、デバッグするのが難しい場合があります。上記の単純なコンパイルおよびフィットコマンドを使用して、3種類のモデルをコンパイルしてトレーニングすることも、完全な制御のために独自のカスタムトレーニングループを作成することもできます。

例えば：

    model = MyModel（）

    テープとしてのtf.GradientTape（）：logits = model（images、training = True）loss_value = loss（ロジット、ラベル）

    grads = tape.gradient（loss_value、model.variables）optimizer.apply_gradients（zip（grads、model.variables））

Model Subclassingスタイルの例については、以下のリンクを参照するか、[tensorflow.org/tutorials](0）を参照してください（「研究と実験」セクションを参照）。

モデルサブクラス化APIを使用して実装されています。*]（https://cdn-images-1.medium.com/max/2000/1*_S6e6TbT6Hsc_1s8h8Dbww.png）* [* Neuralモデルサブクラス化APIを使用して実装された注意書きによる機械翻訳**（1）

！[[GAN](https://github.com/tensorflow/tensorflow/blob/master/tensorflow/contrib/eager/python/examples/generative_examples/dcgan.ipynb)はモデルサブクラスAPI *を使用して実装されています。]（https://cdn-images-1.medium.com/max/2000/1*U5UDkZwAQkJ4lemvs7oSJA.png）** [GAN]( 1)モデルサブクラス化APIを使用して実装**

##自分の研究がこれらのスタイルに適合しない場合はどうなりますか？

アプリケーションエリアを制限するtf.kerasがある場合、多くの選択肢があります。あなたはできる：


* Kerasモデル定義とは別にtf.keras.layersを使用し、独自のグラデーションとトレーニングコードを記述します。同様に、tf.keras.optimizers、tf.keras.initializers、tf.keras.losses、またはtf.keras.metricsを別々に、独立して使用できます。


* tf.kerasを完全に無視し、低レベルのTensorFlow、Python、および[AutoGraph](https://www.tensorflow.org/guide/autograph)を使用して、必要な結果を取得します。

それはあなた次第です！ tf.layersのオブジェクト指向でない層は推奨されなくなり、tf.contrib.slimやtf.contrib.learnのような高レベルのAPIを含むtf.contrib。*はTF 2.0で利用できなくなることに注意してください。

## Estimatorsはどうなりますか？

[Estimators](https://www.tensorflow.org/guide/estimators)は、Google内と広範なTensorFlowコミュニティの両方で広く使用されています。線形クラシファイア、DNNクラシファイア、複合DNN線形クラシファイア（ワイドおよびディープモデルとも呼ばれます）、グラディエントブーストされたツリーなど、いくつかのモデルが[Premade Estimators](https://www.tensorflow.org/guide/premade_estimators)としてパッケージ化されています。これらのモデルは、実績のある、幅広く導入されています。これらの理由から、Premade Estimatorを含むEstimator APIはTensorFlow 2.0に含まれます。

Premade Estimatorのユーザーにとっては、Kerasと熱心な実行に対する新しい焦点の影響は最小限に抑えられます。 Premade Estimatorの実装を変更し、APIサーフェスを同じに保つことができます。 Premade Estimatorとして実装されたモデルのKerasバージョンの追加にも取り組む予定で、Kerasを拡張して大規模な制作要件をよりよく満たすようにします。

つまり、カスタムアーキテクチャーで作業している場合、Estimatorの代わりにtf.kerasを使用してモデルを構築することをお勧めします。 Estimatorが必要なインフラストラクチャで作業している場合は、[model_to_estimator（）](https://www.tensorflow.org/api_docs/python/tf/keras/estimator/model_to_estimator)を使用してモデルを変換し、KerasがTensorFlowエコシステム全体で機能するようにすることができます。

## TensorFlow 2.0以降！

tf.kerasを使って楽しんでいただければ幸いです。今後数ヶ月にわたって、TensorFlowチームは開発者の経験を磨くことに集中します。私たちのドキュメントとチュートリアルには、この道筋が反映されます。あなたのご意見やご意見（[コミュニティリソース](https://www.tensorflow.org/community/)をご覧ください）、GitHubの問題やPRを通じての貢献を楽しみにしています。みんな、ありがとう！
