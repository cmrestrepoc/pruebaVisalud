function obtenerCodigo(usuario){
	let indice;
	switch(usuario){
		case 'CLMARTINEZ':
			indice = '01';
			break;
		case 'BBEDOYA':
			indice = '02';
			break;
		case 'JREYES':
			indice = '03';
			break;
		case 'EPEREA':
			indice = '04';
			break;
		case 'EPALMA':
			indice = '05';
			break;
		case 'DLLANOS':
			indice = '06';
			break;
		case 'OBETANCOUR':
			indice = '07';
			break;
		case 'JCARDENAS':
			indice = '08';
			break;
		case 'MARIOR':
			indice = '10';
			break;
		case 'CRESTREPO':
			indice = '11'
			break;
		default:
			alert('El usuario no está registrado para obtener código');
			break;
	}
	return indice;
}

function login(){
	let estado;
	let usuario = document.getElementsByName('nomUsuario')[0].value;
	let clave = document.getElementsByName('password')[0].value;
	let codigoUsuario = obtenerCodigo(usuario);
	clave == 'GC130' ? estado = true : estado = false;
	if (estado) {
		localStorage.setItem('estado', JSON.stringify(estado));
		localStorage.setItem('usuario', JSON.stringify(usuario));
		localStorage.setItem('codigoUsuario', codigoUsuario);
		alert('Login exitoso');
		window.location.replace("menu0.html");
	}else{
		alert('Clave incorrecta');
	}
}

function logout(){
	let estado = false;
	localStorage.setItem('estado', JSON.stringify(estado));
	localStorage.removeItem('usuario');
	window.location.replace("index.html");
}

function verificarSesionLocal(){
	let estado = localStorage.getItem('estado');
	let usuario = localStorage.getItem('usuario');
	if (estado == 'false') {
		console.log(estado);
		window.location.replace("index.html");
	}else{
		console.log("Usuario loggeado: ", usuario);
	}
}