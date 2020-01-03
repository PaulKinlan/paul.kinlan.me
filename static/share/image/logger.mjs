export class Logger {
  constructor(outputEl) {
    this._outputEl = outputEl;
  }

  log(str) {
    this._outputEl.textContent += str + '\n';
  }

  clear() {
    this._outputEl.textContent = '';
  }
}