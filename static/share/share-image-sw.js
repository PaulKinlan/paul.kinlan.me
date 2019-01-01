onfetch = () => {
  const url = new URL(event.request.url);

  // Don't care about other-origin URLs
  if (url.origin !== location.origin) return;

  if (url.pathname === '/share/submit-image' && url.searchParams.has('share-target')) {
    serveShareTarget(event);
    return;
  }
};