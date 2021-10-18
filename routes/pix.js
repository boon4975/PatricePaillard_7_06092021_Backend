module.exports = function(routePix) {
    const pix = require('../controllers/pix');
    const auth = require('../middleware/auth');
    const multer = require('../middleware/multer-config')
// route PIX
    routePix.get('/api/allpix', auth, pix.getAllPix);
    routePix.put('/api/pix', auth, multer, pix.putPix);
    
}