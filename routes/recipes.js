const Recipe = require("../models/Recipe.model");
const User = require("../models/User.model");
const router = require("express").Router();
const uploader = require("../config/cloudinary.config.js");

router.get("/new-recipe", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  res.render("recipe-form");
});

router.post("/recipe", uploader.single("imageUrl"), (req, res) => {
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
    images,
  } = req.body;
  console.log(req.file);
  console.log(req.body);
  Recipe.create({
    title: title,
    description: description,
    ingredients: ingredients.split(",").map((el) => el.trim()),
    directions: directions,
    duration: duration,
    dishes: dishes,
    servings: servings,
    images: req.file && req.file.path,
    author: [req.session.user._id],
  })
    .then((createdRecipe) => {
      console.log("RECEIPE CREATED");
      User.findByIdAndUpdate(
        req.session.user._id,
        {
          $addToSet: { recipes: createdRecipe._id },
        },
        { new: true }
      ).then(() => {});
      res.redirect(`/recipes/${createdRecipe._id}`);
    })
    .catch((error) => {
      if (error.code === 11000) {
        return res.status(400).render("recipe-form", {
          errorMessage: "Recipe names need to be unique! Please try again",
        });
      }
    });
});

router.post("/delete-recipe/:id", (req, res) => {
  Recipe.findByIdAndDelete(req.params.id).then((removedRecipe) => {
    User.findByIdAndUpdate(
      { _id: req.session.user._id },
      { $pull: { recipes: removedRecipe._id } }
    ).then((user) => {
      res.redirect("/recipes");
    });
    //console.log("removed recipe", removedRecipe);
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
  Recipe.findById(req.params.id).then((recipe) => {
    res.render("recipe", { recipe });
  });
});

router.get("/", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  const { search = "" } = req.query;
  Recipe.find({
    $and: [
      { author: { $in: req.session.user._id } },
      { title: { $regex: new RegExp(search), $options: "i" } },
    ],
  }).then((recipes) => {
    res.render("recipes-list", { recipes });
  });
});

module.exports = router;
