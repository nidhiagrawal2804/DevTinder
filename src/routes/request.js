const express = require("express");
const user = require("../modals/user");
const requestRouter = express.Router();
const userAuth = require("../middlewares/auth");
const connectRequest = require("../modals/connectRequest");

requestRouter.post(
  "/connection/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      if (!["interested", "ignore"].includes(status)) {
        return res
          .status(400)
          .send(
            "Invalid status value. Allowed values are 'interested' or 'ignore'.",
          );
      }

      const checkUserExist = await user.findById(toUserId);
      if (!checkUserExist) {
        return res.status(404).send({message : "User not found."});
      }

      const existingRequest = await connectRequest.findOne({
        $or:[
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId }
        ]
      });
      if(existingRequest){
        return res.status(400).send({message : "Connection request already exists."});
      }

      const connectRequest = new connectRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectRequest.save();
      res.status(201).send({
        message: "Connection request sent successfully.",
        data: data,
      });

      await connectRequest.save();
      res.status(201).send(connectRequest);
    } catch (err) {
      res.status(500).send("Error sending connection request.");
    }
  },
);

requestRouter.post(
  "/connection/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const toUserId = req.user._id;
      const requestId = req.params.requestId;
      const status = req.params.status;

      if (!["accepted", "rejected"].includes(status)) {
        return res
          .status(400)
          .send(
            "Invalid status value. Allowed values are 'accepted' or 'rejected'.",
          );
      }

      const checkUserExist = await user.findById(toUserId);
      if (!checkUserExist) {
        return res.status(404).send({message : "User not found."});
      }

      const connectionRequest = await connectRequest.findOne({
        _id: requestId,
        toUserId: toUserId,
        status: "interested"
      });
      if(!connectionRequest){
        return res.status(404).json({message : "Connection request not found."});
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.status(201).json({
        message: "Connection request updated successfully.",
        data: data,
      });
    } catch (err) {
      res.status(500).send("Error updating connection request.");
    }
  },
);

module.exports = requestRouter;
