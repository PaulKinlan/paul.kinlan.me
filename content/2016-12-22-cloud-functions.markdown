---
slug: cloud-functions
date: 2016-12-22T17:20:31+01:00
title: "Experimenting with Cloud Functions for use in Web Push"
image_header: /images/travis-cloud-function.png
---

I've been building out a quick sample that lets you quickly hook up an [web
push](https://webpush.rocks) with a simple cURL request. The principle being
that I would like to get integrations with third party APIs that currently don't
support Web Push in any way.

The thing about webhooks is that they are not standarised in any way other than
you will most likely get a blob of data in a `POST` HTTP request, for example
[Travis CI](https://docs.travis-ci.com/user/notifications#Webhook-notifications)
`application/x-www-form-urlencoded` encodes the request data, whereas [Github
will just put a JSON object as the POST
payload](https://developer.github.com/webhooks/). Neither is wrong, they are
just different and each other webhook service will be different in their own way
too and I need to be able to handle that.

I decided to implement a small piece of functionality that would allow me to
receive arbitrary web requests from a service (such as Travis or Github) and 
to apply custom logic on the messages so that I can output the data that is
required for the web push notification.

The requirements that I had were:

* I wanted to contain logic for each type of data in it's own module
* I wanted process isolation so that anyone malicious message wouldn't bring 
  down my service
* I wanted to be able to be able to scale quickly to an unknown number of 
  requests.
* I didn't want to have to manage infrastructure

Given that I am on Google Compute Engine and I am always curious, I felt that
[Google Cloud Functions](https://cloud.google.com/functions/docs/) might be a
good fit. GCF's are the same as [Amazon Lambdas](https://aws.amazon.com/lambda/)
and they let me create a small unit of processing and scale it when the relevant
system event happens (in my case, when a web hook request is received).

The architecture that I decided upon was roughly as follows.

{{< figure src="/images/cloud-functions.png" title="Requests come in to the front end, are forwarded to the correct 
  transformation function in Google Cloud Functions and finally sent to the user" >}}

I would have named queues for each service integration and a dedicated cloud
function for each data processor.

The front end is not amazingly complex. It takes the web request that was 
sent via a POST request to `/send-raw` and pushes the data on to the relevant 
queue for processing by the cloud function that knows how to transform the data.

The [code](https://github.com/PaulKinlan/pushit/blob/master/frontend/index.js#L64)
is relatively straight forward: receive the message, send it on for processing.

```
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json 
app.use(bodyParser.json())

app.post('/send-raw', (req, res) => {
  const message = req.body;
  const id = req.query.id;
  const processor = req.query.processor;
  
  // Topic must exist
  const rawTopic = pubsub.topic(`projects/${project_id}/topics/send-${processor}`);
  rawTopic.publish({
      id: id,
      processor: processor,
      message: message
    })
    .then(() => res.send('ok'))
    .catch(() => res.send('error'))
});
```

The Google Cloud function is set up as a subscription to the relevant queue and
when a message is on the bus it triggers the `run` function. The [code](https://github.com/PaulKinlan/pushit/blob/master/cloud-functions/travis/index.js#L17)
again is not too complex as Cloud Functions is taking care of all the scaling
and all I have to do is implement the naive transform from Travis CI's data
payload to the format I need to send the web push message.

```
/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event The Cloud Functions event.
 * @param {!Function} The callback function.
 */
exports.run = function subscribe(event, callback) {
  // The Cloud Pub/Sub Message object.
  const pubsubMessage = event.data;
  const data = JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString());
  const id = data.id;
  const msgObject = JSON.parse(data.message.payload);

  const sendTopic = pubsub.topic(sendTopicId);
  const transformedMessage = {
    "title": `Travis: ${msgObject.repository.name} ${msgObject.status_message}`,
    "description": `${msgObject.status_message}`,
    "url": `${msgObject.build_url}`
  };

  // Send the push to the push sending service
  sendTopic.publish({
    id: id,
    message: transformedMessage
  });

  // Don't forget to call the callback.
  callback();
};
```
And voila!

{{< figure src="/images/travis-cloud-function.png" title="A message." >}}