navigator.serviceWorker.register('/sw.js')
.then(function(registration) { },
        function(e) { console.log("Service Worker Failure", e); });

document.addEventListener('click', function(e) {
  var target = e.target;
  if (target.nodeName === 'DIV' && target.classList.contains('share')) {
      e.preventDefault();

      var shareUrl = target.getAttribute('url') || '';
      var shareTitle = target.getAttribute('title') || '';
      if (navigator.share) {
      navigator.share({
          url: shareUrl,
          title: shareTitle,
          text: shareTitle
      }).then(function() { ga('send', 'event', 'share', 'success'); },
              function() { error => ga('send', 'event', 'share', 'error', error); } );
      } else {
      var windowOptions = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=520,height=420';
      var twitterUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareTitle) + '&url=' + encodeURIComponent(shareUrl) + '&via=Paul_Kinlan';

      window.open(twitterUrl, 'intent', windowOptions);
      }
  }
});

window.addEventListener("load", function() {
  var iframes = document.getElementsByTagName("iframe");
  for(var i = 0; i < iframes.length; i++) {
    var ifr = iframes[i];
    if(ifr.hasAttribute("data-src")) {
      var src = ifr.getAttribute("data-src");
      ifr.setAttribute("src", src);
    }
  }
});

window.onbeforeinstallprompt = function(e) {
  e.preventDefault();
  ga('send', 'event', 'install', 'prompt');
};