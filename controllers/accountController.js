const asyncHandler = require('express-async-handler');
const User = require('../models/user');

exports.accountCreateGet = asyncHandler(async (req, res, next) => {
    const renderConfig = {
        title: 'Create an account',
        page: 'signUp'
    }
    res.render('layout', renderConfig)
})