const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const Ingredient = require("../models/Ingredient.model");
const router = require("express").Router();
const data = require("../public/ingredients.json");
const { findByIdAndUpdate } = require("../models/User.model");
const ingredients = data.ingredients;

router.get("/", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  User.findById(req.session.user._id)
    .populate("pantry")
    .then((data) => {
      const { email } = req.session.user;
      const { pantry } = data;
      res.render("pantry", { pantry, email });
    });
});

router.post("/remove", (req, res) => {
  const id = req.body.removeIngredient;
  const userid = req.session.user._id;
  Ingredient.findByIdAndDelete(id).then((removeIngredient) => {
    User.findByIdAndUpdate(
      { _id: userid },
      { $pull: { pantry: removeIngredient._id } }
    ).then((user) => {
      res.redirect("/pantry");
    });
  });
});

router.get("/edit/:id", (req, res) => {
  Ingredient.findById(req.params.id).then((ingredient) => {
    res.render("pantry-edit", { ingredient });
  });
});
router.post("/edit/:id", (req, res) => {
  const { category, name, availability, amount } = req.body;
  const data = {
    category: category,
    name: name,
    amount: amount,
  };
  Ingredient.findByIdAndUpdate(req.params.id, data).then((ingredient) => {
    res.redirect("/pantry");
  });
});

function prepareForFrontend(ingredients) {
  return ingredients.reduce((acc, v) => {
    const shortenedCategory = v.category.split(" ")[0].toLowerCase();
    if (acc[shortenedCategory]) {
      return {
        ...acc,
        [shortenedCategory]: [...acc[shortenedCategory], v.name],
      };
    }
    return { ...acc, [shortenedCategory]: [v.name] };
  }, {});
}

router.get("/add", (req, res, next) => {
  res.render("pantry-add");
});

router.post("/add", (req, res, next) => {
  const { category, name, availability, amount } = req.body;
  Ingredient.create({
    category: category,
    name: name,
    amount: amount,
  })
    .then((addedIngredient) => {
      User.findByIdAndUpdate(
        req.session.user._id,
        {
          $addToSet: { pantry: addedIngredient._id },
        },
        { new: true }
      ).then((newPantry) => {
        res.redirect("/pantry");
      });
    })
    .catch((error) => {
      if (error.code === 11000) {
        return res.status(400).render("pantry-add", {
          errorMessage: "Ingredient names need to be unique! Please try again",
        });
      }
    });
});

router.get("/options", (req, res, next) => {
  res.render("options", prepareForFrontend(ingredients));
});

router.post("/options", (req, res, next) => {
  let { option } = req.body;

  if (option === undefined) {
    option = [];
  }
  if (typeof option === "string") {
    option = [option];
  }

  const mapOfIngredients = option.map((element) => {
    const [category, name] = element.split(",");
    return Ingredient.create({ category, name, amount: 1 });
  });
  Promise.all(mapOfIngredients)
    .then((arrayOfPromisesResolve) => {
      const updateUser = arrayOfPromisesResolve.map((element) => {
        return User.findByIdAndUpdate(req.session.user._id, {
          $addToSet: { pantry: element._id },
        });
      });
      Promise.all(updateUser).then(() => {
        res.redirect("/pantry");
      });
    })
    .catch((error) => {
      if (error.code === 11000) {
        return res.status(400).render(
          "options",
          Object.assign(
            {
              errorMessage: "Ingredient needs to be unique! Please try again",
            },
            prepareForFrontend(ingredients)
          )
        );
      }
    });
});

module.exports = router;
