function obtenerCodigo(usuario){
	let indice;
	switch(usuario){
		case 'MARIOR':
			indice = '02';
			break;
		case 'CRESTREPO':
			indice = '03';
			break;
		case 'AESPINOZA':
			indice = '04';
			break;
		case 'ETORRES':
			indice = '05';
			break;
		case 'JEVANEGAS':
			indice = '06';
			break;
		case 'DPAMO':
			indice = '07';
			break;
		case 'JFRANCO':
			indice = '08';
			break;
		case 'RCALLE':
			indice = '09';
			break;
		case 'CVASQUEZ':
			indice = '10';
			break;
		case 'MPEREZ':
			indice = '11';
			break;
		default:
			indice = 'error';
			alert('El usuario no está registrado para obtener código');
			break;
	}
	return indice;
}

function login(){
	let estado;
	let usuario = document.getElementsByName('nomUsuario')[0].value;
	let clave = document.getElementsByName('password')[0].value;
	let codigoUsuario = obtenerCodigo(usuario) !== 'error' ? obtenerCodigo(usuario) : null;
	if(codigoUsuario){
		clave == 'GC130' ? estado = true : estado = false;
		if (estado) {
			localStorage.setItem('estado', JSON.stringify(estado));
			localStorage.setItem('usuario', JSON.stringify(usuario));
			localStorage.setItem('codigoUsuario', codigoUsuario);
			window.location.replace("menu0.html");
		}else{
			alert('Clave incorrecta');
		}
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