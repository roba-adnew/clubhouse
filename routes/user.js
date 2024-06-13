const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.get('/sign-up', accountController.accountCreateGet)

module.exports = router;