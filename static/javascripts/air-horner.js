/* Copyright 2017 Google Inc

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
class AirHorner extends HTMLElement {
  get template() {
    if(this._template) return this._template;
    else {
      this._template = document.createElement('template');
      let styles = document.createElement('style');
      styles.innerHTML = `:host {
        height: 100px;
        width: 100px;
        display: inline-block;
      }
#airhorn {
  display: inline-block;
  width: 100%;
  height: 100%;
}
.horn {
    height: 100%;
    width: 100%;
}
.horn .inner {
    height: 80%;
    width: 80%;
}
.horn .inner .center {
    height: 20%;
    width: 20%;
}
@-webkit-keyframes center-horning {
    from {
      height: 20%;
      width: 20%;
    }
    to {
      height: 18%;
      width: 22%;
    }
}
@keyframes center-horning {
    from {
      height: 20%;
      width: 20%;
    }
    to {
      height: 18%;
      width: 22%;
    }
}
@-webkit-keyframes middle-horning {
    from {
      height: 80%;
      width: 80%;
    }
    to {
      height: 81%;
      width: 79%;
    }
}
@keyframes middle-horning {
    from {
      height: 80%;
      width: 80%;
    }
    to {
      height: 81%;
      width: 79%;
    }
}
@-webkit-keyframes horning {
    from {
        height: 100%;
        width: 100%;
    }
    to {
        height: 101%;
        width: 99%;
    }
}
@keyframes horning {
    from {
        height: 100%;
        width: 100%;
    }
    to {
        height: 101%;
        width: 99%;
    }
}

.horn {
    background-color: #F44336;
    box-shadow: 0 2px 2px 0 #000;
    -webkit-transition: box-shadow .2s cubic-bezier(.4, 0, 1, 1);
    transition: box-shadow .2s cubic-bezier(.4, 0, 1, 1);
}
.horn,
.horn .inner {
    border-radius: 50%;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center
}
.horn .inner {
    background-color: #B71C1C
}
.horn .inner .center {
    background-color: #000;
    opacity: .9;
    border-radius: 50%
}
.horn.horning {
    box-shadow: 0 0 0 0 #1565C0;
    -webkit-animation-name: horning;
    animation-name: horning;
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
    -webkit-animation-direction: alternate;
    animation-direction: alternate
}
.horn.horning,
.horn.horning .inner {
    -webkit-animation-duration: 10ms;
    animation-duration: 10ms
}
.horn.horning .inner {
    -webkit-animation-name: middle-horning;
    animation-name: middle-horning
}
.horn.horning .inner,
.horn.horning .center {
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
    -webkit-animation-direction: alternate;
    animation-direction: alternate
}
.horn.horning .center {
    -webkit-animation-duration: 50ms;
    animation-duration: 50ms;
    -webkit-animation-name: center-horning;
    animation-name: center-horning
}`;
      let body = document.createElement('div');
      body.id = 'airhorn';
      body.innerHTML = `
      <slot>
        <div class='horn'>
          <div class='inner'>
            <div class='center'></div>
          </div>
        </div>
      <slot>`;
      this._template.content.appendChild(styles);
      this._template.content.appendChild(body);
      
      return this._template;
    }
  }

  connectedCallback() {
    this._horn = new Horn(this.src);
  }

  constructor() {
    super();

    const root = this.attachShadow({mode:'open'});
    root.appendChild(this.template.content.cloneNode(true));
   
    this._hornHost = root.querySelector(".horn");

    const startHandler = (e) => {
      const hornOptions = {
        loop: true,
        loopStart: this.loopStart,
        loopEnd: this.loopEnd,
        src: this.src
      };

      if(!!e == true) {
        e.preventDefault();

        if(e.touches && e.touches.length > 1) {
          // Multi touch. OFF.
          return false;
        }
      }

      this.start(hornOptions);
    };

    const stopHandler = (e) => {
      if(!!e == true) e.preventDefault();
      this.stop();
    }

    this.addEventListener('mousedown', startHandler);
    this.addEventListener('touchstart', startHandler);

    document.documentElement.addEventListener('mouseup', stopHandler);
    document.documentElement.addEventListener('touchend', stopHandler);
  }

  start(hornParams) {
    // Add to the element for slots
    this.classList.add('horning');
    // Add to the host for shadowDOM
    this._hornHost.classList.add('horning');
    this._horn.start(hornParams || {loop: false}) ;
    this._horn.onstopped = () => {
      this.classList.remove('horning');
      this._hornHost.classList.remove('horning');
    };
  }

  stop() {
    this.classList.remove('horning');
    this._hornHost.classList.remove('horning');
    this._horn.stop();
  }

  get src() {
    return this.getAttribute('src');
  }

  set src(val) {
    if(val) {
      this.setAttribute('src', val);
    } else {
      this.removeAttribute('src');
    }
  }

  get loopStart() {
    return this.getAttribute('loopStart');
  }

  set loopStart(val) {
    if(val) {
      this.setAttribute('loopStart', val);
    } else {
      this.removeAttribute('loopStart');
    }
  }

  get loopEnd() {
    return this.getAttribute('loopEnd');
  }

  set loopEnd(val) {
    if(val) {
      this.setAttribute('loopEnd', val);
    } else {
      this.removeAttribute('loopEnd');
    }
  }
}

var Horn = function(src) {
  // The Horn Player.
  var noAudioContext = false;
  var defaultAudioSrc = './sounds/airhorn.mp3';
  var fallbackAudio;
  var audioCtx = (window.AudioContext || window.webkitAudioContext);
  var self = this;
  var source;
  var buffer;

  if (audioCtx !== undefined) {
    audioCtx = new audioCtx();
  } else  {
    noAudioContext = true;
    fallbackAudio = document.createElement('audio');
  }

  var loadSound = function(callback, src) {
    callback = callback || function() {};

    if (noAudioContext) {
      fallbackAudio.src = src;
      return;
    }

    if(!!buffer == true) {
      // If the buffer is already loaded, use that.
      callback(buffer);
      return;
    }

    var xhr = new XMLHttpRequest();

    xhr.onload = function() {
      audioCtx.decodeAudioData(xhr.response, function(decodedBuffer) {
        callback(decodedBuffer);
      });
    };

    xhr.open('GET', src);
    xhr.responseType = 'arraybuffer';
    xhr.send();
  };


  this.start = function(opts) {
    var shouldLoop = opts.loop; // always loop if from an event.
    var loopStart = opts.loopStart || 0.24;
    var loopEnd = opts.loopEnd || 0.34;
    var src = opts.src || './sounds/airhorn.mp3';

    if (noAudioContext) {
      fallbackAudio.loop = shouldLoop;
      fallbackAudio.currentTime = 0;
      fallbackAudio.play();
      return;
    }

    loadSound(tmpBuffer => {
      source = audioCtx.createBufferSource();

      source.connect(audioCtx.destination);

      source.buffer = tmpBuffer;

      source.onended = function () {
        self.stop();
      };

      source.start(0);
      source.loop = shouldLoop;
      source.loopStart = loopStart;
      source.loopEnd = loopEnd;

    }, src);
  };

  this.stop = function() {
    if(!!source === true)
      source.loop = false;

    if (noAudioContext) {
      fallbackAudio.loop = false;
      fallbackAudio.pause();
    }

    this.onstopped();
  };

  this.onstopped = function() {};

  var init = function(src) {

    loadSound(function(decodedBuffer) {
      buffer = decodedBuffer;
    }, src);
  };

  init(src || defaultAudioSrc);

};

customElements.define('air-horner', AirHorner);