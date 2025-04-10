import { loguearUsuario, mostrarUsuarioActivo } from './almacenaje.js'; // Importamos funciones de almacenaje.js

// Referencias a los elementos del DOM
const botonEnviar = document.getElementById('submitValues');
const inputCorreo = document.getElementById('loginInputEmail');
const inputContrasena = document.getElementById('loginInputPassword');
const usuarioEnMenu = document.getElementById('userLogged');
const mensajeUsuarioActivo = document.getElementById('userIsLogged');



// Función para manejar el inicio de sesión
function manejarInicioSesion(evento) {
    evento.preventDefault(); // Previene la recarga del formulario

    const correo = inputCorreo.value;
    const contrasena = inputContrasena.value;

    if (loguearUsuario(correo, contrasena)) { // Llama a la función loguearUsuario de almacenaje.js
        alert('Inicio de sesión exitoso');
        mostrarUsuarioActivo(); // Actualiza el usuario activo en el DOM
    } else {
        alert('Correo o contraseña incorrectos');
    }
}

// Configuración inicial
window.addEventListener('DOMContentLoaded', () => {
    mostrarUsuarioActivo(); // Muestra el usuario activo al cargar la página
    botonEnviar.addEventListener('click', manejarInicioSesion); // Añade el evento al botón
});



/* Documentacion prompts
 
Todos los prompts se realizaron con la herramienta de IA Copilot

-¿Cual es la función para saber el número de posiciones de un array?
-¿ Cual es este error Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')?
-¿Al recargar la página se pierden los datos puedes explicarme por qué?
-¿Es posible trabajar el back-end en javaScript?
  Al agregar el evento en el botón, se me actualiza la página automáticamente perdiendo los datos, ¿cómo puedo evitarlo?


*/