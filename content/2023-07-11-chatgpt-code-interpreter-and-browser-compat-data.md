---
slug: chatgpt-code-interpreter-and-browser-compat-data
date: '2023-07-11T11:51:48'
title: Chat GPT Code Interpreter and Browser Compat Data
published: false
tags:
- bcd
- browser compat data
- ml
- chat gpt
draft: false
---

One of the problems that I have with LLMs is knowing when they will be useful and how to apply them to any given problem. A lot of it just feels alien to me because with a background in computer programing I\'ve been trained over 30 years that we frequently will get a deterministic set of results.

I like to experiment and break new mental ground, so when I saw that Chat GPT had a code interpreter, I was was interested and yet had no clue what I would do with it.

I had a bit of a think, and my [side-passion is querying the BCD](https://paul.kinlan.me/bcd-a-hidden-web-compat-gem/) ([Browser Compat Data](https://github.com/mdn/browser-compat-data)) project for interesting information. BCD is a repository of features that are available to web browsers and their availability in them, for example: CSS Grid and Flexbox support.

The BCD project is accessible as a [large JSON file](https://unpkg.com/@mdn/browser-compat-data/data.json) and in many previous projects I create scripts or websites to parse the data, for example:

* [BCD Training](https://bcd-training.deno.dev/) ([source](https://github.com/PaulKinlan/bcd-training)) - a web page with human readable versions of the data so it can be used in the LLM attached to [Ask Paul](https://paul.kinlan.me/ask-paul)

* [Time to Stable](https://time-to-stable.deno.dev/) ([source](https://github.com/PaulKinlan/time-to-stable)) - a web page that finds interesting stats about feature availability across browsers. Which browser is a sprinter and which is a plodder? or Which APIs are [experimental](https://paul.kinlan.me/bcd-experimental-apis/), etc

* [Baseline](https://baseline.deno.dev/) ([source](https://github.com/PaulKinlan/baseline)) - a web page that lists all the APIs that came to a the web in a given year. I use it to get a picture of what the [Baseline project](https://web.dev/introducing-baseline/) might look like each year

These projects can take a little while to create as I build a parser and display logic and then a website around it. I thought it might be neat to see if the Code Interpreter could take some of this burden off me.

**TL;DR** - It can.

I\'m very interested in Browser velocity, that is how quickly do browsers update, so I wanted to see if it could build some tools to analyse this data.

First up, I downloaded the [JSON file](https://unpkg.com/@mdn/browser-compat-data/data.json) and uploaded it to the new [Chat GPT model.](https://chat.openai.com/?model=gpt-4-code-interpreter)

I know the file format so I had a bit of head start, so I asked it something simple. \"Find me the most recent versions of each browser.\"

![Screenshot 2023-07-11 at 14.09.48.png](/images/Screenshot%202023-07-11%20at%2014.09.48.png)

It\'s wrong, but it\'s kind of incredible to watch it build the code that parses the file format and produces something that could work.

I suggested that it was wrong because Chrome is already a different version

![Screenshot 2023-07-11 at 14.09.58.png](/images/Screenshot%202023-07-11%20at%2014.09.58.png)

It was incredible to see it adjust the algorithm to change how it parses the version number, however it was still wrong because it was showing future versions of browsers that haven\'t hit stable yet, so I simple suggested an improvement \"Close, but some of those have a \'release\_date\' after today. Can you get only the latest released versions of the browsers?\"

![Screenshot 2023-07-11 at 14.10.07.png](/images/Screenshot%202023-07-11%20at%2014.10.07.png)

Damn!

All in all it\'s pretty great. Something that would have taken me about 30 minutes to make was created in about 2 minutes and a great thing is that it has the script so that you can run it locally too.

Yes, technically there are some errors for example if you check the code below you will see it tries to convert the browser version to an integer, yet some browsers have x.y.z versioning.... Yet, I\'m still blown away.

```python
from datetime import datetime
import json

# Load JSON file
with open('/mnt/data/data (1).json', 'r') as f:
    data = json.load(f)

# The issue might be related to the version numbers being treated as strings rather than numbers. 
# This can result in "99" being considered larger than "110" because "9" is larger than "1" in string comparison.

# To fix this, we need to convert the version numbers to integers where possible for the comparison. 
# However, we need to handle cases where the version number is not a simple integer (e.g., "9.3.0").

def convert_version_to_int(version):
    # Try to convert the version to an integer
    try:
        return int(version)
    except ValueError:
        # If that fails, convert the first part of the version to an integer
        try:
            return int(version.split('.')[0])
        except ValueError:
            # If that still fails, return the version as is
            return version


# Function to convert a string to a datetime object
def convert_string_to_date(date_string):
    return datetime.strptime(date_string, "%Y-%m-%d")

# Get today's date
today = datetime.now()

# Let's inspect the 'browsers' key
browsers_data = data['browsers']

# Initialize an empty dictionary to store the most recent version of each browser
recent_versions = {}

# Loop over each browser
for browser, details in browsers_data.items():
    # Get the 'releases' field which contains version information
    releases = details.get('releases', {})

    # Filter out versions where the release date is in the future
    releases = {version: details for version, details in releases.items()
                if 'release_date' in details and convert_string_to_date(details['release_date']) <= today}
    
    # Convert the versions to integers where possible
    releases = {convert_version_to_int(version): version for version in releases.keys()}
    
    # Get the most recent version
    recent_version = max(releases.keys(), default='No releases found')
    # Map the recent version back to its original string representation
    recent_version = releases[recent_version]
    recent_versions[browser] = recent_version

recent_versions
```

![Screenshot 2023-07-11 at 14.25.23.png](/images/Screenshot%202023-07-11%20at%2014.25.23.png)Absolutely amazing! I think the summary is great too. The only nit right now is that the colours are hard to distinguish.

![Screenshot 2023-07-11 at 11.23.03.png](/images/Screenshot%202023-07-11%20at%2011.23.03.png)It kept all the context amazingly well, but as I was reading this, but the IE outlier make it hard to see what\'s happening today, so I asked it to \"Remove some of the outliers\"

![Screenshot 2023-07-11 at 14.29.31.png](/images/Screenshot%202023-07-11%20at%2014.29.31.png)Much clearer, but also WOW! Just by looking at the data there are stories that I can see :D

I\'m not sure this post does my reaction any justice. I was completely blown away! Yes it\'s not an amazingly complex example, but I got to an output that I found incredibly useful in minutes and it\'s now left me thinking what else can I do with it.

If you are interested in the final code it generated check out this [gist](https://gist.github.com/PaulKinlan/7f25055ac899e1667a6f80119d7c3b05).

Let me know if you\'ve played with the Code Interpreter, I\'m certainly keen to learn more about how you are using it so that I can work out where I can take better advantage of it.
