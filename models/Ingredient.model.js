const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const ingredientSchema = new Schema({
  category: String,
  name: {
    type: String,
    unique: true,
  },

  amount: Number,
  author: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Ingredient = model("Ingredient", ingredientSchema);

module.exports = Ingredient;
