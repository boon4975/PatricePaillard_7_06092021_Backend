module.exports = function(routePost) {
    const post = require('../controllers/post');
    const auth = require('../middleware/auth');
    routePost.post('/api/post', auth, post.createPost);
    routePost.get('/api/post', auth, post.getAllPosts);
    routePost.get('/api/post/:id', auth, post.getOnePost);
    routePost.put('/api/post', auth, post.updatePost);
    routePost.delete('/api/post/:id', auth, post.delPost);
}