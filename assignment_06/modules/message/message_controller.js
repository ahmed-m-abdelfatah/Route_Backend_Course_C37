const messageModel = require('../../DB/model/message_model.js');
const userModel = require('../../DB/model/user_model.js');
const { roles } = require('../../middleware/auth.js');

const sendMessage = async (req, res) => {
  const { id: receiverId } = req.params;
  const { messageBody, senderId } = req.body; // senderId is optional

  const findUser = await userModel.findById(receiverId).select('name email');

  if (findUser) {
    const sendedMessage = await messageModel.insertMany({ messageBody, receiverId, senderId });
    res.status(201).json({ message: 'Done', sendedMessage }); // 201: Created
  } else {
    res.status(403).json({ message: 'user not exist' }); // 403: Forbidden
  }
};

const getProfileMessages = async (req, res) => {
  const { id: receiverId } = req.user;
  const { role } = req.user;
  let selectedData;
  selectedData =
    role === roles.Admin ? '-_id -__v -receiverId -updatedAt' : '-_id -__v -receiverId -updatedAt -senderId';

  const messageList = await messageModel.find({ receiverId }).select(selectedData); // we hide senderId from user and show it to admins only
  res.status(200).json({ message: 'Done', messageList }); // 200: OK
};

const deleteMessage = async (req, res) => {
  const { id: _id } = req.params;
  const { id: receiverId } = req.user;

  const deletedMessage = await messageModel.deleteOne({ _id, receiverId }); // only receiver can delete message

  res.status(200).json({ message: 'Done', deletedMessage: deletedMessage.deletedCount }); // 200: OK
};

module.exports = { sendMessage, getProfileMessages, deleteMessage };
