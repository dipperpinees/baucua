import React, { useEffect, useState } from 'react';
import "./App.scss";
import { io } from "socket.io-client";
import Board from "./components/board";
import JoinForm from './components/joinform';
import Toastify from './components/notification';
import AskMaster from './components/board/components/askmaster';

const socket = io("http://16.163.107.160:8022/");

function App() {
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [pos, setPos] = useState();
  const toggleFullSceen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    socket.on("join", (args) => {
      if (args === "fail") {
        alert("Chưa thể tham gia phòng");
        return;
      }
    });
    socket.on("joinform", () => {
      setShowJoinForm(true);
    });
  }, []);

  const connectSocket = async (name, avatar) => {
    setShowJoinForm(false);
    socket.emit("join", {
      name: name,
      pos: pos,
      cash: Number(localStorage.getItem("cash2")),
      avatar: avatar,
    });
    localStorage.setItem("name", name);
    localStorage.setItem("avatar", avatar);
  };
  const openJoinForm = (pos) => {
    setPos(pos);
    socket.emit("changepos", { pos: pos });
  };

  return (
    <div className="App">
      <Board onShowJoinForm={openJoinForm} socket={socket} />
      {showJoinForm && <JoinForm onConnect={connectSocket} onClose={() => setShowJoinForm(false)}/>}
      <Toastify socket={socket}/>
      <AskMaster socket={socket}/>
    </div>
  );
}

export default App;
