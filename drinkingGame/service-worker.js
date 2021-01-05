cacheName = "cache-dev-v2"
const toCache = [
    '/',
    '/index.html',
    '/main.js',
    '/helpers.js',
    '/style.css',
    '/assets/*',
    '/compos/*',
]

// self.addEventListener('fetch', function (event) {
//     event.respondWith(caches.open(cacheName).then(function (cache) {
//         return cache.match(event.request).then(function (response) {
//             console.log("[R] cache request: " + event.request.url)
//             var fetchPromise = fetch(event.request).then(function (networkResponse) {
//                 console.log("[D] fetch completed: " + event.request.url, networkResponse)
//                 if (networkResponse) {
//                     console.debug("[U] updated cached page: " + event.request.url, networkResponse)
//                     cache.put(event.request, networkResponse.clone())
//                 }
//                 return networkResponse
//             }, function (event) {
//                 console.log("[E] Error in fetch()", event)
//                 event.waitUntil(
//                     caches.open(cacheName).then(function (cache) {
//                         return cache.addAll(toCache)
//                     })
//                 )
//             })
//             return response || fetchPromise
//         })
//     }))
// })
self.addEventListener('fetch', (e) => {
    console.log('[Service Worker] Fetched resource ' + e.request.url)
    e.respondWith(
        caches.match(e.request).then((r) => {
            console.log('[Service Worker] Fetching resource: ' + e.request.url)
            return r || fetch(e.request).then((response) => {
                return caches.open(cacheName).then((cache) => {
                    console.log('[Service Worker] Caching new resource: ' + e.request.url)
                    cache.put(e.request, response.clone())
                    return response
                })
            })
        })
    )
})

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== cacheName) {
                    return caches.delete(key)
                }
            }))
        })
    )
})

self.addEventListener('install', function (event) {
    // The promise that skipWaiting() returns can be safely ignored.
    self.skipWaiting()
    console.log("Latest version installed!")
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Caching all: app shell and content')
            return cache.addAll(contentToCache)
        })
    )
})