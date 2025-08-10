const express= require('express');



const {
    createFilterObject,
    getReviews,
    createReview
} = require('../controllers/review.controller');

const protect = require('../middlewares/protect.middleware');
const router = express.Router({ mergeParams: true });

router.route('/')
    .get(createFilterObject, getReviews)
    .post(protect.auth, protect.allowedTo('user'), createReview);







module.exports = router;