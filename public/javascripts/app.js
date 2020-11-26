//filter recipes
const list = document.querySelector(".recipes-list");
const searchForm = document.forms["search-recipes"];
if (searchForm !== undefined) {
  searchForm.onsubmit = function (event) {
    event.preventDefault();
  };
  const searchBar = searchForm.querySelector("input");
  searchBar.addEventListener("keyup", (e) => {
    const term = e.target.value.toLowerCase();

    const recipes = list.getElementsByClassName("recipe-card");
    Array.from(recipes).forEach((recipe) => {
      const title = recipe.firstElementChild.textContent;
      if (title.toLowerCase().indexOf(term) !== -1) {
        recipe.style.display = "flex";
      } else {
        recipe.style.display = "none";
      }
    });
  });
}
