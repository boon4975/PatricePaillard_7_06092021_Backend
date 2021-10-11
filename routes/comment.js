module.exports = function(routeComment) {
    const comment = require('../controllers/comment');
    const auth = require('../middleware/auth');
    routeComment.post('/api/comment', auth, comment.addComment);
    routeComment.put('/api/comment', auth, comment.updateComment);
    routeComment.get('/api/comment/:id', auth, comment.getComment);
    routeComment.delete('/api/comment/:id', auth, comment.delComment);
}