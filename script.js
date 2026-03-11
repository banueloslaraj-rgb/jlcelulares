let carrito = []
let costoEnvio = 150 // Costo de envío fijo

// Inicializar Mercado Pago (necesitas tu public key)
const mp = new MercadoPago('TU_PUBLIC_KEY_AQUI', {
    locale: 'es-MX'
});

async function cargarProductos(){

const res = await fetch("productos.json")
const productos = await res.json()

// Convertir precios a números
const productosProcesados = productos.map(p => ({
...p,
precio: Number(p.precio)
}))

window.listaProductos = productosProcesados
mostrar(productosProcesados)

}

function mostrar(lista){

const contenedor = document.getElementById("productos")

if(!lista || lista.length === 0) {
contenedor.innerHTML = "<p style='text-align:center;'>No hay productos</p>"
return
}

contenedor.innerHTML = ""

lista.forEach((p,index)=>{

// Formatear precio con comas
const precioFormateado = p.precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

contenedor.innerHTML += `

<div class="card">

<img src="${p.imagen}" alt="${p.nombre}" onerror="this.src='https://via.placeholder.com/300?text=Imagen+no+disponible'">

<h3>${p.nombre}</h3>

<p>${p.descripcion}</p>

<p class="precio">$${precioFormateado}</p>

<a href="${p.video}" target="_blank">🎥 Ver video</a>

<br><br>

<button onclick="agregar(${index})">
Agregar al carrito
</button>

</div>

`

})

}

function filtrar(tipo){

if(tipo==="todos"){
mostrar(window.listaProductos)
return
}

const filtrados = window.listaProductos.filter(p=>p.tipo===tipo)

mostrar(filtrados)

}

function agregar(i){

const producto = window.listaProductos[i]

// Verificar si el producto ya está en el carrito
const existe = carrito.find(item => item.id === producto.id)

if(existe) {
existe.cantidad++
} else {
carrito.push({
...producto,
id: Date.now() + Math.random(),
cantidad: 1
})
}

actualizarContadorCarrito()
mostrarNotificacion(`${producto.nombre} agregado al carrito`)

}

function verCarrito(){
const modal = document.getElementById('modalCarrito')
const contenido = document.getElementById('carritoContenido')
modal.style.display = 'block'
actualizarVistaCarrito()
}

function cerrarModal() {
document.getElementById('modalCarrito').style.display = 'none'
}

function actualizarVistaCarrito() {
const contenido = document.getElementById('carritoContenido')

if(carrito.length === 0) {
contenido.innerHTML = `
<p style="text-align:center;padding:20px;">El carrito está vacío</p>
<div class="acciones-carrito">
<button class="btn-secundario" onclick="cerrarModal()">Seguir comprando</button>
</div>
`
return
}

let html = '<div class="items-carrito">'

carrito.forEach((item, index) => {
html += `
<div class="item-carrito">
<div class="item-info">
<div class="item-nombre">${item.nombre}</div>
<div class="item-precio">$${item.precio.toLocaleString()} c/u</div>
</div>
<div class="item-cantidad">
<button class="btn-cantidad" onclick="cambiarCantidad(${index}, -1)">-</button>
<span>${item.cantidad}</span>
<button class="btn-cantidad" onclick="cambiarCantidad(${index}, 1)">+</button>
</div>
<div class="item-eliminar" onclick="eliminarDelCarrito(${index})">&times;</div>
</div>
`
})

const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)

html += `
</div>
<div class="carrito-total">
<span>Subtotal:</span>
<span>$${subtotal.toLocaleString()}</span>
</div>
<div class="acciones-carrito">
<button class="btn-secundario" onclick="cerrarModal()">Seguir comprando</button>
<button class="btn-peligro" onclick="vaciarCarrito()">Vaciar carrito</button>
</div>
<button class="btn-pago" onclick="mostrarFormularioPago()">Proceder al pago</button>
`

contenido.innerHTML = html
}

function cambiarCantidad(index, cambio) {
const item = carrito[index]
item.cantidad += cambio

if(item.cantidad <= 0) {
eliminarDelCarrito(index)
} else {
actualizarVistaCarrito()
actualizarContadorCarrito()
}
}

function eliminarDelCarrito(index) {
carrito.splice(index, 1)
actualizarVistaCarrito()
actualizarContadorCarrito()
mostrarNotificacion('Producto eliminado del carrito')
}

function vaciarCarrito() {
if(confirm('¿Estás seguro de vaciar el carrito?')) {
carrito = []
actualizarVistaCarrito()
actualizarContadorCarrito()
mostrarNotificacion('Carrito vaciado')
}
}

