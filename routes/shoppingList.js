const Recipe = require("../models/Recipe.model");
const Ingredients = require("../models/Ingredient.model");
const { modelNames } = require("mongoose");
const router = require("express").Router();

router.get("/shopping-list/:_id", (req, res, next) => {
  const id = req.params._id;
  console.log("this is the ID:" + id);
  Recipe.findById(id).then((recipe) => {
    const recipeIngredients = recipe.ingredients;
    Ingredients.find().then((ingredients) => {
      const pantryIngredients = ingredients.map(
        (ingredient) => ingredient.name
      );
      const shoppingList = recipeIngredients.filter(
        (ingredient) => !pantryIngredients.includes(ingredient)
      );
      const instockalways = recipeIngredients.filter((ingredient) =>
        pantryIngredients.includes(ingredient)
      );
      res.render("shopping-list", {
        toBuy: shoppingList,
        recipe: recipe,
        inStockalways: instockalways,
      });
    });
  });
});

module.exports = router;
