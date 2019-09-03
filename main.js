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
			.then(keys => alert('Longitud del caché instalado: ' + keys.length))
			.catch(err => console.log('Problemas abriendo el cache', err));
	})
}

function setConcepto(objeto, destino) {
	var concepto = objeto.value;

	switch(concepto){
		case '1':
			document.getElementsByName(destino)[0].value = 'FAVORABLE';
			break;
		case '2':
			document.getElementsByName(destino)[0].value = 'FAVORABLE CON REQUERIMIENTOS';
			break;
		case '3':
			document.getElementsByName(destino)[0].value = 'DESFAVORABLE';
			break;
		case 'N':
			document.getElementsByName(destino)[0].value = 'SIN CONCEPTO';
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
	}else if (puntajeTotal < 90 && puntajeTotal >= 70){
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

function setSujeto(value, destino) {
	switch(value){
		case "479-1":
			document.getElementsByName(destino)[0].value = "RESTAURANTES - PANADERIAS - Y/O PASTELERIAS - CAFETERIAS - FRUTERIAS - COMIDAS RAPIDAS - SERVICIO DE BANQUETES - OFERTA DE ALIMENTACION POR REDES S.";
			break;
		case "479-2":
			document.getElementsByName(destino)[0].value = "COMEDORES ESCOLARES (INCLUYE PAE Y PRIVADOS) INFANTILES (ICBF - INPEC) - COLEGIOS Y UNIVERSIDADES";
			break;
		case "479-3":
			document.getElementsByName(destino)[0].value = "COMEDORES CARCELARIOS (USPEC) - FUERZAS MILITARES Y POLICIVAS";
			break;
		case "479-4":
			document.getElementsByName(destino)[0].value = "COMEDORES HOGARES GERIATRICOS - ASILOS - HOSPITALES - CASINOS DE EMPRESAS O FABRICAS - CLUBES SOCIALES";
			break;
		case "479-5":
			document.getElementsByName(destino)[0].value = "HOTELES - MOTELES - HOSTALES - RESIDENCIAS Y CASAS DE LENOCINIO CON PREPARACION DE ALIMENTOS";
			break;
		case "479-6":
			document.getElementsByName(destino)[0].value = "ESTABLECIMIENTOS DE PREPARACION DE ALIMENTOS AL INTERIOR DE PLAZAS DE MERCADO - CENTRALES DE ABASTO - PLAZOLETAS DE COMIDA - ZONAS FRANCAS";
			break;
		case "481-1":
			document.getElementsByName(destino)[0].value = "BODEGAS PARA ALMACENAMIENTO DE ALIMENTOS Y/O BEBIDAS INCLUIDAS ZONAS FRANCAS";
			break;
		case "481-2":
			document.getElementsByName(destino)[0].value = "ALMACENAN Y DISTRIBUYEN";
			break;
		case "481-3":
			document.getElementsByName(destino)[0].value = "DADORES DE FRIO";
			break;
		case "495-1":
			document.getElementsByName(destino)[0].value = "TIENDAS DE BARRIO I CIGARRERIAS INCLUIDAS ZONAS FRANCAS";
			break;
		case "495-2":
			document.getElementsByName(destino)[0].value = "MINI MERCADO";
			break;
		case "495-3":
			document.getElementsByName(destino)[0].value = "EXPENDIO CON OPERACIONES DE PORCIONADO - TROCEADO O ACONDICIONAMIENTO";
			break;
		case "495-4":
			document.getElementsByName(destino)[0].value = "EXPENDIO DE PRODUCTOS DE LA PESCA";
			break;
		case "495-5":
			document.getElementsByName(destino)[0].value = "CHARCUTERIAS Y SALSAMENTARIAS";
			break;
		case "495-6":
			document.getElementsByName(destino)[0].value = "VENTA DE LECHE CRUDA";
			break;
		case "440-1":
			document.getElementsByName(destino)[0].value = "CARNICERIAS Y FAMAS";
			break;
		case "440-2":
			document.getElementsByName(destino)[0].value = "CARNICERIA DE GRANDES SUPERFICIES - DE PLAZAS DE MERCADO";
			break;
		case "474-1":
			document.getElementsByName(destino)[0].value = "BARES";
			break;
		case "474-2":
			document.getElementsByName(destino)[0].value = "DISCOTECAS";
			break;
		case "474-3":
			document.getElementsByName(destino)[0].value = "CANTINAS";
			break;
		case "474-4":
			document.getElementsByName(destino)[0].value = "TABERNAS";
			break;
		case "474-5":
			document.getElementsByName(destino)[0].value = "CIGARRERIAS";
			break;
		case "474-6":
			document.getElementsByName(destino)[0].value = "LICORERAS";
			break;
		case "474-7":
			document.getElementsByName(destino)[0].value = "WHISKERIAS";
			break;
		case "474-8":
			document.getElementsByName(destino)[0].value = "PROSTIBULOS";
			break;
		case "474-9":
			document.getElementsByName(destino)[0].value = "CLUBES SOCIALES";
			break;
		case "478-1":
			document.getElementsByName(destino)[0].value = "GRAN SUPERFICIE";
			break;
		case "478-2":
			document.getElementsByName(destino)[0].value = "HIPERMERCADO";
			break;
		case "478-3":
			document.getElementsByName(destino)[0].value = "SUPERMERCADO";
			break;
		case "478-4":
			document.getElementsByName(destino)[0].value = "FRUVER";
			break;
		case "475-1":
			document.getElementsByName(destino)[0].value = "CENTRO DE ABASTO";
			break;
		case "475-2":
			document.getElementsByName(destino)[0].value = "PLAZA DE MERCADO";
			break;
		case "472-1":
			document.getElementsByName(destino)[0].value = "VEHICULO";
			break;
		case "480-1":
			document.getElementsByName(destino)[0].value = "PUESTO FIJO ESTACIONARIO";
			break;
		case "480-2":
			document.getElementsByName(destino)[0].value = "PUESTO MOVIL";
			break;
		case "480-3":
			document.getElementsByName(destino)[0].value = "PLAZA DE MERCADO MOVIL";
			break;
		case "480-4":
			document.getElementsByName(destino)[0].value = "MERCADO CAMPESINO";
			break;
		case "480-5":
			document.getElementsByName(destino)[0].value = "FOOD TRUCK";
			break;
		case "480-6":
			document.getElementsByName(destino)[0].value = "COMERCIALIZACION AMBULANTE DE LECHE CRUDA PARA CONSUMO HUMANO DIRECTO";
			break;
		default:
			document.getElementsByName(destino)[0].value = '';
	}
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