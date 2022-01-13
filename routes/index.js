var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/liked', function(req, res, next) {
  res.render('liked', { title: 'spacetagram' });
});

router.get('/:date', function(req, res, next) {
  res.render('page', { date: req.params.date });
});


module.exports = router;
