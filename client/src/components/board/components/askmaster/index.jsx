import React, { useEffect, useState } from 'react';
import "./styles.scss";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';

function AskMaster({socket}) {
    const [show, setShow] = useState(false);
    useEffect(() => {
        socket.on("master", () => {
            setShow(false);
        })
        socket.on("dontmaster", () => {
            setShow(true);
        })
        socket.on("join", (args) => {
            if(args !== "fail") {
                setShow(true);
            }
        })
        socket.on("askmaster", ({name, socketId}) => {
            confirmAlert({
                title: 'Xin làm cái',
                message: `${name} muốn xin làm cái`,
                buttons: [
                  {
                    label: 'Đồng ý',
                    onClick: () => socket.emit("changemaster", socketId)
                  },
                  {
                    label: 'Hủy',
                  }
                ]
              });
        })
    }, [])
    
    return (
        <div className="askmaster">
            {show && <button onClick={() => socket.emit("askmaster")}>Xin làm cái</button>}

        </div>
    );
}

export default AskMaster;