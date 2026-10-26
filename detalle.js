import { db } from "./firebase-config.js";
import { completarImagenProducto } from "./imagenes-productos.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

let producto = localStorage.getItem("producto");
let productojson = producto ? completarImagenProducto(JSON.parse(producto)) : null;

const volverInicio = () => {
    window.location.href = "index.html";
}

const actualizarContadorCarrito = () => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const contador = document.getElementById("contadorcarrito");
    if (!contador) return;

    const cantidadTotal = carrito.reduce((total, producto) => total + Number(producto.cantidad || 0), 0);
    contador.textContent = cantidadTotal;
    contador.style.display = cantidadTotal > 0 ? "inline-flex" : "none";
}

const cargar = () => {
    const contenedor = document.getElementById("boxproductos");
    contenedor.replaceChildren();

    if (!productojson) {
        const mensaje = document.createElement("p");
        mensaje.textContent = "No hay producto seleccionado.";
        const botonVolver = document.createElement("button");
        botonVolver.textContent = "🏠 Volver al inicio";
        botonVolver.addEventListener("click", volverInicio);
        contenedor.append(mensaje, botonVolver);
        return;
    }

    let parrafo = document.createElement("div");
    parrafo.id = "boxproducto";
    parrafo.innerHTML = `<h2 id="nombre">${productojson.nombre}</h2>
                    <img src="${productojson.imagen}" alt="${productojson.nombre}" width="200" onerror="this.onerror=null;this.src='./imagenes/producto-generico.svg'">
                    <p id="detalle">${productojson.descripcion}</p>
                    <h3 id="precio">$ ${productojson.precio}</h3>
                    <p id="stock">Stock: ${productojson.stock}</p>
                    <div id="boxcontador">
                        <button id="btnrestar" type="button">-</button>
                        <p id="contador">0</p>
                        <button id="btnsumar" type="button">+</button>
                    </div>
                    <button id="btnagregar" type="button">Agregar al carrito</button>
                    `;
    contenedor.appendChild(parrafo);

    document.getElementById("btnrestar").addEventListener("click", restar);
    document.getElementById("btnsumar").addEventListener("click", sumar);
    document.getElementById("btnagregar").addEventListener("click", agregar);
}

let contar = 0;

const restar = () => {
    if (contar > 0) {
        contar = contar - 1;
        document.getElementById("contador").innerHTML = contar;
    }
}

const sumar = () => {
    const stockDisponible = Number(productojson.stock || 0);

    if (contar < stockDisponible) {
        contar = contar + 1;
        document.getElementById("contador").innerHTML = contar;
    } else {
        alert("Stock máximo");
    }
}

const agregar = () => {
    if (contar === 0) {
        alert("Ingrese la cantidad de productos");
        return;
    }

    const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];
    const productoEnStock = productosGuardados.find(item => item.id === productojson.id);

    if (!productoEnStock) {
        alert("No hay stock disponible para este producto.");
        return;
    }

    if (contar > productoEnStock.stock) {
        alert(`Solo quedan ${productoEnStock.stock} unidades disponibles.`);
        return;
    }

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const productoExistente = carrito.find(item => item.id === productojson.id);

    if (productoExistente) {
        productoExistente.cantidad += contar;
        productoExistente.precio = productojson.precio * productoExistente.cantidad;
    } else {
        carrito.push({
            id: productojson.id,
            imagen: productojson.imagen,
            nombre: productojson.nombre,
            cantidad: contar,
            precio: productojson.precio * contar
        });
    }

    productoEnStock.stock = productoEnStock.stock - contar;
    productojson.stock = productoEnStock.stock;
    localStorage.setItem("productos", JSON.stringify(productosGuardados));
    localStorage.setItem("producto", JSON.stringify(productojson));
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
    window.location.href = "carrito.html";
};

const vercarrito = () => {
    actualizarContadorCarrito();
}

vercarrito();
cargar();
