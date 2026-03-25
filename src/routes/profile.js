const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth");

profileRouter.get("/profile", userAuth, async (req,res) => {
    try{
        const user = req.user;
        res.send("User Profile: " + JSON.stringify(user));
    }catch(err){
        res.status(500).send("Error fetching user profile.");
    }
})

profileRouter.get("/feed", async (req,res) => {
    const users = await User.find();
    try{
        res.send("Users List: " + JSON.stringify(users));
    }catch(err){
        res.status(500).send("Error fetching users.");
    }
})

profileRouter.get("/user", async (req,res) => {
    const users = await User.findOne({emailId: req.query.emailId});
    try{
        res.send("Users List: " + JSON.stringify(users));
    }catch(err){
        res.status(500).send("Error fetching users.");
    }
})

profileRouter.delete("/user", async (req,res) => {
  const userId = req.body.id;
    const users = await User.findByIdAndDelete(userId);
    try{
        res.send("User deleted successfully.");
    }catch(err){
        res.status(500).send("Error fetching users.");
    }
})

profileRouter.patch("/user", async (req,res) => {
    const userId = req.body.id;
    const users = await User.findByIdAndUpdate(userId, req.body, { new: true });
    try{
        res.send("User updated successfully: " + JSON.stringify(users));
    }catch(err){
        res.status(500).send("Error fetching users.");
    }
})

module.exports = profileRouter;