const mongoose = require("mongoose");
const Ingredient = require("../models/Ingredient.model");
const router = require("express").Router();
const data = require("../public/ingredients.json");
const ingredients = data.ingredients;

router.get("/", (req, res, next) => {
  Ingredient.find({}).then((ingredients) => {
    res.render("pantry", { ingredients });
  });
});

router.get("/add", (req, res, next) => {
  res.render("pantry-add");
});

router.post("/add", (req, res, next) => {
  const { category, name, availability, amount } = req.body;
  Ingredient.create({
    category: category,
    name: name,
    availability: availability,
    amount: amount,
  }).then(res.redirect("/pantry"));
});

router.get("/options", (req, res, next) => {
  res.render("options", { ingredients });
});

router.post("/options", (req, res, next) => {
  const { option } = req.body;
  console.log(option);
  option.forEach((element) => {
    Ingredient.create({
      category: "to be determined",
      name: element,
      amount: 1,
    });
  });
  res.redirect("/pantry");
});

module.exports = router;
