---
slug: designing-a-webpush-service
date: 2016-11-29T13:20:31+01:00
title: "Designing a Web Push Service"
tags: ["headless", "webpush"]
image_header: /images/notification.png
---

As anyone who works for a US based company but lives in the UK knows,
Thanksgiving is a wonderful time of the year. It is that point in the year when
we can actually get work done without a barrage of emails hitting us in the
morning and in the evening.

This Thanksgiving free-time I wanted to knock a project off my to-do list that 
had been sitting around for a while: a generic web-push web-hook end point.

The idea came about because I am very keen on the idea of the [headless
web](/the-headless-web/) &mdash; we can use experiences that are powered by "the
web", written in JavaScript and hosted on a site that requires no visible web 
browser to have a longer term relationship with. I also wanted to make 
incredibly easy to get notifications that you want to receive into your browser
as quickly as possible without having to wait for a service to integrate them.

Some quick use-cases that I wanted to solve:

* Get a quick weather notification in the morning
* Get a notification when a pull request comes in to [WebFundamentals](https://developers.google.com/Google/WebFundamentals)
* Be able to quickly hook any service up so that I can do a quick curl
* Know when one of my team have tweeted (I am a massive voyeur)
* Get a ping when a blog has updated
* Integrated in to IFTTT so that there is a huge amount of flexibility

I would like to do this all without installing any application and the easiest
way that I can see how to do it is to have my own URL endpoint that can be 
pinged whenever there is an action that is important to me.

I also wanted to create this as inspiration for any one else who wants to build
this kind of service. I would be happy if IFTTT implemented web-push and then I
could do away with this service :)

So, I created a simple example web app that if you execute the following curl
command

```shell
curl -XPOST -H "Content-type: application/json" -d '{
    "title": "This is a test",
    "description": "This is a longer description",
    "icon": "https://pbs.twimg.com/profile_images/2736788281/13811f0063041a72d7ea6ede7b89fedd.png"
}' 'https://webpush.rocks/send?id=https://fcm.googleapis.com/fcm/send/egETsJiMlKg:APA91bEmnW-vSLYt_w1qc_2y109fFRWHkukoQjx6d8TNhhPFIKqg9Yeiwbq6IYBRyF3yvbjlXYW2lI2TxoDwxu0cyalUlBudxOpkk-t-nbW_uUm_XXre3V86IBv0RLP7gd9AovsOJytS'
```

then I will get the following notification

<figure>
  <img src="/images/notification.png">
</figure>

Neat.

Obviously, you could abuse this pretty easily and send me filthy things, but
there are two interesting things 1) the end-point is unique to my instance of
the browser and the service worker that is running and unless you give it to
someone (like I have just done) only *you* can send the messages and 2) I have
just killed this subscription, so the curl request would still succeed but you
won't know if it ever got through.

I like this service idea because it allows me to have push notifications for any
service that I can to integrate with and that service doesn't have to support
web push.

I do expect to need to take this service down at some point and I would be
happy when all the service I use use web push.

Implementing web push can seem like a daunting task, but I believe it is not
too complicated and I hope to use this post to show you the code and some 
of my reasoning so that you can go and integrate web-push in to your own
services.

### Designing the service

I've been having some luck with the nano instance on Compute Engine, it's about
5USD per month and I know these services aren't going to be chocker so it has
been pretty in-expensive to run so far.

The rough architecture was based around 3 components that I had in my head:

1. The front-end server &mdash; displays the UI and creates the subscription for
   the user
2. The subscription service &mdash; saves the subscription to a data store
3. The send service &mdash; sends the message to the user

<figure>
 <img src="/images/push-architecture.png" alt="push architecture">
</figure>

#### The front-end client

The idea is that as far as possible this front-end is stateless, the service
that hosts it doesn't care about the user and the only state that it needs
is the Application Key that is used by the web push API (more on that later).

It's sole job is to render a button, manage the subscription of the user to the 
push endpoint and then display a URL: The user clicks subscribe, they get
their unique REST endpoint and a sample cUrl command that they can execute to
test that it works.

{{< fast-youtube k4dJB4klh04 >}}

A quick aside for anyone doing anything with web push in Chrome: If you call
subscribe on a page that is already managing a subscription then you won't be
able to use the subscription again from the server. To fix it, I call
unsubscribe before subscribing again.

The flow for the entire site is:

1. If there is a subscription, unsubscribe the user
2. Subscribe the user to push (at this point they would need to accept the 
   notification permission) - in here we send the application server key (more 
   on that later)
3. Send the subscription info to the server
4. Update the UI.

```javascript
subscribe.addEventListener('click', function() {
  const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

  pushSubscription.then(sub => {
    if(!!sub) {
      return sub.unsubscribe().then(function(s) {return navigator.serviceWorker.ready; });
    }
    return navigator.serviceWorker.ready;
  })
  .then(function(reg) {
    return reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
    })
  })
  .then(function(subscription) {
    // Update the global state (sorry) and pass through
    pushSubscription = Promise.resolve(subscription);
    return pushSubscription;
  })
  .then(function(subscription) {
    // Process the subscription
    let subscriptionData = subscription.toJSON();
    subscriptionData.applicationServerKey = vapidPublicKey;
    var fetchOptions = {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(subscriptionData)
      };
    return fetch('/subscribe', fetchOptions).then(() => subscriptionData);
  })
  .then(function(subscriptionData) {
    EventManager.trigger('usersubscribed', subscriptionData);
  })
  .catch(function() {
    EventManager.trigger('usersubsribefailed');
  });
});
```

#### The front-end service worker

The service worker is relatively lightweight. It receives a push message and
displays it. It will also handle what happens when a user clicks on the
notification and if a URL has been passed along with the payload then it will
open that URL.

