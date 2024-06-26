const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require("passport-local").Strategy;
const accountController = require('../controllers/accountController');
const User = require('../models/user');

router.get('/sign-up', accountController.accountCreateGet)

router.post('/sign-up', accountController.accountCreatePost)

router.get('/login', accountController.loginGet);

router.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

router.post('/login', accountController.loginPost);

router.get('/log-out', accountController.logoutGet);

router.post('/log-out', accountController.logoutPost);

router.get('/secret-password', accountController.passcodeGet);

router.post('/secret-password', accountController.passcodePost);

router.get('/admin-password', accountController.adminGet);

router.post('/admin-password', accountController.adminPost);

module.exports = router;