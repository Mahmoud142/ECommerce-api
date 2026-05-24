const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [50, 'Name must be at most 50 characters long'],
        trim: true,
    },
    slug: {
        type: String,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
    },
    phone: String,
    profileImg: String,
    passwordChangedAt: Date,
    passwordResetcode: String,
    passwordResetExpires: Date,
    resetCodeVerified: Boolean,
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    twoFactorCode: String,
    twoFactorExpires: Date,
    isVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationCode: String,
    emailVerificationExpires: Date,
    role: {
        type: String,
        enum: ['user', 'manager', 'admin'],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true,
    },
    wishlist: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
        },
    ],
    addresses: [
        {
            id: { type: mongoose.Schema.Types.ObjectId },
            alias: String,
            details: String,
            phone: String,
            city: String,
            postalCode: String,
        }
    ],
    refreshToken: [String]
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    // if the password is not modified, skip hashing
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// toJSON transform dynamically appends base URL only when returning data to the client, leaving DB clean
userSchema.set('toJSON', {
    transform: function (doc, ret) {
        if (ret.profileImg) {
            const filename = ret.profileImg.split('/').pop();
            if (process.env.CLOUDINARY_CLOUD_NAME) {
                ret.profileImg = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/users/${filename}`;
            } else {
                ret.profileImg = `${process.env.BASE_URL}/uploads/users/${filename}`;
            }
        }
        delete ret.password;
        return ret;
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;