```javascript
self.addEventListener('push', e => {
  const data = e.data.json();

  e.waitUntil(self.registration.showNotification(
    data.title, {
      body: data.description || "",
      icon: data.icon || "",
      data: data
    }
  ))
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data.url;

  if(url) {
    e.waitUntil(clients.openWindow(url));
  }
});
```

#### The front-end server

Generates the application server key each time it is booted up and embeds it in 
the web page. The application server key is stored and used in later in the 
process of signing and sending the push messages to the Push Message service 
&mdash; it is used to prove that send from the server is the actual sender of
the message to the push service.

The front-end has two main endpoints:

1. **/subscribe** &mdash; takes the subscription object and puts it on to a
   PubSub queue so that a service can persist it.
2. **/send** &mdash; takes what ever `curl` or other input and passes it through
   to the subscription service

and that is all.

#### The subscribe service

It is argueable if this service is needed because persistence could be done on
the front-end and that would be ok. I made it a service because it enables me to
keep huge swathes of logic out of the front-end, I don't have to deal with the
data store, it allows me to scale it horizontally and also scale logic out into
different services as needed (logging service for instance) and chain them 
together (I worry about the whole YAGNI principle here, but I was having fun).

The code is pretty simple, I:

1. create the topic queue and subscribe to messages on the bus
2. listen for 'subscribe' messages
3. persist the user subscription (keys and )

```javascript
const gcloud = require('google-cloud');
const model = require('../model');
const project_id = 'web-push-rocks';
const pubsub = gcloud.pubsub({
  projectId: project_id
});

const subscribeTopic = `projects/${project_id}/topics/subscribe`;

// Create the topic
pubsub.createTopic(subscribeTopic)
      .then(data => topic = data[0])
      .catch(data => topic = pubsub.topic(subscribeTopic))
      .then(topic => topic.subscribe('subscription-storage-service', {reuseExisting:true}))
      .then(d => {
        subscription.on('message', message => {
          const data = message.data.subscription;
          const applicationServerKey = data.applicationServerKey;
          const endpoint = data.endpoint;
          const p256dh = data.keys.p256dh;
          const auth = data.keys.auth;
          const privateKey = data.privateKey;

          const userSubscription = new model.Subscription(
            endpoint,
            applicationServerKey,
            p256dh,
            auth,
            privateKey
          );

          // Scoping ick.
          ((m) =>
            userSubscription.put(endpoint).then(() => {
            // Successfully stored. Acknowledge
            m.ack();
          }))(message);
        });
      })
```


#### The send service

The send service is actually where the magic happens as it does the actual
sending of the message. There is a lot of other infrastructure here that we 
have no control over (all of the GCM part), but the goal of this is to 
take a message, encrypt it ready for sending and then send it to the user.

<figure>
 <img src="/images/push-architecture-gcm.png" alt="push architecture with GCM">
</figure>

The process is not too complex, we:

1. Wait to be told that a message needs to be sent, by listening to the send 
   queue.
2. De-serialize the message
3. Find out the key for the user (from the data store &mdash; I am debating
about pulling this out in to the front-end) - this is needed for the VAPID
process later.
4. Set up the VAPID headers
5. Send the notification to the endpoint the users for the browser the user is
   using.

The interesting thing is the interplay around the Push service. I heavily relied
on the awesome [Node Web-Push library](https://www.npmjs.com/package/web-push) to
do all the grunt work of encrypting the payload that is being sent to the user.

Our article on [sending push notifications](https://developers.google.com/web/fundamentals/engage-and-retain/push-notifications/sending-messages)
describes how to encode the data to the push service and I would encourage you
all to read it. The process is complex, but it is needed. The push service that
the browser users should never be able to see the messages in between the 
service and the user, so that means we need to encrypt and sign the payload to
ensure that it is not tampered with or inspected.


```javascript
const gcloud = require('google-cloud');
const webpush = require('web-push');
const model = require('../model');
const project_id = 'web-push-rocks';
const pubsub = gcloud.pubsub({
  projectId: project_id
});

const sendTopic = `projects/${project_id}/topics/send`;

// Create the topic
pubsub.createTopic(sendTopic)
      .then(data => topic = data[0])
      .catch(data => topic = pubsub.topic(sendTopic))
      .then(topic => topic.subscribe('subscription-send-service', {reuseExisting:true}))
      .then(data => {
        const subscription = data[0];
        subscription.on('message', message => {
          // We only expect one message a day so this for now will be super super lightweight
          const id = message.data.id;
          const payload = message.data.message;

          model.Subscription.getByEndpoint(id)
          .then(sub => {
            const applicationServerKey = sub.applicationServerKey;
            const endpoint = sub.endpoint;
            const p256dh = sub.p256dh;
            const auth = sub.authKey;
            const privateKey = sub.privateKey;
            const stringPayload = JSON.stringify(payload);

            const pushSubscription = {
              endpoint: endpoint,
              keys: {
                p256dh: p256dh,
                auth: auth
              }
            };

            webpush.setVapidDetails('https://webpush.rocks', applicationServerKey, privateKey);

            webpush.sendNotification(
              pushSubscription,
              stringPayload
            )
            .catch(err => {
              if(err.statusCode && err.statusCode == 410) {
                console.log('Subscription not registered');
                // Delete the subscription and ack
                return topic.delete();
              }
            })
            .then(res => {
              message.ack();
            });
          }, err=> {
            console.error(`Error ${err}`);
            message.ack();
          })
          .catch(err => {
            console.error(`Error getting subscription: ${err}`);
            message.ack();
          });
        });
      });
```
### and that is all