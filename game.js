const Player = require("./player");

module.exports = class Game {
    constructor(io) {
        this.io = io;
        this.playerList = {};
        this.isPlayed = false;
        this.maxCash = 5000;
        this.allCards = ['nai', 'bầu', 'gà', 'cá', 'cua', 'tôm'];
        this.put = {
            nai: {
                num: 0,
                list: [],
                cash: 0
            },
            bầu: {
                num: 0,
                list: [],
                cash: 0
            },
            gà: {
                num: 0,
                list: [],
                cash: 0
            },
            cá: {
                num: 0,
                list: [],
                cash: 0
            },
            cua: {
                num: 0,
                list: [],
                cash: 0
            },
            tôm: {
                num: 0,
                list: [],
                cash: 0
            },
        };
        this.master = null;
    }

    update() {
        this.io.sockets.emit('update', Object.values(this.playerList));
    }

    updateCard () {
        this.io.sockets.emit('card', this.put);
    }

    playerJoin(socket, cash, name, avatar, pos) {
        if(this.isPlayed) {
            socket.emit("join", "fail")
            return;
        }
        socket.emit("join", "success")
        this.playerList[socket.id] = new Player(name, avatar, cash, pos, !this.master, socket.id);
        if(this.playerList[socket.id].isMaster) {
            this.master = this.playerList[socket.id];
            socket.emit("master");
        }
        this.update();
    }

    sendCash(socket, recipientId, cash) {
        if(!this.auth(socket.id)) return;
        this.playerList[recipientId].earnCash(cash);
        this.playerList[socket.id].earnCash(cash * -1);
        setTimeout(() => {
            this.playerList[socket.id].earn = 0;
        }, 2000)
        this.update();
    }

    randomCards() {
        const cards = [];
        for (let i = 0; i < 3; i++) {
            const card = this.allCards[Math.floor(Math.random() * this.allCards.length)];
            cards.push(card);
            this.put[card].num++;
        }
        return cards;
    }

    reset() {
        this.put = {
            nai: {
                num: 0,
                list: [],
                cash: 0
            },
            bầu: {
                num: 0,
                list: [],
                cash: 0
            },
            gà: {
                num: 0,
                list: [],
                cash: 0
            },
            cá: {
                num: 0,
                list: [],
                cash: 0
            },
            cua: {
                num: 0,
                list: [],
                cash: 0
            },
            tôm: {
                num: 0,
                list: [],
                cash: 0
            },
        };
        this.isPlayed = false;
        Object.keys(this.playerList).forEach((key) => {
            this.playerList[key].reset();
        })
    }

    start(socket) {
        if(socket.id !== this.master.socketId) return;
        this.isPlayed = true;
        setTimeout(() => {
            const cards = this.randomCards();
            this.io.sockets.emit('deal', cards);
            setTimeout(() => {
                this.compare();
                this.update();

                setTimeout(() => {
                    this.io.to(this.master.socketId).emit("newgame");
                }, 3000)
            }, 2000);
        }, 5000);
    }

    compare() {
        this.allCards.forEach((card) => {
            if (this.put[card].num === 0) {
                this.put[card].list.forEach((item) => {
                    if(!this.playerList[item.socketId]) return;
                    this.master.earnCash(Number(item.cash));
                    this.playerList[item.socketId].earnCash(Number(item.cash) * -1);
                });
            } else {
                this.put[card].list.forEach((item) => {
                    if(!this.playerList[item.socketId]) return;
                    this.master.earnCash(Number(item.cash) * this.put[card].num * -1);
                    this.playerList[item.socketId].earnCash(Number(item.cash) * this.put[card].num);
                });
            }
        });
        
        Object.keys(this.playerList).forEach((key) => {
            if(this.playerList[key].earn > 0) {
                this.io.to(this.playerList[key].socketId).emit("alert", {type: "win", message: "Bạn nhận được " + this.playerList[key].earn + " đ"})
            } else {
                this.io.to(this.playerList[key].socketId).emit("alert", {message: "Bạn bị trừ " + this.playerList[key].earn + "đ"})
            }
        })
    }

    askMaster(socket) {
        if(!this.auth(socket.id)) return;
        if(this.isPlayed) return;
        if (!this.master) {
            this.master = this.playerList[socket.id];
            this.playerList[socket.id].isMaster = true;
            socket.emit("master");
            this.update();
        }
        this.io.to(this.master.socketId).emit("askmaster", {socketId: socket.id, name: this.playerList[socket.id].name});
    }

    changeMaster (socket, newMaster) {
        if(socket.id !== this.master.socketId) return;
        this.master.isMaster = false;
        socket.emit("dontmaster");
        this.playerList[newMaster].isMaster = true;
        this.master = this.playerList[newMaster];
        this.io.to(newMaster).emit("master");
        this.update();
    }

    changePos(socket, pos) {
        if (this.playerList[socket.id]) {
            this.playerList[socket.id].changePos(pos);
            this.update();
        } else {
            socket.emit('joinform');
        }
    }

    disconnect(socket) {
        if (!this.playerList[socket.id]) {
            return;
        }
        if (this.master?.socketId === socket.id) {
            this.master = null;
        }
        delete this.playerList[socket.id];
        this.update();
        if(Object.keys(this.playerList).length === 0) {
            this.reset();
        }
    }

    putCash (socket, cash, card)  {
        if(socket.id === this.master.socketId) return;
        if(this.isPlayed) return;
        if(!this.auth(socket.id)) return;
        if(this.playerList[socket.id].put + cash > this.maxCash) {
            socket.emit("alert", {message: "Vượt quá số tiền tối đa"})
            return;
        }
        this.put[card].cash += cash;
        this.playerList[socket.id].put += cash;
        this.put[card].list.push({avatar: this.playerList[socket.id].avatar, socketId: socket.id, cash: cash});
        this.updateCard();
    }

    auth(socketId) {
        if(!this.playerList[socketId]) return false;
        return true;
    }

    newGame () {
        this.reset();
        this.update();
        this.io.sockets.emit("reset");
        this.updateCard();
    }
}