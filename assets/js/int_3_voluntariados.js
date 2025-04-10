// int_3_voluntariados.js
import { cards } from './datos.js';

const DB_NAME = 'VoluntariadosDB';
const STORE_NAME = 'voluntariados';

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = event => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function initializeDB() {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const countRequest = store.count();
    
    return new Promise((resolve, reject) => {
        countRequest.onsuccess = async () => {
            if (countRequest.result === 0) {
                const txAdd = db.transaction(STORE_NAME, 'readwrite');
                const storeAdd = txAdd.objectStore(STORE_NAME);
                cards.forEach(voluntariado => storeAdd.add(voluntariado));
            }
            resolve();
        };
        countRequest.onerror = () => reject(countRequest.error);
    });
}

export async function addVoluntariado(voluntariado) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    return store.add(voluntariado);
}

export async function getVoluntariados() {
    await initializeDB();
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function deleteVoluntariado(id) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    return store.delete(id);
}

export function generarGrafico() {
    getVoluntariados().then(voluntariados => {
        const canvas = document.getElementById('grafica');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const conteo = { Oferta: 0, Petición: 0 };
        voluntariados.forEach(v => conteo[v.volunType]++);

        const total = conteo.Oferta + conteo.Petición;
        if (total === 0) return;

        // Coordenadas y dimensiones
        const barWidth = 50;
        const ofertaX = 50;
        const peticionX = 150;
        const baseY = 300;

        // Dibujar barras
        ctx.fillStyle = 'blue';
        ctx.fillRect(ofertaX, baseY - conteo.Oferta * 10, barWidth, conteo.Oferta * 10);
        ctx.fillStyle = 'red';
        ctx.fillRect(peticionX, baseY - conteo.Petición * 10, barWidth, conteo.Petición * 10);

        // Estilo del texto
        ctx.fillStyle = 'black';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';

        // Etiquetas sobre las barras (Tipo de voluntariado)
        ctx.fillText('Oferta', ofertaX + barWidth / 2, baseY - conteo.Oferta * 10 - 5);
        ctx.fillText('Petición', peticionX + barWidth / 2, baseY - conteo.Petición * 10 - 5);

        // Números debajo de las barras (Cantidad)
        ctx.fillText(conteo.Oferta, ofertaX + barWidth / 2, baseY - 10);
        ctx.fillText(conteo.Petición, peticionX + barWidth / 2, baseY - 10);
    });
}