function mostrarFormularioPago() {
cerrarModal()
const modalPago = document.getElementById('modalPago')
const contenido = document.getElementById('pagoContenido')

const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
const total = subtotal + costoEnvio

contenido.innerHTML = `
<form id="formEnvio" onsubmit="procesarPago(event)">
<div class="form-envio">
<h3>📦 Datos de envío</h3>

<div class="form-row">
<div class="form-group">
<label>Nombre completo *</label>
<input type="text" id="nombre" required>
</div>
<div class="form-group">
<label>Teléfono *</label>
<input type="tel" id="telefono" required>
</div>
</div>

<div class="form-group">
<label>Email *</label>
<input type="email" id="email" required>
</div>

<div class="form-group">
<label>Dirección completa *</label>
<input type="text" id="direccion" required>
</div>

<div class="form-row">
<div class="form-group">
<label>Ciudad *</label>
<input type="text" id="ciudad" required>
</div>
<div class="form-group">
<label>Estado *</label>
<input type="text" id="estado" required>
</div>
</div>

<div class="form-row">
<div class="form-group">
<label>Código postal *</label>
<input type="text" id="cp" required>
</div>
<div class="form-group">
<label>Colonia *</label>
<input type="text" id="colonia" required>
</div>
</div>

<div class="form-group">
<label>Referencias (opcional)</label>
<textarea id="referencias" rows="2"></textarea>
</div>

<div class="resumen-compra">
<h4>Resumen de compra</h4>
${carrito.map(item => `
<div class="resumen-item">
<span>${item.nombre} x${item.cantidad}</span>
<span>$${(item.precio * item.cantidad).toLocaleString()}</span>
</div>
`).join('')}
<div class="resumen-item">
<span>Envío</span>
<span>$${costoEnvio.toLocaleString()}</span>
</div>
<div class="resumen-total">
<span>Total</span>
<span>$${total.toLocaleString()}</span>
</div>
</div>

<h3>💳 Método de pago</h3>
<div class="metodos-pago">
<div class="metodo-pago seleccionado" onclick="seleccionarMetodoPago('mercadopago')">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/MercadoPago.svg/2560px-MercadoPago.svg.png" alt="Mercado Pago">
<span>Mercado Pago</span>
</div>
</div>

<button type="submit" class="btn-pago" style="margin-top:20px;">
Pagar con Mercado Pago
</button>
</div>
</form>
`

modalPago.style.display = 'block'
}

function cerrarModalPago() {
document.getElementById('modalPago').style.display = 'none'
}

function seleccionarMetodoPago(metodo) {
// Por ahora solo tenemos Mercado Pago
document.querySelectorAll('.metodo-pago').forEach(el => {
el.classList.remove('seleccionado')
})
event.currentTarget.classList.add('seleccionado')
}

async function procesarPago(event) {
event.preventDefault()

// Validar que haya productos
if(carrito.length === 0) {
mostrarNotificacion('El carrito está vacío')
return
}

// Obtener datos del formulario
const datosEnvio = {
nombre: document.getElementById('nombre').value,
telefono: document.getElementById('telefono').value,
email: document.getElementById('email').value,
direccion: document.getElementById('direccion').value,
ciudad: document.getElementById('ciudad').value,
estado: document.getElementById('estado').value,
cp: document.getElementById('cp').value,
colonia: document.getElementById('colonia').value,
referencias: document.getElementById('referencias').value
}

// Guardar datos de envío para usarlos después
localStorage.setItem('datosEnvio', JSON.stringify(datosEnvio))

// Calcular total
const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
const total = subtotal + costoEnvio

// Crear preferencia de pago (esto deberías hacerlo en tu backend)
// Por ahora simulamos la redirección a Mercado Pago
mostrarNotificacion('Procesando pago...')

// Simulación de creación de preferencia
// En producción, esto debe ser una llamada a tu backend
const preferencia = {
items: carrito.map(item => ({
title: item.nombre,
quantity: item.cantidad,
currency_id: 'MXN',
unit_price: item.precio
})),
back_urls: {
success: 'https://tusitio.com/success',
failure: 'https://tusitio.com/failure',
pending: 'https://tusitio.com/pending'
},
auto_return: 'approved'
}

// Aquí iría la llamada a tu backend para crear la preferencia
// Por ahora, redirigimos a una simulación
setTimeout(() => {
// Esto es solo para demostración
window.open('https://www.mercadopago.com.mx/', '_blank')
mostrarNotificacion('Redirigiendo a Mercado Pago...')
}, 1500)

// En un caso real, harías:
// const response = await fetch('https://tuservidor.com/crear-preferencia', {
//     method: 'POST',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify(preferencia)
// })
// const data = await response.json()
// window.location.href = data.init_point
}

function actualizarContadorCarrito() {
const botonCarrito = document.querySelector('button[onclick="verCarrito()"]')
if (botonCarrito) {
const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0)
botonCarrito.textContent = `🛒 Ver carrito (${totalItems})`
}
}

function mostrarNotificacion(mensaje) {
const notif = document.createElement('div')
notif.textContent = mensaje
notif.style.cssText = `
position: fixed;
bottom: 100px;
left: 50%;
transform: translateX(-50%);
background: #00a86b;
color: white;
padding: 10px 20px;
border-radius: 30px;
box-shadow: 0 4px 12px rgba(0,0,0,0.2);
z-index: 2000;
animation: slideUp 0.3s ease;
`

const style = document.createElement('style')
style.textContent = `
@keyframes slideUp {
from {
opacity: 0;
transform: translate(-50%, 20px);
}
to {
opacity: 1;
transform: translate(-50%, 0);
}
}
`
document.head.appendChild(style)

document.body.appendChild(notif)
setTimeout(() => notif.remove(), 2000)
}

function comprar() {
verCarrito()
}

function buscar() {
const texto = document.getElementById('buscador').value.toLowerCase()
const filtrados = window.listaProductos.filter(p => 
p.nombre.toLowerCase().includes(texto) || 
p.descripcion.toLowerCase().includes(texto)
)
mostrar(filtrados)
}

// Cerrar modales al hacer clic fuera
window.onclick = function(event) {
const modalCarrito = document.getElementById('modalCarrito')
const modalPago = document.getElementById('modalPago')
if (event.target == modalCarrito) {
modalCarrito.style.display = 'none'
}
if (event.target == modalPago) {
modalPago.style.display = 'none'
}
}

// Iniciar
cargarProductos()