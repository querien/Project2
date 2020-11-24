const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const Ingredient = require("../models/Ingredient.model");
const router = require("express").Router();
const data = require("../public/ingredients.json");
const ingredients = data.ingredients;

router.get("/", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  User.findById(req.session.user._id)
    .populate("pantry")
    .then((data) => {
      const { pantry } = data;
      res.render("pantry", { pantry });
    });
});

//   Ingredient.find({}).then((ingredients) => {
//     res.render("pantry", { ingredients });
//   });
// });

function prepareForFrontend(ingredients) {
  return ingredients.reduce((acc, v) => {
    //console.log(acc[v.category]);
    const shortenedCategory = v.category.split(" ")[0].toLowerCase();
    if (acc[shortenedCategory]) {
      console.log("PREVOIOUS VERSION OF THE ARRAY", acc[v.category]);
      return {
        ...acc,
        [shortenedCategory]: [...acc[shortenedCategory], v.name],
      };
    }
    return { ...acc, [shortenedCategory]: [v.name] };

    // return { ...acc, [v.category]: [...acc[v.category], v.name] };
  }, {});
  console.log(firsttest);
}

// acc = {}
// val = {cateogry: "Oils and vinegar", name:"Extra-virgin..."}
// if acc[v.category] => if acc["Oils and vinegar"] -> acc.OilsAndVinegar
// return { ["Oils abd vibegar"]: ["Extr virign"}

// 2nd looo
// acc=> {"Oils and vinegar": ["Extr virign"]}
// val = { category: "Oils and viegar", name:"Cocunut oil"}
// if acc[v.category] => if acc["Oils and vinegar"] -> acc.OilsAndVinegar
// return {"Oils and vinegar": ["Extr virgin"]} -> {"Oils and vinegar": ["extr virgin", "Cocunt oil"]}

//prepareForFrontend(ingredients);
// const categories = {[
//   "Oils and vinegar",
//   "Herbs and spices",
//   "Condiments",
//   "Sweeteners",
//   "Grains and starches",
//   "Beans",
//   "Canned goods",
//   "Produce",
// ]};

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
  }).then((addedIngredient) => {
    User.findByIdAndUpdate(
      req.session.user._id,
      {
        $addToSet: { pantry: addedIngredient._id },
      },
      { new: true }
    ).then((newPantry) => {
      console.log("newPantry:", newPantry);
      res.redirect("/pantry");
    });
  });
});

router.get("/options", (req, res, next) => {
  res.render("options", prepareForFrontend(ingredients));
});

router.post("/options", (req, res, next) => {
  const { option } = req.body;
  console.log(option);
  option.forEach((element) => {
    Ingredient.create({
      category: "to be determined",
      name: element,
      amount: 1,
    }).then((addedIngredient) => {
      User.findByIdAndUpdate(
        req.session.user._id,
        {
          $addToSet: { pantry: addedIngredient._id },
        },
        { new: true }
      ).then((newPantry) => {
        console.log("newPantry:", newPantry);
      });
      res.redirect("/pantry");
    });
  });
});

module.exports = router;
