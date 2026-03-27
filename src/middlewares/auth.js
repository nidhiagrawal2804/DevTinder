const jsonWebtoken = require("jsonwebtoken");
const User = require("../modals/user");

const userAuth = async (req,res,next) => {

    const token = req.cookies?.token;

    if(!token){
        return res.status(401).send("Unauthorized: No token provided.");
    }

    try{
        const decoded = jsonWebtoken.verify(token, process.env.JWT_SECRET);
        const {_id} = decoded;
        const user = await User.findById(_id);
        if(!user){
            return res.status(401).send("Unauthorized: User not found.");
        }
        req.user = user;
        next();
    }catch(err){
        return res.status(401).send("Unauthorized: Invalid token.");
    }
}

module.exports = { userAuth };