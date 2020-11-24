const list = document.querySelector('#recipes-list ul');

const searchBar = document.forms['search-recipes'].querySelector('input');
searchBar.addEventListener('keyup', function(e) => {
  const term = e.target.value.toLowerCase();
  const recipes = list.getElementsByTagName('li');
  Array.from(recipes).forEach(recipe  => {
    const title = recipe.firstElementChild.textContent;
    if(title.toLowerCase().indexOf(term) !== -1){
      recipe.style.display = 'block'
    } else {
      recipe.style.display = 'none'
    }
  });
})
