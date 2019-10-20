var db493 = new PouchDB('inscritosCargados493');
var dbNuevos493 = new PouchDB('inscritosNuevos493');
var db569 = new PouchDB('inscritosCargados569');
var dbNuevos569 = new PouchDB('inscritosNuevos569');
var db444 = new PouchDB('inscritosCargados444');
var dbNuevos444 = new PouchDB('inscritosNuevos444');

var censo = new PouchDB('censo');
var censoc = new PouchDB('censoc');
var censov = new PouchDB('censov');
var censosv = new PouchDB('censosv');

var db440 = new PouchDB('evaluaciones440');
var db474 = new PouchDB('evaluaciones474');
var db479 = new PouchDB('evaluaciones479');
var db480 = new PouchDB('evaluaciones480');
var db495 = new PouchDB('evaluaciones495');
var db478 = new PouchDB('evaluaciones478');
var db475 = new PouchDB('evaluaciones475');
var db481 = new PouchDB('evaluaciones481');
var db442 = new PouchDB('evaluaciones442');
var db333 = new PouchDB('evaluaciones333');
var db243 = new PouchDB('evaluaciones243');
var db26 = new PouchDB('evaluaciones26');
var db245 = new PouchDB('evaluaciones245');
var db443 = new PouchDB('evaluaciones443');
var db441 = new PouchDB('evaluaciones441');
var db472 = new PouchDB('evaluaciones472');

const BASEURL = 'https://sisbenpro.com/visaludJamundi/public/';
const URL_CERRAR_SESION = 'cerrarSesion/';
const URL_INSCRITOS_VFP = 'inscritosVisual';
const URL_INSCRITOS_TABLET = 'inscritosTabla';
const URL_EVALUACIONES_TABLET = 'evaluacionesTabla';

dbNuevos493.changes({
	since: 'now',
	live: true
}).on('change', function(changes){
	mostrarInscritos493('493');
});

dbNuevos569.changes({
	since: 'now',
	live: true
}).on('change', function(changes){
	mostrarInscritos569('569');
});

dbNuevos444.changes({
	since: 'now',
	live: true
}).on('change', function(changes){
	mostrarInscritos444('444');
});

function verificarSesionLocal(){
	let estado = localStorage.getItem('estado');
	if (estado == 'false') {
		console.log(estado);
		window.location.replace("index.html");
	}else{
		console.log("Problemas con el if");
	}
}

verificarSesionLocal();

function dbActasForm(formulario){
	let db;
	switch(formulario){
		case '440':
			db = db440;
			break;
		case '474':
			db = db474;
			break;
		case '479':
			db = db479;
			break;
		case '480':
			db = db480;
			break;
		case '495':
			db = db495;
			break;
		case '478':
			db = db478;
			break;
		case '475':
			db = db475;
			break;
		case '481':
			db = db481; 
			break;
		case '442':
			db = db442;
			break;
		case '333':
			db = db333;
			break;
		case '243':
			db = db243;
			break;
		case '26':
			db = db26;
			break;
		case '245':
			db = db245;
			break;
		case '443':
			db = db443;
			break;
		case '441':
			db = db441;
			break;
		case '472':
			db = db472;
			break;
	}
	return db;
}

function calcularFecha(){
	let fecha = new Date();
	console.log(fecha.getFullYear());
	let mes = fecha.getMonth() + 1;
	let cadenaMes = mes < 10 ? '0' + mes : mes;
	let cadenaDia = fecha.getDate() < 10 ? '0' + fecha.getDate() : fecha.getDate();
	
	return {
		dia: cadenaDia,
		mes: cadenaMes,
		anio: fecha.getFullYear()
	};
}

function cargarInicio(formulario){
	let fecha = calcularFecha();
	let cadenaFecha = fecha.anio + '-' + fecha.mes + '-' + fecha.dia;
	console.log(cadenaFecha);
	document.getElementsByName('fecha' + formulario)[0].value = cadenaFecha;

	let db = dbActasForm(formulario);

	if(localStorage.getItem('evaluado') && (localStorage.getItem('firmaAut1') || localStorage.getItem('firmaAut2') || localStorage.getItem('firmaIns1') || localStorage.getItem('firmaIns2'))){
		let eva = JSON.parse(localStorage.getItem('evaluado'));
		eva.FIRMA_E1 = localStorage.getItem('firmaIns1');
		eva.FIRMA_E2 = localStorage.getItem('firmaIns2');
		eva.FIRMA_F1 = localStorage.getItem('firmaAut1');
		eva.FIRMA_F2 = localStorage.getItem('firmaAut2');
		
		persistirEvaluado(db, eva, formulario);
		
		localStorage.removeItem('evaluado');
		localStorage.removeItem('firmaAut1');
		localStorage.removeItem('firmaAut2');
		localStorage.removeItem('firmaIns1');
		localStorage.removeItem('firmaIns2');
	}
}

function setInicio(formulario){
	//alert("Se ejecuta setInicio");
	document.getElementById('municipio').innerHTML = "JAMUNDÍ";
	let form = "";
	switch(formulario){
		case '440':
			form = 'F-61';
			break;
		case '474':
			form = 'F-62';
			break;
		case '479':
			form = 'F-45';
			break;
		case '480':
			form = 'F-65';
			break;
		case '495':
			form = 'F-67';
			break;
		case '478':
			form = 'F-64';
			break;
		case '475':
			form = 'F-63';
			break;
		case '481':
			form = 'F-11'; 
			break;
		case '442':
			form = 'F-57';
			break;
		case '333':
			form = 'F-50';
			break;
		case '243':
			form = 'F-58';
			break;
		case '26':
			form = 'F-48'
			break;
		case '245':
			form = 'F-13'
			break;
		case '443':
			form = 'F-59';
			break;
		case '441':
			form = 'F-71';
			break;
		case '472':
			form = 'F-72';
			break;
		case '493':
			form = 'F-55'
			break
		case '569':
			form = 'F-54';
			break;
		case '444':
			form = 'F-53';
			break;
		default:
	}
	document.getElementById('nomForm').innerHTML = form;
	document.getElementById('formato').innerHTML = form;
	localStorage.setItem('form', form.substr(2));
	document.getElementsByName('mpio' + formulario)[0] ? 
		document.getElementsByName('mpio' + formulario)[0].value = "JAMUNDÍ": null;
	document.getElementsByName('ciudad' + formulario)[0] ? 
		document.getElementsByName('ciudad' + formulario)[0].value = "JAMUNDÍ": null;
	document.getElementsByName('mpioNotif' + formulario)[0] ?
		document.getElementsByName('mpioNotif' + formulario)[0].value = "JAMUNDÍ": null;
	document.getElementsByName('dpto' + formulario)[0] ? 
		document.getElementsByName('dpto' + formulario)[0].value = "VALLE DEL CAUCA": null;
	document.getElementsByName('depto' + formulario)[0] ? 
		document.getElementsByName('depto' + formulario)[0].value = "VALLE DEL CAUCA": null;
	document.getElementsByName('deptoNotif' + formulario)[0] ?
		document.getElementsByName('deptoNotif' + formulario)[0].value = "VALLE DEL CAUCA": null;
	document.getElementsByName('entidad' + formulario)[0] ? 
		document.getElementsByName('entidad' + formulario)[0].value = "SECRETARÍA DE SALUD MUNICIPAL - JAMUNDÍ": null;
	document.getElementsByName('inscripcion' + formulario)[0] ?
		document.getElementsByName('inscripcion' + formulario)[0].value = "76364": null;

	if(document.getElementsByName('nomTerr' + formulario)[0]){
		console.log("El campo nomTerr está definido");
		let arregloBarrios = [
			'CIRO VELASCO',
			'LA LIBERIA',
			'BELLO HORIZONTE',
			'PORTAL DE JAMUNDI',
			'LAS ACACIAS',
			'PORTAL DEL JORDAN',
			'POPULAR',
			'BELALCAZAR II',
			'POTRERITO',
			'ROBLES',
			'VILLA PAZ',
			'BELALCAZAR I',
			'CIUDADELA TERRANOVA',
			'LA ESMERALDA',
			'EL JORDAN',
			'PANAMERICANO',
			'ALFAGUARA',
			'EL SOCORRO',
			'QUINTAS DE BOLIVAR',
			'JORGE ELIECER GAITAN',
			'PUENTE VELEZ',
			'LIBERTADORES',
			'LA ESTACION',
			'SAN ISIDRO',
			'LA PRADERA',
			'CENTENARIO',
			'PASO DE LA BOLSA',
			'JUAN DE AMPUDIA',
			'BOCAS DEL PALO',
			'EL JARDIN',
			'ALFEREZ REAL',
			'VILLA DEL SOL',
			'SAN ANTONIO',
			'AMPUDIA',
			'ANGEL MARIA CAMACHO',
			'EL ROSARIO',
			'QUINAMAYO',
			'RANCHO ALEGRE',
			'VILLA COLOMBIA',
			'VILLA TATIANA',
			'LA VENTURA',
			'TIMBA',
			'LA ESTRELLA',
			'GUACHINTE',
			'EL PRIVILEGIO',
			'LA ISLA',
			'CIUDAD SUR',
			'RIO CLARO',
			'MUNICIPAL SACHAMATE',
			'SACHAMATE',
			'LOMA DE PIEDRA',
			'LA CEIBITA',
			'EL PORVENIR',
			'LA PLAYITA',
			'LAS MERCEDES',
			'SAN VICENTE',
			'SANTA ANA',
			'LA HOJARASCA',
			'CESTILLAL',
			'LAS BRISAS',
			'VILLA ESTELA',
			'EL CAMPITO',
			'EL RODEO',
			'SIMON BOLIVAR 2',
			'RIVERAS DEL ROSARIO',
			'EL GUABAL',
			'EL PILOTO',
			'RINCON DE LAS GARZAS',
			'LOS CRISTALES',
			'LA ESPERANZA',
			'LA ADRIANITA',
			'OPORTO',
			'RINCON DE ZARAGOZA',
			'LAS PILAS',
			'LA AURORA',
			'SAN PABLO',
			'LOS MANDARINOS',
			'VILLA MONICA',
			'VILLA PAULINA',
			'PEON',
			'PARQUES DE CASTILLA',
			'LA LUCHA',
			'CASCARILLAL',
			'VILLA PIME',
			'SANCHEZ',
			'CHAGRES',
			'LA NUEVA VENTURA',
			'PRIMAVERA CIUDADELA BONANZA',
			'CANTABRIA',
			'LA CABAÑA',
			'CHORRERA BLANCA',
			'MESETA',
			'PRIMERO DE MAYO',
			'CHONTADURO',
			'GATO DE MONTE',
			'TINAJAS',
			'PLAN DE MORALES',
			'LA PLAYA',
			'LAS PALMAS',
			'EL PITAL',
			'BELLA VISTA',
			'ALTO VELEZ',
			'EL ALBA',
			'LOMA LARGA',
			'PEÑAS NEGRAS',
			'PUEBLO NUEVE',
			'LA DESPENSA',
			'EL PLACER',
			'EL DESCANSO',
			'CAÑITAS',
			'SOLARES LA MORADA',
			'EL OSO',
			'VAREJONAL',
			'EL CEDRO',
			'COLINAS DE MIRA VALLE',
			'MAKUNAIMA',
			'NARANJAL',
			'COVICEDROS',
			'EL DIAMANTE',
			'EL PROGRESO',
			'CARRIZAL',
			'BERLIN',
			'LA MINA',
			'PORTAL DEL SAMAN II',
			'LA BERTHA',
			'EL DORADO',
			'SIGLO XXI',
			'LA ARBOLEDA',
			'PITALITO',
			'LA PRADERA MIRAVALLE',
			'JUAN PABLO II',
			'VILLA DE ALTAGRACIA',
			'LA MORADA',
			'SAN CAYETANO',
			'SANTA BARBARA',
			'CONDADOS DEL SUR',
			'LA FERREIRA',
			'VILLA ELVIRA',
			'PATIO BONITO',
			'SAN MIGUEL',
			'LA OLGA',
			'LA CLAVELLINA',
			'VILLA EMMA',
			'VILLA MAITE',
			'COUNTRY PLAZA I',
			'COLINDRES',
			'LA PRIMAVERA',
			'EL CRUCERO',
			'TIMBITA',
			'EL CABUYO',
			'LA BORRASCOSA',
			'EL RECREO',
			'LA BALASTRERA',
			'PARAISO DE SARDI',
			'COMUNEROS',
			'LA CIMA',
			'LA CRISTALINA',
			'EL BOSQUE',
			'EL SILENCIO',
			'SANTA ROSA (VILLA COLOMBIA)',
			'REMOLINO',
			'EL MORRO',
			'CAZADORES',
			'TRES ESQUINAS',
			'LA SELVA',
			'PLAYA LARGA',
			'FALDIQUERAS',
			'EL PALMAR',
			'LOS MANGOS',
			'COUNTRY PLAZA II',
			'CONJUNTO MADEIRA CLUB HOUSE',
			'LA HERRERIA',
			'LA PROFUNDA',
		]
		let madre = document.getElementsByName('nomTerr' + formulario)[0];
		arregloBarrios.sort();
		arregloBarrios.forEach( elemento => {
			let option = document.createElement('option');
			option.value = elemento;
			option.innerHTML = elemento;
			madre.appendChild(option);
		});
	}

	if(formulario == '26'){
		let arregloSujetos = [
			'479-1',
			'479-2',
			'479-3',
			'479-4',
			'479-5',
			'479-6',
			'481-1',
			'481-2',
			'481-3',
			'495-1',
			'495-2',
			'495-3',
			'495-4',
			'495-5',
			'495-6',
			'440-1',
			'440-2',
			'474-1',
			'474-2',
			'474-3',
			'474-4',
			'474-5',
			'474-6',
			'474-7',
			'474-8',
			'474-9',
			'478-1',
			'478-2',
			'478-3',
			'478-4',
			'475-1',
			'475-2',
			'472-1',
			'480-1',
			'480-2',
			'480-3',
			'480-4',
			'480-5',
			'480-6'
		];
		let madre = document.getElementsByName('tipoSujeto26')[0];
		arregloSujetos.forEach( elemento => {
			let option = document.createElement('option');
			option.value = elemento;
			option.innerHTML = elemento;
			madre.appendChild(option);
		});
	}
}

