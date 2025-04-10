// voluntariado.js
import { addVoluntariado, getVoluntariados, deleteVoluntariado, generarGrafico } from './int_3_voluntariados.js';
import { obtenerUsuarioActivo } from './almacenaje.js';

document.addEventListener('DOMContentLoaded', async () => {
    mostrarUsuarioActivo();
    cargarVoluntariados();
    document.getElementById('submitId').addEventListener('click', registrarVoluntariado);
});

// Mostrar el usuario activo en la barra de navegación
function mostrarUsuarioActivo() {
    const usuario = obtenerUsuarioActivo();
    const userLoggedElement = document.getElementById('userLogged');
    userLoggedElement.textContent = usuario ? usuario.email : 'No login';
}

// Registrar un nuevo voluntariado
async function registrarVoluntariado() {
    const email = document.getElementById('newVolEmailId').value;
    const title = document.getElementById('newVolTitleId').value;
    const date = document.getElementById('volDateId').value;
    const description = document.getElementById('newVolDescriptionId').value;
    const volunType = document.getElementById('volSelectId').value;

    if (!email || !title || !date || !description || !volunType) {
        alert('Todos los campos son obligatorios');
        return;
    }

    await addVoluntariado({ email, title, date, description, volunType });
    cargarVoluntariados();
    generarGrafico();

    // Limpiar el formulario
    document.getElementById('newVolEmailId').value = '';
    document.getElementById('newVolTitleId').value = '';
    document.getElementById('volDateId').value = '';
    document.getElementById('newVolDescriptionId').value = '';
    document.getElementById('volSelectId').value = '';

    alert('Voluntariado agregado con éxito');
}

// Cargar voluntariados en la tabla
async function cargarVoluntariados() {
    const voluntariados = await getVoluntariados();
    const tbody = document.querySelector('#volTableId tbody');
    tbody.innerHTML = '';

    voluntariados.forEach(v => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${v.email}</td>
            <td>${v.date}</td>
            <td>${v.title}</td>
            <td>${v.description}</td>
            <td>${v.volunType}</td>
            <td><button class='btn btn-danger btn-sm' onclick='eliminarVoluntariado(${v.id})'>Eliminar</button></td>
        `;
        tbody.appendChild(row);
    });
    generarGrafico();
}

// Eliminar voluntariado
window.eliminarVoluntariado = async function (id) {
    await deleteVoluntariado(id);
    cargarVoluntariados();
    generarGrafico();
};
