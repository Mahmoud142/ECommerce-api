const express= require('express');



const {
    createFilterObject,
    createReview,
    getReviews,
    getReview,
    updateReview,
    deleteReview
} = require('../controllers/review.controller');

const {
    createReviewValidator,
    getReviewValidator,
    updateReviewValidator,
    deleteReviewValidator
} = require('../utils/validators/review.validator');



const protect = require('../middlewares/protect.middleware');
const router = express.Router({ mergeParams: true });

router.route('/')
    .get(createFilterObject, getReviews)
    .post(protect.auth, protect.allowedTo('user'),createReviewValidator, createReview);

router.route('/:id')
    .get(getReviewValidator, getReview)
    .put(protect.auth, protect.allowedTo('user'), updateReviewValidator, updateReview)
    .delete(protect.auth, protect.allowedTo('user','manager','admin'), deleteReviewValidator, deleteReview);






module.exports = router;