function calcularActaInscripcion(formulario, db){
	let codUsuario = localStorage.getItem('codigoUsuario');
	return db.info().then( result => {
		var ultimo = result.doc_count!=0 ? result.doc_count + 1: result.doc_count = 1;
		let indice = calcularIndice(ultimo);
		let fecha = calcularFecha();
		let year = fecha.anio.toString()
		let cadenaFecha = fecha.dia + fecha.mes + year.substring(2, 4);
		//console.log(indice);
		let acta = formulario + codUsuario + cadenaFecha + indice;
		console.log(acta);
		return acta;
	});
}

function cargarInicioInscripciones(formulario){
	agregarValidacionTextInputs(formulario);
	let db;
	let dbNuevos;
	switch(formulario){
		case '493':
			db = db493;
			dbNuevos = dbNuevos493;
			break;
		case '569':
			db = db569;
			dbNuevos = dbNuevos569;
			break;
		case '444':
			db = db444;
			dbNuevos = dbNuevos444;
			break;
	}
	let formu = localStorage.getItem('form');
	console.log("Valor de form!!!", formu);
	calcularActaInscripcion(formu, dbNuevos).then( acta => {
		console.log("Valor de acta recibido ", acta);
		let event = new Event('input');
		let objetoActa = document.getElementsByName('acta' + formulario)[0];
		objetoActa.value = acta;
		objetoActa.dispatchEvent(event);
	});
	if(localStorage.getItem('inscrito') && localStorage.getItem('firmaAutoridad') && localStorage.getItem('firmaInscribe') )
	{
		let ins = JSON.parse(localStorage.getItem('inscrito'));
		ins.FIRMA_F1 = localStorage.getItem('firmaAutoridad');
		ins.FIRMA_E1 = localStorage.getItem('firmaInscribe');

		/* calcularActaInscripcion(formulario, dbNuevos).then( acta => {
			ins.ACTA = acta;
		}); */
		persistirInscrito(db, dbNuevos, ins, 0);
		localStorage.removeItem('inscrito');
		localStorage.removeItem('firmaAutoridad');
		localStorage.removeItem('firmaInscribe');
	}
}

/* Desde aqui arranca funcionalidad relacionada con validaciones */

function ponerLabelError(element, mensaje){
	element.style.borderColor = "red";
	if(!document.getElementById(element.name)){
		let etiqueta = document.createElement('Label');
		let parent = element.parentNode;
		etiqueta.style.color = 'red';
		etiqueta.style.fontSize = '10px';
		etiqueta.setAttribute('id', element.name);
		etiqueta.innerHTML = mensaje;
		console.log(etiqueta);
		parent.insertBefore(etiqueta, element);
	}
}

function ponerLabelOk(element){
	let label = document.getElementById(element.name);
	if(label){
		label.parentNode.removeChild(label);
	}
	//element.style.removeProperty('borderColor');
	element.style.borderColor = "green";
}

function validarHallazgos(element, key){
	/* Se debe hacer parseInt sobre key, ya que no viene como entero... si no se hace, al sumar se concatena 
	como una cadena de caracteres. */
	let cadena = element[key].name.split('_');
	let hallazgo = document.getElementsByName('hallazgos_' + cadena[1] + '_' + (parseInt(key, 10) + 1));
	console.log("Contenido hallazgo: ", hallazgo[0].value);
	if(!hallazgo[0].value && element[key].value != 1){
		ponerLabelError(hallazgo[0], "Si el puntaje es diferente de 1, debe incluir al menos un hallazgo");
	}else{
		ponerLabelOk(hallazgo[0]);
	}
}

function validarLongitudInput(elemento, longitud, mensaje){
	console.log("Valor input: ", elemento.value);
	console.log("Longitud input: ", elemento.value.length);
	if(elemento.value.length > longitud){
		ponerLabelError(elemento, mensaje);
	}else{
		ponerLabelOk(elemento);
	}
}

function agregarValidacionTextInputs(formulario){
	/* El campo noloca tambien es de longitud maxima 50, pero no se incluye porque se escoge de un dropdown list */
	let nombresInput = "input[name='propietario" + formulario + "'], input[name='repLegal" + formulario + "'], "
						+ "input[name='persona" + formulario + "-1'], input[name='persona" + formulario + "-2'], "
						+ "input[name='funcionario" + formulario + "-1'], input[name='funcionario" + formulario + "-2'], "
						+ "input[name='dirNotif" + formulario + "'], input[name='direccion" + formulario + "'], "
						+ "input[name='cual569'] ";
	let nombres = document.querySelectorAll(nombresInput);
	nombres.forEach(element => {
		// El evento input captura los cambios de texto dentro de un elemento input
		element.addEventListener('input', validarLongitudInput.bind(this, element, 50, 
								"No puede escribir más de 50 caracteres en este campo"));
	});

	/* validación de campo inscripción */
	/* Ejemplo de uso de var vs let... en este caso, si se pone let, longitud no es reconocida dentro del forEach*/
	var longitud = formulario != '444' ? 15 : 11; 
	let inputInscripcion = "input[name='inscripcion" + formulario  + "']";
	let objetosInscripcion = document.querySelectorAll(inputInscripcion);
	objetosInscripcion.forEach( elemento => {
		elemento.addEventListener('input', validarLongitudInput.bind(this, elemento, longitud,
			"No puede escribir más de " + longitud + " caracteres en este campo"));
	});

	/* Validación campo Acta */
	longitud = 14;
	let inputActa = "input[name='acta" + formulario  + "']";
	let objetosActa = document.querySelectorAll(inputActa);
	objetosActa.forEach( elemento => {
		elemento.addEventListener('input', validarLongitudInput.bind(this, elemento, longitud, 
								"No puede escribir más de " + longitud + " caracteres en este campo"));
	});

	/* validaciones para numeros de identificación (cedulas) */
	let cedulas = "input[name='idPropietario" + formulario + "'], input[name='idRepLegal" + formulario + "'], "
						+ "input[name='idFuncionario" + formulario + "-1']," + "input[name='idFuncionario" + formulario + "-2'],"
						+ "input[name='idPersona" + formulario + "-1']," + "input[name='idPersona" + formulario + "-2']";
	let medianos = document.querySelectorAll(cedulas);
	medianos.forEach(element => {
		element.addEventListener('input', validarLongitudInput.bind(this, element, 12,
								"No puede escribir más de 12 caracteres en este campo"));
	});

	/* correo, horarios, objeto */
	let medianosInput = "input[name='correoProp" + formulario + "'], input[name='horarios" + formulario + "'], "
						+ "input[name='objeto" + formulario + "']";
	let medianos = document.querySelectorAll(medianosInput);
	medianos.forEach(element => {
		element.addEventListener('input', validarLongitudInput.bind(this, element, 70,
								"No puede escribir más de 70 caracteres en este campo"));
	});

	/* numeroActa para muestras, cargos, matriculaMercantil, otrasEspecies440, otro472 */
	let cortosInput = "input[name='numeroActa" + formulario + "'], input[name='matriculaMercantil" + formulario + "'], "
						+ "input[name='otrasEspecies" + formulario + "'], input[name='otro" + formulario + "'], "
						+ "input[name='cargoFuncionario" + formulario + "-1'], input[name='cargoFuncionario" + formulario + "-2'], "
						+ "input[name='cargoPersona" + formulario + "-1'], input[name='cargoPersona" + formulario + "-2'] ";
	let cortos = document.querySelectorAll(cortosInput);
	cortos.forEach(element => {
		element.addEventListener('input', validarLongitudInput.bind(this, element, 30, 
								"No puede escribir más de 30 caracteres en este campo"));
	});

	/* validaciones en razón social y nombre comercial */
	let nombresComercialesInput = "input[name='razonSocial" + formulario + "'], input[name='nombreComercial" + formulario + "'] ";
	let nombresComerciales = document.querySelectorAll(nombresComercialesInput);
	nombresComerciales.forEach(element => {
		element.addEventListener('input', validarLongitudInput.bind(this, element, 100, 
								"No puede escribir más de 100 caracteres en este campo"))
	});

	/* validaciones en textAreas */
	let stringHallazgos = '';
	for(let i = 1; i<=6; i++){
		for(let j = 1; j<=6; j++){
			stringHallazgos += "textarea[name='hallazgos_" + i + "_" + j + "'], ";
		}
	}
	let nombresTextAreas = "textarea[name='obAutoridad" + formulario + "'], textarea[name='obPersona" + formulario + "'], "
					 + stringHallazgos + "textarea[name='medida" + formulario + "'], " 
					 + "textarea[name='requerimientos" + formulario + "'], "
					 + "textarea[name='observaciones']";
	let textAreas = document.querySelectorAll(nombresTextAreas);
	textAreas.forEach(elemento => {
		elemento.addEventListener('input', validarLongitudInput.bind(this, elemento, 254, 
								"No puede escribir más de 254 caracteres en este campo"));
	});

	/* validaciones en hallazgos cuando hay evaluación negativa */
	let stringEvaluaciones = '';
	let evaluaciones = [];
	for(let i = 1; i<=6; i++){
		stringEvaluaciones = "select[name='evaluacion_" + i + "'] ";
		evaluaciones.push(document.querySelectorAll(stringEvaluaciones));
	}
	evaluaciones.forEach( element => {
		/* Debido a que en la key vienen indices no numericos como length y otros, se verifica con isNaA */ 
		for (let key in element){
			if (!isNaN(key)){
				element[key].addEventListener('change', validarHallazgos.bind(this, element, key));
			}
		}
	});
}

/* La funcionalidad de validaciones termina con el llamado al metodo desde una funcion de arranque en todas las vistas */
function verificarAccionForm(formulario){
	agregarValidacionTextInputs(formulario);
	localStorage.getItem('Accion') == 'cargarServidor' ? cargarServidor(formulario) : console.log('No hay Acción');
}

function verificarAccion(){
	if (localStorage.getItem('Accion')) {
		console.log('Acción en localStorage', localStorage.getItem('Accion'));
		switch(localStorage.getItem('Accion')){
			case 'cargarInscritos493':
				cargarInscritos('493');
				break;
			case 'cargarInscritos444':
				cargarInscritos('444');
				break;
			case 'cargarInscritos569':
				cargarInscritos('569');
				break;
			case 'cargarTodosLosInscritos':
				cargarTodosLosInscritos();
				break;
			case 'cargarCensos':
				cargarCensos();
				break;
			default:
			break;
		}
	}else{
		console.log("No hay acción");
	}
}

function createColumns(arreglo){
	var td = document.createElement('td');
	td.innerHTML = arreglo;
	return td;
}

function calcularIndice(ultimo){
	let indice;
	if(ultimo < 10){
		indice = '000' + String(ultimo);
	}else if (ultimo >= 10 && ultimo < 100){
		indice = '00' + String(ultimo);
	}else if (ultimo >= 100 && ultimo < 1000){
		indice = '0' + String(ultimo);
	}else{
		indice = String(ultimo);
	}
	return indice;		
}

function calcularNumActa(formulario, form){
	let db = dbActasForm(formulario);
	let codUsuario = localStorage.getItem('codigoUsuario');
	return db.info().then( result => {
		var ultimo = result.doc_count!=0 ? result.doc_count + 1: result.doc_count = 1;
		let indice = calcularIndice(ultimo);
		let fecha = calcularFecha();
		let year = fecha.anio.toString()
		let cadenaFecha = fecha.dia + fecha.mes + year.substring(2, 4);
		//console.log(indice);
		let acta = form + codUsuario + cadenaFecha + indice;
		console.log(acta);
		return acta;
	});
}

