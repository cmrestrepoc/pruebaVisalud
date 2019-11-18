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
		{ coda: '1.1A', actividad: 'Visita de inspección y vigilancia sanitaria al sistema de abasto público de Agua para el consumo humano URBANO. Incluye concertación. actualización y materialización de puntos de muestreo.'},
		{ coda: '1.2A', actividad: 'Visita de inspección y vigilancia sanitaria al sistema de abastecimiento de Agua para el consumo humano RURAL. Incluye concertación. actualización y materialización de puntos de muestreo.'},
		{ coda: '1.3A', actividad: 'Visitas y elaboración de mapa de riesgo de la calidad de agua para consumo humano para adopción por la secretaria de salud municipal (incluye la ficha y los anexos)"'},
		{ coda: '1.4A', actividad: 'Visita para la toma de muestra de agua para elaboración de mapa de riesgo de la calidad del agua'},
		{ coda: '1.5A', actividad: 'Elaboración del acto administrativo de adopción del mapa de riesgo de la calidad del agua para la secretaria de salud municipal.'},
		{ coda: '1.5A-2', actividad: 'Programacion de muestreos para sistemas urbanos y rurales.'},
		{ coda: '1.6A', actividad: 'Muestreos de agua en sistemas de abastecimiento urbano'},
		{ coda: '1.7A', actividad: 'Muestreos de agua en sistemas de abastecimiento rurales'},
		{ coda: '1.8A', actividad: 'Elaborar el informe técnico para la administracion municipal. COVE. Empresas de Servicios Publicos. de la calidad del agua con los resultados de laboratorio obtenidos en los muestreos de los sistemas de abastecimiento de agua (Urbano-Rural)'},
		{ coda: '1.9A', actividad: 'Notificar a las administraciones municipales. COVE y Empresas prestadoras de servicios publicos. el informe con los resultados de laboratorio obtenidos en los muestreos de los sistemas de abastecimiento de agua de acueductos urbanos y rurales. acorde con'},
		{ coda: '1.10A', actividad: 'Educacion Sanitaria'},
		{ coda: '1.11A', actividad: 'Recepción. Atención y Elaboración de Informes de las Peticiones. Quejas. Reclamos y Solicitudes relacionadas con el programa.'},
		{ coda: '1.12A', actividad: 'Acompañamiento técnico en mejoramiento calidad del agua para consumo humano en sistemas de abastecimiento en acueductos rurales'},
		{ coda: '1.13A', actividad: 'Cargue de información al Sistema de Vigilancia para la Calidad del Agua para consumo - SIVICAP (Actas de inspección en acueductos. concertación. actualización y materialización de puntos de muestreo. resultados de Analisis de Laboratorio y mapas de riesg'},
		{ coda: '1.15A', actividad: 'Visita de inspección sanitaria a vehiculo para transporte y suministro de agua para consumo humano- Carrotanque'},
		{ coda: '1.16A', actividad: 'Capacitaciones internas'},
		{ coda: '1.17A', actividad: 'CUADROS DE SALIDA DEL PROCESO DE AGUA PARA CONSUMO HUMANO'},
		{ coda: '1.18A', actividad: 'INFORME TRIMESTRAL A LA ALCALDIA'},
		{ coda: '5.1SA', actividad: 'Visita de inspección sanitaria a la empresa de aseo municipal y elaboración de informe a la Administración Municipal. CVC y Superintendencia de Servicios'},
		{ coda: '5.3SA', actividad: 'Visita integral de inspección sanitaria a empresas sociales del estado-ESE (incluye la visita de residuos de Atención en salud. tanques de abasto de agua. alimentos. higienico locativo- ETV y radiaciones ionizantes)'},
		{ coda: '5.4SA', actividad: 'Visita integral de inspección sanitaria a IPS que presten servicio de urgencia y hospitalización (incluye la visita de residuos de Atención en salud. tanques de abasto de agua. alimentos. higienico locativo- ETV y radiaciones ionizantes)'},
		{ coda: '5.5SA', actividad: 'Visita integral de inspección sanitaria a generadores de residuos en Atención en salud y otras actividades tales como funerarias y salas de velación (incluye inspección a carro funebre) SIN SERVICIO DE TANATOPRAXIA'},
		{ coda: '5.6SA', actividad: 'Visita integral de inspeccion sanitaria a morgues y cementerios (incluye inscripción e inspección de ETV)'},
		{ coda: '5.7SA', actividad: 'Visita integral de vigilancia y control para constatar condiciones sanitarias y técnicas de establecimientos de Estática Ornamental y emitir Acta conceptualizada.'},
		{ coda: '5.7SA', actividad: 'Visita integral de vigilancia y control para constatar condiciones sanitarias y técnicas de Establecimientos de Estática Ornamental y emitir Acta conceptualizada. CON ENFOQUE DE RIESGO DE DISPOSICIÓN INADECUADA DE LOS RESIDUOS PELIGROSOS'},
		{ coda: '5.9SA', actividad: 'Visita integral de inspección sanitaria a establecimientos con estanque de piscinas para uso recreacional y elaboración de informe a la Administración Municipal'},
		{ coda: '5.13SA', actividad: 'Visita Integral a parques destinado a usos diversos'},
		{ coda: '5.15SA', actividad: 'Educacion Sanitaria'},
		{ coda: '5.16SA', actividad: 'Recepción. Atención y Elaboración de Informes de las Peticiones. Quejas. Reclamos y Solicitudes relacionadas con el programa'},
		{ coda: '5.17SA', actividad: 'CUADROS DE SALIDA DEL PROGRAMA DE SALUD AMBIENTAL'},
		{ coda: '5.18SA', actividad: 'INFORME TRIMESTRAL A LA ALCALDIA'},
		{ coda: '7.1P', actividad: 'Visitas de inspección. vigilancia y control sanitario para verificar el cumplimiento de las condiciones de funcionamiento en depósitos y expendios de plaguicidas.  CON ENFOQUE DE RIESGO POR INADECUADA DISPOSICION DE RESIDUOS GENERADOS EN SERVICIOS DE SAL'},
		{ coda: '7.2P', actividad: 'Visitas de inspección. vigilancia y control Sanitario para verificar el cumplimiento de las condiciones de funcionamiento en empresas aplicadoras terrestres y áreas de plaguicidas. el cual incluye la inscripción y Revisión de vehículos'},
		{ coda: '7.3P', actividad: 'Efectuar monitoreo biológico: exámenes de colinesterasa. Elaboración y notificación de los resultados de la prueba.'},
		{ coda: '7.4P', actividad: 'Efectuar el registro. consolidación y analisis de resultados de vigilancia epidemiológica en formatos VEO-2 (EXCEL).'},
		{ coda: '7.5P', actividad: 'Visitas de IVC a establecimientos que almacenan. manejan y expenden sustancias potencialmente toxicas diferentes a plaguicidas.'},
		{ coda: '7.6P', actividad: 'Realizar recolección e investigación de los reportes de intoxicación por exposición a plaguicidas y otras sustancias quimicas (accidentales y ocupacionales)'},
		{ coda: '7.7P', actividad: 'Revisión de las intoxicaciones por sustancias químicas y plaguicidas notificadas en el SIVIGILA con la remisión de la información a la alcaldia.'},
		{ coda: '7.8P', actividad: 'Revisión y carnetización de operarios aplicadores de plaguicidas.'},
		{ coda: '7.9P', actividad: 'Revisión e inscripción de asistentes técnicos de empresas aplicadoras de plaguicidas.'},
		{ coda: '7.10P', actividad: 'Realización de pruebas de control de calidad analítica de colinesterasa y envío de reporte al INS.'},
		{ coda: '7.11P', actividad: 'Preparación y asistencia al Consejo Seccional de Plaguicidas'},
		{ coda: '7.12P', actividad: 'Educacion Sanitaria en manejo adecuado de plaguicidas y riesgos en su aplicación.'},
		{ coda: '7.13P', actividad: 'Recepción. Atención y Elaboración de Informes de las Peticiones. Quejas. Reclamos y Solicitudes relacionadas con el respectivo Programa'},
		{ coda: '7.14P', actividad: 'CUADROS DE SALIDA DEL PROGRAMA DE PLAGUICIDAS'},
		{ coda: '7.15P', actividad: 'INFORME TRIMESTRAL A LA ALCALDIA'},
		{ coda: '2.4AL', actividad: 'Visitas de vigilancia y control para constatar condiciones sanitarias y técnicas a Panaderías y Reposteria.'},
		{ coda: '2.5AL', actividad: 'Visita integral de inspección. vigilancia y control para constatar condiciones sanitarias y técnicas a plazas de mercado'},
		{ coda: '2.6AL', actividad: 'Visita integral de inspección. vigilancia y control para constatar condiciones sanitarias y técnicas a supermercados y grandes superficies.'},
		{ coda: '2.6AL', actividad: 'Visita integral de inspección. vigilancia y control para constatar condiciones sanitarias y técnicas a supermercados y grandes superficies (Incluye la Revisión de los medicamentos de venta Libre) - CON ENFOQUE DE RIESGO POR ALIMENTOS ALTERADOS Y FRAUDULE'},
		{ coda: '2.7AL', actividad: 'Visitas de vigilancia y control para constatar condiciones sanitarias y técnicas a restaurantes. cafeterías y heladerías.'},
		{ coda: '2.8AL', actividad: 'Efectuar visita integral (alimentos incluido el PAE. ETV y saneamiento edificaciones) de inspección. vigilancia y control a establecimientos educativos entre los que se encuentran: Universidades. Colegios. escuelas. jardines. guarderias que incluye ICBF.'},
		{ coda: '2.9AL', actividad: 'Visitas de vigilancia y control para constatar condiciones sanitarias y técnicas a restaurantes escolares Beneficiados con el PAE.'},
		{ coda: '2.10AL', actividad: 'Visita integral de vigilancia y control para constatar condiciones sanitarias y técnicas a tiendas. graneros. depósitos de alimentos. (Incluye la Revisión de los medicamentos de venta Libre)'},
		{ coda: '2.11AL', actividad: 'Visita integral de vigilancia y control para constatar condiciones sanitarias y técnicas a expendios ambulantes y estacionarios (casetas. kioskos) INCLUIR EN ESTA VISITA EL LUGAR DE PREPARACION Y ALMACENAMIENTO DE MATERIAS PRIMAS ( NO INCLUIR LOS EXPENDI'},
		{ coda: '2.12AL', actividad: 'Toma de muestras de alimentos solicitadas por el Laboratorio Departamental de Salud Publica'},
		{ coda: '2.13AL', actividad: 'Autorizacion de Planes de capacitación de manipuladores de alimentos (solo sede principal)'},
		{ coda: '2.14AL', actividad: 'Visitas de Vigilancia a establecimientos Capacitadores en Manipulación de carne y productos carnicos (Decreto 1500/2007)'},
		{ coda: '2.15AL', actividad: 'Investigaciones epidemiológicas por brotes de E.T.A.notificadas por la Secretaria Dptal de Salud .DLS'},
		{ coda: '2.16AL', actividad: 'Toma de muestras de bebidas alcohólicas para LDS'},
		{ coda: '2.17AL', actividad: 'Visita integral de vigilancia y control para constatar condiciones sanitarias y técnicas a estanquillos. estancos. depositos de bebidas alcoholicas. bares. cantinas. griles. tabernas y emitir acta conceptualizada (Incluye la Revisión de los medicamentos'},
		{ coda: '2.18AL', actividad: 'Educacion Sanitaria (Basado en el Plan de Educación elaborado por el profesional responsable del proceso)'},
		{ coda: '2.19AL', actividad: 'Recepción. Atención y Elaboración de Informes de las Peticiones. Quejas. Reclamos y Solicitudes relacionadas con el respectivo Proceso Misional'},
		{ coda: '2.20AL', actividad: 'Elaborar el informe de conceptualización de los resultados de laboratorio obtenidos en los muestreos en el LDSP y UES Valle'},
		{ coda: '2.21AL', actividad: 'Notificación de los resultados y manejo de contramuestra donde aplique'},
		{ coda: '2.22AL', actividad: 'Atención de fiestas. eventos o similares en los municipios con la presentacion del informe'},
		{ coda: '2.23AL', actividad: 'Asistencia a COVES y mesas departamentales del COTSA y grupos funcionales (Solo sede principal)'},
		{ coda: '2.24AL', actividad: 'Revisión de los eventos afines al procesos notificados en el SIVIGILA y boletin epidemiologico de la SDS y del INS'},
		{ coda: '2.25AL', actividad: 'Realizar la visita para la inscripción de establecimientos del sector gastronomico y expendios de alimentos.'},
		{ coda: '11.1Z', actividad: 'Realizar  inmunización de caninos contra la Rabia'},
		{ coda: '11.2Z', actividad: 'Realizar  inmunización de felinos contra la Rabia'},
		{ coda: '11.3Z', actividad: 'Realizar las observaciones por Agresión Animal.'},
		{ coda: '11.4Z', actividad: 'Apoyar todos los controles de foco de rabia. Encefalitis Equina Venezolana. Brucelosis. Influenza Aviar. Accidente Ofidico y  Leptospirosis'},
		{ coda: '11.5Z', actividad: 'Educacion Sanitaria (Basado en el Plan de Educación elaborado por el profesional responsable del proceso'},
		{ coda: '11.6Z', actividad: 'Visitas de vigilancia y control de fabricas de materia prima para Alimentos para consumo  animal y fabricas de concentrado animal'},
		{ coda: '11.7Z', actividad: 'Visitas de vigilancia y control a clinicas. cementerios de mascotas. consultorios.  SPA y peluquerías veterinarias'},
		{ coda: '11.8Z', actividad: 'Diagnostico y control de roedores plaga en viviendas y establecimientos publicos y evaluacion'},
		{ coda: '11.9Z', actividad: 'Recepción. Atención y Elaboración de Informes de las Peticiones. Quejas. Reclamos y Solicitudes relacionadas con el respectivo Proceso Misional'},
		{ coda: '11.10', actividad: 'Apoyo al programa Departamental de esterilizacion canina y felina'},
		{ coda: '11.11', actividad: 'Asistencia a COVES y mesas departamentales del COTSA - Consejo Seccional de Zoonosis y grupos funcionales'},
		{ coda: '11.12', actividad: 'Revisión y seguimiento de los eventos afines al procesos notificados en el SIVIGILA e ICA'},
		{ coda: '11.13', actividad: 'Realizar  el acompañamiento técnico por funcionario de las actividades del proceso en los formatos y procecedimientos establecidos'},
		{ coda: '4.6M', actividad: 'Visita de vigilancia y control para constatar condiciones sanitarias y técnicas a Tiendas Naturistas. expendios de Productos Esotóricos y demás productos afines y emitir acta conceptualizada. En Mpios categorias 4a. 5a y 6a.'},
		{ coda: '1.1ETV', actividad: 'Realizar el Control quimico con equipo de espalda ULV en viviendas y establecimientos'},
		{ coda: '1.2ETV', actividad: 'Realiza el Control quimico con equipo pesado ULV'},
		{ coda: '1.3ETV', actividad: 'Realizar la Investigacion por la mortalidad por una ETV reportada por la SDS'},
		{ coda: '1.4ETV', actividad: 'Asistencia y participar COVE SALUD y reuniones intersectoriales de ETV o afines. Elaborar informe ejecutivo de la reunión'},
		{ coda: '1.5ETV', actividad: 'Educacion Sanitaria en prevencion de criaderos de zancudos'},
		{ coda: '1.6ETV', actividad: 'Revisión de los eventos afines al procesos notificados en el SIVIGILA y boletin epidemiologico de la SDS y del INS'},
		{ coda: '1.7ETV', actividad: 'Recepción. Atención y Elaboración de Informes de las Peticiones. Quejas. Reclamos y Solicitudes relacionadas con el respectivo programa.'},
		{ coda: '10.1SV', actividad: 'Efectuar visitas de inspección. vigilancia y control a depósitos. talleres. estaciones de servicio. lavanderías. fabricas de colchones y similares. Elaboración y notificación del informe de visita.'},
		{ coda: '10.2SV', actividad: 'Efectuar visitas de inspección. vigilancia y control a hoteles. moteles y hospedajes. Elaboración y notificación del informe de visita.'},
		{ coda: '10.3SV', actividad: 'Efectuar visitas de inspección. vigilancia y control a teatros. coliseos. estadios. centro comercial y circos. Elaboración y notificación del informe de visita.'},
		{ coda: '10.4SV', actividad: 'Efectuar visitas de inspección. vigilancia y control a almacenes. bancos. oficinas y juegos de azar. Elaboración y notificación del informe de visita.'},
		{ coda: '10.5SV', actividad: 'Efectuar visitas de inspección. vigilancia y control a Geriatricos. Elaboración y notificación del informe de visita.'},
		{ coda: '10.6SV', actividad: 'Efectuar visitas de inspección. vigilancia y control a Edificios Públicos. cuarteles. batallones. inspecciones de policía. iglesias. Elaboración y notificación del informe de visita.'},
		{ coda: '10.7SV', actividad: 'Efectuar visita integral de IVC a carceles (Centro penitenciario y de rehabilitación) Incluye Tanques de almacenamiento de agua. ETV. alimentos. medicamentos. manejo de residuos. control de plagas e higienico locativo'},
		{ coda: '10.8SV', actividad: 'Visitas de visitas de inspección. vigilancia y control a ladrilleras. tejares. trilladoras. fundidoras. industria manufacturera entre otros. (Revision de condiciones higienico locativas y ETV)'},
		{ coda: '10.9SV', actividad: 'Recepción. Atención y Elaboración de Informes de las Peticiones. Quejas. Reclamos y Solicitudes relacionadas con el respectivo Programa'},
		{ coda: '10.10S', actividad: 'CUADROS DE SALIDA DEL PROGRAMA DE PLAGUICIDAS'},
		{ coda: '10.11S', actividad: 'INFORME TRIMESTRAL A LA ALCALDIA'}
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