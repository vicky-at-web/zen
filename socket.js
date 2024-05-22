const socketIO = require('socket.io');
const Chat = require('./models/chat')

let io;
const userMap = new Map();

function initializeSocket(server) {
    io = socketIO(server);

    io.on('connection', socket => {
        console.log('Socket connected:', socket.id);

        socket.on('joinRoom', room => {
            socket.join(room);
            console.log(`${socket.id} joined room ${room}`);
        });

        socket.on('join', user => {
            socket.join(user);
            userMap.set(user, socket.id);
            console.log(userMap);
        });
        socket.on('sendMessage', async (messageData) => {
            try {
                console.log('Received messageData:', messageData);
                const { chatId, message } = messageData;
                const chat = await Chat.findById(chatId);
                const { customer, seller } = chat;
                chat.messages.push(message);
                await chat.save();
                console.log('Message saved to MongoDB:', chat);
                const recipientId = message.sender === 'customer' ? seller._id : customer._id;
                sendMessage(String(recipientId), message);
            } catch (error) {
                console.error('Error saving message to MongoDB:', error);
            }
        });
        socket.on('disconnect', () => {
            userMap.forEach((value, key) => {
                if (value === socket.id) {
                    userMap.delete(key);
                }
            });
            console.log('Socket disconnected:', socket.id);
        });
    });
}

function sendMessage(user, message){
    console.log({ user: user, message: message });
    console.log({ userMap: userMap });
    if (userMap.has(user)) {
        console.log('Yes, the userMap has user');
        const socketId = userMap.get(user);
        if (socketId) {
            io.to(socketId).emit('newMessage', message);
        }
    }
}



function notifyCustomer(user, message) {
    console.log({ user: user, notification: message });
    console.log({ userMap: userMap });
    if (userMap.has(user)) {
        console.log('Yes, the userMap has user');
        const socketId = userMap.get(user);
        if (socketId) {
            io.to(socketId).emit('notifyCustomer', message);
        }
    }
}

function notifySeller(user, message) {
    console.log({ user: user, notification: message });
    console.log({ userMap: userMap });
    if (userMap.has(user)) {
        console.log('Yes, the userMap has user');
        const socketId = userMap.get(user);
        if (socketId) {
            io.to(socketId).emit('notifySeller', message);
        }
    }
}

module.exports = { initializeSocket, notifyCustomer, notifySeller };
