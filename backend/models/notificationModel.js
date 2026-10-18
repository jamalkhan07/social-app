import mongoose from "mongoose";

const notificationShema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  type: {
    type: String,
    required: true,
    enum: ["follow", "like", "comment", "reply"],
  },

  read: {
    type: Boolean,
    defualt: false,
  },
});

export default mongoose.model("Notification", notificationShema);
