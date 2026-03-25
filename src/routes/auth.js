const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../modals/user");
const cookieParser = require("cookie-parser");
const {validateSignupRequest} = require("../utils/validation");
const authRouter = express.Router();

const app = express();
app.use(cookieParser());


authRouter.post("/signup", async (req,res) => {
    validateSignupRequest(req);
    const { firstName, lastName, emailId, password } = req.body;
    
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash  
    });

    try{
        await user.save();
        res.send("User Created Successfully.");
    }catch(err){
        res.status(500).send("Error creating user.");
    }
})



authRouter.post('/login', async (req,res) => { 
    const { emailId, password } = req.body;
    if(!emailId || !password){
        return res.status(400).send("Missing required fields: emailId and password are required.");
    }

    const user = await User.findOne({emailId});
    if(!user){
        return res.status(400).send("Invalid email or password.");
    }

    const isPasswordValid = await user.verifyPassword(password);
    if(!isPasswordValid){
        return res.status(400).send("Invalid email or password.");
    }
    const token = await user.getJWT();
    res.cookie("token", token);
    res.send(user);
})

authRouter.post('/logout', (req,res) => {
    res.cookie("token", "", { expires: new Date(0) });
    res.send("Logout successful.");
})

module.exports = authRouter;