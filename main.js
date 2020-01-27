// Service worker

//Se verifica que el nagegador pueda usar el serviceWorker
if('serviceWorker' in navigator){
	console.log('Puedes usar los serviceWorker en tu navegador');

	navigator.serviceWorker.register('./sw.js')
						.then(res => console.log('serviceWorker cargado correctamente', res))
						.catch(err => console.log('serviceWorker no se ha podido registrar', err));
}else{
	console.log('NO PUEDES usar los serviceWorker en tu navegador');
}

const BASEURL1 = 'https://sisbenpro.com/visaludJamundi/public/';
const URL_CERRAR_SESION1 = 'cerrarSesion/';
const URL_LOGIN_SERVER = 'loginVisalud';

function mostrarCache(){
	caches.open('v3_cache_visalud_jamundi')
	.then(cache => {
		cache.keys()
			.then(keys => document.getElementsByName('versionContent')[0].innerHTML += ' - Caché: ' + keys.length)
			.catch(err => console.log('Problemas abriendo el cache', err));
	})
}

function setSemaforo(){
	let semaforo = Array.from(document.getElementsByName('semaforo'));
	let preguntas = Array.from(document.getElementsByName('pregunta'));
	let calificaciones = ['2', '1', '0', 'NA', 'NO'];
	
	for (let indice in semaforo){
		let filtrado = preguntas.filter(element => element.value === calificaciones[indice]);
		semaforo[indice].innerHTML = filtrado.length;
	}
}

function setConcepto(objeto, destino) {
	var concepto = objeto.value;
	switch(concepto){
		case '1':
			document.getElementsByName(destino)[0].value = 'FAVORABLE';
			break;
		case '2':
			document.getElementsByName(destino)[0].value = 'F. CON REQUERIMIENTOS';
			break;
		case '3':
			document.getElementsByName(destino)[0].value = 'DESFAVORABLE';
			break;
		default:
			document.getElementsByName(destino)[0].value = '';
	}
}

function setMotivo(objeto, destino) {
	var motivo = objeto.value;

	switch(motivo){
		case '01':
			document.getElementsByName(destino)[0].value = 'PROGRAMACIÓN';
			break;
		case '02':
			document.getElementsByName(destino)[0].value = 'SOLICITUD DEL INTERESADO';
			break;
		case '03':
			document.getElementsByName(destino)[0].value = 'ASOCIADA A PQRS';
			break;
		case '04':
			document.getElementsByName(destino)[0].value = 'SOLICITUD OFICIAL';
			break;
		case '05':
			if(destino == 'textoMotivo440'){
				document.getElementsByName(destino)[0].value = 'SEGUIMIENTO A VISITA ANTERIOR';
			}else{
				document.getElementsByName(destino)[0].value = 'EVENTO DE INTERÉS EN SALUD PÚBLICA';
			};
			break;
		case '06':
			document.getElementsByName(destino)[0].value = 'SOLICITUD DE PRÁCTICA DE PRUEBAS/PR';
			break;
		case '09':
			document.getElementsByName(destino)[0].value = 'OTRO';
			break;
		default:
			document.getElementsByName(destino)[0].value = '';
	}
}

var puntajeBloques = [];

function evaluarBloque(evaluacion, puntaje, resultado, indice){
	var evaluaciones = document.getElementsByName(evaluacion);
	var puntos = document.getElementsByName(puntaje);	
	var i = 0;
	var suma = 0;
	
	evaluaciones.forEach( eva => {
		//console.log ((evaluaciones[i].value*puntos[i].innerHTML));
		suma = suma + (eva.value*puntos[i].innerHTML);
		i++;
	})
	
	document.getElementsByName(resultado)[0].value = suma;
	puntajeBloques[indice] = suma;
	//console.log(puntajeBloques);
}


function consolidarPuntaje(con, puntaje){
	var puntajeTotal = 0;
	var concepto = 0;

	for (var i = 0; i < puntajeBloques.length; i++) {
		if(puntajeBloques[i] != null){
			puntajeTotal += puntajeBloques[i];
		}else{
			puntajeTotal += 0;
		}
	};

	if (puntajeTotal >= 90) {
		concepto = 1;
	}else if (puntajeTotal < 90 && puntajeTotal >= 60){
		concepto = 2;
	}else {
		concepto = 3;
	}
	
	//console.log(puntajeTotal);
	document.getElementsByName(con)[0].value = concepto;
	document.getElementsByName(puntaje)[0].value = puntajeTotal;
}

