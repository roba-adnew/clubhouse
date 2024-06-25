const asyncHandler = require('express-async-handler');
const feedUtils = require('../utils/feed');
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

        const user = res.locals.currentUser;

        const rawFeed = await Post
            .find({}, "title user ts message")
            .populate('user')
            .sort({ ts: 1 })
            .exec();
    
        const feed = user.status === "initiated" ?
            rawFeed : feedUtils.feedAnonymizer(rawFeed);
    
        const renderConfig = {
            title: 'the clubhouse',
            page: 'feed',
            feed: feed,
            user: user
        }
        res.render('layout', renderConfig)
    }
    catch (error) {
        throw error;
    }
})

exports.feedGet = asyncHandler(async (req, res, next) => {
    const user = res.locals.currentUser;

    const rawFeed = await Post
        .find({}, "title user ts message")
        .populate('user')
        .sort({ ts: 1 })
        .exec();

    const feed = user.status === "initiated" ?
        rawFeed : feedUtils.feedAnonymizer(rawFeed);

    const renderConfig = {
        title: 'the clubhouse',
        page: 'feed',
        feed: feed,
        user: user
    }
    res.render('layout', renderConfig)
})

exports.postDeletePost = asyncHandler(async (req, res) => {
    try {
        const deleted = await Post
            .findByIdAndDelete(req.params.id)
            .exec();

        if (!deleted) {
            return res.status(404).json({ message: 'Post not found' })
        }

        res.redirect('back'); 

    }
    catch (error) {
        console.error(`Error deleting post: ${error}`)
        next(error)
    }

})