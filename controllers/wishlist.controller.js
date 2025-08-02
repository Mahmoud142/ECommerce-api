
const asyncWrapper = require('../middlewares/asyncWrapper');
const User = require('../models/user.model');
const { FAIL, SUCCESS } = require('../utils/httpStatusText');

//@desc Add product to wishlist
//@route POST /api/wishlist
//access Private/User
exports.addProductToWishlist = asyncWrapper(async (req, res, next) => {
    const { productId } = req.body;


    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $addToSet: { wishlist: productId }
        }, { new: true });
    if (!user) {
        return res.status(404).json({
            success: FAIL,
            message: "User not found"
        });
    }
    return res.status(200).json({
        success: SUCCESS,
        message: "Product added to wishlist successfully",
        data: user.wishlist
    })
})

//@desc Remove product from wishlist
//@route DELETE /api/wishlist/:productId
//access Private/User
exports.DeleteProductFromWishlist = asyncWrapper(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: { wishlist: req.params.productId },
        },
        { new: true }
    );

    return res.status(200).json({
        success: SUCCESS,
        message: 'Product removed successfully from your wishlist',
        data: user.wishlist,
    });
})

//@desc Get wishlist
//@route GET /api/wishlist
//@access Private/User
exports.getWishlist = asyncWrapper(async (req, res, next) => {
    const wishlist = await User.findById(req.user._id)
        .select('wishlist')
        .populate('wishlist');

    return res.status(200).json({
        success: SUCCESS,
        message: "Wishlist fetched successfully",
        data: wishlist
    })
})

