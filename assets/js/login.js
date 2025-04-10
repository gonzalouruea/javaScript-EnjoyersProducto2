import { obtenerUsuarioActivo, loguearUsuario, obtenerTodosLosUsuarios } from './almacenaje.js';
import { mostrarUsuarioActivo } from './mostrarUsuarioActivo.js';

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const domInputEmail = document.getElementById('loginInputEmail');
    const domInputPassword = document.getElementById('loginInputPassword');
    const domSubmitValues = document.getElementById('submitValues');
    const domUserIsLogged = document.getElementById('userIsLogged');

    // función para realizar el inicio de sesión comprobando si el usuario existe
    async function loguinButton(event) {
      event.preventDefault(); // Función para evitar que el DOM recargue la página al realizar la acción

      let emailValue = domInputEmail.value;
      let passwordValue = domInputPassword.value;
      let userExists = false;

      const users = await obtenerTodosLosUsuarios() ; // Se obtiene el usuario activo

      window.localStorage.setItem("userActive", "false");

      // Comprobamos si existe un usuario con el correo y la contraseña proporcionados
      for (let user of users) {
        if (user.email === emailValue && user.password === passwordValue) {
          alert("Se ha iniciado sesión correctamente");
          loguearUsuario(emailValue);
          mostrarUsuarioActivo();
          domUserIsLogged.textContent = `¡Bienvenid@ ${user.name}!`;
          userExists = true;
          break;
        }
      }

      if (!userExists) {
        alert("Dirección de correo o contraseña incorrectos");
      }
    }

    // Listener para añadir acción al realizar "click" en el botón del DOM
    domSubmitValues.addEventListener('click', loguinButton);

  } catch (err) {
    console.error(err);
  }
});

mostrarUsuarioActivo();
