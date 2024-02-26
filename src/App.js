import { useState } from 'react';

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={{ backgroundColor: isWinningSquare ? 'yellow' : null }}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i){
    if (squares[i] || calculateWinningLine(squares)){
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares, i);
  }
  
  const winningLine = calculateWinningLine(squares);
  let status;
  if (winningLine) {
    status = 'Winner: ' + (xIsNext ? 'O' : 'X');
  } else if (squares.filter((value) => value === null).length === 0) {
    status = 'Draw';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }
  
  return (
    <>
      <div className="status">{status}</div>
      
      {[0, 1, 2].map((i) => 
        <div className="board-row">
        {[0, 1, 2].map((j) => 
          <Square
            value={squares[3 * i + j]}
            onSquareClick={() => handleClick(3 * i + j)}
            isWinningSquare={winningLine && winningLine.includes(3 * i + j)}
          />
        )}
        </div>
      )}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [doReverseMoves, setDoReverseMoves] = useState(false);
  const [indexHistory, setIndexHistory] = useState([null]);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  
  function handlePlay(nextSquares, i) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    const nextIndexHistory = [...indexHistory.slice(0, currentMove + 1), i];
    setIndexHistory(nextIndexHistory);
  }
  
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  
  function reverseOrder() {
    setDoReverseMoves(!doReverseMoves);
  }
  
  const moves = history.map((squares, move) => {
    if (doReverseMoves) {
      move = history.length - 1 - move;
    }
    
    let description;
    if (move === currentMove) {
      description = `You are at move #${move}`
    } else if (move > 0) {
      description = `Go to move #${move}`
    } else {
      description = "Go to game start";
    }
    
    return (
      <li key={move}>
        {
          move === currentMove
            ? description
            : <button onClick={() => jumpTo(move)}>{description}</button>
        }{
          move === 0
          ? null
          : ` - [(row, col) = (${Math.floor(indexHistory[move] / 3) + 1}, ${indexHistory[move] % 3 + 1})]`
        }
      </li>
    );
  });
  
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
        <div className="game-info">
          <button onClick={reverseOrder}>Reverse order</button>
          <ol>{moves}</ol>
        </div>
    </div>
  );

}

function calculateWinningLine(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}