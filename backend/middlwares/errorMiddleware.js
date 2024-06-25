

module.exports = (err,req,res,next) =>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error'

    // Wrong mongodb cast error
    if(err.name === 'CastError'){
        const message = `Resource not found. Invalid ${err.path}`
        err = new ErrorHandler(message,400)
    }

    // Mongoose duplicate key error
    if(err.name === 11000){
        const message = `Duplicate Key ${Object.keys(err.keyValues)}`
        err = new ErrorHandler(message,400)
    }

    res.status(err.statusCode).json({
        success:false,
        error:err,
        message:err.message,
    })
}