function escogerInscrito(registro, formulario){
	document.getElementsByName('inscripcion' + formulario)[0].value = registro.N_INSCRIP;
	document.getElementsByName('direccion' + formulario)[0].value = registro.DIRECC;
	document.getElementsByName('correoProp' + formulario)[0].value = registro.CORREO;
	document.getElementsByName('tel' + formulario)[0].value = registro.TELS;
	document.getElementsByName('cel' + formulario)[0].value = registro.CELULAR;
	document.getElementsByName('propietario' + formulario)[0].value = registro.NOMBRE_P;
	document.getElementsByName('idPropietario' + formulario)[0].value = registro.DOC_P;
	document.getElementsByName('tipoIdProp' + formulario)[0].value = registro.TID_P;
	document.getElementsByName('autorizaNoti' + formulario)[0].value = registro.AUTORIZA;

	if(formulario == '333' || formulario == '243'){
		document.getElementsByName('nomTerr' + formulario)[0].value = registro.NOLOCA;
		document.getElementsByName('razonSocial' + formulario)[0].value = registro.RSO;
		document.getElementsByName('nit' + formulario)[0].value = registro.NIT;
		let formu = localStorage.getItem('form');
		console.log("lo que se recoge de localstorage", formu);
		calcularNumActa(formulario, formu).then( acta => {
			console.log("Valor de acta recibido ", acta);
			let event = new Event('input');
			let objetoActa = document.getElementsByName('acta' + formulario)[0];
			objetoActa.value = acta;
			objetoActa.dispatchEvent(event);
		});
	}else{
		document.getElementsByName('fax' + formulario)[0].value = registro.FAX;
		document.getElementsByName('deptoNotif' + formulario)[0].value = registro.DPTO_NOTI ? 
			registro.DPTO_NOTI : 
			document.getElementsByName('deptoNotif' + formulario)[0].value;
		document.getElementsByName('mpioNotif' + formulario)[0].value = registro.MPIO_NOTI ? 
			registro.MPIO_NOTI : 
			document.getElementsByName('mpioNotif' + formulario)[0].value;
		
		if(formulario == '444' || formulario == '472' || formulario == '441'){
			console.log('Inscritos 444');
			document.getElementsByName('marca' + formulario)[0].value = registro.MARCAV;
			document.getElementsByName('modelo' + formulario)[0].value = registro.MODELOV;
			document.getElementsByName('placa' + formulario)[0].value = registro.PLACA;
			document.getElementsByName('isotermo' + formulario)[0].value = registro.ISOTERMO;
			document.getElementsByName('ufrio' + formulario)[0].value = registro.U_UFRIO;
			document.getElementsByName('producto' + formulario)[0].value = registro.PRODUCTO;
			if (formulario == '444' || formulario == '441') {
				document.getElementsByName('furgon' + formulario)[0].value = registro.FURGON;
				document.getElementsByName('rmque' + formulario)[0].value = registro.REMOLQUE;
				document.getElementsByName('placaRemolque' + formulario)[0].value = registro.PLACAREM;
				document.getElementsByName('srmque' + formulario)[0].value = registro.SEMIREM;
				document.getElementsByName('placaSrmque' + formulario)[0].value = registro.PLACASEMI;	
			}
		}else{ 
			document.getElementsByName('dirNotif' + formulario)[0].value = registro.DIR_NOT;
			document.getElementsByName('nombreComercial' + formulario)[0].value = registro.NOCO;
			document.getElementsByName('razonSocial' + formulario)[0].value = registro.RSO;
			document.getElementsByName('nit' + formulario)[0].value = registro.NIT;
			document.getElementsByName('nomTerr' + formulario)[0].value = registro.NOLOCA;
			document.getElementsByName('matriculaMercantil' + formulario)[0].value = registro.MAMER;
	
			if (registro.TERRITORIO != undefined) {
				console.log('Territorio: ', registro.TERRITORIO);
				switch(registro.TERRITORIO){
					case 'barrio':
						$('#barrio').prop('checked', true);
						break;
					case 'corregimiento':
						$('#corregimiento').prop('checked', true);
						break;
					case 'vereda':
						$('#vereda').prop('checked', true);
						break;
					default:
					break;
				}
			}else{
				console.log('Territorio Null');
				$('input:radio[name=territorio'+formulario+']').prop('checked', false);
			}
	
			if (formulario != '442'){
				document.getElementsByName('concepto' + formulario)[0].value = registro.CCUV;
				document.getElementsByName('textoConcepto' + formulario)[0].value = registro.CUV;
				document.getElementsByName('fechaUltVisita' + formulario)[0].value = registro.F_UV;
			}	
		}
	
		if(formulario == '493' || formulario == '569'|| formulario == '444'){
			console.log('Debería estar en ' + formulario);
			document.getElementsByName('acta' + formulario)[0].value = registro.ACTA;
			document.getElementsByName('id' + formulario)[0].value = registro._id;
			document.getElementsByName('fecha' + formulario)[0].value = registro.FECHA;
			document.getElementsByName('obAutoridad' + formulario)[0].value = registro.OBSERVA_AU;
			document.getElementsByName('obPersona' + formulario)[0].value = registro.OBSERVA_F1;
			document.getElementsByName('inscribe' + formulario)[0].value = registro.NOMBRE_E1;
			document.getElementsByName('idInscribe' + formulario)[0].value = registro.ID_E1;
			document.getElementsByName('recibe' + formulario)[0].value = registro.NOMBRE_F1;
			document.getElementsByName('idRecibe' + formulario)[0].value = registro.ID_F1;
			if(formulario != '444'){
				document.getElementsByName('funcUltVisita' + formulario)[0].value = registro.DIR_NOT_E;
				document.getElementsByName('visitado' + formulario)[0].value = registro.VISITADO;
			}else{
				document.getElementsByName('inscripcionRep444')[0].value = registro.N_INSCRIP;
				document.getElementsByName('fecha444_2')[0].value = registro.FECHA;
				document.getElementsByName('funcionario444')[0].value = registro.NOMBRE_F1;
			}
		}else{
			// Aquí se puede introducir un método para calcular automáticamente un número de acta
			let formu = localStorage.getItem('form');
			calcularNumActa(formulario, formu).then( acta => {
				console.log("Valor de acta recibido ", acta);
				let event = new Event('input');
				let objetoActa = document.getElementsByName('acta' + formulario)[0];
				objetoActa.value = acta;
				objetoActa.dispatchEvent(event);
			});
			
			let alerta = document.getElementsByName('alertaInscrito');
			let arreglo = Array.from(alerta); //en este caso alerta es un iterable pero no un arreglo, hay que convertirlo primero
			let arr = arreglo.map( item => {
				item.style.display = "none";
				return item;
			});
			document.getElementsByName('entidad' + formulario).value = registro.ENTIDAD;
		}
	
		if (formulario == '493') {
			console.log('Estamos en ' + formulario);
			console.log("registro.actividad", registro.ACTIVIDAD);
			
			document.getElementsByName('cargoRecibe' + formulario)[0].value = registro.CARGO_F1;
			document.getElementsByName('cargoInscribe' + formulario)[0].value = registro.CARGO_E1;
	
			if (registro.ACTIVIDAD != null){
				if (registro.ACTIVIDAD.length != 0) {
					var actividad = [];
					for (let i = 0; i < document.getElementsByName('actividad' + formulario).length; i++) {
						actividad.push(document.getElementsByName('actividad' + formulario)[i].value);
					}
	
					var mapActividad = new Map();
					var j = 0;
					// El siguiente for busca si la key está en el array, busca por el key. Con forEach 
					//hay que cambiar el orden
					for (let valor in registro.ACTIVIDAD){
						mapActividad.set(registro.ACTIVIDAD[valor].toUpperCase(),valor);
						j++;
					}
					//var mapActividad = new Map(registro.ACTIVIDAD);
					console.log(mapActividad);
					console.log(JSON.stringify(registro.ACTIVIDAD));
	
					$('input:checkbox[name=actividad'+formulario+']').prop('checked', false);
	
					for (let i = 0; i < actividad.length; i++) {
						//console.log(actividad[i]);
						//console.log(mapActividad.has(actividad[i]));
						mapActividad.has(actividad[i]) ? $('input:checkbox[value='+actividad[i]+']').prop('checked', true) : $('input:checkbox[value='+actividad[i]+']').prop('checked', false);			
					};
				}else{
					$('input:checkbox[name=actividad'+formulario+']').prop('checked', false);
				}	
			}else{
				$('input:checkbox[name=actividad'+formulario+']').prop('checked', false);
			}
		}
	
		if (formulario == '569' || formulario == '440') {
			document.getElementsByName('repLegal' + formulario)[0].value = registro.NOMBRE_RL;
			document.getElementsByName('tipoIdRl' + formulario)[0].value = registro.TID_RL;
			document.getElementsByName('idRepLegal' + formulario)[0].value = registro.DOC_RL;
		}
	
		if(formulario == '569'){
			document.getElementsByName('dependencia' + formulario)[0].value = registro.DEPENDEN;
			document.getElementsByName('expendio' + formulario)[0].value = registro.EXPENDIO;
			document.getElementsByName('almacena' + formulario)[0].value = registro.ALMACENA;
			document.getElementsByName('deposito' + formulario)[0].value = registro.DEPOSITO;
			document.getElementsByName('despresa' + formulario)[0].value = registro.DESPRESA;
		}
	}
}

function setCodigoConcepto(concepto){
	let codigo;
	switch(concepto){
		case 'FAVORABLE':
			codigo = '1';
			break;
		case 'DESFAVORABLE':
			codigo = '3';
			break;
		case 'SIN CONCEPTO':
			codigo = '';
			break;
		default:
			codigo = '2';
			break;
	}
	console.log('codigo', codigo);
	return codigo;
}

function escogerCensado(registro, formulario){
	document.getElementsByName('razonSocial' + formulario)[0].value = registro.rso;
	document.getElementsByName('propietario' + formulario)[0].value = formulario !== '245' ? 
		registro.nombre_p : '';
	document.getElementsByName('idPropietario' + formulario)[0].value = formulario !== '245' ? 
		registro.doc_p : '';
	document.getElementsByName('repLegal' + formulario)[0].value = formulario == '245' ? 
		registro.nombre_rl : '';
	document.getElementsByName('idRepLegal' + formulario)[0].value = formulario == '245' ? 
		registro.doc_rl : '';
	document.getElementsByName('direccion' + formulario)[0].value = registro.direcc;
	document.getElementsByName('tel' + formulario)[0].value = registro.tels;
	document.getElementsByName('correoProp' + formulario)[0].value = registro.correo;
	formulario !== '245' ? 
		document.getElementsByName('fechaUltVisita' + formulario)[0].value = registro.f_uv : '';
	formulario !== '245' ? 
		document.getElementsByName('textoConcepto' + formulario)[0].value = registro.cuv : '';
	formulario !== '245' ? 
		document.getElementsByName('funcUltVisita' + formulario)[0].value = registro.nombre_f1 : '';
	if (formulario !== '245'){
		document.getElementsByName('concepto' + formulario)[0].value = registro.cuv ? 
			setCodigoConcepto(registro.cuv) : '';
	}else{
		let formu = localStorage.getItem('form');
		calcularNumActa(formulario, formu).then( acta => {
			console.log("Valor de acta recibido ", acta);
			document.getElementsByName('acta' + formulario)[0].value = acta;
		});
	}
	let alerta = document.getElementsByName('alertaInscrito');
	let arreglo = Array.from(alerta); //en este caso alerta es un iterable pero no un arreglo, hay que convertirlo primero
	arreglo.forEach( item => {
		item.style.display = "none";
		return item;
	});
	console.log('Registro', registro);
}

function createRadio(registro, formulario, funcionEscoger='inscrito'){
	var radio = document.createElement('input');
	radio.type = 'radio';
	radio.setAttribute('name',"seleInscrito");
	radio.value = registro._id;
	funcionEscoger == 'inscrito' ?
	radio.addEventListener('click', escogerInscrito.bind(this, registro, formulario)) :
	radio.addEventListener('click', escogerCensado.bind(this, registro, formulario));

	var span = document.createElement('span');
	span.className = 'input-group-addon';
	span.appendChild(radio);

	var td = document.createElement('td');
	td.appendChild(span);

	return td;
}

function crearTabla(doc, idBody, idTabla, formulario, formularioActual){
	var tbody = document.getElementById(idBody);
		tbody.innerHTML = '';
		var contador = 0;
		doc.rows.forEach( registro => {
			//console.log(registro.doc._id);
			var extra;
			switch(formulario){
				case '493':
					extra = registro.doc.NOCO;
					break;
				case '569':
					extra = registro.doc.RSO;
					break;
				case '444':
					extra = registro.doc.PLACA === null ? registro.doc.PLACAREM : registro.doc.PLACA;
					break;
				default:
			}
			contador++;
			var tr = document.createElement('tr');
			tr.appendChild(createColumns(contador));
			tr.appendChild(createColumns(registro.doc._id));
			tr.appendChild(createColumns(extra));
			tr.appendChild(createColumns(registro.doc.ACTA));
			tr.appendChild(createColumns(registro.doc.FECHA));
			tr.appendChild(createColumns(registro.doc.NOMBRE_P));
			tr.appendChild(createColumns(registro.doc.DOC_P));
			tr.appendChild(createRadio(registro.doc, formularioActual));
			tbody.appendChild(tr);
		});
		$(idTabla).DataTable();
		return tbody;
}

function mostrarInscritos493(formulario){
	db493.allDocs({include_docs: true, descending: true}).then ( doc => {
		crearTabla(doc, 'inscritos', '#tablaInscritos', '493', formulario);
	});

	dbNuevos493.allDocs({include_docs: true, descending: true}).then ( doc => {
		crearTabla(doc, 'inscritosNuevos', '#tablaInscritosNuevos', '493', formulario);
	});
}

function mostrarInscritos569(formulario){
	db569.allDocs({include_docs: true, descending: true}).then ( doc => {
		crearTabla(doc, 'inscritos569', '#tablaInscritos569', '569', formulario);
	});

	dbNuevos569.allDocs({include_docs: true, descending: true}).then ( doc => {
		crearTabla(doc, 'inscritosNuevos569', '#tablaInscritosNuevos569', '569', formulario);
	});
}

