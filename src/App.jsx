/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Square from './square';
import './App.css';

function App() {
  const [chosen , setChosen] = useState(false);
  const ai = 2;
  const human = 1;
  const grid = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  const [currentPlayer, setCurrentPlayer] = useState(chosen);
  const [lay, setLay] = useState(grid);
  const [winner, setWinner] = useState(null);

  // Check winner when lay is updated
  useEffect(() => {
    setWinner(checkWinner(lay));
  }, [lay]);

  // AI Move
  useEffect(() => {
    if (currentPlayer && winner == null) {
      GetBestMove(lay);
    }
  }, [currentPlayer, winner]);

  function checkWinner(lay) {
    let winner = null;
    let empty = 0;
    for (let i = 0; i < 9; i++) {
      if (lay[i] === 0) {
        empty++;
      }
    }

    // Check for winning combinations
    if (lay[0] === lay[1] && lay[1] === lay[2] && lay[2] !== 0) {
      winner = lay[0];
    } else if (lay[3] === lay[4] && lay[4] === lay[5] && lay[5] !== 0) {
      winner = lay[3];
    } else if (lay[6] === lay[7] && lay[7] === lay[8] && lay[8] !== 0) {
      winner = lay[6];
    } else if (lay[0] === lay[3] && lay[3] === lay[6] && lay[6] !== 0) {
      winner = lay[0];
    } else if (lay[1] === lay[4] && lay[4] === lay[7] && lay[7] !== 0) {
      winner = lay[1];
    } else if (lay[2] === lay[5] && lay[5] === lay[8] && lay[8] !== 0) {
      winner = lay[2];
    } else if (lay[0] === lay[4] && lay[4] === lay[8] && lay[8] !== 0) {
      winner = lay[0];
    } else if (lay[2] === lay[4] && lay[4] === lay[6] && lay[6] !== 0) {
      winner = lay[2];
    }

    // Return winner or tie (0) if no spaces left
    return winner ? winner : (empty === 0 ? 0 : null);
  }

  function GetBestMove(board) {
    if (winner === null) {  // Ensure no moves if the game is over
      let bestMove;
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === 0) {
          let game = [...board];
          game[i] = ai;
          let score = minimax(game, 0, false);  // False since human moves next
          if (score > bestScore) {
            bestScore = score;
            bestMove = i;
          }
        }
      }
      let result = [...board];
      result[bestMove] = ai;
      setLay(result);
      setCurrentPlayer(false);
    }
  }

  let scores = [0, -1, 1]; // Tie: 0, Loss: -1, Win: 1

  function minimax(board, depth, isMaximizing) {
    let result = checkWinner(board);
    let empty = 0;
    for(let i = 0; i < 9; i++){
      if(board[i] != 0){
        empty++;
      }
    }
    if(empty == 1 && board[4] == ai && chosen == true){
      console.log("empty")
      return 5;
    }
    if (result != null) {
      return scores[result];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === 0) {
          board[i] = ai;
          const score = minimax(board, depth + 1, false);
          board[i] = 0;  // Undo the move
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === 0) {
          board[i] = human;
          const score = minimax(board, depth + 1, true);
          board[i] = 0;  // Undo the move
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  function handleClick(index) {
    if (lay[index] === 0 && winner == null && !currentPlayer) {
      const newArr = [...lay];
      newArr[index] = human;
      setLay(newArr);
      setCurrentPlayer(true);
    }
  }

  return (
    <>
      <div className='container'>
        {lay.map((item, index) => (
          <Square grid={lay} index={index} key={index} onClick={() => handleClick(index)} />
        ))}
      </div>
      <h1>{winner === null ? "Game ON" : winner === 0 ? "Tie" : (winner === 1 ? "X Won" : "O Won")}</h1>
      <button onClick={e => {setLay(grid); setCurrentPlayer(chosen);setWinner(null);}}>Reset</button>
      <select onChange={e => setChosen(e.target.value === 'true')}>
        <option value={false}>Player</option>
        <option value={true}>AI</option>
      </select>
    </>
  );
}

export default App;

