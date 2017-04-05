class TwitterShareButton extends HTMLElement{static get observedAttributes(){return["href","text"]}get text(){return this.getAttribute("text")}set text(a){a?this.setAttribute("text",a):this.removeAttribute("text")}get href(){return this.getAttribute("href")}set href(a){a?this.setAttribute("href",a):this.removeAttribute("href")}createTemplate(){const a=document.createDocumentFragment();let b=document.createElement("style");b.innerHTML=`
    #share-btn {
      min-height: 32px;
      min-width: 32px;
    }
    `;const c=document.createElement("button");return c.id="share-btn",c.innerHTML=`<slot><svg xmlns="http://www.w3.org/2000/svg" viewBox="75 75 240 240"><defs><style>.cls-2{fill:#1da1f2;}</style></defs><path d="M153.6 301.6c94.4 0 146-78.2 146-146 0-2.2 0-4.4-.2-6.6a104.4 104.4 0 0 0 25.6-26.5 102.4 102.4 0 0 1-29.5 8 51.5 51.5 0 0 0 22.6-28.3 102.8 102.8 0 0 1-32.5 12.4 51.3 51.3 0 0 0-87.4 46.8 145.6 145.6 0 0 1-105.6-53.6 51.3 51.3 0 0 0 16 68.5A51 51 0 0 1 85 170v.5a51.3 51.3 0 0 0 41 50.3 51.2 51.2 0 0 1-23 1 51.4 51.4 0 0 0 48 35.5 103 103 0 0 1-63.8 22 104.4 104.4 0 0 1-12.2-.8 145.2 145.2 0 0 0 78.6 23" class="cls-2"/></svg></slot>`,a.appendChild(b),a.appendChild(c),a}attributeChangedCallback(a,b,c){b!=c&&(this[a]=c)}constructor(){super();const a=this.attachShadow({mode:"open"});a.appendChild(this.createTemplate()),a.querySelector("#share-btn").addEventListener("click",a=>{let b=this.parentElement.href;let c=this.parentElement.text;let d=c||this.text||document.title;let e=b||this.href||document.location;location.href=`https://twitter.com/intent/tweet/?text=${encodeURIComponent(d)}&url=${encodeURIComponent(e)}`})}}customElements.define("twitter-share-button",TwitterShareButton);class ShareButton extends HTMLElement{static get observedAttributes(){return["href","text"]}constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(this._createTemplate());let a=this.shadowRoot;this.shareBtn=a.getElementById("share-btn"),this.overlay=a.getElementById("overlay"),this.url=a.getElementById("url"),this.copy=a.getElementById("copy"),this.android=a.getElementById("android")}_createTemplate(){const a=document.createDocumentFragment();let b=document.createElement("style");b.innerHTML=`:host {
      display: inline-flex;
      --share-button-background: none;   
      --share-button-border: 2px outset buttonface;
      --share-button-appearance: button;
      --share-button-border-radius: initial;
      --share-button-color: initial;
      --overlay-background-color: white;
      --overlay-background-border: 1px solid #ccc;
      min-width: 25px;
      min-height: 25px;
    }
          
    .visible {
      display: block !important;
    }
    
    #share-btn {
      -webkit-appearance: var(--share-button-appearance);
      -moz-appearance: var(--share-button-appearance);
      appearance: var(--share-button-appearance);
      border: var(--share-button-border);
      border-radius: var(--share-button-border-radius);
      color: var(--share-button-color);
      width: 100%;
      height: inherit;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      flex-shrink: 1;
      text-transform: inherit;
      font: inherit;
    }

    :host(:not(:empty)) #share-btn {
      background: var(--share-button-background);
    }

    :host(:empty) #share-btn, :host(.empty) #share-btn {
      --share-button-background: url(https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_share_black_24px.svg) center/18px no-repeat;
      background: var(--share-button-background);
    }
        
    #overlay {
      background-color: var(--overlay-background-color);
      display: none;
      padding: 1em;
      top: 0;
      margin: auto;
      left: 0;
      right: 0;
      max-width: 300px;
    }
    
    #overlay.visible {
      display: inline-block !important;
      border: var(--overlay-background-border);
      position: fixed;
    }
    
    #services {
      padding-left: 0;
    }
    
    #copy {
      display: none;
    }
    
    #copy.visible {
      display: block !important;
    }
    
    #copy {
      height: 25px;
      width: 25px;
      margin: 0 0 0 0.5em;
      padding: 1em;
    }

    #copy img {
      transform: translate(-50%, -50%);
    }
    
    #android {
      display: none;
      height: 25px;
      width: 25px;
      margin: 0 0 0 0.5em;
      padding: 1em;
    }

    #android img {
      transform: translate(-50%, -50%);
    }
    
    div.buttons {
      overflow-x: auto;
      display: flex;
      flex-direction: row;
    }
    
    slot[name=buttons]::slotted(*) {
      min-height: 1em;
      margin-top: 1em;
    }

    slot[name=clipboard]::slotted(*) {
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
    }

    slot[name=android]::slotted(*) {
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
    }

    slot[name=buttons]:empty {
      display: none;
    }
                    
    #android.visible {
      display: block !important;
    }
    
    #urlbar {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    
    #url {
      width: 100%;
      padding: 0.5em 0.5em;
    }`;const c=document.createElement("button");c.id="share-btn",c.innerHTML="<slot></slot>";const d=document.createElement("div");return d.id="overlay",d.innerHTML=`
      <div id="urlbar">
        <input type="url" id="url" />
        <button id="copy" aria-label="Copy to clipboard"><slot name="clipboard"><img src="https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_content_copy_black_24px.svg"></slot></button>
        <button id="android" aria-label="Share on Android"><slot name="android"><img src="https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_android_black_24px.svg"></slot></button>  
      </div>
      <div class="buttons">
        <slot name="buttons"></slot>
      </div>`,a.appendChild(b),a.appendChild(c),a.appendChild(d),a}_childrenAdded(){let c,a=this.querySelectorAll("[slot]").length,b=document.createTreeWalker(this,NodeFilter.SHOW_TEXT,null,!1),d=!1;for(;(c=b.nextNode())&&!(d=/\S/.test(c.textContent)););0==d&&a>0?this.classList.add("empty"):this.classList.remove("empty")}connectedCallback(){let a=this.shadowRoot;if(this._childrenAdded(),new MutationObserver(this._childrenAdded.bind(this)).observe(this,{childList:!0}),this.addEventListener("click",a=>{a.preventDefault();this.toggleOverlay();return!1},!1),this.addEventListener("keypress",a=>this.toggleOverlay()),document.documentElement.addEventListener("click",b=>{b.target!=a.host&&this.hide()},!0),this.copy.addEventListener("click",a=>{a.stopPropagation();a.preventDefault();a.cancelBubble=!0;this.copyUrl()}),this.android.addEventListener("click",a=>{const b=encodeURIComponent("https://twitter.com/intent/tweet");window.location=`intent:#Intent;action=android.intent.action.SEND;type=text/plain;S.android.intent.extra.TEXT=${encodeURIComponent(this.url.value)};S.android.intent.extra.SUBJECT=${document.title};S.browser_fallback_url=${b}?text=${encodeURIComponent(document.title)}&${encodeURIComponent(window.location)};end`}),navigator.userAgent.indexOf("Android")>0&&this.android.classList.add("visible"),this.url.addEventListener("click",a=>{a.stopPropagation();a.preventDefault();a.cancelBubble=!0;return!1},!1),this.url.addEventListener("keypress",a=>{a.stopPropagation();a.cancelBubble=!0;13==a.charCode&&(window.location=a.currentTarget.value)}),window.addEventListener("hashchange",a=>this.updateUrl(window.location)),window.addEventListener("popstate",a=>this.updateUrl(window.location)),0==!!this.href&&(this.href=window.location),this.updateUrl(this.href),0==!!this.text){const a=document.getElementsByTagName("title"),b=a?a.innerText:void 0,c=document.querySelector("meta[name=description]"),d=c?c.content:void 0;this.text=d||b}document.queryCommandSupported&&document.queryCommandSupported("copy")&&this.copy.classList.toggle("visible")}attributeChangedCallback(a,b,c){b!=c&&(this[a]=c)}get href(){return this.getAttribute("href")}set href(a){a?(this.updateUrl(a),this.setAttribute("href",a)):(this.updateUrl(window.location),this.removeAttribute("href"))}get text(){return this.getAttribute("text")}set text(a){a?(this.updateText(a),this.setAttribute("text",a)):(this.updateText(),this.removeAttribute("text"))}updateUrl(a){this.url.value=a}updateText(a){}copyUrl(){window.getSelection().removeAllRanges();const a=document.createRange();a.selectNode(this.url),window.getSelection().addRange(a);try{const a=document.execCommand("copy");return window.getSelection().removeAllRanges(),this.toggleOverlay(),a}catch(a){console.error(a)}return!1}hide(){this.overlay.classList.remove("visible")}show(){this.overlay.classList.add("visible")}toggleOverlay(){this.overlay.classList.toggle("visible")}}customElements.define("share-button",ShareButton);