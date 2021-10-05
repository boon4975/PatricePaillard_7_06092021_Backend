module.exports = function(routePost) {
    const post = require('../controllers/post');
    //const auth = require('../middleware/auth');
    routePost.post('/api/post', post.createPost);
    routePost.get('/api/post', post.getAllPosts);
}