function crearInput(name, tipoInput){
	let input = document.createElement('input');
	input.type = tipoInput;
	input.className = 'form-control';
	input.setAttribute('name', name);

	return input; 
}

function crearColumna(name, tipoInput){
	let td = document.createElement('td');
	td.appendChild(crearInput(name, tipoInput));
	return td;
}

function crearMuestra(){
	let tbody = document.getElementById('muestras');
	let tr = document.createElement('tr');
	//let listado = document.getElementById('listadoMuestras');
	//let br = document.createElement('br');
	
	tr.appendChild(crearColumna('Orden', 'text'));
	tr.appendChild(crearColumna('Um', 'text'));
	tr.appendChild(crearColumna('Contenido', 'text'));
	tr.appendChild(crearColumna('Producto', 'text'));
	tr.appendChild(crearColumna('Temperatura', 'text'));
	tr.appendChild(crearColumna('TipoEnvase', 'text'));
	tr.appendChild(crearColumna('LoteFechaV', 'text'));
	tr.appendChild(crearColumna('RegSanit', 'text'));

	tbody.appendChild(tr);
	//listado.parentNode.insertBefore(br, listado.nextSibling);
}

function crearMuestraCongelado(){
	let tbody = document.getElementById('muestrasCongelado');
	let tr = document.createElement('tr');
	
	tr.appendChild(crearColumna('producto', 'text'));
	tr.appendChild(crearColumna('lote', 'text'));
	tr.appendChild(crearColumna('presentaci', 'text'));
	tr.appendChild(crearColumna('cantidad', 'text'));
	tr.appendChild(crearColumna('fv', 'date'));
	tr.appendChild(crearColumna('invima', 'text'));

	tbody.appendChild(tr);
	//listado.parentNode.insertBefore(br, listado.nextSibling);
}

function loginServer(){
	let user = JSON.parse(localStorage.getItem('usuario'));
	let clave = document.getElementsByName('password')[0].value;

	let data = 'nombreUsuario='+user+'&clave='+clave;

	let identity = {
		usuario: user,
		token: ''
	};
	//console.log(data);
	fetch( BASEURL1 + URL_LOGIN_SERVER, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: data
	})
	.then( res => {
		res.json()
		.then( jsonRes => {
			if (jsonRes.err != undefined) {
				var identidad = JSON.parse(localStorage.getItem('identity'));
				if (identidad != undefined) {
					//identidad = JSON.parse(localStorage.getItem('identity'));
					fetch( BASEURL1 + URL_CERRAR_SESION1 + identidad.usuario )
					.then( res => res.json() )
					.then( jsonRes => alert('Sesión cerrada por precaución. ' + jsonRes.res) );
					localStorage.removeItem('identity');				
				} else{
					alert('Error: ' + jsonRes.err);
				}
				location.reload();
			}else if (jsonRes.token == 'Usuario ya está loggeado') {
				alert('Este usuario está bloqueado. Posiblemente por decisión del administrador del sistema o porque otro dispositivo lo está usando');
				history.back();
			}else{
				identity.token = jsonRes.token;
				localStorage.setItem('identity', JSON.stringify(identity));
				console.log('respuesta POST', jsonRes);
				console.log(identity);
				history.back();
			}
		});
	})
	.catch( err => alert('Problemas con la conexión a internet', err.json()) );
}

function estabNumInscripcion(valor, formulario){
	let event = new Event('input');
	let elementoInscripcion = document.getElementsByName('inscripcion' + formulario)[0];
	elementoInscripcion.value += valor;
	elementoInscripcion.dispatchEvent(event);
}

function vehiNumInscripcion(valor){
	let event = new Event('input');
	let elementoInscripcion = document.getElementsByName('inscripcion444')[0];
	elementoInscripcion.value = '76364' + valor;
	elementoInscripcion.dispatchEvent(event);
}

function auxiliarInscVehi(valor){
	if(document.getElementsByName('placaSrmque444')[0].value == '' && document.getElementsByName('placaRemolque444')[0].value == ''){
		let event = new Event('input');
		let elementoInscripcion = document.getElementsByName('inscripcion444')[0];
		elementoInscripcion.value += valor;
		elementoInscripcion.dispatchEvent(event);
	}
}

