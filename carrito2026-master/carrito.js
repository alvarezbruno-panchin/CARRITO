import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const obtenerProductos = () => {
    return JSON.parse(localStorage.getItem("productos")) || [];
}

const ajustarStockProducto = (productoId, cantidad, accion) => {
    const productos = obtenerProductos();
    const producto = productos.find(item => item.id === productoId);

    if (!producto) return;

    if (accion === "sumar") {
        producto.stock = Number(producto.stock || 0) + Number(cantidad || 0);
    }

    if (accion === "restar") {
        producto.stock = Math.max(0, Number(producto.stock || 0) - Number(cantidad || 0));
    }

    localStorage.setItem("productos", JSON.stringify(productos));
}

const actualizarContadorCarrito = () => {
    const contador = document.getElementById("contadorcarrito");
    if (!contador) return;

    const cantidadTotal = carrito.reduce((total, producto) => total + Number(producto.cantidad || 0), 0);
    contador.textContent = cantidadTotal;
    contador.style.display = cantidadTotal > 0 ? "inline-flex" : "none";
}

const cargar = () => {
    const lista = document.getElementById("lista");
    if (!lista) return;

    lista.innerHTML = "";

    if (carrito.length === 0) {
        lista.innerHTML = `<tr><td colspan="5" class="carrito-vacio">Tu carrito está vacío.</td></tr>`;
        const botonFinalizar = document.getElementById("btn-finalizar-compra");
        if (botonFinalizar) {
            botonFinalizar.disabled = true;
            botonFinalizar.textContent = "Finalizar compra";
        }
        actualizarContadorCarrito();
        return;
    }

    let total = 0;

    carrito.forEach((producto, index) => {
        total += Number(producto.precio || 0);

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td><img src="${producto.imagen}" alt="${producto.nombre}" class="img-carrito"></td>
            <td>${producto.cantidad}</td>
            <td>${producto.nombre}</td>
            <td>$ ${producto.precio}</td>
            <td><button class="btn-eliminar" data-index="${index}">X</button></td>
        `;
        lista.appendChild(fila);
    });

    const totalFila = document.createElement("tr");
    totalFila.className = "fila-total";
    totalFila.innerHTML = `
        <td colspan="3"><strong>Total</strong></td>
        <td><strong>$ ${total}</strong></td>
        <td></td>
    `;
    lista.appendChild(totalFila);

    const botonFinalizar = document.getElementById("btn-finalizar-compra");
    if (botonFinalizar) {
        botonFinalizar.disabled = false;
        botonFinalizar.textContent = `Finalizar compra - $ ${total}`;
    }

    actualizarContadorCarrito();
}

const finalizarCompra = () => {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    const total = carrito.reduce((sum, producto) => sum + Number(producto.precio || 0), 0);
    alert(`Compra finalizada. Total a pagar: $ ${total}. ¡Gracias por tu compra!`);

    carrito.forEach(producto => {
        ajustarStockProducto(producto.id, producto.cantidad, "sumar");
    });

    carrito.length = 0;
    localStorage.removeItem("carrito");
    cargar();
}

document.addEventListener("click", (event) => {
    const boton = event.target.closest(".btn-eliminar");
    if (boton) {
        const index = Number(boton.dataset.index);
        const productoEliminado = carrito[index];

        if (productoEliminado) {
            ajustarStockProducto(productoEliminado.id, productoEliminado.cantidad, "sumar");
        }

        carrito.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        cargar();
        return;
    }

    if (event.target.closest("#btn-finalizar-compra")) {
        finalizarCompra();
    }
});

cargar();
actualizarContadorCarrito();
