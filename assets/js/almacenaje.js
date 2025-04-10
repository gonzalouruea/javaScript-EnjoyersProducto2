// almacenaje.js
import { getDBUsers, getUserByEmail, getAllUsers, addItem,deleteItemByEmail, getDBCards,getAllCards,deleteItemByAutor} from "./indexedDB.js";

// Devuelve el usuario activo si está en localStorage y existe en IndexedDB
export async function obtenerUsuarioActivo() {
  const email = localStorage.getItem("userActive");
  if (!email) return null;

  const db = await getDBUsers();
  const usuario = await getUserByEmail(db, "usersStore", email);
  return usuario;
}

// Guarda el email del usuario logueado en localStorage
export function loguearUsuario(email) {
  localStorage.setItem("userActive", email);
}

export async function obtenerTodosLosUsuarios(){
    const users = await getAllUsers();
    return users;

}
export async function eliminarUsuarioPorEmail(email) {
    try {
      const dbUsers = await getDBUsers();  // Obtenemos la base de datos de usuarios
      const transaction = dbUsers.transaction("usersStore", "readonly");
      const store = transaction.objectStore("usersStore");
  
      const index = store.index("email");  // Accedemos al índice de "email"
      const request = index.get(email);    // Buscamos el usuario por email
  
      request.onsuccess = async () => {
        const user = request.result;
        if (user) {
          // Si encontramos al usuario, usamos el método deleteItem para eliminarlo
          console.log(user);
          const userId = user.key;  // El id se encuentra en `user.key` cuando se usa autoincrement
          await deleteItemByEmail(dbUsers, "usersStore", user.email);  // Utilizamos el id del índice autoincremental
          console.log("Usuario eliminado correctamente");
        } else {
          console.log("Usuario no encontrado");
        }
      };
  
      request.onerror = () => {
        console.error("Error al buscar el usuario por email");
      };
    } catch (error) {
      console.error("Error al eliminar el usuario: ", error);
    }
  }
  

 // almacenaje.js


export async function agregarUsuario(usuario) {
  try {
    const dbUsers = await getDBUsers();  // Obtenemos la base de datos de usuarios
    
    // Usamos el método addItem para añadir el nuevo usuario
    const resultado = await addItem(dbUsers, "usersStore", usuario);
    console.log("Usuario agregado correctamente con ID:", resultado);
  } catch (error) {
    console.error("Error al agregar el usuario:", error);
  }
}
export async function obtenerTodasLasCards() {
    const cards = await getAllCards();
    return cards;
  }
  
  // Guarda una tarjeta en IndexedDB
  export async function agregarCard(card) {
    try {
      const dbCards = await getDBCards();  // Obtenemos la base de datos de tarjetas
      
      // Usamos el método addItem para añadir la nueva tarjeta
      const resultado = await addItem(dbCards, "cardsStore", card);
      console.log("Tarjeta agregada correctamente con ID:", resultado);
    } catch (error) {
      console.error("Error al agregar la tarjeta:", error);
    }
  }
  
  // Elimina una tarjeta por autor (o cualquier otro campo único)
  export async function eliminarCardPorAutor(autor) {
    try {
      const dbCards = await getDBCards();  // Obtenemos la base de datos de tarjetas
      const transaction = dbCards.transaction("cardsStore", "readonly");
      const store = transaction.objectStore("cardsStore");
  
      const index = store.index("autor");  // Accedemos al índice de "autor"
      const request = index.get(autor);   // Buscamos la tarjeta por autor
  
      request.onsuccess = async () => {
        const card = request.result;
        if (card) {
          // Si encontramos la tarjeta, usamos el método deleteItem para eliminarla
          console.log(card);
          const cardId = card.key;  // El id se encuentra en `card.key` cuando se usa autoincrement
          await deleteItemByAutor(dbCards, "cardsStore", autor);  // Utilizamos el autor como clave
          console.log("Tarjeta eliminada correctamente");
        } else {
          console.log("Tarjeta no encontrada");
        }
      };
  
      request.onerror = () => {
        console.error("Error al buscar la tarjeta por autor");
      };
    } catch (error) {
      console.error("Error al eliminar la tarjeta: ", error);
    }
  }