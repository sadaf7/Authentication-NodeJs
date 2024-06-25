const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { Schema } = mongoose;

const userSchema = new Schema({
    name:{
        type: String,
        required: [true,'Name is required']
    },
    email:{
        type: String,
        required: [true,'Email is required'],
        validate: [validator.isEmail,'Please Enter a valid Email'],
        unique: true
    },
    password:{
        type: String,
        required: [true,'Password is required'],
        select: false
    },
    avatar:{
        publicId:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
})

// hashing and adding salt to password
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next()
    }

    this.password = await bcrypt.hash(this.password,10)
})

// Generating JWT TOKEN
userSchema.methods.getJWT = function(){
    return jwt.sign({id: this._id},process.env.JWT_SEC,{expiresIn: '2d'})
}

// comparing password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

const User = mongoose.model('User', userSchema);
module.exports = User;