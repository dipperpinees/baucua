import React, { useEffect, useState } from 'react';
import Player from '../player';

function PlayerList({socket}) {
    const [listPlayer, setListPlayer] = useState([]);
    useEffect(() => {
        if(!socket) {
            return;
        }
        socket.on("update", (args) => {
            setListPlayer(args);
        })
        return () => {
            socket.off("update");
        }
    }, [socket])
    return (
        <>
            {listPlayer.map((player, index) => (
                <Player isYou={socket.id === player.socketId} key={index} player={player}/>
            ))} 
        </>
    );
}

export default PlayerList;