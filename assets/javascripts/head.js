(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-114468-20', 'auto');
ga('send', 'pageview');

if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
  .then(function(registration) { },
        function(e) { console.log("Service Worker Failure", e); });
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

window.addEventListener("load", function() {
  var iframes = document.getElementsByTagName("iframe");
  for(var i = 0; i < iframes.length; i++) {
    var ifr = iframes[i];
    if(ifr.hasAttribute("data-src")) {
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

  for(var shareButton of shareButtons) {
    shareButton.addEventListener("click", function(event) {
      event.preventDefault();
      var shareUrl = event.target.getAttribute('url') || '';
      var shareTitle = event.target.getAttribute('title') || '';
      if (navigator.share) {
      navigator.share({
          url: shareUrl,
          title: shareTitle,
          text: shareTitle
      }).then(function() { ga('send', 'event', 'share', 'success'); },
              function(error) { ga('send', 'event', 'share', 'error', error); } );
      } else {
        var windowOptions = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=520,height=420';
        var twitterUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareTitle) + '&url=' + encodeURIComponent(shareUrl) + '&via=Paul_Kinlan';
        window.open(twitterUrl, 'intent', windowOptions);
      }
    });
  }
});

window.onbeforeinstallprompt = function(e) {
  e.preventDefault();
  ga('send', 'event', 'install', 'prompt');
};