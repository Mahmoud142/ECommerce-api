const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { protect, admin } = require('../middlewares/auth.middleware');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`)
    }
});

const checkFileType = (file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images only!');
    }
}

const upload = multer({
    storage, fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
});
router.post('/', protect, admin, upload.single('image'), (req, res) => {
    res.status(200).json({ image: `http://localhost:3000/api/uploads/${req.file.filename}` });
});

module.exports = router;

