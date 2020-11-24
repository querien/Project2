const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


//If user is logged in, and clicks on log in -> redirect to the profile page



module.exports = router;
