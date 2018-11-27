
var db = new PouchDB('pruebaVisalud');

mostrarInscritos();

db.changes({
	since: 'now',
	live: true
}).on('change', mostrarInscritos);

function guardarInscrito(){
	//var depto = $('input:text[name=depto]').val();
	var depto = document.getElementsByName('depto')[0].value;
	var mpio = $('input:text[name=mpio]').val();
	var fecha = document.getElementsByName('fechaInsc')[0].value;
	var inscripcion = document.getElementsByName('inscripcion')[0].value;
	var razonSocial = $('input:text[name=razonSocial]').val();
	var nitEsta = $('input:text[name=nit]').val();
	var nombreComercial = $('input:text[name=nombreComercial]').val();
	var nombrePropietario = $('input:text[name=propietario]').val();

	var territorio = document.getElementsByName('territorio');
	//console.log(territorio);
	
	/*var arrTerritorio = [];
	for (var i = territorio.length - 1; i >= 0; i--) {
		if (territorio[i].checked){
			arrTerritorio.push(territorio[i].value);
		}
	};  //Con esto recogemos valores de checkbox */

	var radioTerritorio = "";
	for (var i = territorio.length - 1; i >= 0; i--) {
		if (territorio[i].checked) {
			radioTerritorio = territorio[i].value;
		}  
	}; 

	//console.log(inscripcion,fecha);
	id = new Date().toISOString();

	//console.log(arrTerritorio);
	var inscrito = {
		_id: id,
		dppto: depto,
		codepto: 76,
		ciudad: mpio,
		comun: 130,
		fecha: fecha,
		n_inscrip: inscripcion,
		entidad: '',
		soprovis: '',
		so: '',
		rso: razonSocial,
		nit: '',
		noco: '',
		nombre_p: nombrePropietario,
		cc_p: '',
		ce_p: '',
		tid_p: '',
		doc_p: '',
		direcc: '',
		zona: '',
		rural: '',
		urbano: '',
		comuna: '',
		cbarrio: '',
		barrio: '',
		cvereda: '',
		vereda: '',
		localidad: '',
		sector: '',
		corregto: '',
		caserio: '',
		upz: '',
		otro: '',
		noloca: '',
		tels: '',
		fax: '',
		celular: '',
		correo: '',
		dir_not: '',
		dir_not_e: '',
		autoriza: '',
		dpto_not_e: '',
		mpio_not_e: '',
		mamer: '',
		dir_noti: '',
		dpto_noti: '',
		mpio_noti: '',
		cod_activi: '',
		actividad: '',
		a01: '',
		a02: '',
		a03: '',
		a04: '',
		a11: '',
		a12: '',
		a21: '',
		a22: '',
		a31: '',
		a41: '',
		a42: '',
		a43: '',
		a51: '',
		a52: '',
		a61: '',
		a62: '',
		a63: '',
		a64: '',
		a71: '',
		a81: '',
		a82: '',
		visitado: '',
		f_uv: '',
		cuv: '',
		nombre_f1: '',
		id_f1: '',
		cargo_f1: '',
		entidad_f1: '',
		nombre_f2: '',
		id_f2: '',
		cargo_f2: '',
		entidad_f2: '',
		nombre_e1: '',
		id_e1: '',
		cargo_e1: '',
		nombre_e2: '',
		id_e2: '',
		cargo_e2: '',
		observa_au: '',
		observa_f1: '',
		activo: '',
		grabado: ''
	};
	console.log(inscrito);

	db.put(inscrito, function callback(err, result){
		if (!err) {
			alert('inscrito guardado en base de datos');
		}else {
			alert('problemas guardando inscrito en base de datos');
		}
	});
}


function createColumns(arreglo){
	var td = document.createElement('td');
	td.innerHTML = arreglo;
	return td;
}

function mostrarInscritos(){
	db.allDocs({include_docs: true, descending: true}).then ( doc => {
		var tbody = document.getElementById('inscritos');
		tbody.innerHTML = '';
		var contador = 0;
		doc.rows.forEach(function(registro){
			//console.log(registro.doc);
			contador++;
			var tr = document.createElement('tr');
			tr.appendChild(createColumns(contador));
			tr.appendChild(createColumns(registro.doc.NOCO));
			tr.appendChild(createColumns(registro.doc.N_INSCRIP));
			tr.appendChild(createColumns(registro.doc.FECHA));
			tr.appendChild(createColumns(registro.doc.NOMBRE_P));
			tbody.appendChild(tr);
		});
	});
}

function eliminarInscritos(){
	db.destroy().then(resp => console.log);
}

//Aquí se usa la función json(), que funciona similar a JSON.parse()
function cargarInscritos(){
	fetch('http://192.168.0.5/formularioVisaludAPI/public/inscritos/create')
		.then( res => {
			fetch('http://192.168.0.5/formularioVisaludAPI/public/inscritos')
				.then( resp => resp.json() )
				.then( respObj => {
					//console.log (id);
					//console.log(respObj);
					//eliminarInscritos();
					db.destroy().then( resp => {
						console.log('Base de datos anterior eliminada');
						db = new PouchDB('pruebaVisalud');
						console.log('Nueva base de datos creada');
						respObj.forEach(function(registro){
							var id = { _id: registro.id.toString() };
							// Con la siguiente línea se añade la variable _id al objeto			
							registro = Object.assign(id,registro);   
							//console.log(registro);
							db.put(registro, function callback(err, result){
								if (!err) {
									console.log('inscrito guardado en base de datos');
								}else {
									console.log('problemas guardando inscrito en base de datos', err);
								}
							});
						});
						mostrarInscritos();
					});
				});
		});	
}

//eliminarInscritos();
