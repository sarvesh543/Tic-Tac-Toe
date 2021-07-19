import TextField from "@material-ui/core/TextField";
import React from "react";
import Button from "@material-ui/core/Button";
import { useGlobalContext } from "./context";

function Home() {
  const { setBoard, level, setReady, setLevel, setPlayers, players } =
    useGlobalContext();

  const handleClick = (e) => {
    e.preventDefault();
    const input = document.getElementById("level");
    const player1 = document.getElementById("name1");
    const player2 = document.getElementById("name2");
    let tempPlayers = players;
    console.log("before", players, level);
    if (input.value === "3" || input.value === "4" || input.value === "5") {
      if (player1.value !== "") {
        tempPlayers.player1.name = player1.value;
      }
      if (player2.value !== "") {
        tempPlayers.player2.name = player2.value;
      }
      setPlayers(tempPlayers);
      setLevel(Number(input.value));
      setBoard();
      setReady(true);
    }
  };
  return (
    <div className='App'>
      <header className='App-Header'>
        <p>Enter a number 3,4,5 for n x n game</p>
        <TextField id='level'></TextField>
        <br />
        <p>Enter Player1 name</p>
        <TextField id='name1' placeholder='player1'></TextField>
        <br />
        <p>Enter Player2 name</p>
        <TextField id='name2' placeholder='player2'></TextField>
      </header>
      <Button onClick={handleClick} variant='contained' color='primary'>
        Play
      </Button>
    </div>
  );
}

export default Home;
