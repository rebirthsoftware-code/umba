/* Umba service worker: çevrimdışı yedek sayfa + statik varlık önbelleği. API ve dinamik sayfalar her zaman ağdan. */
const VERSION = "umba-v1";
const STATIC = `${VERSION}-static`;
const PAGES = `${VERSION}-pages`;
const OFFLINE_URL = "/offline";
const NETWORK_ONLY = [/^\/api\//, /^\/yonetim/, /^\/odeme/, /^\/sepet/, /^\/siparis-/];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PAGES).then((c) => c.addAll([OFFLINE_URL, "/icons/icon-192.png", "/icons/admin-192.png"])).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Sayfa gezintileri: ağ öncelikli, çevrimdışıysa önbellek, o da yoksa /offline
  if (req.mode === "navigate") {
    const networkOnly = NETWORK_ONLY.some((re) => re.test(url.pathname));
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (!networkOnly && res.ok) caches.open(PAGES).then((c) => c.put(req, res.clone()));
          return res;
        })
        .catch(async () => (await caches.match(req)) || (await caches.match(OFFLINE_URL))),
    );
    return;
  }

  // Derleme çıktıları: önbellek öncelikli (içerik adresli, değişmez)
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(caches.open(STATIC).then(async (c) => (await c.match(req)) || fetch(req).then((res) => (c.put(req, res.clone()), res))));
    return;
  }

  // Görseller ve ikonlar: önbellekten ver, arkada yenile
  if (/^\/(products|hero|categories|story|brand|icons)\//.test(url.pathname)) {
    event.respondWith(
      caches.open(STATIC).then(async (c) => {
        const cached = await c.match(req);
        const network = fetch(req).then((res) => (res.ok && c.put(req, res.clone()), res)).catch(() => cached);
        return cached || network;
      }),
    );
  }
});

/* ---------- Anlık bildirimler (yönetim) ---------- */
self.addEventListener("push", (event) => {
  let data = { title: "Umba", body: "", url: "/yonetim", tag: undefined };
  try {
    data = { ...data, ...event.data.json() };
  } catch {
    data.body = event.data ? event.data.text() : "";
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/admin-192.png",
      badge: "/icons/admin-192.png",
      tag: data.tag,
      renotify: Boolean(data.tag),
      data: { url: data.url },
      vibrate: [120, 60, 120],
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || "/yonetim", self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      const existing = list.find((c) => c.url.startsWith(new URL("/yonetim", self.location.origin).href));
      if (existing) return existing.navigate(url).then((c) => c && c.focus());
      return self.clients.openWindow(url);
    }),
  );
});
