//filter recipes
const list = document.querySelector("#recipes-list");

const searchBar = document.forms["search-recipes"].querySelector("input");
searchBar.addEventListener("keyup", (e) => {
  const term = e.target.value.toLowerCase();

  const recipes = list.getElementsByTagName("li");
  Array.from(recipes).forEach((recipe) => {
    const title = recipe.firstElementChild.textContent;
    if (title.toLowerCase().indexOf(term) !== -1) {
      recipe.style.display = "block";
    } else {
      recipe.style.display = "none";
    }
    // const text = recipe.querySelector("#ingredients");
    // if (text.toLowerCase().indexOf(term) !== -1) {
    //   recipe.style.display = "block";
    // } else {
    //   recipe.style.display = "none";
    // }
  });
});
