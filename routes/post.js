module.exports = function(routePost) {
    const post = require('../controllers/post');
    routePost.post('/api/post', post.post)
}