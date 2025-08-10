const express= require('express');



const {
    createFilterObject,
    createReview,
    getReviews,
    getReview,
    updateReview,
    deleteReview
} = require('../controllers/review.controller');

const protect = require('../middlewares/protect.middleware');
const router = express.Router({ mergeParams: true });

router.route('/')
    .get(createFilterObject, getReviews)
    .post(protect.auth, protect.allowedTo('user'), createReview);

router.route('/:id')
    .get(getReview)
    .put(protect.auth, protect.allowedTo('user'), updateReview)
    .delete(protect.auth, protect.allowedTo('user','manager','admin'), deleteReview);






module.exports = router;