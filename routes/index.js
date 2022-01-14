var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/liked', function(req, res, next) {
  res.render('liked');
});

router.get('/:date', function(req, res, next) {

  // Render page if date format in YYYY-MM-DD, else render error
  if (/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.test(req.params.date)) {
    res.render('page', { date: req.params.date });
  } else {
    res.render('error');
  }

});

module.exports = router;
