module.exports = function(routeTopic) {
    const post = require('../controllers/topic');
    const auth = require('../middleware/auth');
    const multer = require('../middleware/multer-config');
// route GET
    routeTopic.get('/api/lasttopic', auth, post.getLastTopic);
    routeTopic.get('/api/allpost', auth, post.getAllPost);
    routeTopic.get('/api/allpix', auth, post.getAllPix);
    routeTopic.get('/api/topic/:id', auth, post.getOneTopic);
// route de Modification
    routeTopic.post('/api/topic', auth, multer, post.createTopic);
    routeTopic.put('/api/topic', auth, multer, post.updateTopic);
    routeTopic.delete('/api/topic/:id', auth, post.delTopic);

}