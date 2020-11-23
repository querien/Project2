const { Schema, model } = require("mongoose");

const ingredientSchema = new Schema({
  category: [String],
  name: String,
  availability: [
    "I always have this ingredient",
    "Most of the time I have this ingredient",
  ],
  amount: Number,
});

const Ingredient = model("Ingredient", ingredientSchema);

module.exports = Ingredient;
