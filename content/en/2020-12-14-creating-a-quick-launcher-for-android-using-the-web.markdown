---
slug: creating-a-quick-launcher-for-android-using-the-web
date: 2020-12-14T15:52:23.844Z
title: Creating a quick launcher for Android using the web
link: ''
tags: [pwa, shortcuts, serviceworker]
---

The web is a powerful thing, with the right capabilities you can create tools and services that can be deployed without a central authority and can also deeply integrate with the peoples devices.

I love being able to tinker and scratch an itch quickly.

The itch in question was that I'm a heavy user of .new domains and I wanted a quick way to have access to them on my Android home screen so that I can start a task without having to find the app, go through its menus and then create the "new" thing.

If you're not well versed in .new domains, they're great. Want to create an email? [mail.new](https://mail.new/). Want a doc? [docs.new](https://docs.new).... etc etc. The .new domains are simple shortcuts to deep-linked functionality.

[shortcut.cool](https://shortcut.cool) is the demo I built. It lets you create any number of shortcuts that you can then install as a PWA onto your homescreen.

<figure><img src="/images/2020-12-14-creating-a-quick-launcher-for-android-using-the-web-0.jpeg" alt="Shortcut new"></figure>

## How does it work?

Before I get too far into the weeds, at a high-level this is a PWA. The PWA has a small service worker and a web app manifest. The manifest defines how your PWA should be installed and launched, and it is also what defines the list of shortcuts that you might want to be on your home screen (checkout [shortcuts](https://web.dev/app-shortcuts/) in the web app manifest).&nbsp;

The entire site is a configuration tool for custom web app manifests.

At a deeper level, the demo is a small nodeJS express service that takes user configuration that is passed in from the query string, decodes it, and returns a valid manifest file as follows:

```javascript
app.get("/:actions/manifest.json", (request, response) => {
  let buff = Buffer.from(request.params.actions, "base64");
  let actions = JSON.parse(buff.toString("ascii"));

  const shortcuts = actions.map(({ name, url }) => {
    return {
      name,
      url: `/${request.params.actions}/launch?url=${url}`,
      icons: [
        {
          src: "images/ic_launcher.png",
          sizes: "192x192",
        },
      ],
    };
  });

  response.json({
    name: "shortcut.cool",
    short_name: "shortcut.cool",
    background_color: "#E91E63",
    theme_color: "#E91E63",
    display: "standalone",
    icons: [
      {
        sizes: "192x192",
        src: "images/ic_launcher.png",
        type: "image/png",
        purpose: "maskable",
      },
      {
        sizes: "512x512",
        src: "images/web_hi_res_512.png",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: shortcuts,
    start_url: `/${request.params.actions}/`,
  });
});
```

If you're familiar with nodeJS you can see that the architecture of this site is not too complex, but it does require some explaining. The site has a basic user interface that takes in the user's desired configuration of site names and launch URLs.

<figure><img src="/images/2020-12-14-creating-a-quick-launcher-for-android-using-the-web-1.jpeg" alt="The UI"></figure>

When the user hits 'Create Launcher' the site encodes the configuration into the URL with the format `/[base64 encoding of url and name pairs]/`.

<figure><img src="/images/2020-12-14-creating-a-quick-launcher-for-android-using-the-web-2.jpeg" alt="The URL"></figure>

With this URL format, each distinct configuration has its own custom directory, its own service worker and manifest for its scope, with all of the required images relative to the new PWA. The launch url for each shortcut is also locked to the PWA - and is a simple redirect based on a `url` parameter.

This method of encoding the data in the URL worked well because it meant I don't have to store any state in on the server, which means I don't have to have user accounts or databases, and when the URL changes the updated manifest and service worker mean that Chrome will offer to install this new experience. 

It does have a couple of drawbacks. By using a URL to encode the data, it can be quite brittle. While I don't think there's a major issue, encoding and rendering user inputted data is a recipe for potential security issues and although I've tested it fairly well, it's, well, a known area of potential concern. And finally, you can't update your existing installed PWA - because configurations are distinct PWA's and are unique to the data entered, the one you create will always be the way you configured it. Any change you make to the configuration will be considered a new PWA.

Anyway, I love how the web let's me mess about like this and try simple new services. If you want to have a look at how I built it, the code is up on my [github](https://github.com/PaulKinlan/quick.new).

