const User = require('../models/user.model');
const { SUCCESS, FAIL } = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');

//@desc Add a new address for the logged user
//@route POST /api/addresses
//@access Private/User
exports.addAddress = asyncWrapper(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $addToSet: { addresses: req.body },
        },
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).json({
        status: SUCCESS,
        message: 'Address added successfully',
        data: user.addresses
    });

})

//@desc Get all addresses for the logged user
//@route GET /api/addresses
//@access Private/User
exports.getLoggedUserAddresses = asyncWrapper(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('addresses');

    res.status(200).json({
        status: SUCCESS,
        message: 'User addresses retrieved successfully',
        data: user.addresses
    });
})

//@desc delete an address for the logged user
//@route DELETE /api/addresses/:addressId
//@access Private/User
exports.deleteAddress = asyncWrapper(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $pull: { addresses: { _id: req.params.addressId } },
        },
        {
            new: true
        }
    )

    res.status(200).json({
        status: SUCCESS,
        message: 'Address deleted successfully',
        data: user.addresses
    });
})