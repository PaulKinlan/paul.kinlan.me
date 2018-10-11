---
slug: building-a-video-editor-on-the-web-with-the-web
date: 2018-10-11T11:00:00Z
title: 'Building a video editor on the web. Part 0.'
video_url: /videos/video-editor-part-0.webm
---


あなたは、ブラウザでウェブだけを使ってビデオを作成し編集することができます。 Screenflowに似たユーザーインターフェイスを提供することで、複数のビデオ、画像、およびオーディオを1つのビデオにまとめて、YouTubeなどのサービスにアップロードできる出力ビデオを作成できるようにする必要があります。

この投稿は本当に単なる声明です。私はプラットフォーム上で利用できるものと利用できないものを整理し、今日までにどのくらい得ることができるかを見るための長いプロセスを開始するつもりです。

このプロジェクトのいくつかの考えの中で、私はカール・セイガンの瞬間を持っていました。つまり、リンゴ・パイを作るために宇宙を発明する代わりに、少なくともビデオ・エディタを構築するのに必要なすべてのツールを作成する必要があります。それを行うプロセス。この記事が存在するという事実は、私がいくつかの作品を用意して準備ができていることを知っているからです。

私は、他の誰かのためのビジネスでもある大規模なモノリシックな「ビデオエディタ」を作り出すつもりはないと思っていますが、私はそれを簡単にするために必要なすべての部分を工夫するつもりですウェブ上で素晴らしい動画を作成し、多くの人にウェブ上で可能なことを見せてもらいましょう。

以下は私の大まかな1ページプロジェクト計画です：


**私が持っている使用例：**


*私は通常、Google I / OとChrome DevSummitのすべてのデバイスデモを記録し、オーバーレイなどを追加する必要があります。チームの全員がこれを行うことができます。
*チームはしばしばスクリーンキャストを記録し、シンプルなウェブサイトからすぐにそれを行い、最終的な出力をクリーンアップできるようにしたいと考えています。
*私は鋭く保つためにいくつかの製品を作る必要があります。 ;）


**入力：**


* [p0]マイクから音声を録音する
* [p0]ウェブカメラからビデオを録画する[完了 - 下記参照]
* [p0]ウェブ上にホストされている外部動画を埋め込む
* [p0]デスクトップを記録する
* [p1]リモートストリームを記録する
* [p1]＆lt; canvas＆gt;を記録します。素子
* [p0]ローカルデバイスからファイルをロードする
* [p1]ローカルデバイスからファイルを共有する（android share intent）


**操作：**


* [p1]ウォーターマークを追加する
* [p1]フィルター効果を画像に追加する
* [p0]カスタム画像をレイヤーとして追加する
* [p0]ビデオとオーバーレイをキューに入れる
* [p0]オーディオとビデオの別々のトラックをオーバーレイする
* [p1]特定の時間にテキストを重ねる
* [p0]ビデオをサイズに切り抜く
* [p0]ビデオの位置決めとサイズ変更を有効にする
* [p0]ビデオ/オーディオのトリム
* [p0]スプライスビデオ/オーディオ


**出力：**


* [p0] webm形式のビデオファイル
* [p1] MTB情報
* [p1] xyz形式のビデオファイル

[この動画のコード](https://glitch.com/edit/\#!/camera-recorder?path=script.js:1:0)[デモ]([https://camera-recorder.glitch.me/](https://camera-recorder.glitch.me/)）


```javascript  
const init = () => {  
  let blobs;  
  let rec;  
  let stream;  
    
  captureBtn.onclick = async () => {  
    stream = await navigator.mediaDevices.getUserMedia({video: { width: 1280, 
height: 720 }, audio: true});

    videoElement.srcObject = stream;  
    let opts = {mimeType: 'video/webm; codecs=vp9,opus'};  
    blobs = [];  
    download.style.display = 'none'

    rec = new MediaRecorder(stream, opts);  
    rec.ondataavailable = (e) => blobs.push(e.data);  
    rec.onstop = async () => {  
      let blob = new Blob(blobs, {type: 'video/webm'});  
      let url = window.URL.createObjectURL(blob);  
      download.href = url;  
      download.download = 'test.webm';  
      download.style.display = 'block';  
    };  
    startBtn.disabled = false;  
    captureBtn.disabled = true;  
  };

  startBtn.onclick = () => {  
    startBtn.disabled = true;  
    stopBtn.disabled = false;  
    rec.start();  
  };

  stopBtn.onclick = () => {  
    captureBtn.disabled = false;  
    startBtn.disabled = true;  
    stopBtn.disabled = true;

    rec.stop();  
    stream.getTracks().forEach(s=>s.stop())  
    videoElement.srcObject = null  
    stream = null;  
  };  
};

window.addEventListener('load', init);  
```

