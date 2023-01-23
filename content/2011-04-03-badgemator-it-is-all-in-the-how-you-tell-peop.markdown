---
slug: badgemator-it-is-all-in-the-how-you-tell-peop
date: 2011-04-03
title: Badgemator .... it is all in the how you tell people about your app
---
<p>Telling people about your web app in the <a href="https://chrome.google.com/webstore">Chrome Web Store</a> is just as important as making your landing page rock.  The more people that you can drive to your detail page the better your application will do, but you want to do it in a targeted way.</p>

<p>For this reason I created <a href="http://badgemator.appspot.com/">Badgemator</a> &ndash; an app that creates badges for you to put on your website.  It is about a month old, so why am I telling you now?  Well the answer is simple, I posted it on twitter, and then forgot to post this blog &ndash; DOH!</p>

<p>It is an interesting project because it does a couple of cool things that make it super easy for you to use.</p>

<ul>
<li>All you need is your Web Store URL &ndash; for example see <a href="http://badgemator.appspot.com/#https://chrome.google.com/webstore/detail/dhbgookgdfbbinnmmkbmjgolhikbbhpj">http://badgemator.appspot.com/#https://chrome.google.com/webstore/detail/dhbgookgdfbbinnmmkbmjgolhikbbhpj</a> to get started.</li>
<li>It is self contained &ndash; it base64 encodes your initial logo and css so that all you need to do is drop a single script tag into your HTML and BOOM, you have a great looking badge with no extra HTTP requests.  Check out the source of <a href="http://appmator.appspot.com/">Appmator</a> and you will see there is a simple html tag that points to an <a href="http://appmator.appspot.com/js/badge.js">embedded script</a>.</li>
<li>It will only appear for Chrome users.</li>
<li>If installed on your app, it will detect if your app is installed using the window.chrome.app.isInstalled variable and not show it to users who already have your app running.</li>
<li>It will scan your listing page and pluck out all the important information including your Logo</li>
<li>The default style is 'basic' to say the least, but you can style this up to look however ever you want, it could look like the Butter bar, or it could be some crazy 3d transform.</li>
</ul>


<p>My good friend <a href="http://softwareas.com">Mike Mahemoff</a> suggested a neat use of URL fragments a while ago to enable quick sharing of links, hence you will see all my services support #URL at the end, so that if you wanted you could share it on Twitter and any reader would see the completed action &ndash; most of my service logic is on the client side.</p>

<p>I really need some more designs for default badges, so feel free to <a href="http://github.com/PaulKinlan/badgemator">fork this project</a> and make some changes to the CSS and I will incorporate it into the project and give you credit and links from the app.</p>

