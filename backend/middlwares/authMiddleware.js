const User = require("../models/UserModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");


exports.isAuthenticated = catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("Please login to access this resource",401));
    }
    const decodedData = jwt.verify(token,process.env.JWT_SEC);

    req.user = await User.findById(decodedData.id);

    next();
})

exports.authorizedRoles=(...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role: ${req.user.role} isn't allowed to access this resources`,403))
        }

        next();
    }
}