import * as Handlebars from "handlebars/dist/cjs/handlebars";



function setCardEvents() {
    const element = this.closest(".primary-card");
    element.setAttribute("id", "expand-card");

}



const getDataFromApi = async (category, page) => {
    let result = [];

    const data = await fetch(`https://swapi.dev/api/${category}/?limit=10&page=${page}`);
    const { results } = await data.json();

    result = [...results];


    setPageDataToLocalStarage(page, JSON.stringify(result));

    return result;
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

const appendTempalte = async (page) => {
    const container = document.getElementById("card-section");
    const data = getPageDataFromLocalStorage(page) ? await JSON.parse(getPageDataFromLocalStorage(page)) : await getDataFromApi("people", page);

    const elements = [];
    data.forEach((card) => {
        elements.push(getCardTemplate(card));
    });
    container.innerHTML = elements;


    const cards = Array.from(document.getElementsByClassName("primary-card"));
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

const setPaginationTemplate = async () => {
    const paginationContainer = document.getElementById("pagination");
    const countOfPeople = await fetch(`https://swapi.dev/api/people/`);
    const { count } = await countOfPeople.json();
    const countOFPage = Math.ceil(count / 10);
    paginationContainer.innerHTML = generatePaginationPages(countOFPage);
    setEventsOnPaginationPages();
}

const generatePaginationPages = (countPages) => {
    const pages = [];
    for (let i = 1; i <= countPages; i++) {
        pages.push(`<div ${i === 1 && "class='pagination-page'"} >${i}</div>`);
    }
    return pages;
}
const setEventsOnPaginationPages = () => {
    const pages = Array.from(document.querySelectorAll(".pagination div"));

    pages.forEach(page => {
        page.addEventListener("click", function () {
            document.getElementsByClassName("pagination-page")[0] && document.getElementsByClassName("pagination-page")[0].removeAttribute("class");
            this.setAttribute("class", "pagination-page");
            appendTempalte(this.innerText);
        })
    })


}


const getPageDataFromLocalStorage = (page) => {

    const pageData = localStorage.getItem(page);
    return pageData;
}

const setPageDataToLocalStarage = (page, data) => {
    localStorage.setItem(page, `${data}`);
}

appendTempalte(1);
setPaginationTemplate();


