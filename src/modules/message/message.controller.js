import {
  createDocument,
  deleteDocument,
  findDocument,
} from "../../../DB/dbMethods.js";
import Message from "../../../DB/models/message.model.js";
import User from "../../../DB/models/user.model.js";

//====================send message====================//
export const sendMessage = async (req, res, next) => {
  const { content } = req.body;
  const { sendTo } = req.params;

  //user check
  const isUserExist = await findDocument(User, { _id: sendTo });
  if (!isUserExist.success)
    // return res
    //   .status(isUserExist.status)
    //   .json({ message: isUserExist.message });
      return next(new Error(isUserExist.message,{cause:isUserExist.status}))
  //create message
  const createMessage = await createDocument(Message, { content, sendTo });
  if (!createMessage.success)
    // return res
    //   .status(createMessage.status)
    //   .json({ message: createMessage.message });
      return next(new Error (createMessage.message,{cause:createMessage.status}))
  return res
    .status(createMessage.status)
    .json({ message: createMessage.message });
};

//====================delete message====================//
export const deleteMessage = async (req, res, next) => {
  const { loggedUserId, messageId } = req.query;
  const deletedMessage = await deleteDocument(Message, {
    sendTo: loggedUserId,
    _id: messageId,
  });
  if (!deletedMessage)
    // return res
    //   .status(deletedMessage.status)
    //   .json({ message: deletedMessage.message });
      return next(new Error(deletedMessage.message,{cause:deletedMessage.status}))
  res.status(deletedMessage.status).json({ message: deletedMessage.message });
};

//=====================mark as viewed=====================//
export const markMessageAsRead = async (req, res, next) => {
  const { loggedUserId, messageId } = req.query;
  const updateMessage = await Message.findOneAndUpdate(
    { sendTo: loggedUserId, _id: messageId, isViewed: false },
    { isViewed: true, $inc: { __v: 1 } },
    { new: true }
  );
  if (!updateMessage) return next(new Error("updated fail", { cause: 400 }));
  return res.status(200).json({ message: "updated done", updateMessage });
};

//=====================list user's messages=====================//

export const listUserMessage = async (req, res, next) => {
  const { loggedUserId, isViewed } = req.query;
  const messages = await Message.find({ sendTo: loggedUserId, isViewed }).sort({
    createdAt: -1,
  });
  if (!messages.length) return res.status(200).json({ message: "no result" });
  return res.status(200).json({ message: "your messages:", messages });
};
