// ℹ️ To get access to environment
require("dotenv").config();

// ℹ️ Connect to the database
require("./db");

const express = require("express");
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);

const projectName = "project-2";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with IronGenerator`;
// default value for title local

app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.email = req.session.user.email;
  }
  next();
});

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const profileRoutes = require("./routes/profile");
app.use("/", profileRoutes);

const pantryRoutes = require("./routes/pantry");
app.use("/pantry", pantryRoutes);

const recipesRoutes = require("./routes/recipes");
app.use("/recipes", recipesRoutes);

const shoppingListRoutes = require("./routes/shoppingList");
app.use("/", shoppingListRoutes);

// ❗ To handle errors. Routes that dont exist or errors that you handle in specfic routes
require("./error-handling")(app);

hbs.handlebars.registerHelper("selected", function (option, value) {
  if (option === value) {
    return " selected";
  } else {
    return "";
  }
});

hbs.handlebars.registerHelper("loud", function (aString) {
  const words = aString.split(" ");
  return words
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(" ");
});

hbs.handlebars.registerHelper("upper", function (aString) {
  return aString[0].toUpperCase() + aString.slice(1);
});

module.exports = app;
