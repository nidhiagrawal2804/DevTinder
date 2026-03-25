const mongoose = require("mongoose");

const connectRequestSchema = new mongoose.Schema(
{
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
    status:{
        type: String,
        enum: {
            values: ["ignore","interested","accepted","rejected"],
            message: "Status must be one of ignore, interested, accepted, rejected"
        },
        required: true
    }
}
,{
    timestamps: true
});

connectRequestSchema.pre("save", async function(next){
    const connectRequest = this;
    if(connectionRequest.fromUserId.equals(connectRequest.toUserId)){
        return next(new Error("Cannot send connection request to yourself."));
    }
    next();
})

const ConnectRequest =  new mongoose.model("ConnectRequest", connectRequestSchema);
module.exports = ConnectRequest;