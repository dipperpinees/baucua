import React, {useState, useEffect} from 'react';
import "./styles.scss";
import rollSound from "../../../../assets/sound/roll.mp3";

function Plate({socket}) {
    const [showStart, setShowStart] = useState(false);
    const [showNewGame, setShowNewGame] = useState(false);
    const [shake, setShake] = useState(false);
    const [cards, setCards] = useState(null);
    const [rollAudio] = useState(new Audio(rollSound));
    useEffect(() => {
        socket.on("master", () => {
            setShowStart(true);
        })
        socket.on("dontmaster", () => {
            setShowStart(false);
        })
        socket.on("newgame", () => {
            setShowNewGame(true);
        })
        socket.on("deal", (args) => {
            setCards(args);
            setShake(false);
            rollAudio.pause();
        })
        socket.on("reset", (args) => {
            setCards(null);
        })
        socket.on("shake", () => {
            setShake(true);
            rollAudio.play();
            rollAudio.loop = true;
        })
    }, [])

    const handleShake = () => {
        setShowStart(false);
        socket.emit("start");
        socket.emit("shake");
    }

    const handleNewGame = () => {
        setShowNewGame(false);
        setShowStart(true);
        socket.emit("newgame");
    }

    return (
        <div className={`plate ${shake && "shake"}`}>
            <img className="plate-plate" src={require("../../../../assets/plate.png")} alt="plate" />
            {!cards && <img className="plate-bowl" src={require("../../../../assets/bowl.webp")} alt="plate" />}
            
            {cards && <div className="plate-cards">
                {cards.map((card, index) => (
                    <div key={index}>
                        <img src={require(`../../../../assets/${card}.png`)} alt="card" />
                    </div>
                ))}
            </div>}
            {showStart && <button onClick={() => handleShake()}>Xóc</button>}
            {showNewGame && <button onClick={() => handleNewGame()}>Ván mới</button>}
        </div>
    );
}

export default Plate;