// importamos las funciones necesarias de almacenaje.js
import { obtenerTodasLasCardsFinal, eliminarCardPorAutorFinal, agregarCardFinal } from "./int_3_voluntarios.js";
import { obtenerTodosLosUsuariosFinal } from "./int_4_usuarios.js";
import { mostrarUsuarioActivo } from "./mostrarUsuarioActivo.js"

// declaramos constantes para obtener el ID de diferentes elementos del DOM
const table = document.getElementById("volTableId")
const submitButton = document.getElementById("submitId")

// función para añadir una nueva fila, se pasará como parámetros email, nombre, título, descipción, tipo de voluntariado y el index del array
async function addRow(email, date, title, description, volunType) {
    let newRow = table.insertRow()
    let delButton = `<button type="button" class="btn btn-danger delete-button">Eliminar</button>`
    let cellClass = volunType === "Oferta" ? "table-primary" : "table-success"

    let cell1 = newRow.insertCell(0)
    let cell2 = newRow.insertCell(1)
    let cell3 = newRow.insertCell(2)
    let cell4 = newRow.insertCell(3)
    let cell5 = newRow.insertCell(4)
    let cell6 = newRow.insertCell(5)

    const users = await obtenerTodosLosUsuariosFinal()

    cell1.textContent = email
    cell2.textContent = date
    cell3.textContent = title
    cell4.textContent = description
    cell5.textContent = volunType
    cell6.innerHTML = delButton

    newRow.classList.add(cellClass)

    let deleteButton = newRow.querySelector(".delete-button")
    deleteButton.addEventListener("click", function () {
        
        if (users.some(user => user.email === email)) {
            let emailExists = true
            let emailIndex = users.findIndex(user => user.email === email)
            eliminarCardPorAutorFinal(users[emailIndex].name);
            newRow.remove()
        }
        // Eliminar la tarjeta del DOM y de la base de datos (usando el índice si es necesario)

    })
}

// cargamos los usuarios y las tarjetas desde IndexedDB
async function cargarDatos() {
    const users = await obtenerTodosLosUsuariosFinal()
    const cards = await obtenerTodasLasCardsFinal()

    // bucle para iterar las tarjetas y usuarios, verificando con un condicional el usuario y el autor de la tarjeta
    cards.forEach((card, index) => {
        users.forEach(user => {
            if (user.name === card.autor) {
                addRow(user.email, card.date, card.title, card.description, card.volunType)
            }
        })
    })
}

// función para añadir una nueva tarjeta con los datos obtenidos del DOM
async function addNewCard(event) {
    event.preventDefault() //función para evitar que el DOM recargue la página al realizar la acción

    let email = document.getElementById("newVolEmailId").value
    let volunType = document.getElementById("volSelectId").value
    let title = document.getElementById("newVolTitleId").value
    let volunDate = document.getElementById("volDateId").value
    let description = document.getElementById("newVolDescriptionId").value
    let volunAdd = false
    let emailExists = false
    let emailIndex = -1

    // Verificamos si el email está registrado
    const users = await obtenerTodosLosUsuariosFinal()
    if (users.some(user => user.email === email)) {
        emailExists = true
        emailIndex = users.findIndex(user => user.email === email)
    } else {
        alert("El usuario (email) no está registrado")
        return
    }

    // Si todos los datos están completos, añadimos la nueva tarjeta
    if (emailExists && volunType !== "" && title !== "" && volunDate !== "" && description !== "") {
        await agregarCardFinal({
            date: volunDate,
            title: title,
            description: description,
            autor: users[emailIndex].name,
            volunType: volunType
        })

        addRow(email, volunDate, title, description, volunType)
        alert("Nuevo voluntariado registrado correctamente")
        volunAdd = true
    }

    if (!volunAdd) {
        alert("Faltan datos para añadir registro")
    }
}

// listener para añadir acción al realizar "click" en el botón del DOM
submitButton.addEventListener("click", addNewCard)

// Cargar los datos al inicio
cargarDatos()

mostrarUsuarioActivo();
async function calcularCardsPorUsuario() {
    const users = await obtenerTodosLosUsuariosFinal() // Cargar todos los usuarios
    const cards = await obtenerTodasLasCardsFinal()  // Cargar todas las tarjetas

    // Crear un objeto para almacenar el número de cards por usuario
    let cardsPorUsuario = {}

    // Iterar sobre las tarjetas
    cards.forEach(card => {
        // Buscar el usuario que corresponde al autor de la tarjeta
        let autor = card.autor
        
        // Si el usuario ya tiene un contador, incrementamos, si no, inicializamos con 1
        if (cardsPorUsuario[autor]) {
            cardsPorUsuario[autor]++
        } else {
            cardsPorUsuario[autor] = 1
        }
    })
    return cardsPorUsuario;
    // Mostrar el número de cards por usuario
}
async function dibujarGrafico() {
    const users = await obtenerTodosLosUsuariosFinal(); // Asegúrate de que esta función devuelve un array
    const data = await calcularCardsPorUsuario(); // Obtener el número de tarjetas por usuario

    let registros = [];
    users.forEach(user => {
        // Verificar si el usuario tiene tarjetas registradas
        registros.push(data[user.name] || 0); // Si no tiene, poner 0
    });

    // Obtener el contexto del canvas
    const canvas = document.getElementById('userChart');
    const ctx = canvas.getContext('2d');

    // Configuraciones del gráfico
    const barWidth = 50; // Ancho de cada barra
    const gap = 30; // Espacio entre las barras
    const maxHeight = 150; // Altura máxima para las barras

    // Encontrar el número máximo de registros para ajustar las alturas
    const maxRegistros = Math.max(...registros);

    // Función para dibujar las barras
    function drawBar(x, y, height) {
        ctx.fillStyle = '#36a2eb'; // Color de las barras
        ctx.fillRect(x, y, barWidth, height); // Dibujar la barra
    }

    // Función para dibujar el gráfico
    function drawChart() {
        // Limpiar el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar cada barra
        for (let i = 0; i < registros.length; i++) {
            const height = (registros[i] / maxRegistros) * maxHeight; // Calcular la altura proporcional
            const x = (i * (barWidth + gap)) + 30; // Calcular la posición X de la barra
            const y = canvas.height - height - 20; // Calcular la posición Y (de abajo hacia arriba)

            drawBar(x, y, height);

            // Dibujar las etiquetas de usuario en el eje X
            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(users[i].name, x + barWidth / 2, canvas.height - 5); // Centrado debajo de cada barra
        }

        // Dibujar el eje Y
        ctx.beginPath();
        ctx.moveTo(30, canvas.height - 20);
        ctx.lineTo(30, 20);
        ctx.strokeStyle = '#000';
        ctx.stroke();

        // Dibujar el eje X
        ctx.beginPath();
        ctx.moveTo(30, canvas.height - 20);
        ctx.lineTo(canvas.width - 10, canvas.height - 20);
        ctx.strokeStyle = '#000';
        ctx.stroke();
    }

    // Llamar a la función para dibujar el gráfico
    drawChart();
}

// Llamar a la función para dibujar el gráfico
dibujarGrafico();