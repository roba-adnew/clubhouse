const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.accountCreateGet = asyncHandler(async (req, res, next) => {
    console.log('page is loading at least')
    const renderConfig = {
        title: 'Create an account',
        page: 'signUp'
    }
    res.render('layout', renderConfig)
})

exports.accountCreatePost = asyncHandler(async (req, res, next) => {
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

// exports.loginGet = asyncHandler(async (req, res, next) => {
//     const renderConfig = {
//         page: 'loginForm',
//         title: 'Log-In',
//         user: req.user
//     }
//     res.render('layout', renderConfig)
// })

// exports.loginPost = passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login"
//   })