const Recipe = require("../models/Recipe.model");
const Ingredients = require("../models/Ingredient.model");
const { modelNames } = require("mongoose");
const router = require("express").Router();

router.get("/shopping-list/:_id", (req, res, next) => {
  const id = req.params._id;
  console.log("this is the ID:" + id);
  Recipe.findById(id).then((recipe) => {
    const recipeIngredients = recipe.ingredients;
    console.log("recipe ingred", recipeIngredients);
    Ingredients.find().then((ingredients) => {
      const pantryIngredients = ingredients.map((ingredient) =>
        ingredient.name.toLowerCase()
      );
      console.log("pantryIngredients", pantryIngredients);
      const shoppingList = recipeIngredients.filter(
        (ingredient) => !pantryIngredients.includes(ingredient.toLowerCase())
      );
      console.log("shoppinglist", shoppingList);
      const instock = recipeIngredients.filter((ingredient) =>
        pantryIngredients.includes(ingredient.toLowerCase())
      );
      console.log("instock", instock);
      res.render("shopping-list", {
        shoppingList: shoppingList,
        recipe: recipe,
        instock: instock,
      });
    });
  });
});

module.exports = router;
