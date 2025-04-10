// int_1_dashboard.js
import { getVoluntariados } from './int_3_voluntariados.js';

document.addEventListener('DOMContentLoaded', () => {
    cargarVoluntariados();
});

// Función para cargar voluntariados en tarjetas
export async function cargarVoluntariados() {
    const voluntariados = await getVoluntariados();
    const container = document.getElementById('rowContainer');
    container.innerHTML = '';
    
    voluntariados.forEach(vol => {
        const card = document.createElement('div');
        card.classList.add('card', 'm-2', 'voluntariado-card', vol.volunType.toLowerCase() === 'oferta' ? 'bg-primary' : 'bg-danger', 'text-white');
        card.id = `vol-${vol.id}`;
        card.draggable = true;
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${vol.title}</h5>
                <p class="card-text">${vol.description}</p>
                <p><strong>Fecha:</strong> ${vol.date}</p>
                <p><strong>Tipo:</strong> ${vol.volunType}</p>
            </div>
        `;
        container.appendChild(card);
    });

    // Ajustar la altura de la sección de seleccionados
    ajustarAlturaSeleccionados();
}

// Configuración de arrastrar y soltar
export function setupDragAndDrop() {
    document.addEventListener('dragstart', (event) => {
        if (event.target.classList.contains('voluntariado-card')) {
            event.dataTransfer.setData('text/plain', event.target.id);
            event.target.classList.add('dragging');
        }
    });

    document.addEventListener('dragend', (event) => {
        event.target.classList.remove('dragging');
    });

    const dropZones = [document.getElementById('dropZone'), document.getElementById('rowContainer')];

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        zone.addEventListener('drop', (event) => {
            event.preventDefault();
            const id = event.dataTransfer.getData('text/plain');
            const card = document.getElementById(id);
            if (card && card.parentElement !== zone) {
                zone.appendChild(card);
                ajustarAlturaSeleccionados();
            }
        });
    });
}

// Función para ajustar la altura de la sección de seleccionados
function ajustarAlturaSeleccionados() {
    const disponibles = document.getElementById('rowContainer');
    const seleccionados = document.getElementById('dropZone');
    seleccionados.style.minHeight = `${disponibles.offsetHeight}px`;
}