onfetch = async (event) => {
  const url = new URL(event.request.url);

  if (event.request.method !== 'POST') return;

  if (url.pathname === '/share/image/') {
    const dataPromise = event.request.formData();
   
    event.respondWith(async function () {
      return fetch('/share/image/');
    }());

    event.waitUntil(async function () {
      const client = await self.clients.get(event.resultingClientId || event.clientId);
      const data = await dataPromise;
      const file = data.get('file');

      console.log('file',file, data)
      client.postMessage({ file, action: 'load-image' });
    }());

    return;
  }
};