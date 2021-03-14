import * as Handlebars from "handlebars/dist/cjs/handlebars";



function setCardEvents() {
  const element = this.closest(".primary-card");
  element.setAttribute("id", "expand-card");

}



const getDataFromApi = async (category, count) => {
  const result = [];
  for (let i = 1; i <= (count / 10); i++) {
    await fetch(`https://swapi.dev/api/${category}/?limit=10&page=${i}`).then(data => data.json()).then(({ results }) => {
      result.push(...results);
    });
  }
  return result;
}

const getCardTemplate = (data) => {
  const { name, gender, birth_year, homeworld, height, mass, hair_color, eye_color, skin_color } = data;

  const cardTemplate = Handlebars.compile(`<div class="primary-card">
  <i class="far fa-times-circle"></i>
  <h6>{{name}}</h6>
  <div class="primary-card__info">
    <p>Gender: {{gender}}</p>
    <p>Birth year: {{birth_year}}</p>
    <p>Home World: {{homeworld}}</p>
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
</div>`);
  return cardTemplate({ name, gender, birth_year, homeworld, height, mass, hair_color, eye_color, skin_color });
}


const appendTempalte = async () => {
  const container = document.getElementById("card-section");
  const data = await getDataFromApi("people", 10).then((results) => results);
  const elements = [];
  await data.forEach((card) => {
    elements.push(getCardTemplate(card));
  });
  container.innerHTML = elements;


  const cards = Array.from(document.getElementsByClassName("primary-card"));
  const cardsButton = Array.from(document.getElementsByClassName("primary-card__info-label"));
  const closeElement = Array.from(
    document.getElementsByClassName("fa-times-circle")
  );
  await cardsButton.forEach((element) => {
    element.addEventListener("click", setCardEvents);
  });
  await closeElement.forEach((close) => {
    close.addEventListener("click", function () {
      this.closest(".primary-card").removeAttribute("id");
    });
  });


}
appendTempalte();

//getDataFromApi("people", 10).then((res) => { console.log(res) });