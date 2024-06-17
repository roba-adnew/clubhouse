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
        passwordsFailMatch: false,
        userExists: false,
        user: res.locals.currentUser
    }
    res.render('layout', renderConfig)
})

exports.accountCreatePost = [
    body('passwordConf').custom((value, { req }) => {
        if (value === req.body.password) return;
        console.log('passwords dont match');
        return;

    }),
    body('username').custom(async value => {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            const renderConfig = {
                title: 'Create an account',
                page: 'signUp',
                passwordsFailMatch: true,
                userExists: true,
                user: res.locals.currentUser,
            }
            console.log('user already exists');
            res.render('layout', renderConfig);
            return
        }

    }),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const renderConfig = {
                title: 'Create an account',
                page: 'signUp',
                passwordsFailMatch: true,
                userExists: false,
                user: res.locals.currentUser
            }

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
                    status: "uninitiated"
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
        user: res.locals.currentUser
    }
    res.render('layout', renderConfig)
})

exports.loginPost = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
})

exports.logoutGet = asyncHandler(async (req, res, next) => {
    const renderConfig = {
        page: 'logout',
        title: 'Log Out',
        user: res.locals.currentUser
    }
    res.render('layout', renderConfig)
})

exports.logoutPost = asyncHandler(async (req, res, next) => {
    req.logout((error) => {
        if (error) {
            console.log('oops, couldnt log out')
            return next(error)
        }
        console.log('ok ok, youre out');
        res.redirect('/')
    })
})

exports.passcodeGet = asyncHandler(async (req, res, next) => {
    const renderConfig = {
        title: 'Secret Password',
        page: 'memberAccess',
        user: res.locals.currentUser,
        theyKnow: false
    }
    res.render('layout', renderConfig)
})

exports.passcodePost = [
    body('secret').custom(value => {
        return value === 'chinchilla'
    }),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const renderConfig = {
                title: 'Secret Password',
                page: 'memberAccess',
                user: res.locals.currentUser,
                theyKnow: false
            }
            res.render('layout', renderConfig)
            return
        }
        try {
            const userFilter =  { username: res.locals.currentUser.username };
            const updateMembership = {$set: {status: "initiated"}}
            const result = await User.updateOne(userFilter, updateMembership)
            if (result.modifiedCount === 1) {
                console.log('theyve been initiated');
            }
            
            const renderConfig = {
                title: 'Secret Password',
                page: 'memberAccess',
                user: res.locals.currentUser,
                theyKnow: true
            }
            res.render('layout', renderConfig);
        }
        catch(error) {
            console.log(`We had an error: ${error}`)
        }
    })
]