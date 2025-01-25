var express = require('express');
const { default: apiResponse } = require('../utils/api-response');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.status(200).json(apiResponse(true, "Message here", "Datas(s) here, can be any data types"))
});

module.exports = router;
