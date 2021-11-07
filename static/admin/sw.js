onfetch = async (event) => {
  if (event.request.method !== "POST") return;
  if (event.request.url.startsWith("https://paul.kinlan.me/admin/") === false) {
    return;
  }

  event.respondWith(Response.redirect("/admin/"));
};

oninstall = () => {
  skipWaiting();
};

onactivate = () => {
  clients.claim();
};