function mostrarInscritos444(formulario){
	db444.allDocs({include_docs: true, descending: true}).then ( doc => {
		crearTabla(doc, 'inscritos444', '#tablaInscritos444', '444', formulario);
	});

	dbNuevos444.allDocs({include_docs: true, descending: true}).then ( doc => {
		crearTabla(doc, 'inscritosNuevos444', '#tablaInscritosNuevos444', '444', formulario);
	});
}

function crearTablaCenso(doc, idBody, idTabla, formulario, formularioActual){
	var tbody = document.getElementById(idBody);
		tbody.innerHTML = '';
		var contador = 0;
		doc.rows.forEach( registro => {
			// console.log('registro en crearTablaCenso', registro.doc);
			var extra = formulario == 'censov' ? registro.doc.placa : registro.doc.nit;
			contador++;
			var tr = document.createElement('tr');
			tr.appendChild(createColumns(contador));
			tr.appendChild(createColumns(registro.doc._id));
			tr.appendChild(createColumns(registro.doc.rso));
			tr.appendChild(createColumns(extra));
			formulario !== 'censosv' ? 
				tr.appendChild(createColumns(registro.doc.nombre_p)) : 
				tr.appendChild(createColumns(registro.doc.nombre_rl));
			formulario !== 'censosv' ? 
				tr.appendChild(createColumns(registro.doc.doc_p)) : 
				tr.appendChild(createColumns(registro.doc.doc_rl));
			tr.appendChild(createRadio(registro.doc, formularioActual, 'censo'));
			tbody.appendChild(tr);
		});
		$(idTabla).DataTable();
		return tbody;
}

function mostrarCenso(formulario){
	let db;
	let tbody;
	let tabla;
	let formuLlamado;
	switch(formulario){
		case 'censo':
			db = censo;
			tbody = 'censados';
			tabla = '#censo';
			formuLlamado = '493';
			break;
		case 'censoc':
			db = censoc;
			tbody = 'censadosc';
			tabla = '#censoc';
			formuLlamado = '569';
			break;
		case 'censov':
			db = censov;
			tbody = 'censadosv';
			tabla = '#censov';
			formuLlamado = '444';
			break;
		case 'censosv':
			db = censosv;
			tbody = 'censadossv';
			tabla = '#censosv';
			formuLlamado = '245';
			break;
	}
	if (db){
		db.allDocs({include_docs: true, descending: true}).then ( doc => {
			crearTablaCenso(doc, tbody, tabla, formulario, formuLlamado);
		})
		.catch(err => console.log('error recorriendo la db', err));
	}
}

function guardarTraidos(formulario, dbBase, respObj){
	dbBase.destroy().then( response => {
		console.log('Base de datos anterior eliminada');
		dbBase = new PouchDB('inscritosCargados' + formulario);
		console.log('Nueva base de datos creada');
		
		let count = 0;
		let long = respObj.length;
		respObj.forEach( registro => {
			//console.log('Registro: ',registro);
			let indice  = calcularIndice(registro.id);
			let id = { _id: indice };
						
			if (registro.ACTIVIDAD) {
				registro.ACTIVIDAD = JSON.parse(registro.ACTIVIDAD);	
			}
			
			// Los inscritos que vienen desde el servidor vienen sin numero de acta
			//registro.ACTA = " ";
			// Con la siguiente línea se añade la variable _id al objeto			
			registro = Object.assign(id, registro);   
			//console.log('Registro: ',registro);
			dbBase.put(registro, function callback(err, result){
				if (!err) {
					if (count != long - 1) {
						count++;
						console.log('inscrito guardado en base de datos: ', count);	
					}else{
						alert("Inscritos formulario " + formulario + " cargados correctamente");
						localStorage.removeItem('Accion');
					}
				}else {
					console.log('problemas guardando inscrito en base de datos', err);
				}
			});
		});
	});	
}

function cerrarSesionServidor(){
	var identidad = JSON.parse(localStorage.getItem('identity'));
	if (identidad != undefined) {
		fetch( BASEURL + URL_CERRAR_SESION + identidad.usuario)
		.then( res => res.json() )
		.then( jsonRes => alert(jsonRes.res) )
		.catch( err => alert("Problemas en la respuesta del servidor " + err) );
		localStorage.removeItem('identity');
	}else{
		alert('No hay una sesión abierta con el servidor en este momento');
	}	
}

function verificarSesion(){
	var identidad = localStorage.getItem('identity');
	console.log(identidad);
	return identidad != undefined ? true: false;
}

function fetchInscritos(formulario){
	console.log(verificarSesion());
	if (verificarSesion()) {
		var credenciales = JSON.parse(localStorage.getItem('identity'));
		var data = 'nombreUsuario='+credenciales.usuario+'&'
					+'token='+credenciales.token+'&'
					+'formulario='+formulario;
		console.log('Estamos en el formulario: ', formulario);
		
		return new Promise((resolve, reject) => {
			fetch( BASEURL + URL_INSCRITOS_VFP, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					//mode: 'no-cors',
					body: data
				})
				.then( res => resolve(res) )
				.catch( err => reject(err) );
			}).then( resp => resp.json() )
			.catch( error=>error.json() );
	} else{
		location.assign("./loginserver.html");
	}
}

function dbInscritosFromForm(formulario){
	let db;
	switch(formulario){
		case '493':
			db = db493;
			break;
		case '569':
			db = db569;
			break;
		case '444':
			db = db444;
			break;
	}
	return db;
}

//Aquí se usa la función json(), que funciona similar a JSON.parse()
function cargarInscritos(formulario){
	let db = dbInscritosFromForm(formulario);
	//if(!localStorage.getItem('identity')){
		localStorage.getItem('Accion') == 'cargarInscritos' + formulario ? 
			localStorage.removeItem('Accion') :
			localStorage.setItem('Accion', 'cargarInscritos' + formulario);
	//}
	var promesa = fetchInscritos(formulario);
	promesa.then( respObj => {
		if (respObj.err != undefined) {
			respObj.err == "ERROR TOKEN" ? 
			alert('Hubo problemas con el servidor. Es necesario cerrar Sesión con el servidor y volver a introducir credenciales') : 
			alert('Error: ' + respObj.err);
		}else{
			guardarTraidos(formulario, db, respObj);
				//cerrarSesionServidor();
		}		
	}).catch( err => console.log('Error: ', err) );
}

function cargarTodosLosInscritos(){
//	if(!localStorage.getItem('identity')){
		localStorage.getItem('Accion') == 'cargarTodosLosInscritos' ?
			localStorage.removeItem('Accion') :
			localStorage.setItem('Accion', 'cargarTodosLosInscritos');
//	}	
	let promesa = fetchInscritos('493');
	promesa.then( respObj => {
		if (respObj.err != undefined) {
			respObj.err == "ERROR TOKEN" ? 
			alert('Hubo problemas!! Es necesario cerrar Sesión con el servidor y volver a introducir credenciales') : 
			alert('Error: ' + respObj.err);
			return;
		}	
		guardarTraidos('493', db493, respObj);
		let promesa1 = fetchInscritos('569');
		promesa1.then( respObj1 => {
			guardarTraidos( '569', db569, respObj1 );
			let promesa2 = fetchInscritos('444');
			localStorage.removeItem('Accion');
			promesa2.then ( respObj2 => guardarTraidos( '444', db444, respObj2 ) )
					.catch( err2 => console.log('Error', err2 ) );
		}).catch( err1 => console.log('Error: ', err1) );

	}).catch( err => console.log('Error: ', err) );	
}

function guardarCensos(formulario, dbBase, respObj, bandera, banderaAlerta){
	dbBase.destroy().then( response => {
		console.log('Base de datos anterior eliminada');
		dbBase = new PouchDB(formulario);
		console.log('Nueva base de datos creada');
		
		let count = 0;
		let long = respObj.length;
		respObj.forEach( registro => {
			//console.log('Registro: ',registro);
			let indice  = calcularIndice(registro.id);
			let id = { _id: indice };
			let alerta = document.getElementsByName('mensajesServicios')[banderaAlerta];
			// Los inscritos que vienen desde el servidor vienen sin numero de acta
			//registro.ACTA = " ";
			// Con la siguiente línea se añade la variable _id al objeto			
			registro = Object.assign(id, registro);   
			//console.log('Registro: ',registro);
			dbBase.put(registro, function callback(err, result){
				if (!err) {
					if (count != long - 1) {
						count++;
						alerta.style.display = 'block';
						alerta.innerHTML = 'Censados guardados en base de datos: ' + count;
						console.log('Censados guardados en base de datos: ', count);	
					}else{
						alerta.style.display = 'block';
						alerta.innerHTML = "Registros de " + bandera + " cargados correctamente";
						console.log("Registros de " + bandera + " cargados correctamente");
						localStorage.removeItem('Accion');
					}
				}else {
					alerta.style.display = 'block';
					alerta.innerHTML = 'problemas guardando inscrito en base de datos' + err;
					console.log('problemas guardando inscrito en base de datos', err);
				}
			});
		});
	});	
}

function cargarCensos() {
	let banderaAlerta;
	if(localStorage.getItem('Accion')){
		localStorage.getItem('Accion') == 'cargarCensos' ?
				localStorage.removeItem('Accion') :
				localStorage.setItem('Accion', 'cargarCensos');
		banderaAlerta = 1;
	}else{
		localStorage.setItem('Accion', 'cargarCensos');
		banderaAlerta = 0;
	}
	let promesas = [];
	promesas[0] = fetchInscritos('censo')
					.then(resp => guardarCensos('censo', censo, resp, 'Censo Alimentos', banderaAlerta))
					.catch(err => console.log('problemas con el fetch a censo', err));
	promesas[1] = fetchInscritos('censoc')
					.then(resp => guardarCensos('censoc', censoc, resp, 'Censo Carnes', banderaAlerta))
					.catch(err => console.log('problemas con el fetch a censo', err));
	promesas[2] = fetchInscritos('censov')
					.then(resp => guardarCensos('censov', censov, resp, 'Censo Vehículos', banderaAlerta))
					.catch(err => console.log('problemas con el fetch a censo', err));
	promesas[3] = fetchInscritos('censosv')
					.then(resp => guardarCensos('censosv', censosv, resp, 'Censo Sujetos Varios', banderaAlerta))
					.catch(err => console.log('problemas con el fetch a censo', err));
	Promise
		.all(promesas)
		.then( () => console.log('Todos los censos fueron cargados correctamente'))
		.catch(err => console.log('Error en carga de uno de los censos', err));
}

function fetchEvaluados(doc, formulario, url){
	var credenciales = JSON.parse(localStorage.getItem('identity'));
	let credentials = {
		nombreUsuario: credenciales.usuario,
		token: credenciales.token,
		formulario: formulario
	};
	let bigDoc = Object.assign(credentials, doc);
	let data = JSON.stringify(bigDoc);
	console.log(data);
	return new Promise((resolve, reject) => {
		fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: data
		}).then( res => {
			if(res.status == 500){
				return fetchEvaluados(doc, formulario, url)
				.then( body => resolve(body) );
				//.then( () => setTimeout( () => alert("Registros cargados en servidor"), 1500) );	
			}else{
				res.json().then( body => resolve(body)	)
			} 
		})
		.catch( err => reject([err, doc.ACTA]) );
	});
}

function cargarServidor(formulario){
	localStorage.getItem('Accion') == 'cargarServidor' ?
			localStorage.removeItem('Accion') :
			localStorage.setItem('Accion', 'cargarServidor');
			
	let db;
	let urltofetch;
	switch (formulario) {
		case '493':
		db = dbNuevos493;
		urltofetch = BASEURL + URL_INSCRITOS_TABLET;
		break;
		case '569':
		db = dbNuevos569;
		urltofetch = BASEURL + URL_INSCRITOS_TABLET;
		break;
		case '444':
		db = dbNuevos444;
		urltofetch = BASEURL + URL_INSCRITOS_TABLET;
		break;
		default:
		db = dbActasForm(formulario);
		urltofetch = BASEURL + URL_EVALUACIONES_TABLET;
		break;
	}

	if (verificarSesion()) {
		localStorage.removeItem('Accion');	
		db.allDocs({include_docs: true, descending: true}).then( doc => {
			console.log('Cantidad de registros en indexDB para este formulario: ', doc.rows.length);
			// console.log(JSON.stringify(doc.rows));
			let promesas = doc.rows.map( registro => fetchEvaluados(registro.doc, formulario, urltofetch));
			console.log(promesas);
			Promise
				.all(promesas)
				.then( respuesta => {
					//let mensaje = [];
					let cuerpo = document.getElementById('cuerpoRespuesta');
					cuerpo.innerHTML = '';
					respuesta.forEach(element => {
						let texto = document.createElement('p');
						texto.innerHTML = element.res;
						cuerpo.appendChild(texto);
					});
				})
				.catch( (err) => {
					let cuerpo = document.getElementById('cuerpoRespuesta');
					cuerpo.innerHTML = '';
					let texto = document.createElement('p');
					texto.innerHTML = "El acta " + err[1] + " no pudo ser almacenada. Inténtelo de nuevo hasta confirmar que todas las actas hayan sido enviadas";
					cuerpo.appendChild(texto);
				}); 
				//.catch( (err) => alert("Problemas con el envío de registros: ", err ) );
		});	
	} else{
		location.assign("./loginserver.html");
	}
}

