import { useState, useEffect } from 'react';

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button
      className={isWinningSquare ? 'square winning-square' : 'square'}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const rows = [0, 1, 2];
  const cols = [0, 1, 2];

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares).winner) return;

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }

    onPlay(nextSquares, i);
  }

  const { winner, winningSquares } = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (!winner && squares.every((square) => square !== null)) {
    status = 'Draw';
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows.map((row) => (
        <div key={row} className="board-row">
          {cols.map((col) => {
            let i = row * 3 + col;
            return (
              <Square
                key={i}
                value={squares[i]}
                onSquareClick={() => handleClick(i)}
                isWinningSquare={
                  winner && calculateWinner(squares).winningSquares.includes(i)
                }
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  // Example: ['O', null, 'X', 'X', 'X', 'O', 'O', null, null]
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sort, setSort] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [squareHistory, setSquareHistory] = useState([]);

  function handlePlay(nextSquares, i) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setSquareHistory([...squareHistory.slice(0, currentMove + 1), i]);
  }

  useEffect(() => {
    console.log(squareHistory);
  }, [squareHistory]);

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = `Go to move #${move}, (${
        Math.floor(squareHistory[move] / 3) + 1
      }, ${(squareHistory[move] % 3) + 1})`;
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={move}>
        {move === currentMove ? (
          `You are at move #${currentMove}`
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button
          onClick={() => {
            setSort(!sort);
          }}
        >
          Sort {sort ? 'ascending' : 'descending'}
        </button>
        <ol start="0" reversed={sort}>
          {sort ? [...moves].reverse() : moves}
        </ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winningSquares: lines[i],
      };
    }
  }

  return {
    winner: null,
    winningSquares: null,
  };
}
