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
const upload = multer({
    storage: storage,
    fileFilter(req, file, cb) {
        if(file.mimetype == 'image/jpg'|| file.mimetype == 'image/jpeg'|| file.mimetype == 'image/png'|| file.mimetype == 'image/gif'){
            cb(null, true)
        }else{
            return cb(new Error({error: 'please uppload an image'}))
        }   
    },
    limits: {
        fileSize: 1000000
    },
})
//

module.exports = upload.single('file');