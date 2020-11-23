const Recipe = require("../models/Recipe.model");
const Ingredients = require("../models/Ingredient.model");
const { modelNames } = require("mongoose");
const router = require("express").Router();

router.get("/shopping-list/:_id", (req, res, next) => {
  const id = req.params._id;
  console.log("this is the ID:" + id);
  Recipe.findById(id).then((recipe) => {
    const inStockArr = recipe.ingredients;
    inStockArr.forEach((element) => {
      Ingredients.find({ name: element }).then((result) => {
        console.log(result);
      });
    });
    res.render("shopping-list", { recipe });
  });
});

module.exports = router;
