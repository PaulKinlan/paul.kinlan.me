---
slug: opml-net-object-model
date: 2006-04-01
 
title: OPML .Net Object Model
published: true
---
[This is the second time I typed this because IE7 suddenly closed down whilst I was typing the original post.] <p />I have been playing around with the .Net XML Serialization over the past couple of days.  I thought it would be a good idea to create an object based roughly around the OPML 2.0 DRAFT spec.  With the intent of being able to serialize and deserialize OPML files with ease.<p />I had some successes with Serializing the OPML Object.  I had developed the OPML Object model with constraints in which are defined in the spec, so the OPML file was correctly formed when it was serialized.<p />I had problems with the de-serializing.  I could not get the XML Deserializer to enforce some of the constraints that I had placed on public propertties, so it was infact possible to load an incorrectly constructed OPML file.<p />I will post the code later.  But I will keep playing with the code.<p />

