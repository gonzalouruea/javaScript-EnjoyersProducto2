// index.js

console.log("El script está cargando correctamente");
import { cargarVoluntariados, setupDragAndDrop } from './int_1_dashboard.js';

document.addEventListener('DOMContentLoaded', async () => {
    await cargarVoluntariados();
    setupDragAndDrop();
});
