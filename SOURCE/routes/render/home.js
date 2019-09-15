var express = require('express');
const passport = require('passport');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    // logined
    res.redirect('/cctv/monitor/')
  } else {
    // not logined
    res.render('login');
  }
});


module.exports = router;
