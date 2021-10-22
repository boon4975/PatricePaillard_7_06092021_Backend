const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif'
}

/**
 * Enregistre un fichier image dans le dossier ASSETS/IMAGES 
 * ajout d'un timestamp dans le nom de fichier pour etre unique
 */
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'assets/images')
    },
    filename: (req, file, callback) => {
        const name = req.body.user_id +'_';
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('file');