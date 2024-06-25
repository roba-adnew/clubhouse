const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');

exports.accountCreateGet = asyncHandler(async (req, res, next) => {
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
        if (value !== req.body.password) {
            console.log('passwords dont match');
            throw new Error('passwords dont match')
        }
        return true;

    }),
    body('username').custom(async value => {
        const user = await User.findOne({ username: value });
        if (user) {
            console.log('user already exists');
            throw new Error('Username already exists');
        }
        return true;
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
                const renderConfig = {
                    page: 'login',
                    title: 'Log In',
                    user: res.locals.currentUser
                }
                res.render('layout', renderConfig)
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
            throw error
        }
    })
]

exports.adminGet = asyncHandler(async (req, res, next) => {
    const renderConfig = {
        title: 'SECRET Secret Password',
        page: 'adminAccess',
        user: res.locals.currentUser,
        admin: false
    }
    res.render('layout', renderConfig)
})

exports.adminPost = [
    body('admin').custom(value => {
        return value === 'simsimma'
    }),
    asyncHandler(async (req, res) => {
        const user = res.locals.currentUser;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const renderConfig = {
                title: 'SECRET Secret Password',
                page: 'adminAccess',
                user: user,
                admin: false
            }
            res.render('layout', renderConfig)
            return
        }
        try {
            const userFilter =  { username: user.username };
            const updateMembership = {$set: {admin: true}}
            const result = await User.updateOne(userFilter, updateMembership)
            if (result.modifiedCount === 1) {
                console.log(`they're an admin now`);
            }
            
            res.redirect('/');
        }
        catch(error) {
            console.log(`We had an error: ${error}`)
            throw error
        }
    })
]