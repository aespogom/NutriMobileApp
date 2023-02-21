
let cacheData = "appV1";
this.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheData).then((cache) => {
            return cache.addAll([
                '/static/js/main.chunk.js',
                '/static/js/0.chunk.js',
                '/static/js/bundle.js',
                '/static/css/main.chunk.css',
                '/bootstrap.min.css',
                '/index.html',
                '/',
                "/home",
                "/favicon.ico",
                "/manifest.json"
            ]).then(() => this.skipWaiting());
        })
    );
});

this.addEventListener('activate', event => {
    console.warn('Activating service worker');
    event.waitUntil(this.clients.claim());
})

//fetch from cache for offline modus
this.addEventListener("fetch", (event)=>{

    if (event.request )

    if(!navigator.onLine)
    {
        event.respondWith(
            caches.match(event.request).then((resp)=>{
                if(resp)
                {
                    return resp
                }
                // rerender code 
                let requestUrl = event.request.clone()
                fetch(requestUrl)
            })
        )
    }
    else {
        var fetchRequest = event.request.clone();
        return fetch(fetchRequest).then((response)=>{
            if (!response || response.status !== 200 || response.type !== 'basic'){
                return response
            }

            var responseToCache = response.clone();
            caches.open(cacheData).then((cache)=> {
                cache.put(event.request, responseToCache)
            });
            return response
        })
    }
})

// // Respond to a server push with a user notification.
// this.addEventListener('push', (event) => {
//     if (Notification.permission === "granted") {
//         const notificationText = event.data.text();
//         const showNotification = navigator.serviceWorker.ready.then((r) => {
//             r.showNotification('Sample PWA', {
//                 body: notificationText
//             });
//         })
//         // Make sure the toast notification is displayed.
//         event.waitUntil(showNotification);
//     }
// });

// // Respond to the user selecting the toast notification.
// this.addEventListener('notificationclick', (event) => {
//     console.log('On notification click: ', event.notification.tag);
//     event.notification.close();

//     // Display the current notification if it is already open, and then put focus on it.
//     event.waitUntil(clients.matchAll({
//         type: 'window'
//     }).then(function (clientList) {
//         for (var i = 0; i < clientList.length; i++) {
//             var client = clientList[i];
//             if (client.url == 'http://localhost:3000/' && 'focus' in client)
//                 return client.focus();
//         }
//         if (clients.openWindow)
//             return clients.openWindow('/');
//     }));
// });