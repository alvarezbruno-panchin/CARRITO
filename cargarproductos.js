import { db } from "./firebase-config.js";
import { completarImagenProducto } from "./imagenes-productos.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

let productos = [];

const actualizarContadorCarrito = () => {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contador = document.getElementById("contadorcarrito");
  if (!contador) return;

  const cantidadTotal = carrito.reduce((total, producto) => total + Number(producto.cantidad || 0), 0);
  contador.textContent = cantidadTotal;
  contador.style.display = cantidadTotal > 0 ? "inline-flex" : "none";
}

const verdetalle = (idproducto) => {
  const buscarProducto = productos.find(producto => producto.id === idproducto);
  if (!buscarProducto) return;

  localStorage.setItem("producto", JSON.stringify(buscarProducto));
  window.location.href = "detalle.html";
}

const cargar = () => {
  const contenedor = document.getElementById("boxproductos");
  contenedor.replaceChildren();

  if (productos.length === 0) {
    contenedor.textContent = "No hay productos disponibles.";
    return;
  }

  for (const producto of productos) {
    const elemento = document.createElement("div");
    elemento.className = "boxproducto";

    const nombre = document.createElement("h2");
    nombre.className = "nombre";
    nombre.textContent = producto.nombre || "Producto sin nombre";

    const imagen = document.createElement("img");
    imagen.src = producto.imagen;
    imagen.onerror = () => { imagen.src = "./imagenes/producto-generico.svg"; };
    imagen.alt = producto.nombre || "Producto";
    imagen.width = 200;

    const descripcion = document.createElement("p");
    descripcion.className = "detalle";
    descripcion.textContent = producto.descripcion || "";

    const precio = document.createElement("h3");
    precio.className = "precio";
    precio.textContent = `$ ${producto.precio ?? ""}`;

    const stock = document.createElement("p");
    stock.className = "stock";
    stock.textContent = `Stock: ${producto.stock ?? 0}`;

    const boton = document.createElement("button");
    boton.className = "btndetalle";
    boton.textContent = "Ver detalle";
    boton.addEventListener("click", () => verdetalle(producto.id));

    elemento.append(nombre, imagen, descripcion, precio, stock, boton);
    contenedor.appendChild(elemento);
  }
}

const cargarProductos = async () => {
  const contenedor = document.getElementById("boxproductos");
  contenedor.textContent = "Cargando productos...";

  let guardados = [];
  try {
    const datosGuardados = JSON.parse(localStorage.getItem("productos") || "[]");
    guardados = Array.isArray(datosGuardados) ? datosGuardados.map(completarImagenProducto) : [];
  } catch (error) {
    console.warn("No se pudo leer la copia local de productos:", error);
  }

  try {
    const snapshot = await getDocs(collection(db, "productos"));
    productos = snapshot.docs.map(documento => completarImagenProducto({ id: documento.id, ...documento.data() }));
    localStorage.setItem("productos", JSON.stringify(productos));
  } catch (error) {
    console.error("No se pudieron cargar los productos desde Firebase:", error);
    productos = guardados;
    if (productos.length === 0) {
      contenedor.textContent = "No se pudieron cargar los productos. Comprueba la conexión y la configuración de Firebase.";
      return;
    }
  }

  cargar();
}

const vercarrito = () => {
  actualizarContadorCarrito();
}

vercarrito();
cargarProductos();
