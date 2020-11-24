const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const ingredientSchema = new Schema({
  category: String,
  name: {
    type: String,
    unique: true,
  },

  availability: {
    type: String,
    enum: ["I always have this ingredient", "I sometimes have this ingredient"],
    default: "I always have this ingredient",
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
