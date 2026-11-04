// The gtag bootstrap: queued commands are processed by gtag.js whenever it
// loads, so no inline snippet is needed and the CSP can drop 'unsafe-inline'
// (paul-kinlan-me-qz62).
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-V4DZ9TE0NV');

(function (i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
    (i[r].q = i[r].q || []).push(arguments)
  }, i[r].l = 1 * new Date(); a = s.createElement(o),
    m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-114468-20', 'auto');
ga('send', 'pageview');

if ('serviceWorker' in navigator) {
  // Killing off all known SW for this site.
  caches.keys().then((cacheKeys) => Promise.all(cacheKeys.map((key) => caches.delete(key))));
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}

const deferLoadIframe = (iframe) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const src = iframe.getAttribute("data-src");
        iframe.setAttribute("src", src);
        observer.unobserve(iframe);
      }
    });
  });
  observer.observe(iframe);
}

window.addEventListener("load", function () {
  var iframes = document.getElementsByTagName("iframe");
  for (var i = 0; i < iframes.length; i++) {
    var ifr = iframes[i];
    if (ifr.hasAttribute("data-src")) {
      if ('IntersectionObserver' in window) {
        deferLoadIframe(ifr);
      }
      else {
        var src = ifr.getAttribute("data-src");
        ifr.setAttribute("src", src);
      }
    }
  }

  var shareButtons = document.querySelectorAll('div.share');

  for (var shareButton of shareButtons) {
    shareButton.addEventListener("click", function (event) {
      event.preventDefault();
      var shareUrl = event.target.getAttribute('url') || '';
      var shareTitle = event.target.getAttribute('title') || '';
      if (navigator.share) {
        navigator.share({
          url: shareUrl,
          title: shareTitle,
          text: shareTitle
        }).then(function () { ga('send', 'event', 'share', 'success'); },
          function (error) { ga('send', 'event', 'share', 'error', error); });
      } else {
        var windowOptions = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=520,height=420';
        var twitterUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareTitle) + '&url=' + encodeURIComponent(shareUrl) + '&via=Paul_Kinlan';
        window.open(twitterUrl, 'intent', windowOptions);
      }
    });
  }
});

window.onbeforeinstallprompt = function (e) {
  e.preventDefault();
  ga('send', 'event', 'install', 'prompt');
};
// The newsletter form opens its confirmation in a popup window. The old
// inline onsubmit= attribute is blocked by the site CSP now that script-src
// carries no 'unsafe-inline' (paul-kinlan-me-qz62), so the same behaviour is
// wired here from the form's data-popup attribute. Like the original inline
// handler, this does not preventDefault: the form submits itself into the
// named popup window.
window.addEventListener('submit', function (event) {
  var form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  var popup = form.getAttribute('data-popup');
  if (popup && form.getAttribute('target') === 'popupwindow') {
    window.open(popup, 'popupwindow');
  }
}, true);
