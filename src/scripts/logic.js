export const getDataFromApi = async (category, page) => {
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

export const getDataFromLocalStorage = (page) => {

    const pageData = localStorage.getItem(page);
    return pageData;
}

export const getSearchData = async (name) => {
    let data = [];
    let response;
    if (getDataFromLocalStorage(name)) {

        appendTempalte(1, JSON.parse(getDataFromLocalStorage(name)))

    } else {
        data = await fetch(`https://swapi.dev/api/people/?search=${name}`);
        response = await data.json();

        setDataToLocalStarage(name, JSON.stringify(response.results));
        appendTempalte(1, [...response.results])
    }
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