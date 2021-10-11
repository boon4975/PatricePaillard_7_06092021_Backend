module.exports = function(routeComment) {
    const comment = require('../controllers/comment');
    //const auth = require('../middleware/auth');
    routeComment.post('/api/comment', comment.addComment);
    routeComment.put('/api/comment', comment.updateComment);
    routeComment.get('/api/comment/:id', comment.getComment);
    routeComment.delete('/api/comment/:id', comment.delComment);
}