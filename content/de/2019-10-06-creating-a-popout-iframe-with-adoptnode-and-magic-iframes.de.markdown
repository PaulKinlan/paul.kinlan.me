---
slug: creating-a-popout-iframe-with-adoptnode-and-magic-iframes
date: 2019-10-06T20:58:16.791Z
title: 'Creating a pop-out iframe with adoptNode and "magic iframes"'
tags: [iframe, popout, adoptNode]
---

### Update: 8. Oktober - Wichtige Probleme mit diesem Dokument.

Ich habe mit [Jake Archibald](https://jakearchibald.com/) über diesen Beitrag gesprochen, weil ich dachte, ich hätte etwas Neues. Während des Gesprächs haben wir viele Dinge aufgedeckt, die einen Teil dieses Beitrags ungültig machen, und ich habe dabei auch eine Menge gelernt, von denen ich glaube, dass die meisten Entwickler das nicht tun kennt.

* Durch Aufrufen von `.append()` und `.appendChild()` der Knoten übernommen. Dies macht die Verwendung von `adoptNode` in dieser Instanz unbrauchbar, da der Append-Algorithmus sicherstellt, dass der Knoten übernommen wird. Dies wurde in MDN-Dokumenten nicht erwähnt, steht aber in [spec](https://dom.spec.whatwg.org/#concept-node-append) . Ich muss zurückgehen und herausfinden, warum ich früher ein Problem hatte, aber ich vermute, es lag daran, dass ich ursprünglich versucht habe, ein `DocumentFragment` anzuhängen. Dies bedeutet, dass `w.document.body.appendChild(document.adoptNode(airhornerIframe));` und `w.document.body.appendChild(airhornerIframe);` den gleichen Effekt haben.
* DOM-Elemente behalten zwar ihren Status bei (überprüfen Sie das benutzerdefinierte Element), aber wenn ein Iframe im DOM verschoben wird, wird er neu geladen. Zeitraum. Das bedeutet, dass das Verschieben zwischen iframes nicht den Zustand beibehält, den ich ursprünglich getestet habe. Ich glaube, dies lag an der Tatsache, dass die SW die Seite unglaublich schnell geladen hat. Die Portale-API ist davon möglicherweise nicht betroffen - daher sollte diese Erfahrung in Zukunft funktionieren :)

Das Konzept, Elemente zwischen Dokumenten zu verschieben, ist immer noch gültig und interessant, aber der Nutzen für iframes besteht nicht. Ich habe festgestellt, dass die Videoelemente beim Verschieben zwischen den Fenstern zurückgesetzt wurden und ich hätte sorgfältiger prüfen müssen, ob der iframe den Status tatsächlich zurückgesetzt hat.

Wie immer sieht man das [commit history for this post](https://github.com/PaulKinlan/paul.kinlan.me/commits/main/content/en/2019-10-06-creating-a-popout-iframe-with-adoptnode-and-magic-iframes.markdown) .

### Ursprünglicher Beitrag Als ich 2010 zu Google stieß, stieß ich auf ein Dokument, in dem in Google Mail ein Konzept namens &quot; [magic iframes](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf) &quot; erwähnt wurde. Es hatte einen coolen Namen und das Konzept war neuartig.

> * Targeted at apps with multiple windows
> * All code and data go into an IFRAME
> * If window hosting the IFRAME unloads, it gets adopted by another of the windows
> * In Gmail for example:
>   * Tearoff / pop-out compose creates bare window that is filled by code in IFRAME in main window
>   * If you close the main window, the code looks for a tear-off that can accept the IFRAME and moves it
>   * You finish your compose and can still send the email
> * Old way: create new instance of Gmail tailored to the task.

- [Adam de Boor](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf)

Das Konzept ist, dass viele Anwendungen viel komplexes JavaScript laden müssen, selbst für eine &quot;kleine Komponente&quot; wie das Erstellungsfenster in Google Mail. Sie könnten die Komponenten der Anwendung in ein `iframe` , mit dem der Benutzer im `iframe` interagieren kann. dass Sie dann &quot;abreißen&quot; und in ein neues Fenster wechseln können, wenn Sie auf die Schaltfläche &quot;In neuem Fenster erstellen&quot; klicken. Ich war nicht sicher genug, um mit dem Autor zu sprechen (und ich habe es immer noch nicht getan, und ich habe auch nicht in der Quelle nach Google Mail gesucht, um festzustellen, ob es jemals tatsächlich verwendet wurde), aber ich habe es nicht vergessen, hauptsächlich, weil der Name rätselhaft war .

Vorwärts springen 10 Jahre und ich war auf einer langen Zugfahrt und fing an, ein Gebiet zu untersuchen, das ich nicht viel über die `adoptNode` API weiß. Ich habe mit einem [lot of ideas](https://nifty-meadowlark.glitch.me/) und festgestellt, dass es möglich ist, DOM-Elemente, ihren aktuellen Status und ihre angehängten Event-Handler in neue Fenster zu verschieben. Dies erinnerte mich an &quot;magische Iframes&quot; und führte letztendlich zu der Idee, dass Sie ein Pop-Out-Iframe erstellen können (Ein Pop-Out-Iframe ist Bild in Bild-Video, aber für Iframe-Elemente).

Der Code für den Pop-Out-Iframe ist ziemlich einfach:

```html
<iframe src="https://airhorner.com" id="airhorner"> </iframe>

<button id="adoptIframeButton">
  Popout iframe into new window (adoptNode)
</button>

<script>
 adoptIframeButton.addEventListener("click", () => {
    const airhornerIframe = document.getElementById("airhorner");
    const width = airhornerIframe.clientWidth;
    const height = airhornerIframe.clientHeight;
    const w = window.open("blank.html", "", `top=100,width=${width},height=${height}`);
    w.addEventListener("load", () => {
      w.document.body.appendChild(airhornerIframe);
    });
 });
</script>
```

<iframe src="https://airhorner.com" id="airhorner"> </iframe>

<button id="adoptIframeButton">
  Popout iframe into new window (adoptNode)
</button>

<script>
 adoptIframeButton.addEventListener("click", () => {
    const airhornerIframe = document.getElementById("airhorner");
    const width = airhornerIframe.clientWidth;
    const height = airhornerIframe.clientHeight;
    const w = window.open("/blank.html", "", `top=100,width=${width},height=${height}`);
    w.addEventListener("load", () => {
      w.document.body.appendChild(airhornerIframe);
    });
 });
</script>

`adoptNode` können Sie DOM-Elemente mit ihrem aktuellen Status verschieben, während die vorhandenen gebundenen Ereignishandler zwischen den Dokumenten im Browser beibehalten werden. `adoptNode` kann ein neues DOM im aktuellen Fenster sein oder wie im Fall dieser Demo ein bereits verschobenes Laden Sie `iframe` in ein anderes Fenster, das denselben Ursprung hat. (Siehe Update oben).

Das Verschieben eines Iframes ist interessant, da Sie den Inhalt des Iframes nicht neu starten müssen, sondern die Instanz nur verschoben wird. Es gibt ein paar Nachteile:

1. Die URL bleibt auf dem aktuellen Ursprung und nicht auf dem Iframe-Ursprung, obwohl dies möglicherweise mit der `<portal>` API `<portal>` kann.
2. Wenn Sie ein benutzerdefiniertes Element oder ein Element verschieben, dessen Logik auf dem Öffner gehostet ist, wird die Ausführung angehalten, wenn Sie den Öffner schließen.

Abgesehen von den Nachteilen fand ich diesen IPC-Mechanismus auf DOM-Ebene sehr, sehr interessant. Spielen Sie mit [demo page](https://nifty-meadowlark.glitch.me/) ( [src](https://glitch.com/edit/#!/nifty-meadowlark?path=script.js) ) und lassen Sie mich wissen, ob Sie interessante Ideen haben, wo dies verwendet werden könnte.

