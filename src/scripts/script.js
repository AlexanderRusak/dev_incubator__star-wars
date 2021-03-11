const cards = Array.from(document.getElementsByClassName("primary-card"));
const closeElement = Array.from(
  document.getElementsByClassName("fa-times-circle")
);

function setCardEvents() {
  cards.forEach((el) => {
    el.removeAttribute("id");
  });
  this.getAttribute("id") === "expand-card"
    ? this.removeAttribute("id")
    : this.setAttribute("id", "expand-card");
}
cards.forEach((element) => {
  element.addEventListener("click", setCardEvents);
});
closeElement.forEach((close) => {
  close.addEventListener("click", function () {
    this.closest(".primary-card").removeEventListener("click", setCardEvents);
    this.closest(".primary-card").removeAttribute("id");
  });
});
