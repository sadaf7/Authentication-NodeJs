const catchAsyncErrors = require('../middlwares/catchAsyncErrors');
const User = require('../models/UserModel');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/sendToken');

// create user
exports.registerUser = catchAsyncErrors(async(req,res,next)=>{
    const {name,email,password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            publicId:"publicId of cloudinary" ,
            url:"url"
        },
        createdAt:Date.now()  
    })
    
    // res.status(201).json({
    //     success:true,
    //     token,
    //     user
    // })

    await sendToken(user,201,res)
})

// login user
exports.loginUser = catchAsyncErrors(async(req,res,next)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler("Please enter email and password",400))
    }

    const user = await User.findOne({email}).select('+password')
    if(!user){
        return next(new ErrorHandler("invalid email and password",400))
    }

    const isMatched = await user.comparePassword(password)
    if(!isMatched){
        return next(new ErrorHandler("invalid email and password",400))
    }

    const token = await user.getJWT() 

    // res.status(201).json({
    //     success:true,
    //     token,
    //     user
    // })

    await sendToken(user,201,res)
})

// logout user
exports.logoutUser = catchAsyncErrors(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message:"logged out"
    })
})

// get user details
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success:true,
        user
    })
})

// update password
exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");

    // checking password
    const isMatched = await user.comparePassword(req.body.oldPassword);

    if(!isMatched){
        return next(new ErrorHandler("invalid email and password",400))
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("password does not match",400))
    }

    user.password = req.body.newPassword;
    await user.save();

    await sendToken(user,201,res)
})

// update user info
exports.updateUserInfo = catchAsyncErrors(async(req,res,next)=>{
    const updateUserData = {
        name: req.body.name || req.user.name,
        email: req.body.email || req.user.email,
    }

    const user = await User.findByIdAndUpdate(req.user.id,updateUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(201).json({
        success:true,
        user
    })
})

// get all users -- admin
exports.getAllUsers = catchAsyncErrors(async(req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        success:true,
        users
    })
})

// get single user -- admin
exports.getSingleUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler("User not found",400))
    }

    res.status(200).json({
        success:true,
        user
    })
})

// update user roles
exports.updateUserRole = catchAsyncErrors(async(req,res,next)=>{
    const updateUserData = {
        name: req.body.name || req.user.name,
        email: req.body.email || req.user.email,
        role: req.body.role || req.user.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id,updateUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(201).json({
        success:true,
        user
    })
})

// delete user -- admin
exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findByIdAndDelete(req.params.id);

    if(!user){
        return next(new ErrorHandler("User not found",400))
    }

    res.status(200).json({
        success:true,
        message: 'Deleted Successfully'
    })
})