function persistirInscrito(dbBase, dbNuevos, inscrito, idExistente){
	//var id = 0;
	if(idExistente == 0){
		dbNuevos.info().then( result => {
			var ultimo = result.doc_count + 1;
			let indice  = calcularIndice(ultimo);
			console.log(indice);
			var insertar = { _id: indice };
			inscrito = Object.assign( insertar, inscrito );
			console.log(inscrito);

			dbNuevos.put(inscrito, function callback(err, result){
				if (!err) {
					alert('inscrito guardado en base de datos');
					location.reload();
				}else {
					alert('problemas guardando inscrito en base de datos' + err);
				}
			});					
		});					
	}else{
		//id = idExistente;
		var insertar;
		dbNuevos.get(idExistente).then( docum => {
			insertar = { 
				_id: docum._id,
				_rev: docum._rev
			};
			console.log("Rev a adicionar al inscrito para la tabla de nuevos");
			delete inscrito._id;
			delete inscrito._rev;
			inscrito = Object.assign(insertar, inscrito);
			console.log("Inscrito ya existente a guardar en tabla de nuevos: ", inscrito);
			dbNuevos.put(inscrito, function callback(err, result){
				if (!err) {
					alert('inscrito modificado en base de datos');
					location.reload();
				}else {
					alert('problemas modificando inscrito en base de datos: ' + err);
					console.log(err);
				}
			});
		})
		.catch( () => {
			console.log("Inscrito que no esta en tabla de nuevos: ", inscrito);
			delete inscrito._rev;
			dbNuevos.info().then( result => {
				var ultimo = result.doc_count + 1;
				let indice  = calcularIndice(ultimo);
				console.log(indice);
				var insertar = { _id: indice };
				inscrito = Object.assign( insertar, inscrito );
				console.log(inscrito);
				
				dbNuevos.put(inscrito, function callback(err, result){
					if (!err) {
						alert('inscrito almacenado en base de datos');
						location.reload();
					}else {
						alert('problemas almacenando inscrito en base de datos: ' + err);
						console.log(err);
					}
				});
			}).catch( error => console.log("Error contando registros",err) );
		});
	}
}

function guardarComunesInscritos(formulario){
	var inscrito = {
		//Campos comunes a todos los formularios en general
		ACTA: document.getElementsByName('acta' + formulario)[0].value,
		FECHA: document.getElementsByName('fecha' + formulario)[0].value,
		N_INSCRIP: document.getElementsByName('inscripcion' + formulario)[0].value,
		NOMBRE_P: document.getElementsByName('propietario' + formulario)[0].value,
		TID_P: document.getElementsByName('tipoIdProp' + formulario)[0].value,
		DOC_P: document.getElementsByName('idPropietario' + formulario)[0].value,
		FAX: document.getElementsByName('fax' + formulario)[0].value,
		TELS: document.getElementsByName('tel' + formulario)[0].value,
		CORREO: document.getElementsByName('correoProp' + formulario)[0].value,
		DIRECC: document.getElementsByName('direccion' + formulario)[0].value,
		DPTO_NOTI: document.getElementsByName('deptoNotif' + formulario)[0].value,
		MPIO_NOTI: document.getElementsByName('mpioNotif' + formulario)[0].value,
		FIRMA_F1: '',
		FIRMA_E1: '',
		AUTORIZA: document.getElementsByName('autorizaNoti' + formulario)[0].value,
		
		//Campos comunes a los formularios de inscripción 493, 444, 569
		CELULAR: document.getElementsByName('cel' + formulario)[0].value,
		OBSERVA_AU: document.getElementsByName('obAutoridad' + formulario)[0].value,
		OBSERVA_F1: document.getElementsByName('obPersona' + formulario)[0].value,
		NOMBRE_E1: document.getElementsByName('inscribe' + formulario)[0].value,
		ID_E1: document.getElementsByName('idInscribe' + formulario)[0].value,
		NOMBRE_F1: document.getElementsByName('recibe' + formulario)[0].value,
		ID_F1: document.getElementsByName('idRecibe' + formulario)[0].value,
	}
	return inscrito;		
}

function guardarComunesEstablecimientos(formulario){
	var territorio = [];
	for (var i = 0; i < document.getElementsByName('territorio' + formulario).length; i++){
		document.getElementsByName('territorio' + formulario)[i].checked ? territorio.push(document.getElementsByName('territorio' + formulario)[i].value) : console.log(i);
	}
	
	var inscrito = {
		//Campos comunes a todos los formularios menos a 444
		NOCO: document.getElementsByName('nombreComercial' + formulario)[0].value,
		RSO: document.getElementsByName('razonSocial' + formulario)[0].value,
		NIT: document.getElementsByName('nit' + formulario)[0].value,
		CCUV: document.getElementsByName('concepto' + formulario)[0].value,
		CUV: document.getElementsByName('textoConcepto' + formulario)[0].value,
		F_UV: document.getElementsByName('fechaUltVisita' + formulario)[0].value,
		DIR_NOT_E: document.getElementsByName('funcUltVisita' + formulario)[0].value,
		MAMER: document.getElementsByName('matriculaMercantil' + formulario)[0].value,
		NOLOCA: document.getElementsByName('nomTerr' + formulario)[0].value,
		VISITADO: document.getElementsByName('visitado' + formulario)[0].value,
		DIR_NOT: document.getElementsByName('dirNotif' + formulario)[0].value,
		
		TERRITORIO: territorio
	}

	return inscrito;
}

function firmaInscripcion() {
	window.location.assign('firmaInscripcion.html');
}

function firmaEvaluacion(){
	window.location.assign('firmaEvaluacion.html');
}

function validarOjetoActa(formulario){
	let objetoActa = document.getElementsByName('acta' + formulario)[0];
	let cuerpo = document.getElementById('cuerpoRespuesta');
	console.log('objetoActa en plena validación', objetoActa.value);
	if (!objetoActa.value){
		console.log('Entramos al if');
		cuerpo.innerHTML = 'Lo sentimos mucho. Es absolutamente obligatorio diligenciar el número de acta. '
							+ 'Por favor devuélvase y verifique que el número de acta esté incluido ' 
							+ 'antes de guardar el acta.';
		return false;
	}else{
		cuerpo.innerHTML = 'Guardando... ';
		return true;
	}
}

function guardarInscrito493(){
	if(validarOjetoActa('493')){
		var idExistente = document.getElementsByName('id493')[0].value;
		var inscrito = guardarComunesInscritos('493');
		var inscritoEsta = guardarComunesEstablecimientos('493');
		var actividad = [];
		for (var i = 0; i < document.getElementsByName('actividad493').length; i++) {
			document.getElementsByName('actividad493')[i].checked ? actividad.push(document.getElementsByName('actividad493')[i].value) : console.log(i); 
			//console.log(actividad[i].checked ? actividad[i].value : 'No aplica');
		}
		console.log(document.getElementsByName('territorio493'));
		var adicional = {		
			ZONA: document.getElementsByName('zona493')[0].value,
			ACTIVIDAD: JSON.stringify(actividad),
			CARGO_F1: document.getElementsByName('cargoRecibe493')[0].value,
			CARGO_E1: document.getElementsByName('cargoInscribe493')[0].value,
			ACTIVO: '',					//campos no funcionales que es mejor remover
			GRABADO: ''					//campos no funcionales que es mejor remover
		};
		inscrito = Object.assign( inscrito, inscritoEsta, adicional );
		localStorage.setItem('inscrito', JSON.stringify(inscrito));
		idExistente == 0 ? firmaInscripcion() : persistirInscrito(db493, dbNuevos493, inscrito, idExistente);
	}
}

function guardarInscrito444(){
	if(validarOjetoActa('444')){
		var idExistente = document.getElementsByName('id444')[0].value;
		var inscrito = guardarComunesInscritos('444');
		var adicional = {
			MARCAV: document.getElementsByName('marca444')[0].value,
			MODELOV: document.getElementsByName('modelo444')[0].value,
			PLACA: document.getElementsByName('placa444')[0].value,
			FURGON: document.getElementsByName('furgon444')[0].value,
			REMOLQUE: document.getElementsByName('rmque444')[0].value,
			PLACAREM: document.getElementsByName('placaRemolque444')[0].value,
			SEMIREM: document.getElementsByName('srmque444')[0].value,
			PLACASEMI: document.getElementsByName('placaSrmque444')[0].value,
			ISOTERMO: document.getElementsByName('isotermo444')[0].value,
			U_UFRIO: document.getElementsByName('ufrio444')[0].value,
			PRODUCTO: document.getElementsByName('producto444')[0].value
		};
		
		inscrito = Object.assign( inscrito, adicional );
		localStorage.setItem('inscrito', JSON.stringify(inscrito));
		
		idExistente == 0 ? firmaInscripcion() : persistirInscrito(db444, dbNuevos444, inscrito, idExistente);
	}
}

function guardarInscrito569(){
	if(validarOjetoActa('569')){
		var idExistente = document.getElementsByName('id569')[0].value;
		var inscrito = guardarComunesInscritos('569');
		var inscritoEsta = guardarComunesEstablecimientos('569');
		console.log(document.getElementsByName('territorio569'));
		var adicional = {
			NOMBRE_RL: document.getElementsByName('repLegal569')[0].value,
			TID_RL: document.getElementsByName('tipoIdRl569')[0].value,
			DOC_RL: document.getElementsByName('idRepLegal569')[0].value,
			DEPENDEN: document.getElementsByName('dependencia569')[0].value,
			EXPENDIO: document.getElementsByName('expendio569')[0].value,
			ALMACENA: document.getElementsByName('almacena569')[0].value,
			DEPOSITO: document.getElementsByName('deposito569')[0].value,
			DESPRESA: document.getElementsByName('despresa569')[0].value,
			OTROTIPO: document.getElementsByName('cual569')[0].value
		};
		
		inscrito = Object.assign( inscrito, inscritoEsta, adicional );
		localStorage.setItem('inscrito', JSON.stringify(inscrito));
		
		idExistente == 0 ? firmaInscripcion() : persistirInscrito(db569, dbNuevos569, inscrito, idExistente);
	}
}

function guardarComunesEvaluados(formulario){
	var evaluado = {
		//Campos comunes a todos los formularios en general
		FECHA: document.getElementsByName('fecha' + formulario)[0].value,
		ACTA: document.getElementsByName('acta' + formulario)[0].value,
		N_INSCRIP: document.getElementsByName('inscripcion' + formulario)[0].value,
		DIRECC: document.getElementsByName('direccion' + formulario)[0].value,
		FAX: document.getElementsByName('fax' + formulario)[0].value,
		TELS: document.getElementsByName('tel' + formulario)[0].value + ' ' + document.getElementsByName('cel' + formulario)[0].value,
		CORREO: document.getElementsByName('correoProp' + formulario)[0].value,
		NOMBRE_P: document.getElementsByName('propietario' + formulario)[0].value,
		TID_P: document.getElementsByName('tipoIdProp' + formulario)[0].value,
		DOC_P: document.getElementsByName('idPropietario' + formulario)[0].value,
		DIR_NOT: document.getElementsByName('dirNotif' + formulario)[0].value,
		DPTO_NOTI: document.getElementsByName('deptoNotif' + formulario)[0].value,
		MPIO_NOTI: document.getElementsByName('mpioNotif' + formulario)[0].value,
		HORARIOS: document.getElementsByName('horarios' + formulario)[0].value,
		NUTRA: document.getElementsByName('noTrabajadores' + formulario)[0].value,
		F_UV: document.getElementsByName('fechaUltVisita' + formulario)[0].value,
		CCUV: document.getElementsByName('concepto' + formulario)[0].value,
		CUV: document.getElementsByName('textoConcepto' + formulario)[0].value,
		UV_P: document.getElementsByName('porcentaje' + formulario)[0].value,
		NMOTIVO: document.getElementsByName('motivo' + formulario)[0].value,
		MOTIVO: document.getElementsByName('textoMotivo' + formulario)[0].value,
		AUTORIZA: document.getElementsByName('autorizaNoti' + formulario)[0].value,
		CONCEPTO: document.getElementsByName('conceptoEval' + formulario)[0].value,
		P_CUMPL: document.getElementsByName('cumplimiento' + formulario)[0].value,
		N_MUESTRAS: document.getElementsByName('numeroMuestras' + formulario)[0].value,
		N_ACTAS: document.getElementsByName('numeroActa' + formulario)[0].value,
		AMS: document.getElementsByName('medidaSeguridad' + formulario)[0].value,
		DETA_MS: document.getElementsByName('medida' + formulario)[0].value,

		/* ACTA, UV_P, HORARIOS, NUTRA, son los únicos campos que son exclusivos de las evaluaciones, 
		los otros son comunes con los inscritos */
		
		OBS_AS: document.getElementsByName('obAutoridad' + formulario)[0].value,
		OBS_ES: document.getElementsByName('obPersona' + formulario)[0].value,
		NOMBRE_F1: document.getElementsByName('funcionario' + formulario + '-1')[0].value,
		ID_F1: document.getElementsByName('idFuncionario' + formulario + '-1')[0].value,
		CARGO_F1: document.getElementsByName('cargoFuncionario' + formulario + '-1')[0].value,
		NOMBRE_F2: document.getElementsByName('funcionario' + formulario + '-2')[0].value,
		ID_F2: document.getElementsByName('idFuncionario' + formulario + '-2')[0].value,
		CARGO_F2: document.getElementsByName('cargoFuncionario' + formulario + '-2')[0].value,
		NOMBRE_E1: document.getElementsByName('persona' + formulario + '-1')[0].value,
		ID_E1: document.getElementsByName('idPersona' + formulario + '-1')[0].value,
		CARGO_E1: document.getElementsByName('cargoPersona' + formulario + '-1')[0].value,
		NOMBRE_E2: document.getElementsByName('funcionario' + formulario + '-2')[0].value,
		ID_E2: document.getElementsByName('idFuncionario' + formulario + '-2')[0].value,
		CARGO_E2: document.getElementsByName('cargoFuncionario' + formulario + '-2')[0].value,
		FIRMA_F1: '',
		FIRMA_F2: '',
		FIRMA_E1: '',
		FIRMA_E2: '',
		GRABADO: ''
	};
	return evaluado;
}

