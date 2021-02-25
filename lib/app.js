const app = require('express');

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: process.env.CORS_ORIGIN
    }
});


const MOVE_PLAYER = {
    UP: (position, speed) => {
        return {
            x: position.x,
            y: position.y - speed
        };
    },
    DOWN: (position, speed) => {
        return {
            x: position.x,
            y: position.y + speed
        };
    },
    LEFT: (position, speed) => {
        return {
            x: position.x - speed,
            y: position.y
        };
    },
    RIGHT: (position, speed) => {
        return {
            x: position.x + speed,
            y: position.y
        };
    },

};
const northWall = { position: { x: 0, y: -50 }, dimensions: { x: 500, y: 50 } };
const southWall = { position: { x: 0, y: 500 }, dimensions: { x: 500, y: 50 } };
const westWall = { position: { x: -50, y: 0 }, dimensions: { x: 50, y: 500 } };
const eastWall = { position: { x: 500, y: 0 }, dimensions: { x: 50, y: 500 } };

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
    console.log(returnValue);
    return returnValue;
};

io.on('connection', connect => {
    console.log(`connected to ${connect.id}`);
    io.emit('connection', connect.id);

    connect.on('CREATE_USER', () => {
        const newUser = { userName: `player${playerCount}`, position: { x: 250, y: 250 }, id: connect.id, speed: 25 };
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

    connect.on('MOVE_PLAYER', (localUser) => {
        const userIndex = userArray.findIndex(element => {
            return element.userName === localUser.userName;
        });
        console.log(localUser);

        const { dir, position, speed } = localUser;

        if (dir === 'up' && checkConflict(MOVE_PLAYER.UP(position, speed))) {
            userArray[userIndex] = {
                ...userArray[userIndex],
                dir,
                position: MOVE_PLAYER.UP(position, speed)
            };

        } else if (dir === 'down' && checkConflict(MOVE_PLAYER.DOWN(position, speed))) {
            userArray[userIndex] = {
                ...userArray[userIndex],
                dir,
                position: MOVE_PLAYER.UP(position, speed)
            };


        } else if (dir === 'left' && checkConflict(MOVE_PLAYER.LEFT(position, speed))) {
            userArray[userIndex] = {
                ...userArray[userIndex],
                dir,
                position: MOVE_PLAYER.LEFT(position, speed)
            };
            // io.emit('MOVE_PLAYER', userArray);

        } else if (dir === 'right' && checkConflict(MOVE_PLAYER.RIGHT(position, speed))) {
            userArray[userIndex] = {
                ...userArray[userIndex],
                dir,
                position: MOVE_PLAYER.RIGHT(position, speed)
            };
            // io.emit('MOVE_PLAYER', userArray);
        } else if (dir === 'idle') {
            userArray[userIndex] = {
                ...userArray[userIndex],
                dir
            };
        }
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
