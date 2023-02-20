
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
                "/home"
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
    if(!navigator.online)
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