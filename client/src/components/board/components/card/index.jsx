import React, { useEffect, useState } from 'react';
import { formatMoney } from '../../../../helper/money';
import "./styles.scss";

function Card({socket}) {
    const [list, setList] = useState({
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
    })
    const [showForm, setShowForm] = useState(false);
    const [card, setCard] = useState();

    useEffect(() => {
        socket.on("card", (args) => {
            setList(args);
        })
        
    }, [])

    const randomPos = () => {
        // Math.floor(Math.random() * 90) + 
        return {
            top: Math.floor(Math.random() * 80) + "%",
            left: Math.floor(Math.random() * 80) + "%",
            transform: `rotate(${Math.floor(Math.random() * 160)}deg)`
        };
    }

    const handleShowForm = (key) => {
        setCard(key)
        setShowForm(true);
    }

    const handlePut = (e) => {
        setShowForm(false);
        socket.emit("put", {card: card, cash: e.target.value})
    }

    return (
        <div className="card">
            {Object.keys(list).map((key) => (
                <div className="card-item" onClick={() => handleShowForm(key)}>
                    <img src={require(`../../../../assets/${key}.png`)} alt={key} />
                    {list[key].list.map((item) => (
                        <div className="card-item-player" style={randomPos()}>
                            <img src={item.avatar} alt="player" />
                        </div>
                    ))}
                    <span>{formatMoney(list[key].cash) + "đ"}</span>
            </div>
            ))}
            {showForm && <div className="card-form">
                <h4>Số tiền muốn đặt {card}</h4>
                <div>
                    <select onChange={(e) => handlePut(e)}>
                        <option value={1000}>Tiền</option>
                        <option value={1000}>1000đ</option>
                        <option value={2000}>2000đ</option>
                        <option value={3000}>3000đ</option>
                        <option value={4000}>4000đ</option>
                        <option value={5000}>5000đ</option>
                    </select>
                    <button onClick={() => setShowForm(false)}>Hủy</button>
                </div>
            </div>}
        </div>
    );
}

export default Card;