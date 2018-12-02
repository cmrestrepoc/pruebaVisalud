//imports
//importScripts('https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js');
importScripts('./js/pouchdb.min.js');
importScripts('./js/sw-db.js');

// Asignar un nombre y versión de la cache
const CACHE_NAME = 'v2_cache_visalud_pwa';

/*function limpiarCache( cacheName, numeroItems ) {
	caches.open(cacheName)
		.then(cache => {
			return cache.keys()
				.then(keys => {
					if (keys.length > numeroItems) {
						cache.delete( keys[0] )
							.then( limpiarCache(cacheName,numeroItems) );
					}
				});
		});
}*/

// ficheros a cachear en la aplicación
var urlsToCache = [
	'./',
	'./index.html',
	'./f440.html',
	'./f493.html',
	'./css/styles.css',
	'./css/bootstrap.css',
	'./css/bootstrap.min.css',
	'./css/jquery.dataTables.min.css',
	'./js/bootstrap.js',
	'./js/bootstrap.min.js',
	'./js/jquery-3.3.1.slim.min.js',
	'./js/sw-db.js',
	'./js/pouchdb.min.js',
	'./js/jquery.dataTables.min.js',
	'./img/escudo130.ico',
	'./img/escudo.png',
	'./img/escudo.jpg',
	'./img/llave.png'
];


// Evento Install

/* variable que representa el serviceWorker, 
con ella se va a instalar el sw y a guardar en
cache los recursos estáticos*/
self.addEventListener('install', e => {
	e.waitUntil(
		caches.open(CACHE_NAME)
			  .then(cache => {
			  	return cache.addAll(urlsToCache)
			  				.then(() => {
			  					self.skipWaiting();
			  				})			  				
			  })
			  .catch(err => console.log('No se ha registrado el cache', err))
	);
}); 


// Evento Activate hace que la app funcione sin conexión, offline
self.addEventListener('activate', e => {
	const cacheWhiteList = [CACHE_NAME];
	e.waitUntil(
		caches.keys()
			  .then(cacheNames => {
			  	return Promise.all(
			  		cacheNames.map(cacheName => {
			  			if(cacheWhiteList.indexOf(cacheName) === -1){
			  				// Borra los elementos que no se necesitan
			  				return caches.delete(cacheName);
			  			}
			  		})
			  	); 
			  })
			  .then(() => {
			  	// Activa la cache en el dispositivo
			  	self.clients.claim();
			  })
	);

});


/* Evento Fetch para conseguir la información 
original desde el servidor una vez haya conexión 
a internet */
self.addEventListener('fetch', e => {

	//Cache with network update

	const respuesta = caches.open(CACHE_NAME).then( cache => {

		fetch( e.request ).then( newResp => 
			cache.put( e.request, newResp ));
		
		return cache.match( e.request );

	});

	e.respondWith( respuesta );

	// Codigo como está en el curso del Tico: Network with cache fallback
	/*const respuesta = fetch( e.request ).then( res => {

		if(!res) return caches.match(e.request);

		caches.open( CACHE_NAME )
			.then( cache => {
				cache.put(e.request, res);
				//limpiarCache( CACHE_NAME, 20 );
			});

		return res.clone();

	}).catch( err => {
		return caches.match( e.request );
	});
	
	e.respondWith( respuesta );*/

//////////////////
	/*
	Codigo en el curso del espanholete
	e.respondWith(
		caches.match(e.request)
			  .then(res => {
			  	if(res){
			  		// Se devuelven los datos desde el cache
			  		return res;
			  	}

			  	return fetch(e.request);
			  })
	);*/
});

//Victoria2510.Samuel2112