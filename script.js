let carrito = []
let costoEnvio = 150

// Base de datos de productos con STOCK
const productosDB = [
{
id: 1,
nombre:"iPhone 11",
descripcion:"64GB | Batería 83% | Libre | Reacondicionado",
precio:3199,
tipo:"celular",
stock: 5,
imagen:"https://cdn.smart-gsm.com/img/picture/big/apple-iphone-11.jpg",
video:"https://youtube.com/shorts/w1KHfhfkdac?si=iiKdW_T9IcwKIqMx"
},
{
id: 2,
nombre:"iPhone 12 pro",
descripcion:"128GB | Batería 100% | Libre | Reacondicionado",
precio:4599,
tipo:"celular",
stock: 3,
imagen:"https://givu.mx/wp-content/uploads/2024/07/12progris.png",
video:"https://youtube.com/shorts/3PpSWS8wnyI?si=NkFJtVZrGAgn2nZ1"
},
{
id: 3,
nombre:"iPhone 14",
descripcion:"128GB | Batería 83% | Libre | Dual Sim | Reacondicionado",
precio:6599,
tipo:"celular",
stock: 2,
imagen:"https://content.macstore.mx/img/sku/IPHONE623_FZ.jpg",
video:"https://youtube.com/shorts/aZZQmWWQ7h0?si=Lf7pqbNb32TbWkE4"
},
{
id: 4,
nombre:"iPhone 15",
descripcion:"128GB | Batería 100% | Libre | Dual Sim | Reacondicionado",
precio:7799,
tipo:"celular",
stock: 4,
imagen:"https://www.telcel.com/medias/515Wx515H-iPhone-15-BlueDual2.jpeg?context=bWFzdGVyfGltYWdlc3w0MzQ4MHxpbWFnZS9qcGVnfGltYWdlcy9oMTMvaDJlLzk0MDM4MjY3NjU4NTQuanBnfGViNTFjOWFjMWYwYjQwZTYwMGE1N2UyZDhkMTc0OGMxOThmMDFhMTIyMzJmOWI3Mzc4ZWU2ZTAwY2ZlNzhhODQ",
video:"https://youtube.com/shorts/pcKlNEVwRJc?si=hQnG4xMH9EmBkztr"
},
{
id: 5,
nombre:"iPhone 8 Plus",
descripcion:"256GB | Batería 83% | Libre | Bypass Con señal",
precio:2199,
tipo:"celular",
stock: 6,
imagen:"https://i5.walmartimages.com/asr/36c9d3ba-32c0-4635-ad83-6e646fc91f14.6a52ca89115aa77a645eace2ea74509a.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
video:"https://youtube.com/shorts/K9FZvSCSjEA?si=BgJDBKJaO0Ov_N_y"
},
{
id: 6,
nombre:"Samsung A06",
descripcion:"64GB | Reacondicionado | Libre",
precio:1799,
tipo:"celular",
stock: 8,
imagen:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7d74dAAN0p-4jHuJl9K9aLTtLWGf4NUbTew&s",
video:"https://youtube.com/shorts/Ozbv7YY3Img?si=HovJAIuqfKsx9NQR"
},
{
id: 7,
nombre:"Audífonos Bluetooth",
descripcion:"Alta calidad de sonido",
precio:350,
tipo:"accesorio",
stock: 15,
imagen:"https://via.placeholder.com/300",
video:"https://youtube.com"
},
{
id: 8,
nombre:"eSIM Telcel",
descripcion:"LADA a elegir",
precio:250,
tipo:"servicio",
stock: 999,
imagen:"https://m.media-amazon.com/images/I/518WwCz4--L._AC_UF350,350_QL80_.jpg",
video:"https://youtube.com"
}
]

// Inicializar la tienda
window.listaProductos = productosDB
mostrar(productosDB)

