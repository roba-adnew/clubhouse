const asyncHandler = require('express-async-handler');

exports.dynamicHandler = asyncHandler(async (req, res) => {
    let renderConfig;

    switch (req.path) {
        case '/':
            renderConfig = {
                title: 'da clubhouse',
                page: 'index',
                user: res.locals.currentUser
            };
            break;
        
    }
    res.render('layout', renderConfig)
})