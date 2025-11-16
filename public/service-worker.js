const CACHE_NAME = "pwa-site-v1";
const urlsToCache = [
  "/",
  "/style.css",
  "/manifest.json",
  "/js/script.js",
  "/js/splash.js",
  "/icons/16.jpg",
  "/icons/32.jpg",
  "/icons/48.jpg",
  "/icons/64.jpg",
  "/icons/96.jpg",
  "/icons/128.jpg",
  "/icons/192.jpg",
  "/icons/256.jpg",
  "/icons/384.jpg",
  "/icons/512.jpg"
];



self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });
      return cached || fetchPromise;
    })
  );
});

self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data.json(); }
  catch { data = { title: "Bildirim", body: "Yeni bir mesajınız var!" }; }

  const options = {
    body: data.body,
    icon: "/icons/192.jpg",
    badge: "/icons/192.jpg",
    data: data.url || "/"
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
});



