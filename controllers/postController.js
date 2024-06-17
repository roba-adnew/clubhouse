const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Post = require('../models/post');

exports.postDraftGet = asyncHandler(async (req, res, next) => {
    const renderConfig = {
        title: 'Post',
        page: 'draftPost',
        user: res.locals.currentUser
    }
    res.render('layout', renderConfig)
});

exports.postDraftPost = asyncHandler(async (req, res, next) => {
    try {
        const content = {
            title: req.body.title,
            ts: Date.now(), // ms
            message: req.body.post,
            user: res.locals.currentUser._id
        }
        const post = new Post(content);
        const result = await post.save();

        const renderConfig = {
            title: 'Post',
            page: 'draftPost',
            user: res.locals.currentUser
        }
        res.render('layout', renderConfig)
    }
    catch (error) {
        throw error;
    }
})