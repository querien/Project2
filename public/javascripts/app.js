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
  });
});

function searchPantry() {
  // Declare variables
  let input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("pantry");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
