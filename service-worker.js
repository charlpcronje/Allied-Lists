// **service-worker.js**

const CACHE_NAME = 'pwa-list-app-cache-1';
const urlsToCache = [
    '/',
    '/index.html',
    '/main.html',
    '/login.js',
    '/app.js',
    '/service-worker.js',
    'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);

    // Check if the URL contains the reset parameter
    if (requestUrl.searchParams.has('reset')) {
        // Reset the cache
        event.respondWith(
            caches.delete(CACHE_NAME).then(() => {
                return fetch(event.request).then(response => {
                    if (response.ok && (requestUrl.protocol === 'http:' || requestUrl.protocol === 'https:')) {
                        return caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, response.clone());
                            return response;
                        });
                    }
                    return response;
                });
            })
        );
    } else {
        // Normal caching strategy
        event.respondWith(
            caches.match(event.request)
            .then(response => {
                return response || fetch(event.request).then(fetchResponse => {
                    if (fetchResponse.ok && (requestUrl.protocol === 'http:' || requestUrl.protocol === 'https:')) {
                        return caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, fetchResponse.clone());
                            return fetchResponse;
                        });
                    }
                    return fetchResponse;
                });
            })
        );
    }
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});