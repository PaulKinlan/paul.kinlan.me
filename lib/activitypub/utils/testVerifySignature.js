import { Parser, Sha256Signer, Sha256Signature, Signature } from '../../http-signature/index.js';

const publicKeyPem = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuPKVdZpt/olFWtyC4tpJ
bAoxyuFAQ7VDHNjDtC6ooirEtSzAnljaMcw3PLM0KiOTRUoZOeg2GRR4M8mBV2Lv
RdYYMnlFAJNXCTJ0uW3UxVFR5FrMeHlwA27zhwZpaQ74Daz8MTwZ+TFsJoA1UGJl
V3HKZ4QpVYrYNSKl6K75p3+EM/c8AlIA0BuFzJVZYsT3Q9ZJgJCDBXKhqBNEBRSt
6LwOONjzcQkzA9t6l6D0Hwzhb4ySspwH2Ur2X+QPisPnrc01KT3YTX/ygPDDnDcR
rSI+ehs+LtVPqPoAfYMzIKhlo4WLB5gmObO3oQRlg7kda0pFI9FGhLrwV0R3h0BT
kwIDAQAB
-----END PUBLIC KEY-----`;

const publicKeyId = "https://paul.kinlan.me/paul#main-key";

const signature = new Sha256Signature({
  publicKeyId,
  string: 'host: status.kinlan.me\ndate: Fri, 14 Jul 2023 20:36:24 GMT\ndigest: SHA-256=q0ubZcImm4TpDMjk6Q+geJZAsjgODR1m5V/pqcXFSdM=',
  signature: Buffer.from("IiqUSA2oXSzNTsMJE7jOP7YDnL6K7Nol0rpDf+dnK8R14Y6FXX9VdSW43JTDvtnrmlf/lROR36pXXdf/IQhKtHkEJjKQUviBM5BhA9Qv5S84gGXyNkx2ytXEmxcL7BK2nuS/QoW9ud99ZcmhGkzWraoGQ7BM5UV63OCfA3EkKT0gP/QN76eMtuKVVQwCTNZtVxq/RBaJgExrn4+XwaWqFIBovVRM6p+3Pbg1T0e6Eo3Lsy6yn0Um7+iceyjVtveGiV60ywy9bkf85DzoFSSfB4y7sOhjartYyuuBY8HBRkheEywoJH1cK/q29F1Z6jByx84SrlD925sfTgOsB67DNw==")
})

console.log(signature.verify(publicKeyPem));