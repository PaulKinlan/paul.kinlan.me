onfetch = async (event) => {
  if (event.request.method !== 'POST') return;
  if (event.request.url.startsWith('https://paul.kinlan.me/share/image/') === false) return;

  event.respondWith(Response.redirect('/share/image/'));
  
  event.waitUntil(async function () {
    const data = await event.request.formData();
    const client = await self.clients.get(event.resultingClientId || event.clientId);
    const files = data.getAll('files');

    console.log('files', files);
    client.postMessage({ files, action: 'load-image' });
  }());
};

oninstall = () => {
  skipWaiting();
};

onactivate = () => {
  clients.claim();
};