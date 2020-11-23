const Recipe = require("../models/Recipe.model");
const router = require("express").Router();

router.get("/new-recipe", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  res.render("recipe-form");
});

router.post("/recipe", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  const {
    title,
    ingredients,
    description,
    duration,
    dishes,
    servings,
  } = req.body;

  Recipe.create({
    title: title,
    ingredients: ingredients,
    description: description,
    duration: duration,
    dishes: dishes,
    servings: servings,
  }).then((createdRecipe) => {
    console.log("createdRecipe", createdRecipe);
    //send to the database
    res.redirect(`/recipes/${createdRecipe._id}`);
  });
});

router.get("/:id", (req, res) => {
  console.log(req.params.id);
  Recipe.findById(req.params.id).then((recipe) => {
    res.render("recipe", { recipe });
  });
});

router.get("/", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  Recipe.find().then((recipes) => {
    res.render("recipes-list", { recipes });
  });
});

module.exports = router;
