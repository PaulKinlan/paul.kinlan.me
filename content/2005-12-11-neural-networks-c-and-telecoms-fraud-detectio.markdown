---
date: 2005-12-11
published: true
slug: neural-networks-c-and-telecoms-fraud-detectio
summary: I'm revisiting my final year university project on telecoms fraud detection.
  I built a system that generated call records and used a MATLAB neural network to
  analyze them for fraud. It worked surprisingly well! Now, I'm planning to rebuild
  the neural network in C# as a learning exercise to understand the underlying algorithms
  better.  I'll be blogging about the project, neural networks, and the C# development
  process.
tags:
- neural networks
- c#
- telecoms
- fraud detection
- final year project
- multi-layer perceptron
- MATLAB
title: Neural Networks, C# and telecoms fraud detection final year project

---
One of the things I have regretted since I left university is that I have not followed up on my Final year Project [I will try and upload it soon, it was pretty smart.].  Bascially I made a system that created Telephone CDR records based off user determined call profiles.  The data from these CDR was then passed into a neural network [Created using MATLAB] to see if the call history for a particalular telephone customer was fraudulent or not.  It worked really well, and MATLAB was amazing for creating the nerual networks for training and validating.<p />I promised myself that I would create a little neural network framework in what ever language I was working with at the time so that I could learn more about the algorithms and functions of the network.  MATLAB was great but it was easy to hide the detialed understanding of the inner workings of a neural network.<p />So, soon hopefully I will create a little C# neural network package.  Just mainly as a learning exercise.  I know there are a lot of resources out there that already do it in c#, but I don't really want to use them for many reasons.  Some of them seem convulted, some of them seem very specialised and all of them will not really help me understand neural networks the way that I should, it will be MATLAB all over again.<p />On the neural network side of things I used a Multi-layer perceptron.  Which had an astonishing high true-positive/negative rate.<p />Basically my next series if posts will be about my Final year project and the work that I did with neural networks.  Additionally, I will try and talk about some of the c# aspects of me learning about neural networks again.<p />

