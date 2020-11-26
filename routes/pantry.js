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
      //console.log(data);
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
    console.log(ingredient);
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
    //console.log(ingredient);
    res.redirect("/pantry");
  });
});

// router.post("/edit", (req, res) => {
//   const id = req.body.editIngredient;
//   Ingredient.findById(id)
//     .then((foundIngredient) => {
//       console.log(("Found this", foundIngredient));
//       res.render("pantry-edit", { foundIngredient });
//     })
//     .then(() => {
//       const { name, amount, availability, category } = req.body;
//       findByIdAndUpdate(id, {
//         name: name,
//         category: category,
//         availability: availability,
//         amount: amount,
//       });
//     });
// });

// Ingredient.findByIdAndDelete(id).then((removedIngredient) => {
//   console.log("removed ingredient", removedIngredient);
//   res.redirect("/pantry");
// });

// router.post("/delete-ingredient/:id", (req, res) => {
//   Ingredient.findByIdAndDelete(req.params.id).then((removedIngredient) => {
//     console.log("removed ingredient", removedIngredient);
//     res.redirect("/pantry");
//   });
// });

function prepareForFrontend(ingredients) {
  return ingredients.reduce((acc, v) => {
    //console.log(acc[v.category]);
    const shortenedCategory = v.category.split(" ")[0].toLowerCase();
    if (acc[shortenedCategory]) {
      //console.log("PREVOIOUS VERSION OF THE ARRAY", acc[v.category]);
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
        console.log("newPantry:", newPantry);
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
  const { option } = req.body;

  const mapOfIngredients = option.map((element) => {
    const [category, name] = element.split(",");
    return Ingredient.create({ category, name, amount: 1 });
  });
  Promise.all(mapOfIngredients)
    .then((arrayOfPromisesResolve) => {
      const updateUser = arrayOfPromisesResolve.map((element) => {
        return User.findByIdAndUpdate(req.session.user_id, {
          $addToSet: { pantry: element._id },
        });
      });
      Promise.all(updateUser).then(() => {
        res.redirect("/pantry");
      });
    })
    .catch((error) => {
      if (error.code === 11000) {
        return res.status(400).render("options", {
          errorMessage: "Ingredient names need to be unique! Please try again",
        });
      }
    });
});

module.exports = router;