function mostrar(lista){
const contenedor = document.getElementById("productos")

if(!lista || lista.length === 0) {
contenedor.innerHTML = "<p style='text-align:center;'>No hay productos</p>"
return
}

contenedor.innerHTML = ""

lista.forEach((p, index)=>{
const precioFormateado = p.precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
const enCarrito = obtenerCantidadEnCarrito(p.id)
const stockDisponible = p.stock - enCarrito

const puedeAgregar = stockDisponible > 0
const botonAgregar = puedeAgregar 
? `<button onclick="agregar(${index})" class="btn-agregar">Agregar al carrito</button>`
: `<button class="btn-agotado" disabled>❌ Sin stock</button>`

const stockTexto = p.stock === 999 
? '<span class="stock-ilimitado">♾️ Ilimitado</span>'
: `<span class="stock-disponible">📦 ${stockDisponible} disponibles</span>`

contenedor.innerHTML += `
<div class="card">
<img src="${p.imagen}" alt="${p.nombre}" onerror="this.src='https://via.placeholder.com/300?text=Imagen+no+disponible'">
<h3>${p.nombre}</h3>
<p>${p.descripcion}</p>
<p class="precio">$${precioFormateado}</p>
${stockTexto}
<a href="${p.video}" target="_blank">🎥 Ver video</a>
<br><br>
${botonAgregar}
</div>
`
})
}

function obtenerCantidadEnCarrito(productoId) {
const item = carrito.find(item => item.id === productoId)
return item ? item.cantidad : 0
}

function filtrar(tipo){
if(tipo==="todos"){
mostrar(window.listaProductos)
return
}
const filtrados = window.listaProductos.filter(p=>p.tipo===tipo)
mostrar(filtrados)
}

function agregar(index){
const producto = window.listaProductos[index]

const enCarrito = obtenerCantidadEnCarrito(producto.id)
const stockDisponible = producto.stock - enCarrito

if(stockDisponible <= 0) {
mostrarNotificacion(`❌ No hay más stock de ${producto.nombre}`)
return
}

const existe = carrito.find(item => item.id === producto.id)

if(existe) {
existe.cantidad++
} else {
carrito.push({
...producto,
cantidad: 1
})
}

actualizarContadorCarrito()
mostrar(productosDB)
mostrarNotificacion(`✅ ${producto.nombre} agregado`)
}

function cambiarCantidad(index, cambio) {
const item = carrito[index]
const producto = productosDB.find(p => p.id === item.id)
const nuevaCantidad = item.cantidad + cambio

if(nuevaCantidad < 1) {
eliminarDelCarrito(index)
return
}

if(nuevaCantidad > producto.stock) {
mostrarNotificacion(`❌ Solo hay ${producto.stock} disponibles`)
return
}

item.cantidad = nuevaCantidad
actualizarVistaCarrito()
actualizarContadorCarrito()
mostrar(productosDB)
}

function eliminarDelCarrito(index) {
carrito.splice(index, 1)
actualizarVistaCarrito()
actualizarContadorCarrito()
mostrar(productosDB)
mostrarNotificacion('Producto eliminado')
}

function vaciarCarrito() {
if(confirm('¿Vaciar carrito?')) {
carrito = []
actualizarVistaCarrito()
actualizarContadorCarrito()
mostrar(productosDB)
mostrarNotificacion('Carrito vaciado')
}
}

function verCarrito(){
const modal = document.getElementById('modalCarrito')
const contenido = document.getElementById('carritoContenido')
modal.style.display = 'block'
actualizarVistaCarrito()
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
const producto = productosDB.find(p => p.id === item.id)
const maxStock = producto ? producto.stock : 999

html += `
<div class="item-carrito">
<div class="item-info">
<div class="item-nombre">${item.nombre}</div>
<div class="item-precio">$${item.precio.toLocaleString()} c/u</div>
<div class="item-stock">Stock: ${maxStock === 999 ? '♾️' : maxStock}</div>
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
<button class="btn-whatsapp" onclick="mostrarFormularioEnvio()">
📱 Continuar con WhatsApp
</button>
`

contenido.innerHTML = html
}

