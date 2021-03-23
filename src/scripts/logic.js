import * as Handlebars from "handlebars/dist/cjs/handlebars";

const getDataFromApi = async (category, page) => {
    let result = [];

    const data = await fetch(`https://swapi.dev/api/${category}/?limit=10&page=${page}`);
    const { results } = await data.json();

    result = [...results];


    setDataToLocalStarage(page, JSON.stringify(result));

    return result;
}

const setDataToLocalStarage = (page, data) => {
    localStorage.setItem(page, `${data}`);
}

const getDataFromLocalStorage = (page) => {

    const pageData = localStorage.getItem(page);
    return pageData;
}

const getSearchData = async (name) => {
    let data = [];
    let response;
    if (getDataFromLocalStorage(name)) {

        !getDataFromLocalStorage(name) && toggleEmptySearchResult(name);
        appendTempalte(1, JSON.parse(getDataFromLocalStorage(name)));


    } else {
        data = await fetch(`https://swapi.dev/api/people/?search=${name}`);
        response = await data.json();
        !response.count && toggleEmptySearchResult(name);

        setDataToLocalStarage(name, JSON.stringify(response.results));
        appendTempalte(1, [...response.results])
    }
    toggleBackButton();
}

export const setPaginationTemplate = async () => {
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

export const appendTempalte = async (page, searchData = null) => {
    const container = document.getElementById("card-section");
    const data = !searchData ? getDataFromLocalStorage(page) ? await JSON.parse(getDataFromLocalStorage(page)) : await getDataFromApi("people", page) : searchData;
    const elements = [];
    data.forEach((card) => {   ///map
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


export const search = async () => {
    const inputString = document.getElementById("card-search");
    const inputButton = document.getElementById("button-search");

    inputButton.addEventListener("click", async () => {
        await getSearchData(inputString.value);
    });
}

const toggleEmptySearchResult = (name) => {
    let display = document.getElementById("search-empty").style.display;
    console.log(!!display);
    !!display ? document.getElementById("search-empty").style.display = "none" : document.getElementById("search-empty").style.display = "block";
    document.querySelector(".search-empty h4").innerText = `No results were found for ${name}!`;
}

const toggleBackButton = () => {
    const returnButton = document.getElementById("return");
    returnButton.style.display = "block";
    returnButton.addEventListener("click",()=>{
        document.getElementById("pagination").style.display = "flex";
        returnButton.style.display = "none";
        appendTempalte(1);
    })
    document.getElementById("pagination").style.display = "none";
}