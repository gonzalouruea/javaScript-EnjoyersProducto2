import { obtenerUsuarioActivo } from "./almacenaje.js";

export function mostrarUsuarioActivo() {
  window.addEventListener("DOMContentLoaded", async () => {
    const domUserLogged = document.getElementById('userLogged');
    const usuario = await obtenerUsuarioActivo();

    console.log(usuario);

    if (usuario && usuario.name) {
      domUserLogged.textContent = usuario.name;
    } else {
      domUserLogged.textContent = "-no login-";
    }
  });
}
