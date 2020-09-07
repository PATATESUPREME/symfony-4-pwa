const filesToCache = [
    '/',
    '/build/runtime.js',
    '/build/app.css',
    '/build/app.js',
    '/offline',
    '/favicon.ico'
];

const staticCacheName = 'pages-cache-v2';

self.addEventListener('install', event => {
    console.log('Attempting to install service worker and cache static assets');
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    console.log('Fetch event for ', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log('Found ', event.request.url, ' in cache');
                    return response;
                }
                console.log('Network request for ', event.request.url);
                return fetch(event.request)
                    .then(response => {
                        return caches.open(staticCacheName)
                            .then(cache => {
                                cache.put(event.request.url, response.clone());
                                return response;
                            });
                    });
            }).catch(error => {
            console.log('Error, ', error);
            return caches.match('/offline');
        })
    );
});

self.addEventListener('activate', event => {
    console.log('Activating new service worker...');

    const cacheWhitelist = [staticCacheName];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
// console.log('Workbox', workbox);
//
// if (workbox) {
//     console.log(`Yay! Workbox is loaded 🎉`);
//
//     workbox.precaching.precacheAndRoute([]);
//
//     workbox.routing.registerRoute(
//         /(.*)articles(.*)\.(?:png|gif|jpg)/,
//         workbox.strategies.cacheFirst({
//             cacheName: 'images-cache',
//             plugins: [
//                 new workbox.expiration.Plugin({
//                     maxEntries: 50,
//                     maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
//                 })
//             ]
//         })
//     );
//
//     const articleHandler = workbox.strategies.networkFirst({
//         cacheName: 'articles-cache',
//         plugins: [
//             new workbox.expiration.Plugin({
//                 maxEntries: 50,
//             })
//         ]
//     });
//
//     workbox.routing.registerRoute(/(.*)article(.*)\.html/, args => {
//         return articleHandler.handle(args).then(response => {
//             if (!response) {
//                 return caches.match('pages/offline.html');
//             } else if (response.status === 404) {
//                 return caches.match('pages/404.html');
//             }
//             return response;
//         });
//     });
//
// } else {
//     console.log(`Boo! Workbox didn't load 😬`);
// }
