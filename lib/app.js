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
        const newUser = {
            userName: `player${playerCount}`,
            position: { x: 250, y: 250 },
            id: connect.id,
            speed: 50,
            dimension: { x: 50, y: 50 },
            dir: 'idle',
            characterType: 'player'
        };
        userArray.push(newUser);
        playerCount++;
        console.log('+_+_+_+_+_+_+_+_+_+_+_+_+_+');
        console.log('created:');
        console.log(newUser);
        console.log('+_+_+_+_+_+_+_+_+_+_+_+_+_+');
        io.to(connect.id).emit('CREATE_USER', { newUser, userArray });
    });

    connect.on('disconnect', () => {
        console.log('*(*(*((*(*(*(*(*(*(*(*');
        console.log('DELETE_USER');
        console.log(connect.id);
        console.log('*(*(*((*(*(*(*(*(*(*(*');

        userArray = userArray.filter(user => user.id !== connect.id);

    });


    connect.on('GAME_STATE', (localUser) => {

        if (localUser) {
            const { id, position, dir } = localUser;
            const userIndex = userArray.findIndex(element => {
                return element.id === id;
            });


            userArray[userIndex] = { ...userArray[userIndex], position, dir };

            const returnUserArray = userArray.filter(user => user.id !== connect.id);
            io.to(connect.id).emit('GAME_STATE', returnUserArray);
        }
    });
    //     if (dir === 'up' && checkConflict(MOVE_PLAYER.UP(position, speed))) {
    //         userArray[userIndex] = {
    //             ...userArray[userIndex],
    //             dir,
    //             position: MOVE_PLAYER.UP(position, speed)
    //         };

    //     } else if (dir === 'down' && checkConflict(MOVE_PLAYER.DOWN(position, speed))) {
    //         userArray[userIndex] = {
    //             ...userArray[userIndex],
    //             dir,
    //             position: MOVE_PLAYER.UP(position, speed)
    //         };


    //     } else if (dir === 'left' && checkConflict(MOVE_PLAYER.LEFT(position, speed))) {
    //         userArray[userIndex] = {
    //             ...userArray[userIndex],
    //             dir,
    //             position: MOVE_PLAYER.LEFT(position, speed)
    //         };
    //         // io.emit('MOVE_PLAYER', userArray);

    //     } else if (dir === 'right' && checkConflict(MOVE_PLAYER.RIGHT(position, speed))) {
    //         userArray[userIndex] = {
    //             ...userArray[userIndex],
    //             dir,
    //             position: MOVE_PLAYER.RIGHT(position, speed)
    //         };
    //         console.log(userArray);
    //     } else if (dir === 'idle') {
    //         userArray[userIndex] = {
    //             ...userArray[userIndex],
    //             dir
    //         };
    //     }
    // });
    // console.log(userArray);
    // // setInterval(() => {
    //     io.emit('MOVE_PLAYER', userArray);
    // }, (1000 / FPS));
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`listenting on ${PORT}`);
});

module.exports = app;
