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
  position: relative;
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
}
/* The control is a real <button> inside the shadow root, so the role, the focus
   target and Enter/Space come from the platform rather than from ARIA patched
   onto a bare custom element. It is an empty, transparent overlay covering
   #airhorn rather than a wrapper around the slot: a <button> re-lays out its
   content box (Blink centres it), which moved the slotted jakehorner art by
   ~200px, and an overlay leaves the art exactly where it was. */
#horn-button {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
}
#horn-button:focus-visible {
    outline: 3px solid #1565C0;
    outline-offset: 3px;
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
      </slot>
      <button id='horn-button' type='button'></button>`;
      this._template.content.appendChild(styles);
      this._template.content.appendChild(body);
      
      return this._template;
    }
  }

  static get observedAttributes() {
    return ['label'];
  }

  attributeChangedCallback(name) {
    if(name === 'label') this._applyLabel();
  }

  connectedCallback() {
    this._horn = new Horn(this.src);
    // The name lives on the shadow button: the host carries no role, and
    // aria-labelledby cannot cross the shadow boundary.
    this._applyLabel();
  }

  constructor() {
    super();

    // delegatesFocus: the host wraps a focusable control, so focusing the host
    // forwards focus to the button (and :focus reaches the host) - the shape the
    // accessible-web-components guidance gives for this. The host carries no role
    // or state of its own, which is the condition for using it.
    const root = this.attachShadow({mode:'open', delegatesFocus: true});
    root.appendChild(this.template.content.cloneNode(true));
   
    this._hornHost = root.querySelector(".horn");
    this._button = root.querySelector("#horn-button");

    // Tracked per instance: every instance listens for the document-level
    // release, so the flag is what keeps one instance's mouseup from stopping
    // a horn another instance is holding.
    this._pointerHeld = false;
    // Set while an activation key is down, so the release stops only a horn a
    // key started.
    this._keyHeld = false;
    // Set between a keydown that started the horn and the click the same key
    // press may still produce (Enter on keydown, Space on keyup), so that
    // click is not treated as a second, discrete activation.
    this._keyboardActivated = false;
    // What is sounding: null, 'held' (a pointer or key is down) or 'oneshot'
    // (a discrete activation with no release to wait for). One source at a
    // time is the invariant - a press never starts a second one.
    this._sounding = null;

    const startHandler = (e) => {
      if(!!e == true) {
        e.preventDefault();

        if(e.touches && e.touches.length > 1) {
          // Multi touch. OFF.
          return false;
        }
      }

      this._pointerHeld = true;
      this._updateHeld();
    };

    const stopHandler = () => {
      if(this._pointerHeld !== true) return;
      this._pointerHeld = false;
      this._updateHeld();
    }

    this.addEventListener('mousedown', startHandler);
    this.addEventListener('touchstart', startHandler);

    document.documentElement.addEventListener('mouseup', stopHandler);
    document.documentElement.addEventListener('touchend', stopHandler);
    document.documentElement.addEventListener('touchcancel', stopHandler);

    // Keyboard. A button activates on Enter and Space, and the horn is a
    // press-and-hold control, so the press starts it and the release stops it.
    const isActivationKey = (e) => e.key === ' ' || e.key === 'Enter' || e.key === 'Spacebar';

    this._button.addEventListener('keydown', (e) => {
      if(!isActivationKey(e)) return;
      // Space would scroll the page, and the browser's own key handling fires a
      // click on top of the press started here - the double activation that was
      // removed from share-button (paul-kinlan-me-snr).
      e.preventDefault();
      if(e.repeat === true) return; // auto-repeat: the horn is already looping
      this._keyHeld = true;
      this._keyboardActivated = true;
      this._updateHeld();
    });

    this._button.addEventListener('keyup', (e) => {
      if(!isActivationKey(e)) return;
      e.preventDefault();
      if(this._keyHeld !== true) return;
      this._keyHeld = false;
      this._updateHeld();
      // The click this key press may still produce is dispatched after these
      // listeners; clear the flag on the next task so a later real activation
      // is not swallowed.
      setTimeout(() => { this._keyboardActivated = false; }, 0);
    });

    // An activation that arrives as a click with detail 0 and no preceding
    // pointer or key press is how assistive technology (and element.click())
    // presses a button. There is no release to wait for, so play one horn.
    this._button.addEventListener('click', (e) => {
      if(e.detail > 0) return; // a real mouse click already ran mousedown/mouseup
      if(this._keyboardActivated === true) {
        this._keyboardActivated = false;
        return;
      }
      if(this._sounding !== null) return; // already sounding
      this._sounding = 'oneshot';
      this.start(this._hornOptions(false));
    });

    // Losing focus with the key still held (tabbing away, or the page moving
    // focus) must not leave the horn running.
    this._button.addEventListener('blur', () => { this._cancelHeld(); });

    // A press whose release never arrives must not leave the horn running
    // either: the window losing focus mid-press (alt-tab, or the tab being
    // switched away) is the case none of the release listeners above see.
    window.addEventListener('blur', () => { this._cancelHeld(); });
  }

  // The horn's playback options. Held presses loop; a discrete activation
  // (no release to wait for) plays one horn.
  _hornOptions(loop) {
    return {
      loop,
      loopStart: this.loopStart,
      loopEnd: this.loopEnd,
      src: this.src
    };
  }

  // The horn sounds while any press is held and stops when the last one is
  // released: pointer and key presses can overlap (mouse down, then Space), and
  // starting a source per press overwrote the single source slot, leaving the
  // older one looping for ever after both were released
  // (paul-kinlan-me-6vy). One source at a time is the invariant.
  _updateHeld() {
    const held = this._pointerHeld === true || this._keyHeld === true;
    if(held === true) {
      if(this._sounding !== 'held') {
        this._sounding = 'held';
        this.start(this._hornOptions(true));
      }
    } else if(this._sounding === 'held') {
      this._sounding = null;
      this.stop();
    }
  }

  // Stop only a horn this instance is holding, and forget the press so the
  // release that may still arrive is a no-op.
  _cancelHeld() {
    if(this._pointerHeld !== true && this._keyHeld !== true) return;
    this._pointerHeld = false;
    this._keyHeld = false;
    this._keyboardActivated = false;
    this._updateHeld();
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
      this._sounding = null;
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

  get label() {
    return this.getAttribute('label') || 'Air horn';
  }

  set label(val) {
    if(val) {
      this.setAttribute('label', val);
    } else {
      this.removeAttribute('label');
    }
  }

  _applyLabel() {
    if(this._button == null) return;
    this._button.setAttribute('aria-label', this.label);
  }
}

var Horn = function(src) {
  // The Horn Player.
  var noAudioContext = false;
  // The horn this site actually ships (static/audio/airhorn.mp3 ->
  // /audio/airhorn.mp3). The old relative './sounds/airhorn.mp3' resolves
  // against the page, so on /projects/airhorner-customelement/ it 404s and the
  // plain <air-horner> has no media at all - no sound on any input, keyboard
  // included (paul-kinlan-me-lk2).
  var defaultAudioSrc = '/audio/airhorn.mp3';
  var fallbackAudio;
  var audioCtx = (window.AudioContext || window.webkitAudioContext);
  var self = this;
  var source;
  var buffer;
  // Every start owns a generation. A stop - or a later start - bumps it, so a
  // start whose audio is still being fetched cannot create a source for a press
  // that is already over, and cannot outlive the source that replaced it
  // (paul-kinlan-me-6vy).
  var generation = 0;

  // Silence whatever is playing, now, with no onended side effects: a replaced
  // source must not be left looping, and must not report an end later that is
  // read as the current horn stopping.
  var silence = function() {
    if(!!source === true) {
      source.onended = null;
      try {
        if(typeof source.stop === 'function') source.stop();
      } catch(e) {
        // Already stopped is not an error worth failing the horn over.
      }
      source = null;
    }

    if (noAudioContext) {
      fallbackAudio.loop = false;
      fallbackAudio.pause();
    }
  };

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
    var src = opts.src || '/audio/airhorn.mp3';

    if (noAudioContext) {
      fallbackAudio.loop = shouldLoop;
      fallbackAudio.currentTime = 0;
      fallbackAudio.play();
      return;
    }

    // One source at a time: replacing a sounding horn silences the old source
    // rather than overwriting the slot and leaving it looping for ever.
    silence();
    generation += 1;
    var mine = generation;

    loadSound(tmpBuffer => {
      // A release (or a newer press) that arrived while the audio was still
      // loading owns the decision: do not start a sound for it.
      if(mine !== generation) return;

      source = audioCtx.createBufferSource();

      source.connect(audioCtx.destination);

      source.buffer = tmpBuffer;

      // `source` is a single slot, so when a released source finishes (its
      // onended fires at the end of its loop or buffer) it must not stop a
      // horn that started in the meantime: a touch or tap right after a
      // release used to be cut off mid-sound by the previous source's
      // onended. Only the source that is still the current one may stop it.
      source.onended = function () {
        // Reached by a released source finishing its loop tail, or by a
        // one-shot playing out. A source that was replaced never reaches it:
        // start() detaches the handler above before silencing it.
        self.stop();
      };

      source.start(0);
      source.loop = shouldLoop;
      source.loopStart = loopStart;
      source.loopEnd = loopEnd;

    }, src);
  };

  this.stop = function() {
    // A start still waiting on its audio belongs to a press that is over by
    // now: cancel it so it cannot create a source after the release.
    generation += 1;

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