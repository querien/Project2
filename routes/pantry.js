const mongoose = require("mongoose");
const Ingredient = require("../models/Ingredient.model");
const router = require("express").Router();
const data = require("../public/ingredients.json");
const ingredients = data.ingredients;

router.get("/", (req, res, next) => {
  res.render("pantry");
});

router.post("/", (req, res, next) => {
  const { category, name, availability, amount } = req.body;
  Ingredient.create({
    category: category,
    name: name,
    availability: availability,
    amount: amount,
  });
});

router.get("/options", (req, res, next) => {
  res.render("options", { ingredients });
});

router.post("/options", (req, res, next) => {
  const { name } = req.body;
  console.log(req.body);
});

module.exports = router;
