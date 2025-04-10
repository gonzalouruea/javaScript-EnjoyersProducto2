// Importamos las funciones necesarias desde almacenaje.js y int_4_usuarios.js
import { mostrarUsuarioActivo } from "./almacenaje.js"; // Para mostrar el usuario activo
import { renderizarTablaUsuarios, altaUsuario } from "./int_4_usuarios.js"; // Funciones para gestionar usuarios

// Configuración inicial al cargar la página
window.addEventListener("DOMContentLoaded", () => {
    mostrarUsuarioActivo(); // Mostramos el usuario activo en la barra de navegación
    renderizarTablaUsuarios(); // Renderizamos la tabla de usuarios registrados
});

// Referencia al botón para registrar usuario
const botonSubmit = document.getElementById("submitId");
botonSubmit.addEventListener("click", altaUsuario); // Vincula la funcionalidad de alta de usuario

/* Documentacion prompts
 
Todos los prompts se realizaron con la herramienta de IA Copilot

-¿Puedo incluir expresiones regulares en mis validaciones?
-¿Hay alguna función que compruebe si cumple con la expresión?
-¿Podría hacer comprobaciones sin expresiones regulares?
-¿Cómo puedo añadir objetos a un array desde un formulario?


*/