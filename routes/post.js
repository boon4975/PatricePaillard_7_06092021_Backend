module.exports = function(routePost) {
    const post = require('../controllers/post');
    //const auth = require('../middleware/auth');
    routePost.post('/api/post', post.createPost);
    routePost.get('/api/post', post.getAllPosts);
    routePost.get('/api/post/:id', post.getOnePost);
    routePost.put('/api/post', post.updatePost);
    routePost.delete('/api/post/:id', post.delPost);
}