function killSW() {
  self.registration.unregister();

  caches
    .keys()
    .then((cacheKeys) =>
      Promise.all(cacheKeys.map((key) => caches.delete(key)))
    );
}

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
  killSW();
});