function comunesEvaluadosEstabPreguntas(formulario){
	let evaluado = {
		E11: document.getElementsByName('evaluacion_1')[0].value,
		H11: document.getElementsByName('hallazgos_1_1')[0].value,
		E12: document.getElementsByName('evaluacion_1')[1].value,
		H12: document.getElementsByName('hallazgos_1_2')[0].value,
		E13: document.getElementsByName('evaluacion_1')[2].value,
		H13: document.getElementsByName('hallazgos_1_3')[0].value,
		EB1: document.getElementsByName('evalBloque1')[0].value,
		E21: document.getElementsByName('evaluacion_2')[0].value,
		H21: document.getElementsByName('hallazgos_2_1')[0].value,
		EB2: document.getElementsByName('evalBloque2')[0].value,
		E31: document.getElementsByName('evaluacion_3')[0].value,
		H31: document.getElementsByName('hallazgos_3_1')[0].value,
		E32: document.getElementsByName('evaluacion_3')[1].value,
		H32: document.getElementsByName('hallazgos_3_2')[0].value,
		EB3: document.getElementsByName('evalBloque3')[0].value,
		E41: document.getElementsByName('evaluacion_4')[0].value,
		H41: document.getElementsByName('hallazgos_4_1')[0].value,
		E42: document.getElementsByName('evaluacion_4')[1].value,
		H42: document.getElementsByName('hallazgos_4_2')[0].value,
		EB4: document.getElementsByName('evalBloque4')[0].value,
		E51: document.getElementsByName('evaluacion_5')[0].value,
		H51: document.getElementsByName('hallazgos_5_1')[0].value,
		E52: document.getElementsByName('evaluacion_5')[1].value,
		H52: document.getElementsByName('hallazgos_5_2')[0].value,
		EB5: document.getElementsByName('evalBloque5')[0].value
	}
	return evaluado;
}

function guardarEvaluadosVehiculos(formulario){
	let evaluado = {
		MARCAV: document.getElementsByName('marca' + formulario)[0].value,
		MODELOV: document.getElementsByName('modelo' + formulario)[0].value,
		PLACA: document.getElementsByName('placa' + formulario)[0].value,
		ISOTERMO: document.getElementsByName('isotermo' + formulario)[0].value,
		U_UFRIO: document.getElementsByName('ufrio' + formulario)[0].value,
		PRODUCTO: document.getElementsByName('producto' + formulario)[0].value,
		E11: document.getElementsByName('evaluacion_1')[0].value,
		H11: document.getElementsByName('hallazgos_1_1')[0].value,
		EB1: document.getElementsByName('evalBloque1')[0].value,
		E21: document.getElementsByName('evaluacion_2')[0].value,
		H21: document.getElementsByName('hallazgos_2_1')[0].value,
		EB2: document.getElementsByName('evalBloque2')[0].value,
		E31: document.getElementsByName('evaluacion_3')[0].value,
		H31: document.getElementsByName('hallazgos_3_1')[0].value,
		E32: document.getElementsByName('evaluacion_3')[1].value,
		H32: document.getElementsByName('hallazgos_3_2')[0].value,
		E33: document.getElementsByName('evaluacion_3')[2].value,
		H33: document.getElementsByName('hallazgos_3_3')[0].value,
		E34: document.getElementsByName('evaluacion_3')[3].value,
		H34: document.getElementsByName('hallazgos_3_4')[0].value,
		EB3: document.getElementsByName('evalBloque3')[0].value,
		E41: document.getElementsByName('evaluacion_4')[0].value,
		H41: document.getElementsByName('hallazgos_4_1')[0].value,
		EB4: document.getElementsByName('evalBloque4')[0].value,
		E51: document.getElementsByName('evaluacion_5')[0].value,
		H51: document.getElementsByName('hallazgos_5_1')[0].value,
		E52: document.getElementsByName('evaluacion_5')[1].value,
		H52: document.getElementsByName('hallazgos_5_2')[0].value,
		EB5: document.getElementsByName('evalBloque5')[0].value
	}
	return evaluado;
}

function guardarEvaluadosEstablecimientos(formulario){
	var territorio = [];
	for (var i = 0; i < document.getElementsByName('territorio' + formulario).length; i++){
		document.getElementsByName('territorio' + formulario)[i].checked ? territorio.push(document.getElementsByName('territorio' + formulario)[i].value) : console.log(i);
	}

	var evaluado = {
		NOMBRE_RL: document.getElementsByName('repLegal' + formulario)[0].value,
		TID_RL: document.getElementsByName('tipoIdRl' + formulario)[0].value,
		DOC_RL: document.getElementsByName('idRepLegal' + formulario)[0].value,
		NOCO: formulario != "333" && formulario != '243' ? 
			document.getElementsByName('nombreComercial' + formulario)[0].value : "",
		RSO: document.getElementsByName('razonSocial' + formulario)[0].value,
		NIT: document.getElementsByName('nit' + formulario)[0].value,
		MAMER: formulario != "26" && formulario != '333' && formulario != '243' ? 
			document.getElementsByName('matriculaMercantil' + formulario)[0].value : "",
		NOLOCA: document.getElementsByName('nomTerr' + formulario)[0].value,
		TERRITORIO: formulario != "333" && formulario != '243' ? territorio : "",
	};
	
	return evaluado;	
}

function guardarEvaluadoReducido(formulario){
	let evaluado = {
		FECHA: document.getElementsByName('fecha' + formulario)[0].value,
		ACTA: document.getElementsByName('acta' + formulario)[0].value,
		N_INSCRIP: formulario != '26' && formulario != '245' ? 
			document.getElementsByName('inscripcion' + formulario)[0].value : "",
		DIRECC: document.getElementsByName('direccion' + formulario)[0].value,
		TELS: document.getElementsByName('tel' + formulario)[0].value + ' ' + document.getElementsByName('cel' + formulario)[0].value,
		CORREO: document.getElementsByName('correoProp' + formulario)[0].value,
		NOMBRE_P: formulario != '26' ? document.getElementsByName('propietario' + formulario)[0].value : "",
		TID_P: formulario != '26' ? document.getElementsByName('tipoIdProp' + formulario)[0].value : "",
		DOC_P: formulario != '26' ? document.getElementsByName('idPropietario' + formulario)[0].value : "",
		AUTORIZA: document.getElementsByName('autorizaNoti' + formulario)[0].value,			
		OBS_AS: document.getElementsByName('obAutoridad' + formulario)[0].value,
		NOMBRE_F1: document.getElementsByName('funcionario' + formulario + '-1')[0].value,
		ID_F1: document.getElementsByName('idFuncionario' + formulario + '-1')[0].value,
		CARGO_F1: formulario != '26' ? document.getElementsByName('cargoFuncionario' + formulario + '-1')[0].value: "",
		NOMBRE_F2: formulario != '26' ? document.getElementsByName('funcionario' + formulario + '-2')[0].value : "",
		ID_F2: formulario != '26' ? document.getElementsByName('idFuncionario' + formulario + '-2')[0].value : "",
		CARGO_F2: formulario != '26' ? document.getElementsByName('cargoFuncionario' + formulario + '-2')[0].value : "",
		NOMBRE_E1: document.getElementsByName('persona' + formulario + '-1')[0].value,
		ID_E1: document.getElementsByName('idPersona' + formulario + '-1')[0].value,
		CARGO_E1: formulario != '26' ? document.getElementsByName('cargoPersona' + formulario + '-1')[0].value : "",
		NOMBRE_E2: formulario != '26' ? document.getElementsByName('persona' + formulario + '-2')[0].value : "",
		ID_E2: formulario != '26' ? document.getElementsByName('idPersona' + formulario + '-2')[0].value : "",
		CARGO_E2: formulario != '26' && formulario != '245' ? 
			document.getElementsByName('cargoPersona' + formulario + '-2')[0].value : "",
		FIRMA_F1: '',
		FIRMA_F2: '',
		FIRMA_E1: '',
		FIRMA_E2: '',
		GRABADO: 'S'
	};

	return evaluado;
}

function persistirEvaluado(db, evaluado, formulario){
	var insertar = { _id: evaluado.ACTA.substring(10, 14) };
	evaluado = Object.assign( insertar, evaluado );
	console.log(evaluado);
	db.put(evaluado, function callback(err, result){
		if (!err) {
			alert('evaluado guardado en base de datos');
			location.reload();
		}else {
			alert('problemas guardando evaluado en base de datos: ', err);
		}
	});
}

