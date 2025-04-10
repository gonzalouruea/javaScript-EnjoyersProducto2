

import { obtenerTodosLosUsuariosFinal, eliminarUsuarioPorEmailFinal, agregarUsuarioFinal } from "./int_4_usuarios.js";
import { mostrarUsuarioActivo } from "./mostrarUsuarioActivo.js";

// Declaramos constantes para obtener el ID de diferentes elementos del DOM
const table = document.getElementById("userTableId");
const submitButton = document.getElementById("submitId");

// Función para añadir una nueva fila a la tabla, se pasará como parámetros nombre, email, contraseña
function addRow(name, email, password, index) {
  let newRow = table.insertRow();

  let cell1 = newRow.insertCell(0);
  let cell2 = newRow.insertCell(1);
  let cell3 = newRow.insertCell(2);
  let cell4 = newRow.insertCell(3);

  cell1.textContent = name;
  cell2.textContent = email;
  cell3.textContent = password;
  cell4.innerHTML = `<button type="button" class="btn btn-danger delete-button">Eliminar</button>`;

  let deleteButton = newRow.querySelector(".delete-button");
  deleteButton.addEventListener("click", function () {
    eliminarUsuarioPorEmailFinal(email); // Eliminamos el usuario de la base de datos
    newRow.remove();
  });
}

// Función para cargar los usuarios desde la base de datos y mostrar las filas
async function loadUsersFromDB() {
  try {
    const users = await obtenerTodosLosUsuariosFinal(); // Obtener todos los usuarios desde la base de datos
    users.forEach((user, index) => {
      addRow(user.name, user.email, user.password, index);
    });
  } catch (err) {
    console.error("Error al cargar los usuarios desde la base de datos:", err);
  }
}

// Función para añadir un nuevo usuario a la base de datos
async function addNewUser(event) {
  event.preventDefault(); // Evitar que el DOM recargue la página al realizar la acción

  let userName = document.getElementById("userNameId").value;
  let userEmail = document.getElementById("userEmailId").value;
  let userPassword = document.getElementById("userPasswordId").value;

  if (userName && userEmail && userPassword) {
    try {
      // Añadir el nuevo usuario a la base de datos IndexedDB
      await agregarUsuarioFinal({"name": userName, "email": userEmail, "password": userPassword});
      alert("Nuevo usuario registrado correctamente");
      addRow(userName, userEmail, userPassword); // Añadirlo a la tabla visual
    } catch (error) {
      alert("Error al registrar el usuario: " + error.message);
    }
  } else {
    alert("Faltan datos para añadir registro");
  }
}

// Listener para añadir acción al realizar "click" en el botón del DOM
submitButton.addEventListener("click", addNewUser);

// Cargar los usuarios al cargar la página
loadUsersFromDB();

// Mostrar el usuario activo
mostrarUsuarioActivo();
