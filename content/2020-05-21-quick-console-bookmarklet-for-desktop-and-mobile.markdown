---
date: 2020-05-21 22:00:47.030000+00:00
link: ''
slug: quick-console-bookmarklet-for-desktop-and-mobile
summary: This blog post introduces a simple bookmarklet that provides quick access
  to a webpage's JavaScript console logs, warnings, and errors directly on desktop
  and mobile devices.  It eliminates the need for connecting to Chrome DevTools, especially
  useful for quick debugging on mobile. The bookmarklet creates a small, expandable
  element at the bottom of the page that displays console outputs and keeps a running
  tally.  It intercepts calls to console.log, console.warn, and console.error, displaying
  the messages in the created element while preserving their appearance in actual
  DevTools.  While not a full DevTools replacement, it's a handy tool for quick insights
  and debugging on the go.
tags:
- bookmarklet
- console
- devtools
- mobile debugging
- JavaScript
- quick debug
- on-the-go debugging
title: Quick Console bookmarklet for Desktop and Mobile

---

Sometimes when I am on my mobile, I just want quick access to the JS console so that I can see what is going on inside the web page: Does the page have any logs, warnings or errors etc; without having to plug my phone into a laptop and hooking up to Chrome DevTools.

I really wish you could use DevTools more easily on a mobile device. That being said, I have a partial solution that solves my problem.

Now that I know how to access [bookmarklets](/use-bookmarklets-on-chrome-on-android/), I realised it might be possible to create a simple tool that will show me the `console` log of what is happening on the page.

If you want to experiment with this, just drag this <a href='javascript:(function()%7B(function() %7Bconst id %3D "consoleElement12312312khfasdakh"%3Bif (document.getElementById(id) %3D%3D%3D undefined) return%3Bconst consoleElement %3D document.createElement("details")%3BconsoleElement.id %3D id%3Bconst scopedStyle %3D document.createElement("style")%3Bconst container %3D document.createElement("div")%3BscopedStyle.innerText %3D %60%23%24%7Bid%7D %7Bposition%3A fixed%3Bmax-height%3A 5em%3Bbottom%3A 0px%3Bleft%3A 0px%3Bborder%3A 1px solid red%3Bz-index%3A 100%3Bbackdrop-filter%3A blur(5px)%3Bpadding-left%3A 1em%3Bfont-family%3A monospace%3Bmargin%3A 1em%3Bbackground-color%3A rgba(250%2C 235%2C 215%2C 0.4)%3B%7D%23%7Bid%7D%5Bopen%5D %7Bright%3A 0px !important%3Bheight%3A 5em%3B%7D%23%7Bid%7D%3Anot(open) summary %7Bpadding-right%3A 1em%3B%7D%23%24%7Bid%7D div %7Bheight%3A 3em%3Bmax-height%3A 3em%3Boverflow%3A auto%3B%7D%23%24%7Bid%7D p %7Bfont-size%3A 12px%3B%7D%23%24%7Bid%7D p.log%3Abefore %7Bcontent%3A "Log%3A "%3B%7D%23%24%7Bid%7D  p.warn %7Bcolor%3A orange%3Bborder-top%3A solid 1px orange%3Bborder-bottom%3A solid 1px orange%3B%7D%23%24%7Bid%7D p.warn%3Abefore %7Bcontent%3A "Warn%3A "%3B%7D%23%24%7Bid%7D p.error %7Bcolor%3A red%3Bborder-top%3A solid 1px red%3Bborder-bottom%3A solid 1px red%3B%7D%23%24%7Bid%7D p.error%3Abefore %7Bcontent%3A "Error%3A "%3B%7D%60%3Bconst summary %3D document.createElement("summary")%3Bsummary.innerText %3D "Console%3A L%3A 0%2C W%3A 0%2C E%3A 0"%3BconsoleElement.appendChild(scopedStyle)%3BconsoleElement.appendChild(summary)%3BconsoleElement.appendChild(container)%3Bconst log %3D console.log.bind(console)%3Bconst error %3D console.error.bind(console)%3Bconst warn %3D console.warn.bind(console)%3Bconst count %3D %7B%7D%3Bconst output %3D function(type%2C fn%2C ...args) %7Bconst logElement %3D document.createElement("p")%3Bif (type in count %3D%3D false) count%5Btype%5D %3D 0%3Bcount%5Btype%5D%2B%2B%3BlogElement.className %3D type%3Bcontainer.appendChild(logElement)%3BlogElement.innerText %3D %60%24%7Bargs%7D%60%3Bsummary.innerText %3D %60Console%3A L%3A %24%7Bcount%5B"log"%5D %7C%7C 0%7D%2C W%3A %24%7Bcount%5B"warn"%5D %7C%7C 0%7D%2C E%3A %24%7Bcount%5B"error"%5D %7C%7C 0%7D%60%3Bfn(...args)%3B%7D%3Bconsole.log %3D function(...args) %7Boutput("log"%2C log%2C ...args)%3B%7D%3Bconsole.warn %3D function(...args) %7Boutput("warn"%2C warn%2C ...args)%3B%7D%3Bconsole.error %3D function(...args) %7Boutput("error"%2C error%2C ...args)%3B%7D%3Bdocument.body.appendChild(consoleElement)%3B%7D)()%7D)()'>Developer Console</a> link to your bookmarks bar.

