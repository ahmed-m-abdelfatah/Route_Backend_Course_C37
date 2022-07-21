const clintIo = io('http://localhost:3000');

const socketEvents = {
  updateSocketID: 'updateSocketID',
  addProduct: 'addProduct',
  addComment: 'addComment',
  addReply: 'addReply',
};

clintIo.emit(socketEvents.updateSocketID, '62bf52fbfd37dbefa5fcdca4');

clintIo.on(socketEvents.addProduct, data => {
  console.log('~ socketEvents.addProduct', data);
});

clintIo.on(socketEvents.addComment, data => {
  console.log('~ socketEvents.addComment', data);
});

clintIo.on(socketEvents.addReply, data => {
  console.log('~ socketEvents.addReply', data);
});
