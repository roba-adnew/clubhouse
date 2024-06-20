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
        const post = new Post({
            title: req.body.title,
            ts: Date.now(), // ms
            message: req.body.post,
            user: res.locals.currentUser.id
        })
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

exports.feedGet = asyncHandler(async (req, res, next) => {
    const feed = await Post
        .find({}, "title user ts message")
        .populate('user')
        .sort({ ts: 1 })
        .exec();
    
    console.log(feed[0])
    
    const renderConfig = {
        title: 'the clubhouse',
        page: 'feed',
        feed: feed,
        user: res.locals.currentUser
    }
    res.render('layout', renderConfig)
})