function mostrarFormularioEnvio() {
cerrarModal()
const modalEnvio = document.getElementById('modalEnvio')
const contenido = document.getElementById('envioContenido')

const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
const total = subtotal + costoEnvio

let stockSuficiente = true
for(let item of carrito) {
const producto = productosDB.find(p => p.id === item.id)
if(producto && producto.stock < item.cantidad) {
stockSuficiente = false
mostrarNotificacion(`❌ Stock insuficiente para ${producto.nombre}`)
return
}
}

if(!stockSuficiente) return

contenido.innerHTML = `
<div class="form-envio">
<h3>📦 Datos para el envío</h3>
<p style="color:#666; margin-bottom:20px;">Completa tus datos para enviarte el pedido por WhatsApp</p>

<div class="form-group">
<label>Nombre completo *</label>
<input type="text" id="nombre" placeholder="Ej: Juan Pérez">
</div>

<div class="form-group">
<label>Teléfono *</label>
<input type="tel" id="telefono" placeholder="Ej: 3111234567">
</div>

<div class="form-group">
<label>Dirección completa *</label>
<input type="text" id="direccion" placeholder="Calle, número, colonia">
</div>

<div class="form-row">
<div class="form-group">
<label>Ciudad *</label>
<input type="text" id="ciudad" placeholder="Ciudad">
</div>
<div class="form-group">
<label>Estado *</label>
<input type="text" id="estado" placeholder="Estado">
</div>
</div>

<div class="form-row">
<div class="form-group">
<label>Código postal *</label>
<input type="text" id="cp" placeholder="C.P.">
</div>
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

<button class="btn-whatsapp" onclick="enviarPedidoWhatsApp()" style="margin-top:10px;">
📱 Enviar pedido por WhatsApp
</button>
<button class="btn-secundario" onclick="cerrarModalEnvio()" style="margin-top:10px;">Cancelar</button>
</div>
`

modalEnvio.style.display = 'block'
}

function enviarPedidoWhatsApp() {
const nombre = document.getElementById('nombre')?.value
const telefono = document.getElementById('telefono')?.value
const direccion = document.getElementById('direccion')?.value
const ciudad = document.getElementById('ciudad')?.value
const estado = document.getElementById('estado')?.value
const cp = document.getElementById('cp')?.value

if(!nombre || !telefono || !direccion || !ciudad || !estado || !cp) {
mostrarNotificacion('❌ Completa todos los campos')
return
}

for(let item of carrito) {
const producto = productosDB.find(p => p.id === item.id)
if(producto && producto.stock < item.cantidad) {
mostrarNotificacion(`❌ Stock insuficiente para ${producto.nombre}`)
return
}
}

const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
const total = subtotal + costoEnvio

let mensaje = "🛒 *NUEVO PEDIDO - JL CELULARES*%0A%0A"
mensaje += "*PRODUCTOS:*%0A"

carrito.forEach(item => {
mensaje += `• ${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString()}%0A`
})

mensaje += `%0A*SUBTOTAL:* $${subtotal.toLocaleString()}`
mensaje += `%0A*ENVÍO:* $${costoEnvio.toLocaleString()}`
mensaje += `%0A*TOTAL:* $${total.toLocaleString()}%0A%0A`

mensaje += "*DATOS DE ENVÍO:*%0A"
mensaje += `👤 ${nombre}%0A`
mensaje += `📞 ${telefono}%0A`
mensaje += `📍 ${direccion}%0A`
mensaje += `🏙️ ${ciudad}, ${estado} CP ${cp}%0A%0A`

mensaje += "¡Gracias por tu compra! 🙌"

window.open(`https://wa.me/523111063251?text=${mensaje}`)

carrito.forEach(item => {
const producto = productosDB.find(p => p.id === item.id)
if(producto && producto.stock !== 999) {
producto.stock -= item.cantidad
}
})

cerrarModalEnvio()
carrito = []
actualizarContadorCarrito()
mostrar(productosDB)
mostrarNotificacion('✅ Pedido enviado por WhatsApp')
}

function cerrarModal() {
document.getElementById('modalCarrito').style.display = 'none'
}

function cerrarModalEnvio() {
document.getElementById('modalEnvio').style.display = 'none'
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

function buscar() {
const texto = document.getElementById('buscador').value.toLowerCase()
const filtrados = productosDB.filter(p => 
p.nombre.toLowerCase().includes(texto) || 
p.descripcion.toLowerCase().includes(texto)
)
mostrar(filtrados)
}

window.onclick = function(event) {
const modalCarrito = document.getElementById('modalCarrito')
const modalEnvio = document.getElementById('modalEnvio')
if (event.target == modalCarrito) modalCarrito.style.display = 'none'
if (event.target == modalEnvio) modalEnvio.style.display = 'none'
}