function guardarEvaluacion(formulario){
	console.log('Estamos en el formulario', formulario)
	let evaluado = formulario != '333' && formulario != '442' && formulario != '26' && formulario != '243' &&
					formulario != '245' ? 
					guardarComunesEvaluados(formulario) : null;
	let preguntasComunes;
	let evaluadoEsta;
	let evaluadoVehi;
	let reducido;
	
	let objetoActa = document.getElementsByName('acta' + formulario)[0];
	let cuerpo = document.getElementById('cuerpoRespuesta');
	if (!objetoActa.value){
		cuerpo.innerHTML = 'Lo sentimos mucho. Es absolutamente obligatorio diligenciar el número de acta. '
							+ 'Por favor devuélvase y verifique que el número de acta esté incluido antes de guardar el acta.';
	}else if (!validarCambioTab(10) && formulario != '26' && formulario != '245'){
		let cuerpo = document.getElementById('cuerpoRespuesta');
		cuerpo.innerHTML = 'Lo sentimos mucho. Usted no escogió un inscrito antes de diligenciar la evaluación. '
							+ 'Debe regresar a la pesataña de INSCRITOS y escoger uno o, en caso de que no esté inscrito '
							+ 'el establecimiento o vehículo, debe dirigirse al formulario de inscripción correspondiente. '
							+ 'Sentimos las molestias ocasionadas si ha perdido su trabajo, pero este paso es fundamental '
							+ 'para salvaguardar la integridad de los datos.';
	}else{
		cuerpo.innerHTML = 'Guardando... ';
		switch(formulario){
			case '440':
				var tipocarne;
				var adicional;
				var tipoEsta = [];
				preguntasComunes = comunesEvaluadosEstabPreguntas(formulario);
				evaluadoEsta = guardarEvaluadosEstablecimientos(formulario);
		
				for (let i = 0; i < document.getElementsByName('tipoCarneExpende').length; i++){
					tipocarne = document.getElementsByName('tipoCarneExpende')[i].checked ? document.getElementsByName('tipoCarneExpende')[i].value : console.log(i);
				}
				adicional = {
					TIPOCARNE: tipocarne,
					OTRAS: document.getElementsByName('otrasEspecies')[0].value,
					OTIPOPRO: document.getElementsByName('otrosProductos')[0].value,
					E14: document.getElementsByName('evaluacion_1')[3].value,
					H14: document.getElementsByName('hallazgos_1_4')[0].value,
					E22: document.getElementsByName('evaluacion_2')[1].value,
					H22: document.getElementsByName('hallazgos_2_2')[0].value,
					E43: document.getElementsByName('evaluacion_4')[2].value,
					H43: document.getElementsByName('hallazgos_4_3')[0].value,
					E53: document.getElementsByName('evaluacion_5')[2].value,
					H53: document.getElementsByName('hallazgos_5_3')[0].value,
					E54: document.getElementsByName('evaluacion_5')[3].value,
					H54: document.getElementsByName('hallazgos_5_4')[0].value,
					E55: document.getElementsByName('evaluacion_5')[4].value,
					H55: document.getElementsByName('hallazgos_5_5')[0].value
				};
				evaluado = Object.assign( evaluado, evaluadoEsta, preguntasComunes, adicional );
				break;
			case '474':
				preguntasComunes = comunesEvaluadosEstabPreguntas(formulario);
				evaluadoEsta = guardarEvaluadosEstablecimientos(formulario);
				adicional = {
					E14: document.getElementsByName('evaluacion_1')[3].value,
					H14: document.getElementsByName('hallazgos_1_4')[0].value,
					E22: document.getElementsByName('evaluacion_2')[1].value,
					H22: document.getElementsByName('hallazgos_2_2')[0].value,
					E23: document.getElementsByName('evaluacion_2')[2].value,
					H23: document.getElementsByName('hallazgos_2_3')[0].value,
					E33: document.getElementsByName('evaluacion_3')[2].value,
					H33: document.getElementsByName('hallazgos_3_3')[0].value,
					E43: document.getElementsByName('evaluacion_4')[2].value,
					H43: document.getElementsByName('hallazgos_4_3')[0].value,
					E44: document.getElementsByName('evaluacion_4')[3].value,
					H44: document.getElementsByName('hallazgos_4_4')[0].value,
					E45: document.getElementsByName('evaluacion_4')[4].value,
					H45: document.getElementsByName('hallazgos_4_5')[0].value,
					E46: document.getElementsByName('evaluacion_4')[5].value,
					H46: document.getElementsByName('hallazgos_4_6')[0].value
				};
				evaluado = Object.assign( evaluado, evaluadoEsta, preguntasComunes, adicional );
				break;
			case '479':
				preguntasComunes = comunesEvaluadosEstabPreguntas(formulario);
				evaluadoEsta = guardarEvaluadosEstablecimientos(formulario);
				tipoEsta = [];
				for (let i = 0; i < document.getElementsByName('tipoEstablecimiento').length; i++) {
					document.getElementsByName('tipoEstablecimiento')[i].checked ? tipoEsta.push(document.getElementsByName('tipoEstablecimiento')[i].value) : console.log(i);
				}
				console.log(tipoEsta);
				adicional = {
					ACTIVIDAD: JSON.stringify(tipoEsta),
					CUAL: document.getElementsByName('cualEstab')[0].value,
					E14: document.getElementsByName('evaluacion_1')[3].value,
					H14: document.getElementsByName('hallazgos_1_4')[0].value,
					E22: document.getElementsByName('evaluacion_2')[1].value,
					H22: document.getElementsByName('hallazgos_2_2')[0].value,
					E33: document.getElementsByName('evaluacion_3')[2].value,
					H33: document.getElementsByName('hallazgos_3_3')[0].value,
					E34: document.getElementsByName('evaluacion_3')[3].value,
					H34: document.getElementsByName('hallazgos_3_4')[0].value,
					E43: document.getElementsByName('evaluacion_4')[2].value,
					H43: document.getElementsByName('hallazgos_4_3')[0].value,
					E44: document.getElementsByName('evaluacion_4')[3].value,
					H44: document.getElementsByName('hallazgos_4_4')[0].value,
					E53: document.getElementsByName('evaluacion_5')[2].value,
					H53: document.getElementsByName('hallazgos_5_3')[0].value,
					E54: document.getElementsByName('evaluacion_5')[3].value,
					H54: document.getElementsByName('hallazgos_5_4')[0].value,
					E55: document.getElementsByName('evaluacion_5')[4].value,
					H55: document.getElementsByName('hallazgos_5_5')[0].value,
					E56: document.getElementsByName('evaluacion_5')[5].value,
					H56: document.getElementsByName('hallazgos_5_6')[0].value
				};
				evaluado = Object.assign( evaluado, evaluadoEsta, preguntasComunes, adicional );
				break;
			case '480':
				preguntasComunes = comunesEvaluadosEstabPreguntas(formulario);
				evaluadoEsta = guardarEvaluadosEstablecimientos(formulario);
				tipoEsta = [];
				for (let i = 0; i < document.getElementsByName('tipoEstablecimiento').length; i++) {
					document.getElementsByName('tipoEstablecimiento')[i].checked ? tipoEsta.push(document.getElementsByName('tipoEstablecimiento')[i].value) : console.log(i);
				}
				console.log(tipoEsta);
				adicional = {
					ACTIVIDAD: JSON.stringify(tipoEsta),
					E22: document.getElementsByName('evaluacion_2')[1].value,
					H22: document.getElementsByName('hallazgos_2_2')[0].value,
					E33: document.getElementsByName('evaluacion_3')[2].value,
					H33: document.getElementsByName('hallazgos_3_3')[0].value,
					E53: document.getElementsByName('evaluacion_5')[2].value,
					H53: document.getElementsByName('hallazgos_5_3')[0].value,
					E54: document.getElementsByName('evaluacion_5')[3].value,
					H54: document.getElementsByName('hallazgos_5_4')[0].value,
					E55: document.getElementsByName('evaluacion_5')[4].value,
					H55: document.getElementsByName('hallazgos_5_5')[0].value				
				};
				evaluado = Object.assign( evaluado, evaluadoEsta, preguntasComunes, adicional );
				break;
			case '495':
				preguntasComunes = comunesEvaluadosEstabPreguntas(formulario);
				evaluadoEsta = guardarEvaluadosEstablecimientos(formulario);
				tipoEsta = [];
				for (let i = 0; i < document.getElementsByName('tipoEstablecimiento').length; i++) {
					document.getElementsByName('tipoEstablecimiento')[i].checked ? tipoEsta.push(document.getElementsByName('tipoEstablecimiento')[i].value) : console.log(i);
				}
				adicional = {
					ACTIVIDAD: JSON.stringify(tipoEsta),
					E14: document.getElementsByName('evaluacion_1')[3].value,
					H14: document.getElementsByName('hallazgos_1_4')[0].value,
					E15: document.getElementsByName('evaluacion_1')[4].value,
					H15: document.getElementsByName('hallazgos_1_5')[0].value,
					E22: document.getElementsByName('evaluacion_2')[1].value,
					H22: document.getElementsByName('hallazgos_2_2')[0].value,
					E33: document.getElementsByName('evaluacion_3')[2].value,
					H33: document.getElementsByName('hallazgos_3_3')[0].value,
					E34: document.getElementsByName('evaluacion_3')[3].value,
					H34: document.getElementsByName('hallazgos_3_4')[0].value,
					E43: document.getElementsByName('evaluacion_4')[2].value,
					H43: document.getElementsByName('hallazgos_4_3')[0].value,
					E44: document.getElementsByName('evaluacion_4')[3].value,
					H44: document.getElementsByName('hallazgos_4_4')[0].value,
					E45: document.getElementsByName('evaluacion_4')[4].value,
					H45: document.getElementsByName('hallazgos_4_5')[0].value,
					E46: document.getElementsByName('evaluacion_4')[5].value,
					H46: document.getElementsByName('hallazgos_4_6')[0].value,
					E53: document.getElementsByName('evaluacion_5')[2].value,
					H53: document.getElementsByName('hallazgos_5_3')[0].value,
					E61: document.getElementsByName('evaluacion_6')[0].value,
					H61: document.getElementsByName('hallazgos_6_1')[0].value				
				};
				evaluado = Object.assign( evaluado, evaluadoEsta, preguntasComunes, adicional );
				break;
			case '478':
				preguntasComunes = comunesEvaluadosEstabPreguntas(formulario);
				evaluadoEsta = guardarEvaluadosEstablecimientos(formulario);
				tipoEsta = [];
				for (let i = 0; i < document.getElementsByName('tipoEstablecimiento').length; i++) {
					document.getElementsByName('tipoEstablecimiento')[i].checked ? tipoEsta.push(document.getElementsByName('tipoEstablecimiento')[i].value) : console.log(i);
				}
				adicional = {
					ACTIVIDAD: JSON.stringify(tipoEsta),
					GRS: document.getElementsByName('grs')[0].value,
					GRSCON: document.getElementsByName('grscon')[0].value,
					E14: document.getElementsByName('evaluacion_1')[3].value,
					H14: document.getElementsByName('hallazgos_1_4')[0].value,
					E15: document.getElementsByName('evaluacion_1')[4].value,
					H15: document.getElementsByName('hallazgos_1_5')[0].value,
					E22: document.getElementsByName('evaluacion_2')[1].value,
					H22: document.getElementsByName('hallazgos_2_2')[0].value,
					E23: document.getElementsByName('evaluacion_2')[2].value,
					H23: document.getElementsByName('hallazgos_2_3')[0].value,
					E33: document.getElementsByName('evaluacion_3')[2].value,
					H33: document.getElementsByName('hallazgos_3_3')[0].value,
					E34: document.getElementsByName('evaluacion_3')[3].value,
					H34: document.getElementsByName('hallazgos_3_4')[0].value,
					E43: document.getElementsByName('evaluacion_4')[2].value,
					H43: document.getElementsByName('hallazgos_4_3')[0].value,
					E44: document.getElementsByName('evaluacion_4')[3].value,
					H44: document.getElementsByName('hallazgos_4_4')[0].value,
					E45: document.getElementsByName('evaluacion_4')[4].value,
					H45: document.getElementsByName('hallazgos_4_5')[0].value,
					E53: document.getElementsByName('evaluacion_5')[2].value,
					H53: document.getElementsByName('hallazgos_5_3')[0].value,
					E54: document.getElementsByName('evaluacion_5')[3].value,
					H54: document.getElementsByName('hallazgos_5_4')[0].value,
					E55: document.getElementsByName('evaluacion_5')[4].value,
					H55: document.getElementsByName('hallazgos_5_5')[0].value,
					E56: document.getElementsByName('evaluacion_5')[5].value,
					H56: document.getElementsByName('hallazgos_5_6')[0].value,
					E61: document.getElementsByName('evaluacion_6')[0].value,
					H61: document.getElementsByName('hallazgos_6_1')[0].value,
					E62: document.getElementsByName('evaluacion_6')[1].value,
					H62: document.getElementsByName('hallazgos_6_2')[0].value,
					E63: document.getElementsByName('evaluacion_6')[2].value,
					H63: document.getElementsByName('hallazgos_6_3')[0].value				
				};
				evaluado = Object.assign( evaluado, evaluadoEsta, preguntasComunes, adicional );
				break;
			case '475':
				evaluadoEsta = guardarEvaluadosEstablecimientos(formulario);
				tipoEsta = [];
				for (let i = 0; i < document.getElementsByName('tipoEstablecimiento').length; i++) {
					document.getElementsByName('tipoEstablecimiento')[i].checked ? tipoEsta.push(document.getElementsByName('tipoEstablecimiento')[i].value) : console.log(i);
				}
				adicional = {
					ACTIVIDAD: JSON.stringify(tipoEsta),
					E11: document.getElementsByName('evaluacion_1')[0].value,
					H11: document.getElementsByName('hallazgos_1_1')[0].value,
					E12: document.getElementsByName('evaluacion_1')[1].value,
					H12: document.getElementsByName('hallazgos_1_2')[0].value,
					EB1: document.getElementsByName('evalBloque1')[0].value,
					E21: document.getElementsByName('evaluacion_2')[0].value,
					H21: document.getElementsByName('hallazgos_2_1')[0].value,
					E22: document.getElementsByName('evaluacion_2')[1].value,
					H22: document.getElementsByName('hallazgos_2_2')[0].value,
					E23: document.getElementsByName('evaluacion_2')[2].value,
					H23: document.getElementsByName('hallazgos_2_3')[0].value,
					E24: document.getElementsByName('evaluacion_2')[3].value,
					H24: document.getElementsByName('hallazgos_2_4')[0].value,
					E25: document.getElementsByName('evaluacion_2')[4].value,
					H25: document.getElementsByName('hallazgos_2_5')[0].value,
					EB2: document.getElementsByName('evalBloque2')[0].value,			
				};
				evaluado = Object.assign( evaluado, evaluadoEsta, adicional );
				break;
			case '481':
				preguntasComunes = comunesEvaluadosEstabPreguntas(formulario);
				evaluadoEsta = guardarEvaluadosEstablecimientos(formulario);
				tipoEsta = [];
				for (let i = 0; i < document.getElementsByName('tipoEstablecimiento').length; i++) {
					document.getElementsByName('tipoEstablecimiento')[i].checked ? tipoEsta.push(document.getElementsByName('tipoEstablecimiento')[i].value) : console.log(i);
				}
				adicional = {
					ACTIVIDAD: JSON.stringify(tipoEsta),
					E14: document.getElementsByName('evaluacion_1')[3].value,
					H14: document.getElementsByName('hallazgos_1_4')[0].value,
					E33: document.getElementsByName('evaluacion_3')[2].value,
					H33: document.getElementsByName('hallazgos_3_3')[0].value,
					E34: document.getElementsByName('evaluacion_3')[3].value,
					H34: document.getElementsByName('hallazgos_3_4')[0].value,
					E43: document.getElementsByName('evaluacion_4')[2].value,
					H43: document.getElementsByName('hallazgos_4_3')[0].value,
					E53: document.getElementsByName('evaluacion_5')[2].value,
					H53: document.getElementsByName('hallazgos_5_3')[0].value,
					E54: document.getElementsByName('evaluacion_5')[3].value,
					H54: document.getElementsByName('hallazgos_5_4')[0].value,
					E55: document.getElementsByName('evaluacion_5')[4].value,
					H55: document.getElementsByName('hallazgos_5_5')[0].value,
					E56: document.getElementsByName('evaluacion_5')[5].value,
					H56: document.getElementsByName('hallazgos_5_6')[0].value
				};
				evaluado = Object.assign( evaluado, evaluadoEsta, preguntasComunes, adicional );
				break;
			case '442':
				evaluadoEsta = guardarEvaluadosEstablecimientos(formulario);
				reducido = guardarEvaluadoReducido(formulario);
				let iterable = document.getElementsByName('pregunta');
				let arregloPreguntas = [];
				iterable.forEach( item => arregloPreguntas.push(item.value) );
				adicional = {
					FAX: document.getElementsByName('fax' + formulario)[0].value,
					DIR_NOT: document.getElementsByName('dirNotif' + formulario)[0].value,
					DPTO_NOTI: document.getElementsByName('deptoNotif' + formulario)[0].value,
					MPIO_NOTI: document.getElementsByName('mpioNotif' + formulario)[0].value,
					HORARIOS: document.getElementsByName('horarios' + formulario)[0].value,
					NUTRA: document.getElementsByName('noTrabajadores' + formulario)[0].value,
					OBS_ES: document.getElementsByName('obPersona' + formulario)[0].value,
					OTRAS: document.getElementsByName('otrasEspecies' + formulario)[0].value,
					OTIPOPRO: document.getElementsByName('otrosProductos' + formulario)[0].value,
					PREGUNTAS: arregloPreguntas
				};
				evaluado = Object.assign( evaluadoEsta, reducido, adicional );
				break;
			case '333':
				reducido = guardarEvaluadoReducido(formulario);
				evaluadoEsta = guardarEvaluadosEstablecimientos(formulario);
				delete evaluadoEsta.MAMER;
				delete evaluadoEsta.NOCO;
				delete evaluadoEsta.TERRITORIO;
				let longitud = document.getElementsByName('Orden');
				let muestras = [];
				console.log("Longitud del arrglo de muestras", longitud.length);
				for(let i=0; i<longitud.length; i++){
					muestras.push(
						{
							acta: document.getElementsByName('acta' + formulario)[0].value,
							Orden: document.getElementsByName('Orden')[i].value,
							Um: document.getElementsByName('Um')[i].value,
							Contenido: document.getElementsByName('Contenido')[i].value,
							Producto: document.getElementsByName('Producto')[i].value,
							Temperatura: document.getElementsByName('Temperatura')[i].value,
							TipoEnvase: document.getElementsByName('TipoEnvase')[i].value,
							LoteFechaV: document.getElementsByName('LoteFechaV')[i].value,
							RegSanit: document.getElementsByName('RegSanit')[i].value
						}
					);
				}
				adicional = {
					FECHA2: document.getElementsByName('fecha' + formulario + '-2')[0].value,
					HORA2: document.getElementsByName('hora' + formulario + '-2')[0].value,
					T2: document.getElementsByName('temperatura' + formulario + '-2')[0].value,
					OBJETO: document.getElementsByName('objeto' + formulario)[0].value,
					MUESTRAS: muestras
				};
				evaluado = Object.assign( reducido, evaluadoEsta, adicional );
				localStorage.setItem('form', '333');
				break;
			case '243':
				reducido = guardarEvaluadoReducido(formulario);
				evaluadoEsta = guardarEvaluadosEstablecimientos(formulario);
				delete evaluadoEsta.MAMER;
				delete evaluadoEsta.NOCO;
				delete evaluadoEsta.TERRITORIO;
				let longitudCong = document.getElementsByName('producto');
				let muestrasCong = [];
				console.log("Longitud del arreglo de muestras", longitudCong.length);
				for(let i=0; i<longitudCong.length; i++){
					muestrasCong.push(
						{
							acta: document.getElementsByName('acta' + formulario)[0].value,
							producto: document.getElementsByName('producto')[i].value,
							lote: document.getElementsByName('lote')[i].value,
							presentaci: document.getElementsByName('presentaci')[i].value,
							cantidad: document.getElementsByName('cantidad')[i].value,
							fv: document.getElementsByName('fv')[i].value,
							invima: document.getElementsByName('invima')[i].value
						}
					);
				}
				adicional = {
					REQUES: document.getElementsByName('requerimientos243')[0].value,
					OBJETO: document.getElementsByName('objeto' + formulario)[0].value,
					MUESTRAS: muestrasCong
				};
				evaluado = Object.assign( reducido, evaluadoEsta, adicional );
				console.log();
				localStorage.setItem('form', '243');
				break;
			case '26':
				reducido = guardarEvaluadoReducido(formulario);
				console.log("Reducido: ", reducido);
				delete reducido.NOMBRE_P; 
				delete reducido.TID_P; 
				delete reducido.DOC_P; 
				delete reducido.N_INSCRIP; 
				delete reducido.CARGO_F1; 
				delete reducido.NOMBRE_F2; 
				delete reducido.ID_F2;
				delete reducido.CARGO_F2;
				delete reducido.CARGO_E1;
				delete reducido.NOMBRE_E2;
				delete reducido.ID_E2;
				delete reducido.CARGO_E2;
				delete reducido.FIRMA_F2;
				delete reducido.FIRMA_E2;
				console.log("Reducido Depurado: ", reducido);			
				evaluadoEsta = guardarEvaluadosEstablecimientos(formulario);
				delete evaluadoEsta.MAMER;
				adicional = {
					HORA: document.getElementsByName('hora26')[0].value,
					ZONA: document.getElementsByName('zona26')[0].value,
					TIPO_SU: document.getElementsByName('tipoSujeto26')[0].value,
					SUJETO: document.getElementsByName('sujeto26')[0].value,
					FAX: document.getElementsByName('fax' + formulario)[0].value,
					TIPOVIS: document.getElementsByName('tipoVisita26')[0].value,
					NTIPOVIS: document.getElementsByName('tipoVisita26')[0].value == '1' ? "IVC" : 
							document.getElementsByName('tipoVisita26')[0].value == '2' ? "QUEJA SANITARIA" : "",
					REQUERI_AU: document.getElementsByName('obPersona' + formulario)[0].value,
					NOMBRE_T1: document.getElementsByName('testigo26')[0].value,
					ID_T1: document.getElementsByName('idTestigo26')[0].value,
					FIRMA_T1: ''
				};
				evaluado = Object.assign( evaluadoEsta, reducido, adicional );
				localStorage.setItem('form', '26');
				break;
			case '245':
				evaluadoEsta = guardarEvaluadosEstablecimientos(formulario);
				reducido = guardarEvaluadoReducido(formulario);
				let preguntas = document.getElementsByName('pregunta');
				let iteObservaciones = document.getElementsByName('observaciones');
				let arrPreguntas = [];
				let arregloObservaciones = [];
				preguntas.forEach( item => arrPreguntas.push(item.value) );
				iteObservaciones.forEach( item => arregloObservaciones.push(item.value) );
				adicional = {
					FAX: document.getElementsByName('fax' + formulario)[0].value,
					DIR_NOT: document.getElementsByName('dirNotif' + formulario)[0].value,
					DPTO_NOTI: document.getElementsByName('deptoNotif' + formulario)[0].value,
					MPIO_NOTI: document.getElementsByName('mpioNotif' + formulario)[0].value,
					REQUES: document.getElementsByName('requerimientos' + formulario)[0].value,
					CONCEPTO: document.getElementsByName('concepto' + formulario)[0].value,
					NCONCEPTO: document.getElementsByName('textoConcepto' + formulario)[0].value,
					CODA: document.getElementsByName('tipoActividad' + formulario)[0].value,
					NOCODA: document.getElementsByName('actividad' + formulario)[0].value,
					SUJETO: document.getElementsByName('sujeto' + formulario)[0].value,
					TIPO_SU: document.getElementsByName('tipoSujeto' + formulario)[0].value,
					/* NOMBRE_T1: document.getElementsByName('testigo' + formulario)[0].value,
					ID_T1: document.getElementsByName('idTestigo' + formulario)[0].value, */
					PREGUNTAS: arrPreguntas,
					OBSERVACIONES: arregloObservaciones
				};
				evaluado = Object.assign( evaluadoEsta, reducido, adicional );
				localStorage.setItem('form', '245');
				break;
			case '441':
				evaluadoVehi = guardarEvaluadosVehiculos(formulario);
				adicional = {
					NOMBRE_CO: document.getElementsByName('conductor441')[0].value,
					TID_CO: document.getElementsByName('tipoIdCond441')[0].value,
					DOC_CO: document.getElementsByName('idConductor441')[0].value,
					E53: document.getElementsByName('evaluacion_5')[2].value,
					H53: document.getElementsByName('hallazgos_5_3')[0].value
				};
				evaluado = Object.assign( evaluado, evaluadoVehi, adicional );
				break;
			case '472':
				evaluadoVehi = guardarEvaluadosVehiculos(formulario);
				adicional = {
					ESTACAS: document.getElementsByName('camioneta472')[0].value, 
					FURGON: document.getElementsByName('camion472')[0].value,
					MOTOCAR: document.getElementsByName('moto472')[0].value,
					OTRO: document.getElementsByName('otro472')[0].value
				};
				evaluado = Object.assign( evaluado, evaluadoVehi, adicional);
				break;
		}
	
		//console.log("Estructura de evaluado en formulario " + formulario + " para revisión: " + JSON.stringify(evaluado));
		
		localStorage.setItem('evaluado', JSON.stringify(evaluado));
		firmaEvaluacion();
		
		//persistirEvaluado(db, evaluado, formulario);
		//location.reload();
	}

}

