const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    "firstName": {
        type: String,
        required: true
    },
    "lastName": {
        type: String,
        required: true
    },
    "emailId": {
        type: String,
        required: true
    },
    "password": {
        type: String,
        required: true
    },
    "age": {
        type: Number,
    },
    "gender": {
        type: String,
    }
});


userSchema.methods.getJWT = async function(){
    const user = this;
    const token = jsonwebtoken.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

userSchema.methods.verifyPassword = async function(password){
    const user = this;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid;
}


module.exports =  mongoose.model("User", userSchema);