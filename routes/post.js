const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/draft', postController.postDraftGet);

router.post('/draft', postController.postDraftPost);

module.exports = router;