function escogerEvaluado(registro){
	let cuerpo = document.getElementById('cuerpoRespuesta');
	cuerpo.innerHTML = '';
	let arrayKeys = Object.keys(registro);
	let arrayToRemove = ['FIRMA_F1', 'FIRMA_F2', 'FIRMA_E1', 'FIRMA_E2', 'FIRMA_T1', '_id', '_rev'];
	arrayToRemove.forEach(element => {
		let indice = arrayKeys.indexOf(element);
		if (indice !== -1){
			arrayKeys.splice(indice, 1);
		}
	});
	arrayKeys.forEach(element => {
		let texto = document.createElement('p');
		element == 'MUESTRAS' ? 
			texto.innerHTML = element + ': ' + JSON.stringify(registro[element]) : 
			texto.innerHTML = element + ': ' + registro[element];
		cuerpo.appendChild(texto);
	});
}

function createRadioEvaluado(registro){
	var radio = document.createElement('input');
	radio.type = 'radio';
	radio.setAttribute('name',"seleEvaluado");
	radio.value = registro._id;
	radio.setAttribute( 'data-toggle', 'modal');
	radio.setAttribute( 'data-target', '#resp');
	radio.addEventListener('click', escogerEvaluado.bind(this, registro));

	var span = document.createElement('span');
	span.className = 'input-group-addon';
	span.appendChild(radio);

	var td = document.createElement('td');
	td.appendChild(span);

	return td;
}

function setColumnas(tr, registro, contador, evaluado){
	tr.appendChild(createColumns(contador));
	evaluado == 'V' ? 
		(registro.PLACA === null ? 
			tr.appendChild(createColumns(registro.PLACAREM)) : 
			tr.appendChild(createColumns(registro.PLACA))) : 
		evaluado == 'E' ? tr.appendChild(createColumns(registro.NOCO)) : tr.appendChild(createColumns(registro.RSO));
	tr.appendChild(createColumns(registro.ACTA));
	tr.appendChild(createColumns(registro.FECHA));
	evaluado == 'D' ? tr.appendChild(createColumns(registro.OBS_AS)) : 
		evaluado == 'C' ? 
			tr.appendChild(createColumns(registro.SUJETO)) :
			evaluado == 'F' ?
				tr.appendChild(createColumns(registro.NCONCEPTO)) :
				tr.appendChild(createColumns(registro.P_CUMPL));
	evaluado == 'D' || evaluado == 'C' || evaluado == 'F' ? null : 
		tr.appendChild(createColumns(registro.CONCEPTO));
	tr.appendChild(createRadioEvaluado(registro));
	return tr;		
}

function traerEvaluados(db, evaluado){
	db.allDocs({include_docs: true, descending: true}).then ( doc => {
		var tbody = document.getElementById('evaluados');
		tbody.innerHTML = '';
		var contador = 0;
		doc.rows.forEach( registro => {
			//console.log("Evaluado: ", registro);
			contador++;
			var tr = document.createElement('tr');
			tr = setColumnas(tr, registro.doc, contador, evaluado);
			tbody.appendChild(tr);
		});
		$('#tablaEvaluados').DataTable();
	});
}

function mostrarEvaluados(formulario){
	switch(formulario){
		case '440':
			traerEvaluados(db440, 'E');
			validarCambioTab(2);
			break;
		case '474':
			traerEvaluados(db474, 'E');
			validarCambioTab(2);
			break;
		case '479':
			traerEvaluados(db479, 'E');
			validarCambioTab(2);
			break;
		case '480':
			traerEvaluados(db480, 'E');
			validarCambioTab(2);
			break;
		case '495':
			traerEvaluados(db495, 'E');
			validarCambioTab(2);
			break;
		case '478':
			traerEvaluados(db478, 'E');
			validarCambioTab(2);
			break;
		case '475':
			traerEvaluados(db475, 'E');
			validarCambioTab(2);
			break;
		case '481':
			traerEvaluados(db481, 'E');
			validarCambioTab(2);
			break;
		case '333':
			traerEvaluados(db333, 'D');
			validarCambioTab(0);
			break;
		case '243':
			traerEvaluados(db243, 'D');
			validarCambioTab(0);
			break;
		case '442':
			traerEvaluados(db442, 'D');
			validarCambioTab(3);
			break;
		case '26':
			traerEvaluados(db26, 'C');
			break;
		case '245':
			traerEvaluados(db245, 'F');
			// validarCambioTab(2);
			break;
		case '441':
			traerEvaluados(db441, 'V');
			validarCambioTab(2);
			break;
		case '472':
			traerEvaluados(db472, 'V');
			validarCambioTab(2);
			break;
	}
}

function validarCambioTab(i){
	let listCheckboxes = document.getElementsByName('seleInscrito');
	let arreglo = Array.from(listCheckboxes);
	let check = arreglo.map( elemento => {
		return elemento.checked; 
	});	
	let verificador = check.indexOf(true);
	if (verificador == -1) {
		if(i == 10){
			console.log("Se retorna false");
			return false;
		}else{
			document.getElementsByName('alertaInscrito')[i].style.display = "block";
		}
	}else{
		console.log("Se retorna true");
		return true;
	}
}