The above link when clicked will open up a small `detail` element anchored to the bottom of the page, when opened will show all of the console logs, warnings and errors since the bookmark was activated (it can't retrospectively access what was added to the log beforehand).

It's a simple tool, but it gives me just enough insight (especially if you like to debug with `console.log`)

Below is a quick video showing how the bookmarklet works:

<figure><video src="/videos/2020-05-21-quick-console-bookmarklet-for-desktop-and-mobile-0.mp4" alt="A bookmarklet that shows the console logs" controls></video></figure>

The code for the bookmarklet is below:

```JavaScript
(function() {
  const id = "consoleElement12312312khfasdakh";
  if (document.getElementById(id) === undefined) return;
  const consoleElement = document.createElement("details");
  consoleElement.id = id;

  const scopedStyle = document.createElement("style");
  const container = document.createElement("div");
  scopedStyle.innerText = `
#${id} {
  position: fixed;
  max-height: 5em;
  bottom: 0px;
  left: 0px;
  border: 1px solid red;
  z-index: 100;
  backdrop-filter: blur(5px);
  padding-left: 1em;
  font-family: monospace;
  margin: 1em;
  background-color: rgba(250, 235, 215, 0.4);
}

#{id}[open] {
 right: 0px !important;
 height: 5em;
}

#{id}:not(open) summary {
 padding-right: 1em;
}

#${id} div {
  height: 3em;
  max-height: 3em;
  overflow: auto;
}

#${id} p {
  font-size: 12px;
}

#${id} p.log:before {
  content: "Log: ";
}

#${id} p.warn {
  color: orange;
  border-top: solid 1px orange;
  border-bottom: solid 1px orange;
}

#${id} p.warn:before {
  content: "Warn: ";
}

#${id} p.error {
  color: red;
  border-top: solid 1px red;
  border-bottom: solid 1px red;
}

#${id} p.error:before {
  content: "Error: ";
}`;

  const summary = document.createElement("summary");
  summary.innerText = "Console: L: 0, W: 0, E: 0";
  consoleElement.appendChild(scopedStyle);
  consoleElement.appendChild(summary);
  consoleElement.appendChild(container);

  const log = console.log.bind(console);
  const error = console.error.bind(console);
  const warn = console.warn.bind(console);

  const count = {};

  const output = function(type, fn, ...args) {
    const logElement = document.createElement("p");
    if (type in count == false) count[type] = 0;
    count[type]++;
    
    summary.innerText = `Console: L: ${count["log"] || 0}, W: ${count["warn"] ||
      0}, E: ${count["error"] || 0}`;
    
    logElement.className = type;
    logElement.innerText = `${args}`;
    container.appendChild(logElement);
    
    logElement.scrollIntoView({behavior: "smooth", block: "start" });

    fn(...args);
  };

  console.log = function(...args) {
    output("log", log, ...args);
  };

  console.warn = function(...args) {
    output("warn", warn, ...args);
  };

  console.error = function(...args) {
    output("error", error, ...args);
  };

  document.body.appendChild(consoleElement);
})();
```

When clicked we create a `details` element, a set of styles, a summary element (that contains a running tally of the console logs) and a container that will hold all the logs and add it to the page.

We then intercept every call to `console.log`, `console.warn` and `console.error`, add the details to the `details` container and then invoke the original log (so that it will actually appear in DevTools).

And, that's about it. It's a simple utility that's not supposed to replace proper devtools, but it can quickly help you find an issue in the page without any extra tooling required.

