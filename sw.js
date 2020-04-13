//import
importScripts('js/sw-utils.js');

const statyCache = 'static_v3';
const dynamicCache = 'dynamic_v1';
const inmutableCache = 'inmutable_v1';

const app_shell_staty= [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js'
]

const app_shel_inmutable = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
]

self.addEventListener('install',e => {

    const cacheStaty= caches.open(statyCache)
    .then(cacheS => {
        cacheS.addAll(app_shell_staty);
    })

    const cacheInmutable= caches.open(inmutableCache)
    .then(cacheI => {
        cacheI.addAll(app_shel_inmutable);
    })

    e.waitUntil(Promise.all([cacheStaty,cacheInmutable]));

})

self.addEventListener('activate',e => {

    const elimnarCache = caches.keys()
    .then(keys => {
        keys.forEach(key => {
            if(key !== statyCache && key.includes('static')){
                return caches.delete(key);
            }
        })
    })

    e.waitUntil(elimnarCache);

})


self.addEventListener('fetch',e => {

   const respuestaCache = caches.match(e.request)
    .then(res => {
        
        if(res){
            return res;
        }else{
            console.log(e.request.url)
            return fetch(e.request)
            .then(newResp => {
                return actualizaCacheDinamico(dynamicCache,e.request,newResp);
            })
        }
    })

    e.respondWith(respuestaCache);
})