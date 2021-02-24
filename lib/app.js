const app = require('express');

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: process.env.CORS_ORIGIN
    }
});

let userArray = [];
let playerCount = 1;

io.on('connection', connect => {
    console.log(`connected to ${connect.id}`);
    io.emit('connection', connect.id);

    connect.on('CREATE_USER', () => {
        const newUser = { user: `player${playerCount}`, position: { x: 0, y: 0 }, id: connect.id };
        userArray.push(newUser);
        playerCount++;
        console.log('+_+_+_+_+_+_+_+_+_+_+_+_+_+');
        console.log('created:');
        console.log(newUser);
        console.log('+_+_+_+_+_+_+_+_+_+_+_+_+_+');

        io.to(connect.id).emit('CREATE_USER', { newUser, userArray });
    });

    connect.on('disconnect', disconnect => {
        console.log('*(*(*((*(*(*(*(*(*(*(*');
        console.log('DELETE_USER');
        console.log(connect.id);
        console.log('*(*(*((*(*(*(*(*(*(*(*');

        userArray = userArray.filter(user => user.id !== connect.id);
        console.log(userArray);
    });

    connect.on('MOVE_PLAYER', ({ dir, user }) => {

        const userIndex = userArray.findIndex(element => {
            return element.user === user;
        });
        if (dir === 'up') {
            userArray[userIndex] = {
                ...userArray[userIndex],
                dir,
                position: {
                    x: userArray[userIndex].position.x,
                    y: userArray[userIndex].position.y - 25
                }
            };
            io.emit('MOVE_PLAYER', userArray);
        } else if (dir === 'down') {
            userArray[userIndex] = {
                ...userArray[userIndex],
                dir,
                position: {
                    x: userArray[userIndex].position.x,
                    y: userArray[userIndex].position.y + 25
                }
            };
            io.emit('MOVE_PLAYER', userArray);

        } else if (dir === 'left') {
            userArray[userIndex] = {
                ...userArray[userIndex],
                dir,
                position: {
                    y: userArray[userIndex].position.y,
                    x: userArray[userIndex].position.x - 25
                }
            };
            io.emit('MOVE_PLAYER', userArray);

        } else if (dir === 'right') {
            userArray[userIndex] = {
                ...userArray[userIndex],
                dir,
                position: {
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
