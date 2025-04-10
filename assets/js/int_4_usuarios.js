import { users } from "./datos.js"; // Importamos el array inicial de usuarios

let tablaUsuarios;
let formularioAlta;

// Función para renderizar la tabla de usuarios registrados
export function renderizarTablaUsuarios() {
    tablaUsuarios.innerHTML = ""; // Limpiamos la tabla antes de renderizar

    users.forEach((user, index) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.password}</td>
            <td>
                <button class="btn btn-danger btn-sm btnEliminar" data-index="${index}">Eliminar</button>
            </td>
        `;

        // Añadimos evento para eliminar usuario
        const botonEliminar = fila.querySelector(".btnEliminar");
        botonEliminar.addEventListener("click", () => {
            eliminarUsuario(index); // Llamamos a la función para borrar el usuario
            renderizarTablaUsuarios(); // Actualizamos la tabla
        });

        tablaUsuarios.appendChild(fila); // Añadimos la fila al cuerpo de la tabla
    });
}

// Función para registrar un nuevo usuario
export function altaUsuario(event) {
    event.preventDefault(); // Previene la recarga de la página

    const userName = document.getElementById("userNameId").value; // Nombre del usuario
    const userEmail = document.getElementById("userEmailId").value; // Correo del usuario
    const userPassword = document.getElementById("userPasswordId").value; // Contraseña del usuario

    // Validación de campos obligatorios
    if (!userName || !userEmail || !userPassword) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    // Validación para evitar duplicados
    if (users.some(user => user.email === userEmail)) {
        alert("Este correo ya está registrado.");
        return;
    }

    // Agregamos el nuevo usuario al array
    users.push({ name: userName, email: userEmail, password: userPassword });

    renderizarTablaUsuarios(); // Actualizamos la tabla
    formularioAlta.reset(); // Limpiamos el formulario
    alert("Usuario registrado correctamente.");
}

// Función para borrar un usuario por índice
export function eliminarUsuario(index) {
    users.splice(index, 1); // Elimina al usuario del array por índice
}

// Configuración inicial al cargar la página
window.addEventListener("DOMContentLoaded", () => {
    tablaUsuarios = document.getElementById("userTableId").querySelector("tbody");
    formularioAlta = document.querySelector(".row.g-3");
    renderizarTablaUsuarios(); // Renderizamos la tabla de usuarios registrados
});
