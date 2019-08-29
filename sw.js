//imports
//importScripts('https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js');
//importScripts('./js/pouchdb.min.js');
//importScripts('./js/sw-db.js');

// Asignar un nombre y versión de la cache
const CACHE_NAME = 'v3_cache_visalud_jamundi';

// ficheros a cachear en la aplicación
var urlsToCache = [
	'./',
	'./sw.js',
	'./main.js',
	'./js/sw-db.js',
	'./index.html',
	'./menu0.html',
	'./f26.html',
	'./f243.html',
	'./f333.html',
	'./f440.html',
	'./f441.html',
	'./f442.html',
	'./f443.html',
	'./f444.html',
	'./f472.html',
	'./f474.html',
	'./f475.html',
	'./f478.html',
	'./f479.html',
	'./f480.html',
	'./f481.html',
	'./f493.html',
	'./f495.html',
	'./f569.html',
	'./firmaEvaluacion.html',
	'./firmaInscripcion.html',
	'./css/styles.css',
	'./css/bootstrap.css',
	'./css/bootstrap.min.css',
	'./css/jquery.dataTables.min.css',
	'./js/bootstrap.min.js',
	'./js/jquery-3.3.1.slim.min.js',
	'./js/pouchdb.min.js',
	'./js/jquery.dataTables.min.js',
	'./js/jquery.jqscribble.js',
	'./js/login.js',
	'./img/escudo130.ico',
	'./img/escudo.png',
	'./img/escudo.jpg',
	'./img/llave.png',
	'./images/sort_asc.png',
	'./images/sort_both.png',
	'./images/sort_desc.png',
	'./images/sort_asc_disabled.png',
	'./images/sort_desc_disabled.png'
];

// Evento Install

/* self es una variable que representa el serviceWorker, 
con ella se va a instalar el sw y a guardar en
cache los recursos estáticos*/
self.addEventListener('install', e => {
	e.waitUntil(
		caches.open(CACHE_NAME)
			  .then(cache => {
			  	return cache.addAll(urlsToCache)
			  				.then(() => {
								self.skipWaiting();
								cache.keys()
									.then( keys => console.log('keys en el cache en instalación', keys) )
									.catch(err => console.log('Ni siquiera se logró obtener las keys, ', err));  
							})
							.catch(err => console.log('Fallo en función addAll', err))  			
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

	//Cache and network race (prueba)

	/*const respuesta = new Promise( (resolve, reject) => {
		let rechazada = false;
		
		const falloUnaVez = () => {
			if (rechazada) {
				console.log("No es posible que funcione la App");
			} else {
				rechazada = true;
			}
		}

		fetch( e.request ).then( res=> {
			res.ok ? resolve(res) : falloUnaVez();
		}).catch( falloUnaVez );

		caches.match( e.request ).then( res => {
			res ? resolve(res) : falloUnaVez();
		}).catch( falloUnaVez );
	});

	e.respondWith( respuesta );*/

	//Cache with network update
	/*if (e.request.clone().method === 'POST') {
		return fetch(e.request);
	}
	
	const respuesta = caches.open(CACHE_NAME).then( cache => {

		fetch( e.request )
			.then( newResp => cache.put( e.request, newResp ));
		
		return cache.match( e.request );

	});

	e.respondWith( respuesta );*/

	// Codigo como está en el curso del Tico: Network with cache fallback
	const respuesta = fetch( e.request ).then( res => {
		//console.log(e.request.method);
		if(e.request.method !== 'POST'){
			// console.log('Request: ', e.request.url);
			if(!res) return caches.match(e.request);
			
			caches.open( CACHE_NAME )
				/* .then( cache => {
					cache.put(e.request, res);
				}); */
				.then ( cache => {
					cache.keys()
					.then(key => {
						// console.log("key en fetch ??????", key.includes(e.request))
						let arreglo = key.filter( element => {
							if(element.url === e.request.url)
								return element.url;
						});
						//console.log("request", e.request);
						//arreglo.length > 0 ? console.log("Ya existe en el cache", arreglo.length): console.log("No existe en el cache");
						// console.log("cache: ", key);
						//console.log('res', res);
						if(! arreglo.length > 0 ) {
							console.log('El request ' + e.request.url + ' no estaba en caché, por lo cual se guardará');
							cache.put(e.request, res);
						}/* else{
							console.log('elemento ' + e.request.url + ' ya estaba en el caché y por tanto no se guarda');
						} */

					})
					.catch(err => console.log('No se pudo obtener las keys (items) del cache', err));
				})
				.catch (err => console.log('No se logró abrir el cache', err));
		}

		return res.clone();

	}).catch( err => {
		return caches.match( e.request );
	});
	
	e.respondWith( respuesta );

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

let i = 0;
function limpiarCache() {
	caches.open(CACHE_NAME)
		.then(cache => {
			console.log('cache completo', cache);
			setTimeout(() => location.reload(), 1000);
			return cache.keys()
				.then(keys => {
					console.log('Arreglo de keys', keys);
					console.log("Numero de keys: ", keys.length);
					console.log("urlstocache: ", urlsToCache.length);
					console.log(keys[0]);
					console.log("valor i: ", i);
					keys.forEach(key => {
						console.log("Se está borrando del cache: ", key.url)
						cache.delete( key )
							.then( console.log('Se borró: ', key) );
					});
					/* if ((keys.length > (urlsToCache.length - i)) && (i <= urlsToCache.length)) {
						i++;
						console.log("Se está borrando del cache: ", keys[0].url)
						cache.delete( keys[0] )
							.then( limpiarCache() );
					}*/
				});
		});
} 