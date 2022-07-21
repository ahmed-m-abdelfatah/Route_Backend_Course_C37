const userModel = require('../DB/model/user_model.js');
const { initIO } = require('./socket.js');

function socketInit(server) {
  console.log('~ socketInit');

  const io = initIO(server);

  io.on('connection', socket => {
    socket.on('updateSocketID', async userId => {
      await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
    });
    console.log('~ socket.id', socket.id);
  });
}

module.exports = socketInit;
