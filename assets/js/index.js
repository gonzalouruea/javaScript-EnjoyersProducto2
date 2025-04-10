/**
* lógica del fichero index.html
*/

// importamos el array "cards" del fichero datos.js
import { cards } from './datos.js'
import { mostrarUsuarioActivo } from './mostrarUsuarioActivo.js'

// declaramos una constante con la clase #rowContainer
const rowContainer = document.querySelector("#rowContainer")

// bucle para iterar el array de tarjetas y lo mostrará en el fichero HTML con los diferentes datos
// se aplican diferentes fuentes para darte estilo a las tarjetas
for (let i = 0; i < cards.length; i++) {
    if (cards[i].volunType === "Oferta") {
        let card = `
        <div class="col-md-3 col-sm-6 mb-3">
            <div class="card text-bg-primary" style="max-width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title fw-bold textPoppinsFont">${cards[i].title}</h5>
                    <p class="card-text textRockSFont">${cards[i].description}</p>
                    <p class="card-text fst-italic textPatrickFont">Fecha publicación ${cards[i].date}</p>
                    <p class="card-text text-decoration-underline textPatrickFont">Publicado por ${cards[i].autor}</p>
                </div>
            </div>
        </div>`

        rowContainer.innerHTML += card
    }

    if (cards[i].volunType === "Petición") {
        let card = `
        <div class="col-md-3 col-sm-6 mb-3">
            <div class="card text-bg-success" style="max-width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title fw-bold textPoppinsFont">${cards[i].title}</h5>
                    <p class="card-text textRockSFont">${cards[i].description}</p>
                    <p class="card-text fst-italic textPatrickFont">Fecha publicación ${cards[i].date}</p>
                    <p class="card-text text-decoration-underline textPatrickFont">Publicado por ${cards[i].autor}</p>
                </div>
            </div>
        </div>`

        rowContainer.innerHTML += card
    }
}
mostrarUsuarioActivo();
