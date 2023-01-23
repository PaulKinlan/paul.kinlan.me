
---
title: ML 
date: 2022-12-14T13:56:32.221Z
type: entry
slug: ml
---
* Things I need to research
  * [Neural machine translation with a Transformer and Keras  |  Text  |  TensorFlow](https://www.tensorflow.org/text/tutorials/transformer)
* Project idea
  * Links that look like Buttons
    * Prior research: [Classify web page elements: An ML proof-of-concept | by Chang Xiao | Trakr | Medium](https://medium.com/trakr/classify-web-page-elements-an-ml-proof-of-concept-2d0f2fee355f)
    * Code:
      * Find Pages that contain buttons `SELECT page FROM 'httparchive.all.pages' WHERE date = "2022-07-01" and payload like '%<button%' and is_root_page = true LIMIT 1000`
      * [GitHub - PaulKinlan/button-and-link-scraper](https://github.com/PaulKinlan/button-and-link-scraper) - something that will scrape pages to get some training data.
        * Find all the buttons for training
        * Find all the links for validation... Need to classify this properly as there are things that look like buttons.
* Useful links
  * [Build convolutions and perform pooling  |  Google Developers](https://developers.google.com/codelabs/tensorflow-3-convolutions#0)

