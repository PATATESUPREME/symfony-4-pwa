self.addEventListener('fetch', event => {
    if (event.request.method === 'GET') {
        console.log('Fetch event for ', event.request.url);

        // Should we call event.respondWith() inside this fetch event handler?
        // This needs to be determined synchronously, which will give other fetch
        // handlers a chance to handle the request if need be.
        let shouldRespond;

        // First, remove all the ignored parameters and hash fragment, and see if we
        // have that URL in our cache. If so, great! shouldRespond will be true.
        let url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
        shouldRespond = urlsToCacheKeys.has(url);

        // If shouldRespond is false, check again, this time with 'index.html'
        // (or whatever the directoryIndex option is set to) at the end.
        let directoryIndex = 'index.html';
        if (!shouldRespond && directoryIndex) {
            url = addDirectoryIndex(url, directoryIndex);
            shouldRespond = urlsToCacheKeys.has(url);
        }

        // If shouldRespond is still false, check to see if this is a navigation
        // request, and if so, whether the URL matches navigateFallbackWhitelist.
        let navigateFallback = '/offline';
        if (!shouldRespond &&
            navigateFallback &&
            (event.request.mode === 'navigate') &&
            isPathWhitelisted([], event.request.url)) {
            url = new URL(navigateFallback, self.location).toString();
            shouldRespond = urlsToCacheKeys.has(url);
        }

        // If shouldRespond was set to true at any point, then call
        // event.respondWith(), using the appropriate cache key.
        if (shouldRespond) {
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
                                return caches.open(cacheName)
                                    .then(cache => {
                                        cache.put(event.request.url, response.clone());
                                        return response;
                                    });
                            });
                    }).catch(error => {
                    console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, error);
                    return caches.match('offline.html');
                })
            );
        }
    }
});