function setActividad(value, destino) {
	let objeto = [
		{ coda: '10.1SV', actividad: 'Efectuar visitas de inspección. vigilancia y control a depósitos. talleres. estaciones de servicio. lavanderías. fabricas de colchones y similares. Elaboración y notificación del informe de visita.'},
		{ coda: '10.2SV', actividad: 'Efectuar visitas de inspección. vigilancia y control a hoteles. moteles y hospedajes. Elaboración y notificación del informe de visita.'},
		{ coda: '10.3SV', actividad: 'Efectuar visitas de inspección. vigilancia y control a teatros. coliseos. estadios. centro comercial y circos. Elaboración y notificación del informe de visita.'},
		{ coda: '10.4SV', actividad: 'Efectuar visitas de inspección. vigilancia y control a almacenes. bancos. oficinas y juegos de azar. Elaboración y notificación del informe de visita.'},
		{ coda: '10.5SV', actividad: 'Efectuar visitas de inspección. vigilancia y control a Geriatricos. Elaboración y notificación del informe de visita.'},
		{ coda: '10.6SV', actividad: 'Efectuar visitas de inspección. vigilancia y control a Edificios Públicos. cuarteles. batallones. inspecciones de policía. iglesias. Elaboración y notificación del informe de visita.'},
		{ coda: '10.7SV', actividad: 'Efectuar visita integral de IVC a carceles (Centro penitenciario y de rehabilitación) Incluye Tanques de almacenamiento de agua. ETV. alimentos. medicamentos. manejo de residuos. control de plagas e higienico locativo'},
		{ coda: '10.8SV', actividad: 'Efectuar visita de inspección. vigilancia y control a ladrilleras. tejares. trilladoras. fundidoras. industria manufacturera entre otros. (Revision de condiciones higienico locativas y ETV)'}
	];
	let filtrado = objeto.filter(elemento => elemento.coda === value);
	console.log('filtrado', filtrado);
	document.getElementsByName(destino)[0].value = filtrado[0].actividad;
	
}

function setSujeto(value, destino) {
	let objeto = [
		{ tipoSujeto: '24501', sujeto: 'ALMACENES- BANCOS- OFICINAS-JUEGOS DE AZAR'},
		{ tipoSujeto: '24502', sujeto: 'CARCELES'},
		{ tipoSujeto: '24503', sujeto: 'EDIFICIOS PUBLICOS - CUARTELES - IGLESIAS'},
		{ tipoSujeto: '24504', sujeto: 'ESTADIOS - COLISEOS - CENTROS COMERCIALES'},
		{ tipoSujeto: '24505', sujeto: 'GERIATRICOS'},
		{ tipoSujeto: '24506', sujeto: 'HOTELES - MOTELES - HOSPEDAJES'},
		{ tipoSujeto: '24507', sujeto: 'LADRILLERAS - TEJARES - TRILLADORAS'},
		{ tipoSujeto: '24508', sujeto: 'TALLERES - DEPOSITOS -  ESTACIONES DE SERVICIO'}
	];
	let filtrado = objeto.filter(elemento => elemento.tipoSujeto === value);
	console.log('filtrado', filtrado);
	document.getElementsByName(destino)[0].value = filtrado[0].sujeto;
}

function setInicioMenu(){
	document.getElementById('municipio').innerHTML = "JAMUNDÍ";
	document.getElementsByName("nombreFormularios")[0].innerHTML = "F-57";
	document.getElementsByName("nombreFormularios")[1].innerHTML = "F-59";
	document.getElementsByName("nombreFormularios")[2].innerHTML = "F-54";
	document.getElementsByName("nombreFormularios")[3].innerHTML = "F-55";
	document.getElementsByName("nombreFormularios")[4].innerHTML = "F-53";
	document.getElementsByName("nombreFormularios")[5].innerHTML = "F-13";
	document.getElementsByName("nombreFormularios")[6].innerHTML = "F-48";
	document.getElementsByName("nombreFormularios")[7].innerHTML = "F-58";
	document.getElementsByName("nombreFormularios")[8].innerHTML = "F-50";
	document.getElementsByName("nombreFormularios")[9].innerHTML = "F-61";
	document.getElementsByName("nombreFormularios")[10].innerHTML = "F-62";
	document.getElementsByName("nombreFormularios")[11].innerHTML = "F-63";
	document.getElementsByName("nombreFormularios")[12].innerHTML = "F-64";
	document.getElementsByName("nombreFormularios")[13].innerHTML = "F-45";
	document.getElementsByName("nombreFormularios")[14].innerHTML = "F-65";
	document.getElementsByName("nombreFormularios")[15].innerHTML = "F-11";
	document.getElementsByName("nombreFormularios")[16].innerHTML = "F-67";
	document.getElementsByName("nombreFormularios")[17].innerHTML = "F-71";
	document.getElementsByName("nombreFormularios")[18].innerHTML = "F-72";
}

function setInicioIndex(){
	document.getElementById('municipio').innerHTML = "JAMUNDÍ";
}