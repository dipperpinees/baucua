import React from 'react';
import Card from './components/card';
import JoinBox from './components/joinbox';
import Plate from './components/plate';
import PlayerList from './components/playerlist';
import "./styles.scss";

function Board({onShowJoinForm, socket}) {

    const handleConnect = (index) => {
        // if(localStorage.getItem("name")) {
        //     onConnect(index, localStorage.getItem("name"));
        //     return;
        // }
        // let name = prompt("Nhập tên của bạn", "");
        // if (name.length !== 0) {
        //     onConnect(index, name);
        //     localStorage.setItem("name", name);
        // } else {
        //     alert("Tên trống")
        // }
        onShowJoinForm(index);
    }

    return (
        <div className='board'>
            {[...Array(12)].map((x, i) => (
                <JoinBox key={i} index={i+1} onConnect={handleConnect}/>
            ))}
            <PlayerList socket={socket}/>
            <Card socket={socket}/>
            <Plate socket={socket}/>
        </div>
    );
}

export default Board;