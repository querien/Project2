const Recipe = require("../models/Recipe.model");
const User = require("../models/User.model");

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
    directions,
    duration,
    dishes,
    servings,
  } = req.body;

  Recipe.create({
    title: title,
    description: description,
    ingredients: ingredients.split(",").map((el) => el.trim()),
    directions: directions,
    duration: duration,
    dishes: dishes,
    servings: servings,
  }).then((createdRecipe) => {
    User.findByIdAndUpdate(
      req.session.user._id,
      {
        $addToSet: { recipes: createdRecipe._id },
      },
      { new: true }
    ).then(() => {
      console.log("it was added");
    });
    console.log("createdRecipe", createdRecipe);
    //send to the database
    res.redirect(`/recipes/${createdRecipe._id}`);
  });
});

router.post("/delete-recipe/:id", (req, res) => {
  Recipe.findByIdAndDelete(req.params.id).then((removedRecipe) => {
    console.log("removed recipe", removedRecipe);
    res.redirect("/recipes");
  });
});

router.get("/edit-recipe/:id", (req, res) => {
  Recipe.findById(req.params.id).then((recipe) => {
    res.render("recipe-edit-form", { recipe });
  });
});

router.post("/edit/:id", (req, res) => {
  const {
    title,
    ingredients,
    description,
    directions,
    duration,
    dishes,
    servings,
  } = req.body;
  const data = {
    title: title,
    description: description,
    ingredients: ingredients.split(",").map((el) => el.trim()),
    directions: directions,
    duration: duration,
    dishes: dishes,
    servings: servings,
  };
  Recipe.findByIdAndUpdate(req.params.id, data).then((recipe) => {
    res.redirect(`/recipes/${recipe._id}`);
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
  User.findById(req.session.user._id)
    .populate("recipes")
    .then((data) => {
      console.log(data);
      const { recipes } = data;
      res.render("recipes-list", { recipes });
    });
});

module.exports = router;
