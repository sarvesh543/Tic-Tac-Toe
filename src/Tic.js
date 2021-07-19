import "./Tic.css";
import { useGlobalContext } from "./context";
import Button from "@material-ui/core/Button";
import React, { useState } from "react";

function Tic() {
  const [showReplayButton, setShowReplayButton] = useState(false);

  const {
    players,
    setPlayers,
    setBoard,
    setLevel,
    setReady,
    setWin,
    win,
    change,
    setChange,
    game,
    setGame,
    level,
    canvas,
    size,
    playerTurn,
    setPlayerTurn,
  } = useGlobalContext();

  const resetGame = (e) => {
    e.preventDefault();
    setReady(false);
    setWin(undefined);
    setLevel(undefined);
    setPlayers({
      player1: { name: "player1", inputIsX: true, score: 0 },
      player2: { name: "player2", inputIsX: false, score: 0 },
    });
    setPlayerTurn("X");
  };

  const replayGame = (e) => {
    e.preventDefault();
    setWin(undefined);
    setPlayerTurn("X");
    setPlayers({
      player1: { ...players.player1, inputIsX: !players.player1.inputIsX },
      player2: { ...players.player2, inputIsX: !players.player2.inputIsX },
    });
    canvas.current.width = canvas.current.width;
    setBoard();
    setShowReplayButton(false);
  };

  const CheckWin = () => {
    //row check
    for (let i = 0; i < level; i++) {
      const common = game[i][0];
      for (let j = 0; j < level; j++) {
        if (game[i][j] === 0 || game[i][j] !== common) {
          break;
        } else if (j === level - 1) {
          const winObj = {
            winner: game[i][j] === 1 ? "X" : "O",
            winType: "R",
            winTypeNum: i,
          };

          return { type: "WIN", winObj };
        }
      }
    }
    //column check
    for (let i = 0; i < level; i++) {
      const common = game[0][i];
      for (let j = 0; j < level; j++) {
        if (game[j][i] === 0 || game[j][i] !== common) {
          break;
        } else if (j === level - 1) {
          const winObj = {
            winner: game[j][i] === 1 ? "X" : "O",
            winType: "C",
            winTypeNum: i,
          };

          return { type: "WIN", winObj };
        }
      }
    }
    //diagonal check
    let com = game[0][0];
    for (let i = 0; i < level; i++) {
      if (game[i][i] === 0 || game[i][i] !== com) {
        break;
      } else if (i === level - 1) {
        const winObj = {
          winner: game[i][i] === 1 ? "X" : "O",
          winType: "D",
          winTypeNum: 0,
        };

        return { type: "WIN", winObj };
      }
    }
    com = game[0][level - 1];
    for (let i = 0; i < level; i++) {
      if (game[i][level - i - 1] === 0 || game[i][level - i - 1] !== com) {
        break;
      } else if (i === level - 1) {
        const winObj = {
          winner: game[i][level - i - 1] === 1 ? "X" : "O",
          winType: "D",
          winTypeNum: 1,
        };
        return { type: "WIN", winObj };
      }
    }

    //tie check

    for (let i = 0; i < level; i++) {
      for (let j = 0; j < level; j++) {
        if (game[i][j] === 0) {
          return { type: "CONTINUE" };
        }
      }
    }
    setWin("TIE");
    return { type: "TIE", winObj: { tie: "TIE" } };
  };

  const handleMouseDown = (e) => {
    const ctx = document.getElementById("cns");
    const { x: xOff, y: yOff } = ctx.getBoundingClientRect();

    e.preventDefault();
    const xClick = e.pageX - xOff;
    const yClick = e.pageY - yOff;

    if (xClick > 0 && yClick > 0) {
      let j = -1;
      let i = -1;
      let temp = xClick;
      while (temp > 0) {
        temp -= size / level;
        j += 1;
      }
      temp = yClick;
      while (temp > 0) {
        temp -= size / level;
        i += 1;
      }

      if (game[i][j] === 0 && !win) {
        let newPos = game;
        if (playerTurn === "X") {
          newPos[i][j] = 1;
          setPlayerTurn("O");
        } else if (playerTurn === "O") {
          newPos[i][j] = -1;
          setPlayerTurn("X");
        }
        setGame(newPos);
        setChange(!change);
        const { type, winObj } = CheckWin();

        if (type === "WIN" || type === "TIE") {
          setShowReplayButton(true);
        } else if (type === "CONTINUE") {
          setShowReplayButton(false);
        }

        if (type === "WIN") {
          setWin(winObj);
          console.log(players, winObj);
          //set score
          if (
            players.player1.inputIsX === (winObj.winner === "X" ? true : false)
          ) {
            setPlayers({
              ...players,
              player1: {
                ...players.player1,
                score: players.player1.score + 1,
              },
            });
          }
          if (
            players.player2.inputIsX === (winObj.winner === "X" ? true : false)
          ) {
            setPlayers({
              ...players,
              player2: {
                ...players.player2,
                score: players.player2.score + 1,
              },
            });
          }

          const draw = canvas.current.getContext("2d");
          if (winObj.winType === "R") {
            const temp = size / (2 * level);
            draw.moveTo(0, temp + winObj.winTypeNum * 2 * temp);
            draw.lineTo(size, temp + winObj.winTypeNum * 2 * temp);
            draw.stroke();
          } else if (winObj.winType === "C") {
            const temp = size / (2 * level);
            draw.moveTo(temp + winObj.winTypeNum * 2 * temp, 0);
            draw.lineTo(temp + winObj.winTypeNum * 2 * temp, size);
            draw.stroke();
          } else if (winObj.winType === "D") {
            if (winObj.winTypeNum === 0) {
              draw.moveTo(0, 0);
              draw.lineTo(size, size);
              draw.stroke();
            } else {
              draw.moveTo(size, 0);
              draw.lineTo(0, size);
              draw.stroke();
            }
          }
        }
      }
    }
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <div className='App-div-container'>
          <div className='App-div'>
            <p>SCORE</p>
            <p>{`${players.player1.name}: ${players.player1.score}`}</p>
            <p>{`${players.player2.name}: ${players.player2.score}`}</p>
          </div>
          <div className='App-div'>
            {!showReplayButton &&
              ((playerTurn === "X" ? true : false) ===
              players.player1.inputIsX ? (
                <p>{`${players.player1.name}'s turn`}</p>
              ) : (
                <p>{`${players.player2.name}'s turn`}</p>
              ))}
            {showReplayButton && (
              <Button
                onClick={replayGame}
                variant='contained'
                color='primary'
                className='other'>
                Play Again!
              </Button>
            )}
            <Button
              onClick={resetGame}
              variant='contained'
              color='primary'
              className='other'>
              Return To Home
            </Button>
            <p></p>

            {win && <p>{win.winner ? `${win.winner} Wins` : "Match Tie"}</p>}
          </div>
        </div>

        <canvas
          id='cns'
          onMouseDown={handleMouseDown}
          ref={canvas}
          width={size}
          height={size}></canvas>
      </header>
    </div>
  );
}

export default Tic;
