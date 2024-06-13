const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.get('/sign-up', accountController.accountCreateGet)

router.post('/sign-up', accountController.accountCreatePost)

module.exports = router;