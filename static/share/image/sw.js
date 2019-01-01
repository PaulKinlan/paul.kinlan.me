onfetch = async (event) => {
  const url = new URL(event.request.url);
  console.log('service worker', event);

  if (event.request.method !== 'POST') {
    event.respondWith(fetch(event.request));
    return;
  }

  if (url.pathname === '/share/image/') {
    const dataPromise = event.request.formData();
   
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