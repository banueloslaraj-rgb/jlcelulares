async function cargarProductos(){

const res = await fetch("productos.json")
const productos = await res.json()

mostrar(productos)

window.listaProductos = productos

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

<a href="${p.video}" target="_blank">Ver video</a>

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

const filtrados = window.listaProductos.filter(p=>p.tipo===tipo)

mostrar(filtrados)

}

cargarProductos()