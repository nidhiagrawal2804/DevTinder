const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../modals/user");
const { validateSignupRequest } = require("../utils/validation");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  validateSignupRequest(req);
  const { firstName, lastName, emailId, password } = req.body;

  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash,
  });

  try {
    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.status(201).json({ message: "User Created Successfully.", data: savedUser });
  } catch (err) {
    res.status(500).json({ message: "Error creating user." });
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  if (!emailId || !password) {
    return res
      .status(400)
      .json({
        message: "Missing required fields: emailId and password are required.",
      });
  }

  const user = await User.findOne({ emailId });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password." });
  }

  const isPasswordValid = await user.verifyPassword(password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password." });
  }
  const token = await user.getJWT();
  res.cookie("token", token);
  res.status(200).json({ message: "Login successful.", user });
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  res.status(200).json({ message: "Logout successful." });
});

module.exports = authRouter;
