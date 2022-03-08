module.exports = class Player {

    constructor(name, avatar, cash, pos, isMaster, socketId) {
        this.name = name;
        this.avatar = this.isImgLink(avatar) ? avatar : "https://i.ibb.co/YBKWdYw/playing-cards-1.png";
        this.cash = cash;
        this.pos = pos;
        this.isMaster = isMaster;
        this.earn = 0;
        this.put = 0;
        this.socketId = socketId
    }

    putCash(cash) {
        this.put += cash;
    }

    earnCash(cash) {
        this.cash += cash;
        this.earn += cash;
    }

    reset() {
        this.earn = 0;
        this.put = 0;
    }

    changePos(pos) {
        this.pos = pos;
    }

    isImgLink = (url) => {
        if (typeof url !== 'string') {
          return false;
        }
        return (url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi) !== null);
    }
}