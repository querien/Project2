const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const recipeSchema = new Schema({
  title: {
    required: true,
    type: String,
    unique: true,
  },
  description: {
    type: String,
  },
  ingredients: {
    required: true,
    type: [String],
  },
  directions: {
    required: true,
    type: String,
  },
  duration: Number,
  dishes: {
    type: String,
    enum: ["dinner", "lunch", "breakfast", "dessert"],
  },
  servings: Number,
  images: String,
  author: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Recipe = model("Recipe", recipeSchema);
module.exports = Recipe;
