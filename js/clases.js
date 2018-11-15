/*
function crearFunciones(){

	var arr = [];
	var numero = 1;

	for( var numero = 1; numero <= 5; numero++ ){
		arr.push(
			function(){
				console.log(numero);
			}
		);
	}

	return arr;
}

//Imprime en la consola 5 veces el numero 6
var funciones = crearFunciones();
funciones[0]();
funciones[1]();
funciones[2]();
funciones[3]();
funciones[4]();


function crearFuncionesConContexto(){
	var arr = [];
	var numero = 1;

	for( var numero = 1; numero <= 5; numero++ ){
		arr.push( 
			(function (numero){
				return function(){
					console.log(numero);
				}	
			}) (numero)
		);
	}

	return arr;
}

//Imprime en la consola los números del 1 al 5
funciones = crearFuncionesConContexto();
funciones[0]();
funciones[1]();
funciones[2]();
funciones[3]();
funciones[4]();*/


/*var objetoJS = {
	nombre: "Fernando",
	edad: 30
};

console.log("Objeto literal: ", objetoJS);

var jsonString = JSON.stringify(objetoJS);
console.log(jsonString);

var objetoDesdeJson = JSON.parse(jsonString);
console.log(objetoDesdeJson); */

/*function sumarUno(numero){

	var promesa = new Promise( function(resolve, reject) {

		if (numero >= 10){
			reject('El número es muy alto');
		}

		setTimeout( function() {

			resolve( numero + 1 );

		}, 800);

	});

	return promesa;
}*/

/*sumarUno(5).then( nuevoNumero => {
	console.log(nuevoNumero);
});


sumarUno(7).then( nuevoNumero => {
	console.log(nuevoNumero);
	sumarUno(nuevoNumero).then(nuevoNumero2 => {
		console.log(nuevoNumero2);
	});
});

sumarUno(10).then( nuevoNumero => {
	console.log(nuevoNumero);
	return sumarUno(nuevoNumero);
})
.then( nuevoNumero => {
	console.log(nuevoNumero);
});*/

/*sumarUno(10).then( sumarUno )
			.then( sumarUno )
			.then( nuevoNumero => {
				console.log(nuevoNumero);
				return sumarUno(nuevoNumero);
			})
			.then( nuevoNumero => {
				console.log(nuevoNumero);
			});*/

/*sumarUno(11)
	.then( nuevoNumero => {
		console.log(nuevoNumero);
	})
	.catch( error => {
		console.log('ERROR EN PROMESA');
		console.log(error);
	});*/

fetch( 'https://swapi.co/api/people/1/' )
	.then( resp => resp.json() )
	.then( persona=> {
		//console.log(persona.name);
		//console.log(persona.gender);
		let data = {
			nombre: persona.name,
			genero: persona.gender
		};

		return fetch( 'https://reqres.in/api/users', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			}
		});

	})
	.then( resp => resp.json() )
	.then( console.log ); //El último then lleva punto y coma, los otros no
