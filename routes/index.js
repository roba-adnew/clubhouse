const express = require('express');
const router = express.Router();
const navController = require('../controllers/navController');

/* GET home page. */
router.get("/", navController.dynamicHandler);

module.exports = router;