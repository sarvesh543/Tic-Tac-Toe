import React, { useState, useEffect, useContext, useRef } from "react";
import useWindowDimensions from "./window";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const windowDimensions = useWindowDimensions();
  let initial = undefined;
  let size = 0;

  if (windowDimensions.height < windowDimensions.width) {
    size = windowDimensions.height;
  } else {
    size = windowDimensions.width;
  }
  const [ready, setReady] = useState(false);
  const [level, setLevel] = useState(undefined);
  const [playerTurn, setPlayerTurn] = useState("X");
  const [game, setGame] = useState(undefined);
  const [change, setChange] = useState(true);
  const canvas = useRef(null);
  const [win, setWin] = useState(undefined);
  const [players, setPlayers] = useState({
    player1: { name: "player1", inputIsX: true, score: 0 },
    player2: { name: "player2", inputIsX: false, score: 0 },
  });

  const setBoard = () => {
    if (level) {
      initial = [];
      for (let i = 0; i < level; i++) {
        initial.push([]);
        for (let j = 0; j < level; j++) {
          initial[i].push(0);
        }
      }
      setGame(initial);
      setChange(!change);
    }
  };

  const handleClick = (e, lvl) => {
    setLevel(lvl);
    setReady(true);
    setBoard();
  };

  useEffect(() => {
    setBoard();
  }, [level, ready]);

  useEffect(() => {
    if (canvas && ready && game) {
      const ctx = canvas.current.getContext("2d");
      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, size, size);
      //grid
      for (let i = 1; i < level; i++) {
        ctx.moveTo((i * size) / level, 0);
        ctx.lineTo((i * size) / level, size);
        ctx.stroke();
      }

      for (let j = 1; j < level; j++) {
        ctx.moveTo(0, (j * size) / level);
        ctx.lineTo(size, (j * size) / level);
        ctx.stroke();
      }

      for (let i = 0; i < level; i++) {
        for (let j = 0; j < level; j++) {
          if (game[i][j] === 1) {
            //cross in 1,2  x,y = 150,50
            const off = size / (level * 4);
            const xoff = 2 * off + (j * size) / level;
            const yoff = 2 * off + (i * size) / level;

            ctx.moveTo(xoff - off, yoff - off);
            ctx.lineTo(xoff + off, yoff + off);
            ctx.stroke();

            ctx.moveTo(xoff + off, yoff - off);
            ctx.lineTo(xoff - off, yoff + off);
            ctx.stroke();
          } else if (game[i][j] === -1) {
            //circle
            const diameter = size / (level * 2);
            const xoff = diameter + (j * size) / level;
            const yoff = diameter + (i * size) / level;

            ctx.beginPath();
            ctx.arc(xoff, yoff, diameter / 2, 0, 2 * Math.PI);
            ctx.stroke();
          }
        }
      }
    }
  }, [change, game, size]);

  return (
    <AppContext.Provider
      value={{
        game,
        setGame,
        change,
        setChange,
        level,
        setLevel,
        canvas,
        size,
        playerTurn,
        setPlayerTurn,
        setWin,
        win,
        ready,
        setReady,
        setBoard,
        players,
        setPlayers,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
