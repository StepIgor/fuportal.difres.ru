let CACHE_NAME = 'faportal_cache',
    cacheUrls = [
        '/build/bundle.js',
        '/build/bundle.css',
        'font.woff2',
        'icon.css',
        'logo.png',
        'logo2.png',
        'favicon.png',
        'index.html',
        '/'
    ];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(cacheUrls);
        })
    );
});

self.addEventListener('activate', function (event) {
});

let MAX_AGE = 43200000; //половина суток - период обновления кеша

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (cachedResponse) {
            let lastModified, fetchRequest;

            // есть кеш на устройстве
            if (cachedResponse) {
                lastModified = new Date(cachedResponse.headers.get('last-modified'));
                if (lastModified && (Date.now() - lastModified.getTime()) > MAX_AGE) {
                    fetchRequest = event.request.clone();
                    return fetch(fetchRequest).then(function (response) {
                        let responseClone = response.clone();
                        if (!response || response.status !== 200){
                            return cachedResponse;
                        }
                        caches.open(CACHE_NAME).then(function (cache) {
                            cache.put(event.request, responseClone);
                        });
                        //возвращается новое из сети (предварительно положили в кеш)
                        return response;
                    }).catch(function () {
                        return cachedResponse;
                    });
                }
                //срок еще не прошел, возврат кеша
                return cachedResponse;
            }
            // кеша нет на устройстве
            return fetch(event.request);
        })
    );
});