module.exports = function(routeTopic) {
    const topic = require('../controllers/topic');
    const auth = require('../middleware/auth');
    const multer = require('../middleware/multer-config');
// route GET
    routeTopic.get('/api/lasttopic', auth, topic.getLastTopic);
    routeTopic.get('/api/allpost', auth, topic.getAllPost);
    routeTopic.get('/api/allpix', auth, topic.getAllPix);
    routeTopic.get('/api/topic/:id', auth, topic.getOneTopic);
// route de Modification
    routeTopic.post('/api/topic', auth, multer, topic.createTopic);
    routeTopic.put('/api/topic', auth, multer, topic.updateTopic);
    routeTopic.delete('/api/topic/:id', auth, topic.delTopic);

}