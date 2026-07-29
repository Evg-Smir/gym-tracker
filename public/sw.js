const CACHE_NAME = 'gym-tracker-v2';

const getBasePath = () => {
  try {
    const pathname = new URL(self.registration.scope).pathname.replace(/\/$/, '');
    return pathname || '';
  } catch {
    return '';
  }
};

const withBase = (path) => `${getBasePath()}${path}`;

self.addEventListener('install', (event) => {
  const precacheUrls = ['/', '/auth/', '/register/', '/manifest.webmanifest'].map(withBase);

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(precacheUrls)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
    ).then(() => self.clients.claim()),
  );
});

const isFirebaseRequest = (url) =>
  url.hostname.includes('googleapis.com') ||
  url.hostname.includes('firebaseio.com') ||
  url.hostname.includes('firebasestorage.app') ||
  url.hostname.includes('identitytoolkit.googleapis.com') ||
  url.hostname.includes('securetoken.googleapis.com');

const isStaticAsset = (url) => {
  const base = getBasePath();
  return (
    url.pathname.startsWith(`${base}/_next/static/`) ||
    url.pathname.startsWith(`${base}/ui/`) ||
    url.pathname.startsWith(`${base}/categories/`)
  );
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (isFirebaseRequest(url)) return;

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        });
      }),
    );
    return;
  }

  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match(withBase('/'))),
        ),
    );
  }
});
