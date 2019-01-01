onfetch = async () => {
  const url = new URL(event.request.url);
  const clientId = event.clientId;
  const hostClient = await self.clients.get(clientId);

  // Don't care about other-origin URLs
  if (url.origin !== location.origin) return;

  if (url.pathname === '/share/submit-image' && url.searchParams.has('share-target')) {
    // Find the window that is open
    hostClient.postMessage({})

    return;
  }
};