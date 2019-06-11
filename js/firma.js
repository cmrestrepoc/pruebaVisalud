// referencia al canvas y al contexto 2dcanvas
var canvas,ctx;
// variables para seeguir la posición del mouse
// y el status del clic izquierdo
var mouseX, mouseY, mouseDown=0;
// variales para seguir la posicion del dedo o 
// lapicero electrónico sobre la tabla
var touchX, touchY;

//funcion para dibujar un punto en una posicion especifica
function dibujarPunto(ctx,x,y,size){
	// color negro completamente opaco
	r=0; g=0; b=0; a=255;

	// Estilo de llenado
	//ctx.fillStyle = "rgba(0,0,0,1)";
	ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + (a/255) + ")";

	// Dibujar un circulo lleno
	ctx.beginPath();
	ctx.arc(x, y, size, 0, Math.PI*2, true);
	ctx.closePath();
	ctx.fill();
}

// Limpia el contexto del canvas usando las dimensiones del canvas
function limpiarCanvas(canvas,ctx){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function firma_mouseDown(){
	mouseDown = 1;
	dibujarPunto(ctx, mouseX, mouseY, 6); // Hacer pruebas cambiando el 12
}

function firma_mouseUp(){
	mouseDown = 0;
}

function firma_mouseMove(e){
	// Actualización de las coordenadas del mouse cuando se mueve
	getMousePos(e);

	// Dibujar un punto si el botón del mouse está siendo presionado
	if (mouseDown == 1) {
		dibujarPunto(ctx, mouseX, mouseY, 6); // este tamnbien
	}
}

function getMousePos(e){
	if (!e) 
		var e = event;

	if (e.offsetX) {
		mouseX = e.offsetX;
		mouseY = e.offsetY;
	}else if (e.layerX) {
		mouseX = e.layerX;
		mouseY = e.layerY;
	}
}

// Dibujar algo cuando un touch sea detectado
function firma_touchStart(){
	// Actualizar coordenadas
	getTouchPos();

	dibujarPunto(ctx, touchX, touchY, 6);

	// Prevenir un evento mousedown adicional
	event.preventDefault();
}

// Dibujar algo cuando un movimiento de dedo sobre la pantalla sea detectado
function firma_touchMove(e){
	// Actualiza las coordenadas del punto donde se hace contacto touch
	getTouchPos(e);

	// Durante un evento de arrastre sobre el touch, diferente de un movimiento de ratón
	//no see requiere checkear si el touch permanece, ya que siempre habrá contacto con 
	//la pantalla por definición
	dibujarPunto(ctx, touchX, touchY, 6);

	event.preventDefault();
}

function getTouchPos(e){
	if(!e)
		var e = event;

	if (e.touches) {
		if (e.touches.length == 1) {
			var touch = e.touches[0];
			touchX = touch.pageX - touch.target.offsetLeft;
			touchY = touch.pageY - touch.target.offsetTop;
		}
	}
}

function inicio_firma(){
	canvas = document.getElementById('firma');

	if (canvas.getContext) 
		ctx = canvas.getContext('2d');

	if (ctx) {
		canvas.addEventListener('mousedown', firma_mouseDown, false);
		canvas.addEventListener('mousemove', firma_mouseMove, false);
		window.addEventListener('mouseup', firma_mouseUp, false);

		canvas.addEventListener('touchstart', firma_touchStart, false);
		canvas.addEventListener('touchmove', firma_touchMove, false);
	}
}