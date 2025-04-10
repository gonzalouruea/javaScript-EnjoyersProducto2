// int_4_usuarios.js

import { obtenerTodosLosUsuarios, eliminarUsuarioPorEmail, agregarUsuario } from "./almacenaje.js";

// Función para obtener todos los usuarios desde la base de datos
export async function obtenerTodosLosUsuariosFinal() {
  try {
    return await obtenerTodosLosUsuarios(); // Llama a la función de almacenaje para obtener los usuarios
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
  }
}

// Función para eliminar un usuario por email
export async function eliminarUsuarioPorEmailFinal(email) {
  try {
    await eliminarUsuarioPorEmail(email); // Llama a la función de almacenaje para eliminar el usuario
    console.log("Usuario eliminado correctamente");
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
  }
}

// Función para agregar un nuevo usuario
export async function agregarUsuarioFinal(usuario) {
  try {
    await agregarUsuario(usuario); // Llama a la función de almacenaje para agregar un usuario
    console.log("Usuario agregado correctamente");
  } catch (error) {
    console.error("Error al agregar el usuario:", error);
  }
}
