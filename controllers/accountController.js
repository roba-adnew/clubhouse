const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');

exports.accountCreateGet = asyncHandler(async (req, res, next) => {
    console.log('page is loading at least')
    const renderConfig = {
        title: 'Create an account',
        page: 'signUp',
        passwordsFailMatch: false
    }
    res.render('layout', renderConfig)
})

exports.accountCreatePost = [
    body('passwordConf').custom((value, req) => {
        return value === req.body.password
    }),
    asyncHandler(async (req, res, next) => {
        const errors  = validationResult(req);

        if (!errors.isEmpty()) {
            const renderConfig = {
                title: 'Create an account',
                page: 'signUp',
                passwordsFailMatch: true
            }

            console.log('dont match');
            res.render('layout', renderConfig);
            return
        }

        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if (err) {
                console.log("nah, you had issues at the hash")
                return next(err);
            }
            try {
                const user = new User({
                    username: req.body.username,
                    hashedPassword: hashedPassword,
                    start: Date.now(), // ms
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    status: "new"
                });
                const result = await user.save();
                console.log("successful account creation")
                res.redirect("/");
            } catch (err2) {
                console.log("nah, this time we couldn't make the account")
                return next(err2);
            };
        })
    })
]
exports.loginGet = asyncHandler(async (req, res, next) => {
    const renderConfig = {
        page: 'login',
        title: 'Log In',
    }
    res.render('layout', renderConfig)
})

exports.loginPost = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
})