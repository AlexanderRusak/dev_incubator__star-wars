import * as Handlebars from "handlebars/dist/cjs/handlebars";
import { getDataFromApi, getDataFromLocalStorage, getSearchData, setPaginationTemplate } from "./logic";



function setCardEvents() {
    const element = this.closest(".primary-card");
    element.setAttribute("id", "expand-card");

}

const getCardTemplate = (data) => {
    return Handlebars.compile(`<div class="primary-card">
  <i class="far fa-times-circle"></i>
  <h6>{{name}}</h6>
  <div class="primary-card__info">
    <p>Gender: {{gender}}</p>
    <p>Birth year: {{birth_year}}</p>
  </div>
  <div class="primary-card__info-additional">
    <p>Height: {{height}}</p>
    <p>Mass: {{mass}}</p>
    <p>Hair color: {{hair_color}}</p>
  </div>
  <div class="primary-card__info-additional">
    <p>Eye color: {{eye_color}}</p>
    <p>Skin color: {{skin_color}}</p>
  </div>
  <p class="primary-card__info-label">Click to get more</p>
  </div>`)(data);
}

const appendTempalte = async (page, searchData = null) => {
    const container = document.getElementById("card-section");
    const data = !searchData ? getDataFromLocalStorage(page) ? await JSON.parse(getDataFromLocalStorage(page)) : await getDataFromApi("people", page) : searchData;
    const elements = [];
    data.forEach((card) => {
        elements.push(getCardTemplate(card));
    });
    container.innerHTML = elements;


    Array.from(document.getElementsByClassName("primary-card"));
    const cardsButton = Array.from(document.getElementsByClassName("primary-card__info-label"));
    const closeElement = Array.from(
        document.getElementsByClassName("fa-times-circle")
    );
    cardsButton.forEach((element) => {
        element.addEventListener("click", setCardEvents);
    });
    closeElement.forEach((close) => {
        close.addEventListener("click", function () {
            this.closest(".primary-card").removeAttribute("id");
        });
    });


}
const search = async () => {
    const inputString = document.getElementById("card-search");
    const inputButton = document.getElementById("button-search");

    inputButton.addEventListener("click", async () => {
        await getSearchData(inputString.value);
    });
}



appendTempalte(1);
setPaginationTemplate();
search();

