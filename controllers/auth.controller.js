const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { generateToken, generateRefreshToken } = require('../utils/generateToken');
const { SUCCESS, FAIL } = require('../utils/httpStatusText');
const AppError = require('../utils/appError');
const asyncWrapper = require('../middlewares/asyncWrapper');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

//@desc signup a new user
//@route POST /api/auth/register
//@access Public
exports.signup = asyncWrapper(async (req, res, next) => {
    // Generate 6-digit random code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the code
    const hashedCode = crypto
        .createHash('sha256')
        .update(verificationCode)
        .digest('hex');

    const user = await User.create({
        name: req.body.name,
        slug: req.body.slug,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        profileImg: req.body.profileImg,
        isVerified: false,
        emailVerificationCode: hashedCode,
        emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours validity
    });

    // Send verification email via SendGrid
    try {
        await sendEmail({
            email: user.email,
            subject: 'Verify Your Email Address - ECommerce Platform',
            message: `Hi ${user.name},\nThank you for registering! Please use the following 6-digit verification code to verify your account:\n\n${verificationCode}\n\nThis code is valid for 24 hours.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: #333333; text-align: center;">Welcome to ECommerce!</h2>
                    <p>Hi ${user.name},</p>
                    <p>Thank you for signing up. Please use the verification code below to verify your email address and activate your account:</p>
                    <div style="background-color: #f7f7f7; padding: 15px; border-radius: 6px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #1a73e8; margin: 20px 0;">
                        ${verificationCode}
                    </div>
                    <p style="color: #666666; font-size: 14px;">This code is valid for <strong>24 hours</strong>. If you did not sign up for this account, you can safely ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
                    <p style="color: #999999; font-size: 12px; text-align: center;">ECommerce API Platform Support</p>
                </div>
            `
        });
    } catch (err) {
        // If email fails, delete the user so they can try again
        await User.findByIdAndDelete(user._id);
        console.error('Signup Verification Email Error:', err);
        return next(AppError.create('Failed to send verification email. Please try again.', 500, FAIL));
    }

    res.status(201).json({
        status: SUCCESS,
        message: 'Registration successful! A verification code has been sent to your email.'
    });
});

//@desc login a user
//@route POST /api/auth/login
//@access Public
exports.login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    let isPasswordMatch = false;
    if (user) {
        isPasswordMatch = await bcrypt.compare(password, user.password);
    }

    if (!user || !isPasswordMatch) {
        return next(AppError.create('Invalid credentials', 404, FAIL));
    }

    // Ensure email is verified
    if (!user.isVerified) {
        // Generate random 6-digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash the code
        const hashedCode = crypto
            .createHash('sha256')
            .update(verificationCode)
            .digest('hex');

        // Save new verification code and extend expiry by 24 hours
        user.emailVerificationCode = hashedCode;
        user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        // Send a fresh verification email via SendGrid
        try {
            await sendEmail({
                email: user.email,
                subject: 'Verify Your Email Address - ECommerce Platform',
                message: `Hi ${user.name},\nYou attempted to log in, but your email is not verified yet. Please use the following 6-digit verification code to verify your account:\n\n${verificationCode}\n\nThis code is valid for 24 hours.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                        <h2 style="color: #333333; text-align: center;">Email Verification Required</h2>
                        <p>Hi ${user.name},</p>
                        <p>You attempted to log in, but your email address has not been verified yet. Please use the verification code below to verify your email and activate your account:</p>
                        <div style="background-color: #f7f7f7; padding: 15px; border-radius: 6px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #1a73e8; margin: 20px 0;">
                            ${verificationCode}
                        </div>
                        <p style="color: #666666; font-size: 14px;">This code is valid for <strong>24 hours</strong>. If you did not make this request, you can safely ignore this email.</p>
                        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
                        <p style="color: #999999; font-size: 12px; text-align: center;">ECommerce API Platform Support</p>
                    </div>
                `
            });
        } catch (err) {
            console.error('Login Verification Email Send Error:', err);
        }

        return res.status(400).json({
            status: FAIL,
            message: 'Your email address is not verified. A fresh verification code has been sent to your email.',
            emailVerificationRequired: true
        });
    }

    // Check if Two-Factor Authentication is enabled
    if (user.twoFactorEnabled) {
        // Generate random 6-digit OTP code
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP code to save securely
        const hashedOtp = crypto
            .createHash('sha256')
            .update(otpCode)
            .digest('hex');

        user.twoFactorCode = hashedOtp;
        user.twoFactorExpires = Date.now() + 10 * 60 * 1000; // valid for 10 minutes
        await user.save({ validateBeforeSave: false });

        // Send OTP via SendGrid
        try {
            await sendEmail({
                email: user.email,
                subject: 'Your 2FA Login Verification Code',
                message: `Hi ${user.name},\nUse the following 6-digit verification code to complete your login:\n\n${otpCode}\n\nThis code is valid for 10 minutes.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                        <h2 style="color: #333333; text-align: center;">Two-Factor Authentication Required</h2>
                        <p>Hi ${user.name},</p>
                        <p>To complete your login, please enter the following 6-digit verification code:</p>
                        <div style="background-color: #f7f7f7; padding: 15px; border-radius: 6px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #1a73e8; margin: 20px 0;">
                            ${otpCode}
                        </div>
                        <p style="color: #666666; font-size: 14px;">This code is valid for <strong>10 minutes</strong>. If you did not attempt to log in, please secure your account immediately.</p>
                        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
                        <p style="color: #999999; font-size: 12px; text-align: center;">ECommerce API Platform Security</p>
                    </div>
                `
            });
        } catch (err) {
            user.twoFactorCode = undefined;
            user.twoFactorExpires = undefined;
            await user.save({ validateBeforeSave: false });
            return next(AppError.create('Failed to send 2FA verification email. Try again later.', 500, FAIL));
        }

        return res.status(200).json({
            status: SUCCESS,
            message: 'Two-factor authentication code sent to your email.',
            twoFactorRequired: true
        });
    }

    const token = generateToken(user);
    await user.save();

    delete user._doc.password;
    return res.status(200).json({
        status: SUCCESS,
        message: 'User logged in successfully',
        data: { user, token }
    });
});

