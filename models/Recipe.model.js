const { Schema, model } = require("mongoose");

const recipeSchema = new Schema({
  title: {
    required: true,
    type: String,
    unique: true,
  },
  ingredients: {
    required: true,
    type: [String],
  },
  description: {
    required: true,
    type: String,
  },
  duration: Number,
  dish: {
    type: String,
    enum: ["dinner", "lunch", "breakfast", "dessert"],
  },
  servings: Number,
});

const Recipe = model("Recipe", recipeSchema);
module.exports = Recipe;
