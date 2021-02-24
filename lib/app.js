const app = require('express');

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: 'https://silly-wiles-8e4923.netlify.app/'
    }
});

const userArray = [];
let playerCount = 1;

io.on('connection', connect => {
    console.log('connected!');
    io.emit('connection', connect.id);

    connect.on('CREATE_USER', () => {
        const newUser = { user: `player${playerCount}`, position: { x: 0, y: 0 }, id: connect.id };
        userArray.push(newUser);
        playerCount++;
        io.to(connect.id).emit('CREATE_USER', newUser);
    });

    connect.on('MOVE_PLAYER', ({ dir, user }) => {
        const userIndex = userArray.findIndex(element => {
            return element.user === user;
        });
        if (dir === 'up') {
            userArray[userIndex] = {
                ...userArray[userIndex], position: {
                    x: userArray[userIndex].position.x,
                    y: userArray[userIndex].position.y - 25
                }
            };
            io.emit('MOVE_PLAYER', userArray);
        } else if (dir === 'down') {
            userArray[userIndex] = {
                ...userArray[userIndex], position: {
                    x: userArray[userIndex].position.x,
                    y: userArray[userIndex].position.y + 25
                }
            };
            io.emit('MOVE_PLAYER', userArray);

        } else if (dir === 'left') {
            userArray[userIndex] = {
                ...userArray[userIndex], position: {
                    y: userArray[userIndex].position.y,
                    x: userArray[userIndex].position.x - 25
                }
            };
            io.emit('MOVE_PLAYER', userArray);

        } else if (dir === 'right') {
            userArray[userIndex] = {
                ...userArray[userIndex], position: {
                    y: userArray[userIndex].position.y,
                    x: userArray[userIndex].position.x + 25
                }
            };
            io.emit('MOVE_PLAYER', userArray);
        }

    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`listenting on ${PORT}`);
});


module.exports = app;