//@desc forgot password request
//@route POST /api/auth/forgotPassword
//@access Public
exports.forgotPassword = asyncWrapper(async (req, res, next) => {
    // 1) Get user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(AppError.create('User not found with this email', 404, FAIL));
    }

    // 2) Generate random 6-digit verification code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash the code to save securely in DB
    const hashedResetCode = crypto
        .createHash('sha256')
        .update(resetCode)
        .digest('hex');

    // 3) Save hashed code & expiration (10 mins) to user model
    user.passwordResetcode = hashedResetCode;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    user.resetCodeVerified = false;
    await user.save({ validateBeforeSave: false });

    // 4) Send the email via SendGrid
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your Password Reset Verification Code (Valid for 10 mins)',
            message: `Hi ${user.name},\nWe received a request to reset your password. Use the following 6-digit verification code to proceed:\n\n${resetCode}\n\nIf you did not make this request, you can safely ignore this email.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: #333333; text-align: center;">Password Reset Request</h2>
                    <p>Hi ${user.name},</p>
                    <p>We received a request to reset the password for your account. Please use the verification code below to complete the reset process:</p>
                    <div style="background-color: #f7f7f7; padding: 15px; border-radius: 6px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #1a73e8; margin: 20px 0;">
                        ${resetCode}
                    </div>
                    <p style="color: #666666; font-size: 14px;">This code is valid for <strong>10 minutes</strong>. If you did not initiate this request, you can safely ignore this email and your password will remain unchanged.</p>
                    <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
                    <p style="color: #999999; font-size: 12px; text-align: center;">ECommerce API Platform Support</p>
                </div>
            `
        });
    } catch (err) {
        console.error('SendGrid Email Error:', err);
        if (err.response && err.response.body) {
            console.error('SendGrid Error Details:', JSON.stringify(err.response.body, null, 2));
        }
        user.passwordResetcode = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(AppError.create('Failed to send verification email. Try again later.', 500, FAIL));
    }

    res.status(200).json({
        status: SUCCESS,
        message: 'Reset code sent successfully to your email.'
    });
});

