let carrito = []

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

carrito.push(producto)

// Feedback visual en lugar de alert
actualizarContadorCarrito()
mostrarNotificacion(`${producto.nombre} agregado`)

}

function verCarrito(){

const cont = document.getElementById("carrito")

if(carrito.length === 0) {
cont.innerHTML = "<h2>Carrito</h2><p>El carrito está vacío</p>"
return
}

let html = "<h2>Carrito</h2>"
let total = 0

carrito.forEach(p=>{
html += `<p>${p.nombre} - $${p.precio.toLocaleString()}</p>`
total += p.precio
})

html += `<hr><p><strong>Total: $${total.toLocaleString()}</strong></p>`
html += `<button onclick="comprar()">Comprar por WhatsApp</button>`
html += `<button onclick="vaciarCarrito()" style="background:#dc3545;margin-left:10px;">Vaciar carrito</button>`

cont.innerHTML = html

}

function vaciarCarrito() {
carrito = []
verCarrito()
actualizarContadorCarrito()
mostrarNotificacion("Carrito vaciado")
}

function actualizarContadorCarrito() {
const botonCarrito = document.querySelector('button[onclick="verCarrito()"]')
if (botonCarrito) {
botonCarrito.textContent = `Ver carrito (${carrito.length})`
}
}

function mostrarNotificacion(mensaje) {
// Crear notificación temporal
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

// Agregar animación
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

function comprar(){

if(carrito.length === 0) {
mostrarNotificacion("Agrega productos al carrito primero")
return
}

let mensaje = "Hola, quiero comprar:%0A"
carrito.forEach(p => {
mensaje += `- ${p.nombre}: $${p.precio.toLocaleString()}%0A`
})
const total = carrito.reduce((sum, p) => sum + p.precio, 0)
mensaje += `%0ATotal: $${total.toLocaleString()}`

window.open(`https://wa.me/523111063251?text=${mensaje}`)

}

// Función para buscar (si la quieres implementar después)
function buscar() {
const texto = document.getElementById('buscador').value.toLowerCase()
const filtrados = window.listaProductos.filter(p => 
p.nombre.toLowerCase().includes(texto) || 
p.descripcion.toLowerCase().includes(texto)
)
mostrar(filtrados)
}

// Iniciar
cargarProductos()