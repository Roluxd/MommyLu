// Elementos clave
const carritoElemento = document.getElementById('carrito');
const botonCarrito = document.getElementById('boton-carrito');
const contadorCarrito = document.getElementById('contadorCarrito');
const listaCarrito = document.getElementById('listaCarrito');
const tituloHeader = document.getElementById('tituloHeader');
const header = document.getElementById('main-header');
const categorias = document.querySelectorAll('.categoria');

let total = 0;
let cantidadProductos = 0;
const tituloOriginal = 'MoomyLu';

// Mostrar u ocultar carrito al hacer clic en el botón flotante
botonCarrito.addEventListener('click', () => {
  carritoElemento.classList.toggle('mostrar');
  if (carritoElemento.classList.contains('mostrar')) {
    carritoElemento.classList.remove('animar'); // Reinicia animación
    void carritoElemento.offsetWidth; // Forzar reflow
    carritoElemento.classList.add('animar'); // Aplica animación
  }
});


// Agregar producto al carrito
function agregarAlCarrito(nombre, boton) {
  const select = boton.previousElementSibling;
  const precio = parseFloat(select.value);
  const tamaño = select.options[select.selectedIndex].text;

  const li = document.createElement('li');
  li.innerHTML = `
    ${nombre} (${tamaño}) - S/ ${precio.toFixed(2)}
    <button class="eliminar" onclick="eliminarDelCarrito(this, ${precio})">X</button>
  `;
  listaCarrito.appendChild(li);

  total += precio;
  cantidadProductos++;
  actualizarTotal();
  actualizarContador();
  actualizarWhatsApp();

  botonCarrito.classList.remove('carrito-vibrar'); // Reinicia si ya estaba
  void botonCarrito.offsetWidth; // Fuerza reflow
  botonCarrito.classList.add('carrito-vibrar');
}


// Eliminar producto del carrito
function eliminarDelCarrito(boton, precio) {
  const item = boton.parentElement;
  item.remove();
  total -= precio;
  cantidadProductos = Math.max(0, cantidadProductos - 1);
  actualizarTotal();
  actualizarContador();
  actualizarWhatsApp();
  if (cantidadProductos === 0) {
    carritoElemento.classList.remove('mostrar');
  }
}

// Actualizar contador visual en globo
function actualizarContador() {
  contadorCarrito.textContent = cantidadProductos;
}


// Actualizar total en soles
function actualizarTotal() {
  document.getElementById('total').textContent = total.toFixed(2);
}

// Generar enlace de WhatsApp con resumen del pedido
function actualizarWhatsApp() {
  const items = listaCarrito.querySelectorAll('li');
  let resumen = '';

  items.forEach(item => {
    const texto = item.firstChild.textContent.trim(); // Solo el texto sin la X
    resumen += texto + '\n';
  });

  const mensaje = encodeURIComponent(`Hola, quiero pedir lo siguiente:\n\n${resumen}\nTotal: S/ ${total.toFixed(2)}`);
  const btnWhatsApp = document.getElementById('btnWhatsApp');
  if (btnWhatsApp) {
    btnWhatsApp.href = `https://wa.me/924211802?text=${mensaje}`;
  }
}


// Cambiar título del header según sección visible
function actualizarTituloHeader() {
  // Fondo transparente al hacer scroll
  if (window.scrollY > 50) {
    header.classList.add('scroll');
  } else {
    header.classList.remove('scroll');
  }

  // Cambiar título según categoría visible
  if (window.scrollY < 100) {
    tituloHeader.textContent = tituloOriginal;
    return;
  }

  let tituloEncontrado = false;
  for (let categoria of categorias) {
    const rect = categoria.getBoundingClientRect();
    const categoriaCentro = rect.top + rect.height / 2;

    if (categoriaCentro >= 100 && categoriaCentro <= window.innerHeight) {
      tituloHeader.textContent = categoria.dataset.titulo;
      tituloEncontrado = true;
      break;
    }
  }

  if (!tituloEncontrado) {
    tituloHeader.textContent = tituloOriginal;
  }
}


// Eventos de scroll y carga
window.addEventListener('scroll', actualizarTituloHeader);
window.addEventListener('load', actualizarTituloHeader);





// Habilitar scroll horizontal con clic y arrastre en los contenedores .postres-scroll
document.querySelectorAll('.postres-scroll').forEach(scrollContainer => {
  let isDown = false;
  let startX;
  let scrollLeft;

  scrollContainer.addEventListener('mousedown', (e) => {
    isDown = true;
    scrollContainer.classList.add('arrastrando');
    startX = e.pageX - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
  });

  scrollContainer.addEventListener('mouseleave', () => {
    isDown = false;
    scrollContainer.classList.remove('arrastrando');
  });

  scrollContainer.addEventListener('mouseup', () => {
    isDown = false;
    scrollContainer.classList.remove('arrastrando');
  });

  scrollContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 2; // Velocidad
    scrollContainer.scrollLeft = scrollLeft - walk;
  });
});














/*Para que funcionen las flecas scroll*/
document.querySelectorAll('.contenedor-deslizante').forEach(contenedor => {
  const scrollArea = contenedor.querySelector('.postres-scroll');
  const flechaIzq = contenedor.querySelector('.flecha.izquierda');
  const flechaDer = contenedor.querySelector('.flecha.derecha');

  flechaIzq.addEventListener('click', () => {
    scrollArea.scrollBy({ left: -250, behavior: 'smooth' });
  });

  flechaDer.addEventListener('click', () => {
    scrollArea.scrollBy({ left: 250, behavior: 'smooth' });
  });
});
