let io;

const socketEvents = {
  updateSocketID: 'updateSocketID',
  addProduct: 'addProduct',
  addComment: 'addComment',
  addReply: 'addReply',
};

const initIO = server => {
  io = require('socket.io')(server, {
    cors: '*',
  });
  return io;
};

const getIo = () => {
  if (!io) {
    console.log({ message: 'IN-valid io' });
  } else {
    return io;
  }
};

module.exports = {
  initIO,
  getIo,
  socketEvents,
};
