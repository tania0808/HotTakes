const multer = require('multer');

const MIME_TYPES = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png'
}
console.log(MIME_TYPES['image/jpeg']);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.split('.').join('_');
        const extention = MIME_TYPES[file.mimetype];

        cb(null, name + Date.now() + '.' + extention);
    }
});

const maxSize = 1024 ** 2;
module.exports = multer({ 
    storage: storage,
    limits: { fileSize: maxSize },
    onError: function(err, next) {
        console.log('Choose an image under 2Mb !', err);
        next(err);
    }
}).single('image');