// create token and saving it in cookie
const sendToken = async(user,statusCode,res)=>{
    const token = await user.getJWT() 

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly:true
    }
    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        user,
        token
    })
}

module.exports = sendToken;