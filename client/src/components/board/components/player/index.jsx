import React from 'react';
import { formatMoney } from '../../../../helper/money';
import "./styles.scss";
import {isMobile} from 'react-device-detect';

function Player({player, isYou}) {
    const {isMaster, socketId, cash, earn, name, avatar, pos} = player;
    if(isYou) {
        localStorage.setItem("cash2", cash);
    }
    const handlePosPc = (index) => {
        switch(index) {
            case 1: 
                return {top: 116, left: -80}
            case 2: 
                return {top: -36, left: 48}
            case 3: 
                return {top: -52, left: 200}
            case 4: 
                return {top: -52, right: 200}
            case 5:
                return {top: -36, right: 48}
            case 6: 
                return {top: 116, right: -80}
            case 7: 
                return {bottom: 116, right: -80}
            case 8: 
                return {bottom: -28, right: -20}
            case 9:
                return {bottom: -44, right: 120}
            case 10:
                return {bottom: -44, left: 120}
            case 11: 
                return {bottom: -28, left: -20}
            case 12: 
                return {bottom: 116, left: -80}
        }
    }
    const handlePosMobile = (index) => {
        switch(index) {
            case 1: 
                return {top: 42, left: -52}
            case 2: 
                return {top: -38, left: 24}
            case 3: 
                return {top: -44, left: 136}
            case 4: 
                return {top: -44, right: 136}
            case 5:
                return {top: -38, right: 24}
            case 6: 
                return {top: 42, right: -52}
            case 7: 
                return {bottom: 42, right: -52}
            case 8: 
                return {bottom: -38, right: 24}
            case 9:
                return {bottom: -44, right: 136}
            case 10:
                return {bottom: -44, left: 136}
            case 11: 
                return {bottom: -38, left: 24}
            case 12: 
                return {bottom: 42, left: -52}
        }
    }

    const handlePos = (isMobile, pos) => {
        if(isMobile) {
            return handlePosMobile(pos);
        } else {
            return handlePosPc(pos)
        }
    }

    return (
        <div className={`player ${isMaster && "master"} ${isYou && "you"}`} style={{...handlePos(isMobile, pos)}}>
            <div className="player-cash">
                <p>💵 {formatMoney(cash)}đ</p>
            </div>

            <div className="player-info">
                <div className="player-info-avatar">
                    <img src={avatar} alt="avatar" />
                </div>
                <h5>{name}</h5>
                {isMaster && <div className="player-master">👑</div>}
                {earn !== 0 && <span className="player-earn">{earn >= 0 ? `+${earn}` : earn}</span>}
            </div>
        </div>
    );
}

export default Player;