//@desc verify password reset code
//@route POST /api/auth/verifyResetCode
//@access Public
exports.verifyPassResetCode = asyncWrapper(async (req, res, next) => {
    // 1) Hash the submitted code
    const hashedResetCode = crypto
        .createHash('sha256')
        .update(req.body.resetCode)
        .digest('hex');

    // 2) Find user by hashed code & verify expiration
    const user = await User.findOne({
        passwordResetcode: hashedResetCode,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(AppError.create('Verification code is invalid or has expired', 400, FAIL));
    }

    // 3) Code is verified! Generate a cryptographically secure reset token for the reset password step
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // 4) Save hashed resetToken in place of the 6-digit code, and mark as verified
    user.passwordResetcode = hashedResetToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Reset token valid for another 10 mins
    user.resetCodeVerified = true;
    await user.save({ validateBeforeSave: false });

    // 5) Send the resetToken back to the client
    res.status(200).json({
        status: SUCCESS,
        message: 'Verification code verified successfully.',
        resetToken
    });
});

//@desc reset password
//@route PUT /api/auth/resetPassword
//@access Public
exports.resetPassword = asyncWrapper(async (req, res, next) => {
    // 1) Find user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(AppError.create('User not found with this email', 404, FAIL));
    }

    // 2) Ensure reset code was verified
    if (!user.resetCodeVerified) {
        return next(AppError.create('Reset code must be verified first', 400, FAIL));
    }

    // 3) Hash the submitted resetToken and match with the stored hash
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.body.resetToken)
        .digest('hex');

    if (user.passwordResetcode !== hashedToken || user.passwordResetExpires < Date.now()) {
        return next(AppError.create('Reset token is invalid or has expired', 400, FAIL));
    }

    // 4) Set new password (Mongoose pre-save hook will hash it automatically)
    user.password = req.body.newPassword;
    user.passwordChangedAt = Date.now() - 1000; // Prevent JWT mismatch bugs by subtracting 1 second
    
    // Clear reset credentials
    user.passwordResetcode = undefined;
    user.passwordResetExpires = undefined;
    user.resetCodeVerified = undefined;
    
    await user.save();

    res.status(200).json({
        status: SUCCESS,
        message: 'Password reset successfully. Please log in with your new password.'
    });
});

//@desc verify 2FA code and login
//@route POST /api/auth/verify2fa
//@access Public
exports.verify2FA = asyncWrapper(async (req, res, next) => {
    const { email, twoFactorCode } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return next(AppError.create('User not found', 404, FAIL));
    }

    const hashedOtp = crypto
        .createHash('sha256')
        .update(twoFactorCode)
        .digest('hex');

    if (user.twoFactorCode !== hashedOtp || user.twoFactorExpires < Date.now()) {
        return next(AppError.create('Invalid or expired 2FA verification code', 400, FAIL));
    }

    // Clear 2FA temp values
    user.twoFactorCode = undefined;
    user.twoFactorExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // Generate JWT Login Token
    const token = generateToken(user);

    delete user._doc.password;
    res.status(200).json({
        status: SUCCESS,
        message: '2FA verification successful. User logged in.',
        data: { user, token }
    });
});

//@desc enable 2FA for logged-in user
//@route POST /api/auth/enable2fa
//@access Private
exports.enable2FA = asyncWrapper(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(AppError.create('User not found', 404, FAIL));
    }

    user.twoFactorEnabled = true;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: SUCCESS,
        message: 'Two-factor authentication has been successfully enabled for your account.'
    });
});

//@desc disable 2FA for logged-in user
//@route POST /api/auth/disable2fa
//@access Private
exports.disable2FA = asyncWrapper(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(AppError.create('User not found', 404, FAIL));
    }

    user.twoFactorEnabled = false;
    user.twoFactorCode = undefined;
    user.twoFactorExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: SUCCESS,
        message: 'Two-factor authentication has been successfully disabled for your account.'
    });
});

//@desc verify email address using code
//@route POST /api/auth/verifyEmail
//@access Public
exports.verifyEmail = asyncWrapper(async (req, res, next) => {
    const { email, verificationCode } = req.body;

    const hashedCode = crypto
        .createHash('sha256')
        .update(verificationCode)
        .digest('hex');

    const user = await User.findOne({
        email,
        emailVerificationCode: hashedCode,
        emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(AppError.create('Verification code is invalid or has expired', 400, FAIL));
    }

    // Mark as verified and active, and clear verification credentials
    user.isVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // Generate JWT Login Token
    const token = generateToken(user);

    delete user._doc.password;
    res.status(200).json({
        status: SUCCESS,
        message: 'Email verified successfully. User logged in.',
        data: { user, token }
    });
});
