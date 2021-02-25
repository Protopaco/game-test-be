const app = require('express');

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: process.env.CORS_ORIGIN
    }
});

const northWall = { position: { x: 0, y: -50 }, dimensions: { x: 500, y: 50 } };
const southWall = { position: { x: 0, y: 500 }, dimensions: { x: 500, y: 50 } };
const westWall = { position: { x: -50, y: 0 }, dimensions: { x: 50, y: 500 } };
const eastWall = { position: { x: 500, y: 0 }, dimensions: { x: 50, y: 500 } };
// const islandNorthShort = { position: { x: 200, y: 200 }, dimensions: { x: 100, y: 100 } };

const objectArray = [northWall, southWall, westWall, eastWall];
let userArray = [];
let playerCount = 1;
const FPS = process.env.FPS;

const checkConflict = (proposedMove) => {

    let returnValue = true;
    for (const object of objectArray) {
        const { position, dimensions } = object;

        if ((position.y < proposedMove.y && position.y + dimensions.y > proposedMove.y) && (position.x < proposedMove.x && position.x + dimensions.x > proposedMove.x)) {

            returnValue = false;
        }
    }
    return returnValue;
};

io.on('connection', connect => {
    console.log(`connected to ${connect.id}`);
    io.emit('connection', connect.id);

    connect.on('CREATE_USER', () => {
        const newUser = { user: `player${playerCount}`, position: { x: 25, y: 25 }, id: connect.id, speed: 25 };
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
        console.log(userArray);
    });

    connect.on('MOVE_PLAYER', ({ dir, user }) => {
        const userIndex = userArray.findIndex(element => {
            return element.user === user.user;
        });
        console.log(user);
        userArray[userIndex] = user;

        // if (dir === 'up' && checkConflict({
        //     x: position.x,
        //     y: position.y - speed
        // })) {
        //     userArray[userIndex] = {
        //         ...userArray[userIndex],
        //         dir,
        //         position: {
        //             x: position.x,
        //             y: position.y - speed
        //         }
        //     };

        // } else if (dir === 'down' && checkConflict({
        //     x: position.x,
        //     y: position.y + speed
        // })) {
        //     userArray[userIndex] = {
        //         ...userArray[userIndex],
        //         dir,
        //         position: {
        //             x: position.x,
        //             y: position.y + speed
        //         }
        //     };
        //     // io.emit('MOVE_PLAYER', userArray);

        // } else if (dir === 'left' && checkConflict({
        //     y: position.y,
        //     x: position.x - speed
        // })) {
        //     userArray[userIndex] = {
        //         ...userArray[userIndex],
        //         dir,
        //         position: {
        //             y: position.y,
        //             x: position.x - speed
        //         }
        //     };
        //     // io.emit('MOVE_PLAYER', userArray);

        // } else if (dir === 'right' && checkConflict({
        //     y: position.y,
        //     x: position.x + speed
        // })) {
        //     userArray[userIndex] = {
        //         ...userArray[userIndex],
        //         dir,
        //         position: {
        //             y: position.y,
        //             x: position.x + speed
        //         }
        //     };
        //     // io.emit('MOVE_PLAYER', userArray);
        // } else if (dir === 'idle') {
        //     userArray[userIndex] = {
        //         ...userArray[userIndex],
        //         dir
        //     };
        // }

    });

    setInterval(() => {
        io.emit('MOVE_PLAYER', userArray);
    }, (1000 / FPS));
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`listenting on ${PORT}`);
});


module.exports = app;
