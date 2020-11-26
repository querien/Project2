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
  duration: {
    type: String,
    default: "--",
  },
  dishes: {
    type: String,
    enum: ["dinner", "snacks", "breakfast", "dessert", "main"],
  },
  servings: Number,
  images: {
    type: String,
    default:
      "https://images.pexels.com/photos/4110238/pexels-photo-4110238.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  author: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Recipe = model("Recipe", recipeSchema);
module.exports = Recipe;
