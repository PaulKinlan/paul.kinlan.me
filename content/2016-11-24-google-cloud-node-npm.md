---
slug: google-cloud-node-npm-grpc
date: 2016-11-24
title: "GRPC + Google Cloud: Cannot find module grpc_node.node"
description: "This is a note for how to fix the above error because it annoyed me!"
---

I have been running a small service on Google Compute Engine (Ubuntu) that requires
the `google-cloud` npm module but I kept hitting an error with `grpc_node.node`
not being found.

```shell
Error: Cannot find module '/home/paul_kinlan/web-push-rocks/frontend/node_modules/google-cloud/node_modules/grpc/src/node/extens
ion_binary/grpc_node.node'
    at Function.Module._resolveFilename (module.js:469:15)
    at Function.Module._load (module.js:417:25)
    at Function._load (/usr/lib/node_modules/pm2/node_modules/pmx/lib/transaction.js:62:21)
    at Module.require (module.js:497:17)
    at require (internal/module.js:20:19)
    at Object.<anonymous> (/home/paul_kinlan/web-push-rocks/frontend/node_modules/google-cloud/node_modules/grpc/src/node/src/gr
pc_extension.js:38:15)
    at Module._compile (module.js:570:32)
    at Object.Module._extensions..js (module.js:579:10)
    at Module.load (module.js:487:32)
    at tryModuleLoad (module.js:446:12)
```

It was incredibly frustrating as I have not seen any recognition of the issues
that many people are facing.

The solution that I found (well [Surma](https://dassur.ma/) on our team found)
was to force a rebuild of the module from source as follows:

```shell
npm install
npm rebuild --build-from-source google-cloud
```

Stupid node. Stupid Cloud platform.  :)
