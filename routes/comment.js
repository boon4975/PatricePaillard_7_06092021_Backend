module.exports = function(routeComment) {
    const comment = require('../controllers/comment');
    //const auth = require('../middleware/auth');
    routeComment.post('/api/comment', comment.addComment);
}