async function cargarProductos(){

const res = await fetch("productos.json")
const productos = await res.json()

window.listaProductos = productos

mostrar(productos)

}

function mostrar(lista){

const contenedor = document.getElementById("productos")

contenedor.innerHTML=""

lista.forEach(p=>{

contenedor.innerHTML += `

<div class="card">

<img src="${p.imagen}">

<h3>${p.nombre}</h3>

<p>${p.descripcion}</p>

<p class="precio">$${p.precio}</p>

<a href="${p.video}" target="_blank">🎥 Ver video</a>

<br><br>

<a href="${p.compra}" target="_blank">

<button>Comprar</button>

</a>

</div>

`

})

}

function filtrar(tipo){

if(tipo==="todos"){

mostrar(window.listaProductos)

return

}

let carrito = []

async function cargarProductos(){

const res = await fetch("productos.json")
const productos = await res.json()

window.listaProductos = productos

mostrar(productos)

}

function mostrar(lista){

const contenedor = document.getElementById("productos")

contenedor.innerHTML=""

lista.forEach((p,index)=>{

contenedor.innerHTML += `

<div class="card">

<img src="${p.imagen}">

<h3>${p.nombre}</h3>

<p>${p.descripcion}</p>

<p class="precio">$${p.precio}</p>

<button onclick="agregar(${index})">
Agregar al carrito
</button>

</div>

`

})

}

function agregar(i){

const producto = window.listaProductos[i]

carrito.push(producto)

alert("Producto agregado al carrito")

}

cargarProductos()

function verCarrito(){

const cont = document.getElementById("carrito")

let html = "<h2>Carrito</h2>"

carrito.forEach(p=>{

html += `<p>${p.nombre} - $${p.precio}</p>`

})

html += `<button onclick="comprar()">Comprar</button>`

cont.innerHTML = html

}

function comprar(){

window.open("https://wa.me/523111063251?text=Quiero%20comprar%20productos%20de%20la%20pagina")

}