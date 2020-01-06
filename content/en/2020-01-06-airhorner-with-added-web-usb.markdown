---
slug: airhorner-with-added-web-usb
date: 2020-01-06T13:56:40.471Z
title: Airhorner with added Web USB
link: 'https://webusb-horn.firebaseapp.com/'
tags: [links, airhorner, webusb]
---

This new year [Andre Bandarra](https://twitter.com/andreban) left me a little surprise on my desk: A physical airhorner built with Web USB!

<figure><video src="/videos/2020-01-06-airhorner-with-added-web-usb-0.mp4" alt="VID_20200106_134344.mp4" controls></video></figure>

[Check it out](https://webusb-horn.firebaseapp.com/), well actually it will be hard, Andre created a small sketch for an Arduino Uno that connects over USB that is not yet available, however the code on the site is rather neat and not too complex if you are experienced with any form of USB programming.

Andre's code connects to the device and wait for the user to approve, configures the connection and the will then continuously read from the device looking for the string 'ON' (which is a flag that is set when the button is pressed).

```Javascript
const HardwareButton = function(airhorn) {
  this.airhorn = airhorn;
  this.decoder = new TextDecoder();
  this.connected = false;
  const self = this;
  this._loopRead = async function() {
    if (!this.device) {
      console.log('no device');
      return;
    }

    try {
      const result = await this.device.transferIn(2, 64);
      const command = this.decoder.decode(result.data);
      if (command.trim() === 'ON') {
        airhorn.start({loop: true});
      } else {
        airhorn.stop();
      }
      self._loopRead();
    } catch (e) {
      console.log('Error reading data', e);
    }
  };

  this.connect = async function() {
    try {
      const device = await navigator.usb.requestDevice({
        filters: [{'vendorId': 0x2341, 'productId': 0x8057}]
      });
      this.device = device;
      await device.open();
      await device.selectConfiguration(1);
      await device.claimInterface(0);
      await device.selectAlternateInterface(0, 0);
      await device.controlTransferOut({
        'requestType': 'class',
        'recipient': 'interface',
        'request': 0x22,
        'value': 0x01,
        'index': 0x00,
      });
      self._loopRead();
    } catch (e) {
      console.log('Failed to Connect: ', e);
    }
  };

  this.disconnect = async function() {
    if (!this.device) {
      return;
    }

    await this.device.controlTransferOut({
      'requestType': 'class',
      'recipient': 'interface',
      'request': 0x22,
      'value': 0x00,
      'index': 0x00,
    });
    await this.device.close();
    this.device = null;
  };

  this.init = function() {
    const buttonDiv = document.querySelector('#connect');
    const button = buttonDiv.querySelector('button');
    button.addEventListener('click', this.connect.bind(this));
    button.addEventListener('touchend', this.connect.bind(this));
    if (navigator.usb) {
      buttonDiv.classList.add('available');
    }
  };

  this.init();
};
```

