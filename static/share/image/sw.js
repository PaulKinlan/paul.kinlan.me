onfetch = async (event) => {
  if (event.request.method !== 'POST') return;

  event.respondWith(Response.redirect('/share/image/'));
  
  event.waitUntil(async function () {
    const data = await event.request.formData();
    const client = await self.clients.get(event.resultingClientId || event.clientId);
    const file = data.get('file');

    console.log('file', file, data)
    client.postMessage({ file, action: 'load-image' });
  });
};

oninstall = () => {
  skipWaiting();
};

onactivate = () => {
  clients.claim();
};