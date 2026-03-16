let carrito = []
let costoEnvio = 150
let productosGlobales = [] // Guardamos todos los productos aquí

async function cargarProductos(){
    try {
        const res = await fetch("productos.json")
        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`)
        }
        const productos = await res.json()
        
        productosGlobales = productos.map(p => ({
            ...p,
            precio: Number(p.precio)
        }))
        
        mostrar(productosGlobales)
        console.log('✅ Productos cargados:', productosGlobales.length)
    } catch (error) {
        console.error('❌ Error al cargar productos:', error)
        document.getElementById('productos').innerHTML = `
            <p style="text-align:center; color:red; grid-column: 1/-1;">
                Error al cargar productos. Verifica que el archivo productos.json existe y tiene el formato correcto.
            </p>
        `
    }
}

function mostrar(lista){
    const contenedor = document.getElementById("productos")
    
    if(!lista || lista.length === 0) {
        contenedor.innerHTML = "<p style='text-align:center; grid-column: 1/-1; padding: 40px;'>No hay productos en esta categoría</p>"
        return
    }
    
    contenedor.innerHTML = ""
    
    lista.forEach((producto) => {
        const precioFormateado = producto.precio.toLocaleString('es-MX')
        
        const card = document.createElement('div')
        card.className = 'card'
        
        card.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='https://via.placeholder.com/300x200?text=Imagen+no+disponible'">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p class="precio">$${precioFormateado}</p>
            ${producto.video ? `<a href="${producto.video}" target="_blank">🎥 Ver video</a>` : ''}
            <button class="btn-agregar" data-producto='${JSON.stringify(producto).replace(/'/g, "\\'").replace(/"/g, '&quot;')}'>Agregar al carrito</button>
        `
        
        const btnAgregar = card.querySelector('.btn-agregar')
        btnAgregar.addEventListener('click', () => {
            agregarAlCarrito(producto)
        })
        
        contenedor.appendChild(card)
    })
}

function agregarAlCarrito(producto) {
    // Buscar si el producto ya está en el carrito (por nombre)
    const existe = carrito.find(item => item.nombre === producto.nombre)
    
    if(existe) {
        existe.cantidad++
        mostrarNotificacion(`${producto.nombre} +1 (Total: ${existe.cantidad})`)
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        })
        mostrarNotificacion(`✅ ${producto.nombre} agregado`)
    }
    
    actualizarContadorCarrito()
}

function filtrar(tipo){
    if(tipo === "todos"){
        mostrar(productosGlobales)
        return
    }
    const filtrados = productosGlobales.filter(p => p.tipo === tipo)
    mostrar(filtrados)
}

function verCarrito(){
    const modal = document.getElementById('modalCarrito')
    modal.style.display = 'block'
    actualizarVistaCarrito()
}

function cerrarModal() {
    document.getElementById('modalCarrito').style.display = 'none'
}

function cerrarModalEnvio() {
    document.getElementById('modalEnvio').style.display = 'none'
}

function actualizarVistaCarrito() {
    const contenido = document.getElementById('carritoContenido')
    
    if(carrito.length === 0) {
        contenido.innerHTML = `
        <p style="text-align:center;padding:40px;">🛒 El carrito está vacío</p>
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
    const nombre = document.getElementById('nombre')?.value?.trim()
    const telefono = document.getElementById('telefono')?.value?.trim()
    const direccion = document.getElementById('direccion')?.value?.trim()
    const ciudad = document.getElementById('ciudad')?.value?.trim()
    const estado = document.getElementById('estado')?.value?.trim()
    const cp = document.getElementById('cp')?.value?.trim()
    
    if(!nombre || !telefono || !direccion || !ciudad || !estado || !cp) {
        mostrarNotificacion('❌ Completa todos los campos')
        return
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
    
    window.open(`https://wa.me/523111063251?text=${mensaje}`, '_blank')
    
    cerrarModalEnvio()
    carrito = []
    actualizarContadorCarrito()
    mostrarNotificacion('✅ Pedido enviado por WhatsApp')
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
    mostrarNotificacion('❌ Producto eliminado')
}

function vaciarCarrito() {
    if(confirm('¿Vaciar carrito?')) {
        carrito = []
        actualizarVistaCarrito()
        actualizarContadorCarrito()
        mostrarNotificacion('🔄 Carrito vaciado')
    }
}

function actualizarContadorCarrito() {
    const botonCarrito = document.querySelector('.btn-carrito')
    if (botonCarrito) {
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0)
        botonCarrito.textContent = `🛒 Ver carrito (${totalItems})`
    }
}

function mostrarNotificacion(mensaje) {
    // Eliminar notificaciones anteriores
    const notificacionesPrevias = document.querySelectorAll('.notificacion')
    notificacionesPrevias.forEach(n => n.remove())
    
    const notif = document.createElement('div')
    notif.className = 'notificacion'
    notif.textContent = mensaje
    notif.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: #00a86b;
    color: white;
    padding: 12px 24px;
    border-radius: 30px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    z-index: 3000;
    animation: slideUp 0.3s ease;
    font-weight: 500;
    `
    
    if (!document.getElementById('notificacion-style')) {
        const style = document.createElement('style')
        style.id = 'notificacion-style'
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
    }
    
    document.body.appendChild(notif)
    setTimeout(() => {
        if (notif.parentNode) {
            notif.remove()
        }
    }, 2000)
}

function buscar() {
    const texto = document.getElementById('buscador').value.toLowerCase().trim()
    if (texto === '') {
        mostrar(productosGlobales)
        return
    }
    const filtrados = productosGlobales.filter(p => 
        p.nombre.toLowerCase().includes(texto) || 
        p.descripcion.toLowerCase().includes(texto)
    )
    mostrar(filtrados)
}

// Cerrar modales al hacer clic fuera
window.onclick = function(event) {
    const modalCarrito = document.getElementById('modalCarrito')
    const modalEnvio = document.getElementById('modalEnvio')
    if (event.target == modalCarrito) modalCarrito.style.display = 'none'
    if (event.target == modalEnvio) modalEnvio.style.display = 'none'
}

// Cargar productos cuando la página esté lista
document.addEventListener('DOMContentLoaded', cargarProductos)