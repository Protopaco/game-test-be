const app = require('express');

const http = require('http').createServer(app);
const io = require('socket.io')(http));

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

http.listen(3000, () => {
    console.log('listenting on 3000');
});


module.exports = app;
