// This script defines the service workers

let cacheData = "appV1";
this.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheData).then((cache) => {
            // What will be stored in the cache
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
                "/manifest.json",
                "public/logo192.png",
                "public/keras.js",
                "keras.js",
                "https://cdn.rawgit.com/blueimp/JavaScript-Load-Image/v2.6.2/js/load-image.all.min.js"
            ]).then(() => this.skipWaiting());
        })
    );
});

this.addEventListener('activate', event => {
    // This function activates the service workers

    console.warn('Activating service worker');
    event.waitUntil(this.clients.claim());
})

this.addEventListener("fetch", (event)=>{
    // This function intercepts any request done in the app
    // If the request has been done before, the response from the cache is returned
    // If the app is online and the request has been never done before, the response is stored in the cache

    if(!navigator.onLine)
    {
        event.respondWith(
            caches.match(event.request.url).then((resp)=>{ // also check only revent.request? 
                if(resp)
                {
                    console.log('cache response:', resp)
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

        caches.match(event.request.url).then((resp)=>{
            if(resp)
            {
                console.log('cache response:', resp)
                return resp
            }

            else
            {
                return fetch(fetchRequest).then((response)=>{
                    if (!response || response.status !== 200 || response.type !== 'basic'){
                        var responseToCache = response.clone();
                        caches.open(cacheData).then((cache)=> {
                        cache.put(event.request.url, responseToCache)
                        console.warn("adding request to cache:", event.request.url)
                    });
                        return response
                    }
        
                    var responseToCache = response.clone();
                    caches.open(cacheData).then((cache)=> {
                        cache.put(event.request, responseToCache)
                        console.warn("adding request to cache:", responseToCache)
                    });
                    return response
                })
            }
        })
    }
})
