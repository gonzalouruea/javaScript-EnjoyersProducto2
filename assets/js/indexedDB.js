// indexeddb.js
import { users, cards } from "./datos.js";

let dbUsers;
let dbCards;

const dbNameUsers = "users";
const storeNameUsers = "usersStore";
const versionUsers = 1;

const dbNameCards = "cards";
const storeNameCards = "cardsStore";
const versionCards = 1;

function initDBUsers() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbNameUsers, versionUsers);

    request.onerror = () => reject("Error al abrir IndexedDB para usuarios");
    request.onsuccess = () => {
      dbUsers = request.result;
      resolve(dbUsers);
    };
    request.onupgradeneeded = (event) => {
      dbUsers = event.target.result;
      const objectStore = dbUsers.createObjectStore(storeNameUsers, { autoIncrement: true });
      objectStore.createIndex("name", "name", { unique: false });
      objectStore.createIndex("email", "email", { unique: false });

      objectStore.transaction.oncomplete = () => {
        const transaction = dbUsers.transaction(storeNameUsers, "readwrite");
        const store = transaction.objectStore(storeNameUsers);
        users.forEach(user => store.add(user));
      };
    };
  });
}

function initDBCards() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbNameCards, versionCards);

    request.onerror = () => reject("Error al abrir IndexedDB para tarjetas");
    request.onsuccess = () => {
      dbCards = request.result;
      resolve(dbCards);
    };
    request.onupgradeneeded = (event) => {
      dbCards = event.target.result;
      const objectStore = dbCards.createObjectStore(storeNameCards, { autoIncrement: true });
      objectStore.createIndex("autor", "autor", { unique: false });

      objectStore.transaction.oncomplete = () => {
        const transaction = dbCards.transaction(storeNameCards, "readwrite");
        const store = transaction.objectStore(storeNameCards);
        cards.forEach(card => store.add(card));
      };
    };
  });
}

// Funciones para obtener los datos

export async function getAllUsers() {
  if (!dbUsers) await initDBUsers();
  return new Promise((resolve, reject) => {
    const transaction = dbUsers.transaction(storeNameUsers, "readonly");
    const store = transaction.objectStore(storeNameUsers);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Error al obtener usuarios");
  });
}

export async function getAllCards() {
  if (!dbCards) await initDBCards();
  return new Promise((resolve, reject) => {
    const transaction = dbCards.transaction(storeNameCards, "readonly");
    const store = transaction.objectStore(storeNameCards);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Error al obtener tarjetas");
  });
}

export function addItem(db, storeName, data) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.add(data);

    request.onsuccess = () => resolve(request.result); // Devuelve la clave generada
    request.onerror = () => reject("Error al agregar el elemento");
  });
}

export function getAllItems(db, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Error al obtener los elementos");
  });
}

export function getItemById(db, storeName, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Error al obtener el elemento");
  });
}

export function updateItem(db, storeName, id, updatedData) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);

    const request = store.get(id);
    request.onsuccess = () => {
      const data = request.result;
      if (!data) {
        reject("Elemento no encontrado");
        return;
      }

      const updated = { ...data, ...updatedData };
      const updateRequest = store.put(updated, id);

      updateRequest.onsuccess = () => resolve("Elemento actualizado");
      updateRequest.onerror = () => reject("Error al actualizar");
    };
    request.onerror = () => reject("Error al buscar el elemento");
  });
}

export function deleteItem(db, storeName, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);

    request.onsuccess = () => resolve("Elemento eliminado");
    request.onerror = () => reject("Error al eliminar el elemento");
  });
}
export function deleteItemByEmail(db, storeName, email) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const index = store.index('email'); // Suponiendo que tienes un índice llamado 'email'
    const request = index.openCursor(IDBKeyRange.only(email));
    request.onsuccess = function (event) {
      const cursor = event.target.result;
      if (cursor) {
        // Eliminar el elemento usando su id autoincrementado
        const deleteRequest = store.delete(cursor.primaryKey);
        deleteRequest.onsuccess = function () {
          console.log('Elemento eliminado con éxito.');
        };
        deleteRequest.onerror = function () {
          console.error('Error al eliminar el elemento.');
        };
      } else {
        console.log('No se encontró ningún elemento con ese correo electrónico.');
      }
    };

    request.onerror = function () {
      console.error('Error al buscar el elemento por correo electrónico.');
    };
  });
}

export function getUserByEmail(db, storeName, email) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const index = store.index("email"); // accedemos al índice "email"
    const request = index.get(email);   // buscamos por el valor del email

    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result);
      } else {
        resolve(null); // no encontrado
      }
    };

    request.onerror = () => reject("Error al buscar el usuario por email");
  });
}
export async function getDBUsers() {
  if (!dbUsers) {
    dbUsers = await initDBUsers();
  }
  return dbUsers;
}


export function deleteItemByAutor(db, storeName, autor) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const index = store.index('autor'); // Suponiendo que tienes un índice llamado 'autor'
    const request = index.openCursor(IDBKeyRange.only(autor));
    
    request.onsuccess = function (event) {
      const cursor = event.target.result;
      if (cursor) {
        // Eliminar el elemento usando su id autoincrementado
        const deleteRequest = store.delete(cursor.primaryKey);
        deleteRequest.onsuccess = function () {
          console.log('Elemento eliminado con éxito.');
          resolve('Tarjeta eliminada correctamente');
        };
        deleteRequest.onerror = function () {
          console.error('Error al eliminar el elemento.');
          reject('Error al eliminar tarjeta');
        };
      } else {
        console.log('No se encontró ninguna tarjeta con ese autor.');
        resolve('Tarjeta no encontrada');
      }
    };

    request.onerror = function () {
      console.error('Error al buscar el elemento por autor.');
      reject('Error al buscar tarjeta');
    };
  });
}

export async function getDBCards() {
  if (!dbCards) {
    dbCards = await initDBCards();
  }
  return dbCards;
}
