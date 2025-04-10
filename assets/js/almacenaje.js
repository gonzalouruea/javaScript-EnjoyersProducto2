import { users } from './datos.js'; // Importamos los usuarios desde datos.js

// Función para autenticar al usuario
export function loguearUsuario(correoElectronico, contrasena) {
    const usuario = users.find(user => user.email === correoElectronico && user.password === contrasena);

    if (usuario) {
        localStorage.setItem('usuarioActivo', JSON.stringify(usuario)); // Guarda el usuario activo en localStorage
        return true;
    }

    return false;
}

// Función para obtener el usuario activo desde localStorage
export function obtenerUsuarioActivo() {
    const usuario = localStorage.getItem('usuarioActivo');
    return usuario ? JSON.parse(usuario) : null;
}

// Función para mostrar el usuario activo en el menú y mensaje
export function mostrarUsuarioActivo() {
    const usuarioEnMenu = document.getElementById('userLogged'); // Elemento del menú
    const mensajeUsuarioActivo = document.getElementById('userIsLogged'); // Mensaje del usuario activo

    const usuario = obtenerUsuarioActivo(); // Recupera el usuario activo

    if (usuario) {
        usuarioEnMenu.textContent = usuario.email; // Actualiza el correo en el menú
        mensajeUsuarioActivo.textContent = `¡Bienvenid@ ${usuario.name}!`; // Muestra el nombre del usuario activo
    } else {
        usuarioEnMenu.textContent = 'No login'; // Indica que no hay usuario logueado
        mensajeUsuarioActivo.textContent = 'No hay ningún usuario activo.'; // Mensaje predeterminado
    }
}
