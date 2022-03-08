const express = require("express");
const app = express();
const server = require("http").Server(app);
const Game = require("./game");

const io = require("socket.io")(server, {
    cors: {
      origin: '*',
    }
});

server.listen(process.env.PORT || 8022);
app.use(express.json());

const game = new Game(io);

io.on('connection', (socket) => {
    socket.emit('update', Object.values(game.playerList));
    socket.emit('card', game.put);

    socket.on('join', (args) => {
        game.playerJoin(socket, Number(args.cash), args.name, args.avatar, Number(args.pos));
    })

    socket.on('start', () => {
        game.start(socket);
    })

    socket.on('changepos', ({pos}) => {
        game.changePos(socket, pos);
    })

    socket.on('disconnect', () => {
        game.disconnect(socket);
    })

    socket.on('put', ({cash, card}) => {
        game.putCash(socket, Number(cash), card);
    })

    socket.on('newgame', () => {
        game.newGame();
    })

    socket.on("shake", () => {
        io.sockets.emit("shake");
    })

    socket.on("askmaster", () => {
        game.askMaster(socket);
    })

    socket.on("changemaster", (args) => {
        game.changeMaster(socket, args);
    })
})