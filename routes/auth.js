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

// passport set-up
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            };
            const match = await bcrypt.compare(password, user.hashedPassword);
            if (!match) {
                return done(null, false, { message: "Incorrect password" });
            };
            return done(null, user);
        } catch (err) {
            return done(err);
        };
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    };
});

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