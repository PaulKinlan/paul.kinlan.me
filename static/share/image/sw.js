onfetch = async () => {
  const url = new URL(event.request.url);

  if (event.request.method !== 'POST') {
    event.respondWith(fetch(event.request));
    return;
  }

  // Don't care about other-origin URLs
  if (url.origin !== location.origin) return;

  if (url.pathname === '/share/image/' && url.searchParams.has('share-target')) {
    const dataPromise = event.request.formData();
    // Serve the page from the cache:

    event.respondWith(async function () {
      return fetch('/share/image/');
    }());

    event.waitUntil(async function () {
      const client = await self.clients.get(event.resultingClientId);
      const data = await dataPromise;
      const file = data.get('file');

      console.log(file, data)
      client.postMessage({ file, action: 'load-image' });
    }());

    return;
  }
};