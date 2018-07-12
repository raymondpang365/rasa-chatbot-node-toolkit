const express = require('express');
const http = require('http')
const socketio = require('socket.io');
const mongojs = require('mongojs');

const { ObjectID } = mongojs;
const db = mongojs(process.env.MONGO_URL || 'mongodb://localhost:27017/local');
// const app = express();
// const server = http.Server(app);

export default server => {
  const websocket = socketio(server);

 // server.listen(3000, () => console.log('listening on *:3000'));

// Mapping objects to easily map sockets and users.
  const clients = {};
  const users = {};

// This represents a unique chatroom.
// For this example purpose, there is only one chatroom;
  const chatId = 1;

// Helper functions.
// Send the pre-existing messages to the user that just joined.
  function _sendExistingMessages(socket) {
    const messages = db.collection('messages')
      .find({chatId})
      .sort({createdAt: 1})
      .toArray((err, messages) => {
        // If there aren't any messages, then return.
        if (!messages.length) return;
        socket.emit('message', messages.reverse());
      });
  }

// Save the message to the db and send all sockets but the sender.
  function _sendAndSaveMessage(message, socket, fromServer) {
    const messageData = {
      text: message.text,
      user: message.user,
      createdAt: new Date(message.createdAt),
      chatId
    };

    db.collection('messages').insert(messageData, (err, message) => {
      // If the message is from the server, then send to everyone.
      const emitter = fromServer ? websocket : socket.broadcast;
      emitter.emit('message', [message]);
    });
  }

// Event listeners.
// When a user joins the chatroom.
  function onUserJoined(userId, socket) {
    try {
      // The userId is null for new users.
      if (!userId) {
        const user = db.collection('users').insert({}, (err, user) => {
          socket.emit('userJoined', user._id);
          users[socket.id] = user._id;
          _sendExistingMessages(socket);
        });
      } else {
        users[socket.id] = userId;
        _sendExistingMessages(socket);
      }
    } catch (err) {
      console.err(err);
    }
  }

// When a user sends a message in the chatroom.
  function onMessageReceived(message, senderSocket) {
    const userId = users[senderSocket.id];
    // Safety check.
    if (!userId) return;

    _sendAndSaveMessage(message, senderSocket);
  }

// Allow the server to participate in the chatroom through stdin.
  const stdin = process.openStdin();
  stdin.addListener('data', d => {
    _sendAndSaveMessage({
      text: d.toString().trim(),
      createdAt: new Date(),
      user: {_id: 'robot'}
    }, null /* no socket */, true /* send from server */);
  });

  websocket.on('connection', (socket) => {
    clients[socket.id] = socket;
    socket.on('userJoined', (userId) => onUserJoined(userId, socket));
    socket.on('message', (message) => onMessageReceived(message, socket));
  });
}
