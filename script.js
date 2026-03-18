let carrito = []
let costoEnvio = 150
let productosGlobales = []

// ⚡ VERSIÓN ACTUAL
const VERSION = '1.1.1'; // Cambiado a 1.1.0 por los íconos

// 🎯 ÍCONOS POR CATEGORÍA
const iconosCategoria = {
    celular: '📱',
    accesorio: '🔌',
    sim: '📶',
    servicio: '🛠️',
    ortopedia: '🩼',
    impresoras: '🖨️',
    puntosVenta: '💳',
    laptop: '💻',
    default: '📦'
};

// Obtener ícono según el tipo
function getIcono(tipo) {
    return iconosCategoria[tipo] || iconosCategoria.default;
}

async function cargarProductos(){
    try {
        console.log('🔄 Cargando productos - Versión:', VERSION);
        
        const timestamp = new Date().getTime();
        // ⚠️ IMPORTANTE: Cambiamos el nombre del archivo
        const res = await fetch(`productos-data.json?v=${VERSION}&t=${timestamp}`);
        
        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }
        
        const productos = await res.json();
        
        productosGlobales = productos.map(p => ({
            ...p,
            precio: Number(p.precio)
        }));
        
        mostrar(productosGlobales);
        
        console.log(`✅ Productos cargados: ${productosGlobales.length} productos - ${new Date().toLocaleString()}`);
        console.log('📦 Primer producto:', productosGlobales[0]?.nombre);
        
    } catch (error) {
        console.error('❌ Error cargando productos:', error);
        document.getElementById('productos').innerHTML = '<p style="text-align:center;color:red;">Error al cargar productos. Recarga la página.</p>';
    }
}

function mostrar(lista){
    const contenedor = document.getElementById("productos")
    
    if(!lista || lista.length === 0) {
        contenedor.innerHTML = "<p style='text-align:center;'>No hay productos</p>"
        return
    }
    
    contenedor.innerHTML = ""
    
    lista.forEach((producto) => {
        const precioFormateado = producto.precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        const icono = getIcono(producto.tipo); // 👈 Obtenemos el ícono
        
        contenedor.innerHTML += `
        <div class="card">
            <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='https://via.placeholder.com/300?text=Imagen+no+disponible'">
            <h3>${icono} ${producto.nombre}</h3> <!-- 👈 Ícono aquí -->
            <p>${producto.descripcion}</p>
            <p class="precio">$${precioFormateado}</p>
            <a href="${producto.video}" target="_blank">🎥 Ver video</a>
            <br><br>
            <button onclick='agregarAlCarrito(${JSON.stringify(producto).replace(/'/g, "\\'")})'>Agregar al carrito</button>
        </div>
        `
    })
}

// También podemos agregar íconos a los botones de filtro
function actualizarBotonesConIconos() {
    // Esto se puede hacer en el HTML directamente
    console.log('Botones actualizados con íconos');
}

function agregarAlCarrito(producto) {
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
        <p style="text-align:center;padding:20px;">El carrito está vacío</p>
        <div class="acciones-carrito">
            <button class="btn-secundario" onclick="cerrarModal()">Seguir comprando</button>
        </div>
        `
        return
    }
    
    let html = '<div class="items-carrito">'
    
    carrito.forEach((item, index) => {
        const icono = getIcono(item.tipo); // 👈 Ícono también en el carrito
        html += `
        <div class="item-carrito">
            <div class="item-info">
                <div class="item-nombre">${icono} ${item.nombre}</div>
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
            ${carrito.map(item => {
                const icono = getIcono(item.tipo);
                return `
                <div class="resumen-item">
                    <span>${icono} ${item.nombre} x${item.cantidad}</span>
                    <span>$${(item.precio * item.cantidad).toLocaleString()}</span>
                </div>
                `;
            }).join('')}
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
    
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
    const total = subtotal + costoEnvio
    
    let mensaje = "🛒 *NUEVO PEDIDO - JL CELULARES*%0A%0A"
    mensaje += "*PRODUCTOS:*%0A"
    
    carrito.forEach(item => {
        const icono = getIcono(item.tipo);
        mensaje += `• ${icono} ${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString()}%0A`
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
    mostrarNotificacion('Producto eliminado')
}

function vaciarCarrito() {
    if(confirm('¿Vaciar carrito?')) {
        carrito = []
        actualizarVistaCarrito()
        actualizarContadorCarrito()
        mostrarNotificacion('Carrito vaciado')
    }
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
    setTimeout(() => notif.remove(), 2000)
}

function buscar() {
    const texto = document.getElementById('buscador').value.toLowerCase()
    const filtrados = productosGlobales.filter(p => 
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

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Página cargada - Versión:', VERSION);
    cargarProductos();
});