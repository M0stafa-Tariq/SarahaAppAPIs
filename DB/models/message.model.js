import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    sendTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isViewed: {
      type: Boolean,
      default: "false",
      required: true,
    },
  },
  { timestamps: true }
);

const Message = model("Message", messageSchema);

export default Message;
