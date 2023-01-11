+++
date = 2023-01-06T14:47:52Z
draft = true
slug = "training-the-button-detector-ML-model"
summary = "A guide to how I trained an ML model that detects Buttons and Links in a web page."
tags = []
title = "Training the Button detector ML model"

+++
I've had a lot of fun over the holiday period. I spent a huge amount of time with my family, and in some down time I got to hack.

Last week I talked about the [Button and Link scraping tool](https://paul.kinlan.me/button-and-link-scraping-for-ml-training/) that I created to get the data to train a model that will help me work out if an `<a>` element looks like a button. I've made a number of updates to that tool based on some of the results from what I am planning to talk about in this (shorter) post.

I now have a repository of about 3000 images of buttons, and 4000 images of links generated from this list of [urls](https://github.com/PaulKinlan/button-and-link-scraper/blob/main/urls.txt).

### The data

I download the data using the [Button and Link scraping tool](https://paul.kinlan.me/button-and-link-scraping-for-ml-training/)

```python
dataset_url = "https://github.com/PaulKinlan/button-and-link-scraper/releases/download/latest/images.tgz"
data_dir = tf.keras.utils.get_file(origin=dataset_url,
                                   fname="images",
                                   untar=True)
data_dir = pathlib.Path(data_dir)
```

Which is output into two directories.

```python
train_ds = tf.keras.utils.image_dataset_from_directory(
  data_dir,
  validation_split=0.4,
  subset="training",
  seed=123,
  image_size=(img_height, img_width),
  batch_size=batch_size)
  
val_ds = tf.keras.utils.image_dataset_from_directory(
  data_dir,
  validation_split=0.4,
  subset="validation",
  seed=123,
  image_size=(img_height, img_width),
  batch_size=batch_size)
```

Each image in the training and validation set are scaled to a 256x256 image to keep things uniform for the model.

After the data is loaded, I augment the converting it to grey scale, flipping thme by adding some randomisation to it to help with training (more details below).

### The model

If you are familiar with ML training, you can look at the [Colab](https://colab.research.google.com/drive/1njX4Sd-6rfM594ACFx9mS3DHJrGfGdr4#scrollTo=eUC1hx6vezgI) that I have created. In terms of ML, it's relatively standard. A convolution network with three layers that spits has two classes: button or text link

```python
model = tf.keras.Sequential([
  tf.keras.layers.Conv2D(32, 3, activation='relu', input_shape=[img_height, img_width, 1]),
  tf.keras.layers.GaussianNoise(0.01),
  tf.keras.layers.MaxPooling2D(),
  tf.keras.layers.Conv2D(32, 3, activation='relu'),
  tf.keras.layers.MaxPooling2D(),
  tf.keras.layers.Conv2D(32, 3, activation='relu'),
  tf.keras.layers.MaxPooling2D(),
  tf.keras.layers.Flatten(),
  tf.keras.layers.Dense(128, activation='relu'),
  tf.keras.layers.Dense(num_classes) #  activation='softmax' ??
])
```

One interesting thing, I added some noise to the training data as I found it gave me better results for images the model has never seen before.

There is a lot more code around the edges that I needed to try and standardise the data.

### Things I have learnt

A lot of time went into cleaning up the training data so I ended up doing a number of things to improve the output of the model. I'd like to say a lot of the changes I made were based on insight and experience, however in reality I had to experiment a lot and that was rather time consuming.

I've documented some of the issues that I had so that maybe they will be useful for anyone else that is new to ML and is looking for things to experiement with.

* Early models seemed to classify buttons as links if the colour was different.
  *Attempt*: I first changed randomly changed the hue of all my images, however that massively slowed down training as I wanted to train on the original images and then add in the new hues. It didn't really help with classification.
  *Best solution so far*: Change the image to grayscale, not only is there less data to train on (it seemed to speed up) the colour vairance became less of an issue and I didn't have to randomly change they hue.
 
* The model seems to identify text, specifically when the word "here" or "button" is present.
  *Attempt*: The training data is off sites that I own and there is a lot of buttons with the same text. It appears that the feature extaction in the CNN picked this up.
  *Best solution so far*: Get better data. I added in a number of sites that that use multiple languages to try and add veriatey.

* Sometimes the same image button but with a couple of pixels different had a different result.
  *Attempt 1*: Add some random rotations `train_ds = train_ds.map(lambda x, y: (tf.keras.layers.RandomRotation((-0.05, 0.05))(x), y))` on images to give some varaiance to the data. This didn't make any difference other than bloat the training set because in the wild there are very very few links or buttons that aren't in landscape orientation.
  *Attempt 2*: On inspection of the input data, some images had jpeg compression artifacts so I tried to use `train_ds = train_ds.map(lambda x, y: (tf.image.adjust_jpeg_quality(x, 75), y))` however it no longer returns an image tensor (seems like a bug), so in the link scraper software I now also create a heavily compressed version of the image. This yielded better results.
  *Best solution so far*: Added some random noise to all the images. This increased the accuracy of the the validation set and also my testing in the wild. My suspicion is that the variation means it doesn't overfit as much.

### Next steps

I want to get this into production, so I am going to work on two things:

1. Build a web app tool to help me test quickly and see if I can get TensorFlow working
2. Build a Lighthouse Audit that will look at the links on a page and create a report.