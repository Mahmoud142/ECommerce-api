const express = require('express');
const router = express.Router();

const { createCategory, uploadSingleImage, resizeImage } = require('../controllers/category.controller');



router.post('/', uploadSingleImage, resizeImage, createCategory);

module.exports = router;
