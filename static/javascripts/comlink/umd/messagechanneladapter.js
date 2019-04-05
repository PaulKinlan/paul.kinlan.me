/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
else {factory([], self.MessageChannelAdapter={});}
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function wrap(smc, id = null) {
        const { port1, port2 } = new MessageChannel();
        hookup(port2, smc, id);
        return port1;
    }
    exports.wrap = wrap;
    function hookup(internalPort, smc, id = null) {
        internalPort.onmessage = (event) => {
            const msg = event.data;
            const messageChannels = Array.from(findMessageChannels(event.data));
            for (const messageChannel of messageChannels) {
                const id = generateUID();
                const channel = replaceProperty(msg, messageChannel, id);
                hookup(channel, smc, id);
            }
            const payload = JSON.stringify({ id, msg, messageChannels });
            smc.send(payload);
        };
        smc.addEventListener("message", (event) => {
            let data = {};
            try {
                data = JSON.parse(event.data);
            }
            catch (e) {
                return;
            }
            if (id && id !== data.id)
                return;
            if (!id && data.id)
                return;
            const mcs = data.messageChannels.map(messageChannel => {
                const id = messageChannel.reduce((obj, key) => obj[key], data.msg);
                const port = wrap(smc, id);
                replaceProperty(data.msg, messageChannel, port);
                return port;
            });
            internalPort.postMessage(data.msg, mcs);
        });
    }
    function replaceProperty(obj, path, newVal) {
        for (const key of path.slice(0, -1))
            obj = obj[key];
        const key = path[path.length - 1];
        const orig = obj[key];
        obj[key] = newVal;
        return orig;
    }
    function* findMessageChannels(obj, path = []) {
        if (!obj)
            return;
        if (typeof obj === "string")
            return;
        if (obj instanceof MessagePort) {
            yield path.slice();
            return;
        }
        for (const key of Object.keys(obj)) {
            path.push(key);
            yield* findMessageChannels(obj[key], path);
            path.pop();
        }
    }
    function hex4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    const bits = 128;
    function generateUID() {
        return new Array(bits / 16)
            .fill(0)
            .map(_ => hex4())
            .join("");
    }
});
