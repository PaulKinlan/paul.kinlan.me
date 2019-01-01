onfetch = async (event) => {
  const url = new URL(event.request.url);
  console.log(url);

  if (event.request.method !== 'POST') {
    console.log(event.request.method);
    event.respondWith(fetch(event.request));
    return;
  }

  if (url.pathname === '/share/image/') {
    const dataPromise = event.request.formData();
   
    event.respondWith(async function () {
      return fetch('/share/image/');
    }());

    event.waitUntil(async function () {
      await new Promise(r => new BroadcastChannel('share-ready').onmessage = r);
      const client = await self.clients.get(event.resultingClientId);
      const data = await dataPromise;
      const file = data.get('file');

      console.log('file',file, data)
      client.postMessage({ file, action: 'load-image' });
    }());

    return;
  }
};