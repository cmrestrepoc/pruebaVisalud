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

function setConcepto() {
	var concepto = document.getElementsByName('concepto')[0].value;

	switch(concepto){
		case '1':
			document.getElementsByName('textoConcepto')[0].value = 'Aceptable';
			break;
		case '2':
			document.getElementsByName('textoConcepto')[0].value = 'Aceptable con requerimientos';
			break;
		case '3':
			document.getElementsByName('textoConcepto')[0].value = 'Desfavorable';
			break;
		default:
			document.getElementsByName('textoConcepto')[0].value = '';
	}
}

function setMotivo() {
	var motivo = document.getElementsByName('motivo')[0].value;

	switch(motivo){
		case '01':
			document.getElementsByName('textoMotivo')[0].value = 'PROGRAMACIÓN';
			break;
		case '02':
			document.getElementsByName('textoMotivo')[0].value = 'SOLICITUD DEL INTERESADO';
			break;
		case '03':
			document.getElementsByName('textoMotivo')[0].value = 'ASOCIADA A PQRS';
			break;
		case '04':
			document.getElementsByName('textoMotivo')[0].value = 'SOLICITUD OFICIAL';
			break;
		case '05':
			document.getElementsByName('textoMotivo')[0].value = 'SEGUIMIENTO A VISITA ANTERIOR';
			break;
		case '06':
			document.getElementsByName('textoMotivo')[0].value = 'SOLICITUD DE PRÁCTICA DE PRUEBAS/PR';
			break;
		case '09':
			document.getElementsByName('textoMotivo')[0].value = 'OTRO';
			break;
		default:
			document.getElementsByName('textoMotivo')[0].value = '';
	}
}

var puntajeBloque1 = 0;
var puntajeBloque2 = 0;
var puntajeBloque3 = 0;
var puntajeBloque4 = 0;
var puntajeBloque5 = 0;

function evaluarBloque1(){
	var puntaje1 = document.getElementsByName('evaluacion_1_1')[0].value;
	var puntaje2 = document.getElementsByName('evaluacion_1_2')[0].value;
	var puntaje3 = document.getElementsByName('evaluacion_1_3')[0].value;
	var puntaje4 = document.getElementsByName('evaluacion_1_4')[0].value;

	puntajeBloque1 = (puntaje1*4 + puntaje2*4 + puntaje3*4 + puntaje4*5);
	document.getElementsByName('evalBloque1')[0].value = puntajeBloque1;

}

function evaluarBloque2(){
	var puntaje1 = document.getElementsByName('evaluacion_2_1')[0].value;
	var puntaje2 = document.getElementsByName('evaluacion_2_2')[0].value;
	
	puntajeBloque2 = (puntaje1*6 + puntaje2*7);
	document.getElementsByName('evalBloque2')[0].value = puntajeBloque2;
}

function evaluarBloque3(){
	var puntaje1 = document.getElementsByName('evaluacion_3_1')[0].value;
	var puntaje2 = document.getElementsByName('evaluacion_3_2')[0].value;
	
	puntajeBloque3 = (puntaje1*8 + puntaje2*8);
	document.getElementsByName('evalBloque3')[0].value = puntajeBloque3;
}

function evaluarBloque4(){
	var puntaje1 = document.getElementsByName('evaluacion_4_1')[0].value;
	var puntaje2 = document.getElementsByName('evaluacion_4_2')[0].value;
	var puntaje3 = document.getElementsByName('evaluacion_4_3')[0].value;

	puntajeBloque4 = (puntaje1*7 + puntaje2*9 + puntaje3*5);
	document.getElementsByName('evalBloque4')[0].value = puntajeBloque4;
}

function evaluarBloque5(){
	var puntaje1 = document.getElementsByName('evaluacion_5_1')[0].value;
	var puntaje2 = document.getElementsByName('evaluacion_5_2')[0].value;
	var puntaje3 = document.getElementsByName('evaluacion_5_3')[0].value;
	var puntaje4 = document.getElementsByName('evaluacion_5_4')[0].value;
	var puntaje5 = document.getElementsByName('evaluacion_5_5')[0].value;
	
	puntajeBloque5 = (puntaje1*7 + puntaje2*5 + puntaje3*5 + puntaje4*9 + puntaje5*7);
	document.getElementsByName('evalBloque5')[0].value = puntajeBloque5;
}

function consolidarPuntaje(){
	var puntajeTotal = puntajeBloque1 + puntajeBloque2 + puntajeBloque3 + puntajeBloque4 + puntajeBloque5;
	var concepto = 0;

	if (puntajeTotal >= 90) {
		concepto = 1;
	}else if (puntajeTotal < 90 && puntajeTotal >= 70){
		concepto = 2;
	}else {
		concepto = 3;
	}
	
	document.getElementsByName('conceptoEval')[0].value = concepto;
	document.getElementsByName('cumplimiento')[0].value = puntajeTotal;
}