const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

router.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  console.log(req.session);
  console.log(req.session.user);
  console.log(req.session.user._id);
  User.findById(req.session.user._id).then((myUser) => {
    console.log("myUser:", myUser.email);
    res.render("profile", { myUser });
  });
});

router.post("/update-password", (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    //   stop and wait a minute
  }
  const isSamePassword = bcrypt.compareSync(
    oldPassword,
    req.session.user.password
  );

  if (!isSamePassword) {
    //   ERROR HANDLING HERE
  }

  const hashingAlgorithm = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(newPassword, hashingAlgorithm);

  User.findByIdAndUpdate(
    req.session.user._id,
    { password: hashedPassword },
    { new: true }
  ).then((newAndUpdatedUser) => {
    req.session.user = newAndUpdatedUser;
    res.render("profile", {
      message: "All good, successful, move away",
    });
  });
});

router.post("/delete-profile", (req, res) => {
  User.findByIdAndDelete(req.session.user._id).then((removedUser) => {
    console.log(removedUser);
    req.session.user = null;
    res.redirect("/auth/signup");
  });
});

module.exports = router;
