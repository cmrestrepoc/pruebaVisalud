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
		case 'SSANCHEZ':
			indice = '12';
			break;
		case 'RMARIN':
			indice = '13';
			break;
		case 'JOSORIO':
			indice = '14';
			break;
		default:
			console.log('Usuario en switch', usuario);
			indice = 'error';
			alert('El usuario no está registrado para obtener código');
			break;
	}
	return indice;
}

function login(){
	let funcionarios = [
		{
			nombre: 'MARIO RESTREPO',
			usuario: 'MARIOR',
			indice: '02',
			cedula: '6332086'
		},
		{
			nombre: 'CARLOS MARIO RESTREPO',
			usuario: 'CRESTREPO',
			indice: '03',
			cedula: '16845913'
		},
		{
			nombre: 'JOSE OBED OSORIO',
			usuario: 'JOSORIO',
			indice: '04',
			cedula: '75096222'
		},
		{
			nombre: 'MARCELA MOSQUERA',
			usuario: 'MMOSQUERA',
			indice: '05',
			cedula: '1144165679'
		},
		{
			nombre: 'MARY JASMIN MORENO',
			usuario: 'MJMORENO',
			indice: '06',
			cedula: '29111329'
		},
		{
			nombre: 'LINA LOTERO',
			usuario: 'LLOTERO',
			indice: '07',
			cedula: '1143826309'
		},
	]
	let estado;
	let usuario = document.getElementsByName('nomUsuario')[0].value;
	let indice = funcionarios.findIndex(element => element.usuario == usuario);
	console.log('indice usuario', usuario, indice);
	let clave = document.getElementsByName('password')[0].value;
	// let codigoUsuario = obtenerCodigo(usuario) !== 'error' ? obtenerCodigo(usuario) : null;
	if(indice > 0){
		clave == 'GC130' ? estado = true : estado = false;
		if (estado) {
			localStorage.setItem('estado', JSON.stringify(estado));
			localStorage.setItem('usuario', JSON.stringify(funcionarios[indice]));	
			localStorage.setItem('codigoUsuario', JSON.stringify(funcionarios[indice].indice))		
			window.location.replace("menu0.html");
		}else{
			alert('Clave incorrecta');
		}
	}else{
		alert('El usuario no está registrado para obtener código');
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