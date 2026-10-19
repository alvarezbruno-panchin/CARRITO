import { auth, provider } from "./firebase-config.js";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");
const usuario = document.getElementById("usuario");

provider.setCustomParameters({ prompt: "select_account" });
provider.addScope("email");

const actualizarUI = (user) => {
  if (user) {
    btnLogin.style.display = "none";
    btnLogout.style.display = "inline-flex";
    usuario.textContent = `Sesión activa: ${user.email}`;

    if (window.location.pathname.endsWith("ingresar.html") || window.location.pathname.endsWith("/ingresar.html")) {
      window.location.href = "./index.html";
    }
  } else {
    btnLogin.style.display = "inline-flex";
    btnLogout.style.display = "none";
    usuario.textContent = "";
  }
};

btnLogin.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
    window.location.href = "./index.html";
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    usuario.textContent = "No se pudo iniciar sesión con Google";
  }
});

btnLogout.addEventListener("click", async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
});

onAuthStateChanged(auth, (user) => {
  actualizarUI(user);
});

