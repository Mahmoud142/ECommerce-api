const User = require('../models/user.model');
const { SUCCESS, FAIL } = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');


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