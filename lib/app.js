const express = require('express');
const app = express();
const socket = require('socket.io');

app.use(express.json());

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));


socket.on('connection', connect => {
    connect.on('message', ({ user, message }) => {
        socket.emit('message', { user, message });
    });
});



module.exports = app;
