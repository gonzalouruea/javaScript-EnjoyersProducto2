import { mostrarUsuarioActivo } from './mostrarUsuarioActivo.js'
import { getSelectedCards, saveSelectedCard, getAllCards, deleteSelectedCard } from './indexedDB.js'

const allCardsContainer = document.querySelector("#allCards")
const selectedCardsContainer = document.querySelector("#selectedCards")

async function renderCards() {
    const selectedCards = await getSelectedCards();
    const AllCards = await getAllCards();
    // Obtener solo las tarjetas que NO están en seleccionadas
    const selectedTitles = selectedCards.map(card => card.title); // o usa `title` si no tienes `id`
    const cardsToRender = AllCards.filter(card => !selectedTitles.includes(card.title)); 

    // Renderiza "All Cards"
    allCardsContainer.innerHTML = ''
    cardsToRender.forEach(card => {
        const cardHtml = createCardHTML(card);
        allCardsContainer.innerHTML += cardHtml;
    });

}

function createCardHTML(card, isSelected = false) {
    return `
    <div class="col-md-12 mb-3" draggable="true" ondragstart="drag(event)" data-title="${card.title}" data-origin="${origin}">
        <div class="card ${card.volunType === 'Oferta' ? 'text-bg-primary' : 'text-bg-success'}" style="max-width: 100%;">
            <div class="card-body">
                <h5 class="card-title fw-bold textPoppinsFont">${card.title}</h5>
                <p class="card-text textRockSFont">${card.description}</p>
                <p class="card-text fst-italic textPatrickFont">Fecha publicación ${card.date}</p>
                <p class="card-text text-decoration-underline textPatrickFont">Publicado por ${card.autor}</p>
            </div>
        </div>
    </div>`
}

// Renderizar todas las tarjetas
async function renderAllCards() {
    allCardsContainer.innerHTML = ''
    let cards = await getAllCards();
    cards.forEach(function(card){
        allCardsContainer.innerHTML += createCardHTML(card)
    });
}

// Renderizar las seleccionadas desde IndexedDB
async function renderSelectedCards() {
    const selected = await getSelectedCards()
    selectedCardsContainer.innerHTML = ''
    selected.forEach(card => {
        selectedCardsContainer.innerHTML += createCardHTML(card, true)
    })
}

// Arrastrar y soltar
window.allowDrop = function (ev) {
    ev.preventDefault()
}

window.drag = function (ev) {
    const el = ev.target
    ev.dataTransfer.setData("text", el.getAttribute("data-title"))
    ev.dataTransfer.setData("origin", el.getAttribute("data-origin"))
}

window.drop = async function (ev) {
    ev.preventDefault()
    const title = ev.dataTransfer.getData("text")
    const origin = ev.dataTransfer.getData("origin")
    const dropTargetId = ev.currentTarget.id
    let cards = await getAllCards();
    const card = cards.find(c => c.title === title)
    if (!card) return;
 if (dropTargetId === "selectedCards") {
        // Añadir si no está ya
        const selected = await getSelectedCards()
        const exists = selected.find(c => c.title === title)
        if (!exists) {
            await saveSelectedCard(card)
        }
    }

    if (dropTargetId === "allCards" ) {
        await deleteSelectedCard(title)
    }

    renderSelectedCards()
    renderCards()
}

renderCards()
renderSelectedCards()
mostrarUsuarioActivo()
