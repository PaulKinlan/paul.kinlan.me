---
date: 2020-01-06 13:56:40.471000+00:00
link: https://webusb-horn.firebaseapp.com/
slug: airhorner-with-added-web-usb
summary: 'I received a very cool gift this year: a Web USB-powered airhorn! It uses
  an Arduino Uno and some very neat code.  The device waits for approval, configures,
  and reads continuously from the device for an \"ON\" signal to trigger the horn.
  Although the Arduino code isn''t available yet, the project is inspired by the WebUSB
  examples for Arduino and should be released soon. Check out the post and the demo.'
tags:
- airhorn
- webusb
- arduino
- hardware
- diy
- electronics
- javascript
- usb programming
title: Airhorner with added Web USB

---

This new year [Andre Bandarra](https://twitter.com/andreban) left me a little surprise on my desk: A physical airhorner built with Web USB!

<figure><video src="/videos/2020-01-06-airhorner-with-added-web-usb-0.mp4" alt="Airhorner with usb" controls></video></figure>

[Check it out](https://webusb-horn.firebaseapp.com/), well actually it will be hard, Andre created a small sketch for an Arduino Uno that connects over USB that is not yet available, however the code on the site is rather neat and not too complex if you are experienced with any form of USB programming.

Andre's code connects to the device and waits for the user to approve, configures the connection, and then continuously reads from the device looking for the string 'ON' (which is a flag that is set when the button is pressed).

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
If you are interested in what the Arduino side of things looks like, Andre will release the code soon, but it's directly inspired by the [WebUSB examples for Arduino](https://github.com/webusb/arduino).
