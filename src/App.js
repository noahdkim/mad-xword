import React, { useState, useRef, useEffect } from 'react';

// Custom crossword with rebus support
const crosswordData = {
  clues: {
    across: [
      { number: 1, clue: 'The most beautiful in all the land', row: 0, col: 0, answer: 'MADDIE', length: 6 },
      { number: 3, clue: 'Your favorite flower', row: 2, col: 1, answer: 'LILY', length: 2 },
      { number: 6, clue: "If I were a Pokemon you'd probably pick", row: 7, col: 4, answer: 'PIPLUP', length: 6 },
    ],
    down: [
      { number: 2, clue: 'How often I dream about you', row: 0, col: 2, answer: 'DAILY', length: 3 },
      { number: 4, clue: "what I like about you", row: 0, col: 5, answer: 'EVERYTHING', length: 10 },
      { number: 5, clue: 'The thing you cannot live without', row: 6, col: 8, answer: 'JUICE', length: 5 },
    ],
  },
  rebus: {
    '2-2': 'ILY',
  },
};

// Generate grid from clues
const generateGrid = (data) => {
  // Find grid dimensions
  let maxRow = 0;
  let maxCol = 0;
  
  [...data.clues.across, ...data.clues.down].forEach(clue => {
    const endRow = clue.row + (data.clues.down.includes(clue) ? clue.length : 0);
    const endCol = clue.col + (data.clues.across.includes(clue) ? clue.length : 0);
    maxRow = Math.max(maxRow, endRow);
    maxCol = Math.max(maxCol, endCol);
  });
  
  // Create empty grid
  const grid = Array(maxRow + 1).fill(null).map(() => Array(maxCol + 1).fill(''));
  
  // Fill in across clues
  data.clues.across.forEach(clue => {
    let col = clue.col;
    let answerIndex = 0;
    
    for (let i = 0; i < clue.length; i++) {
      const cellKey = `${clue.row}-${col}`;
      if (data.rebus && data.rebus[cellKey]) {
        grid[clue.row][col] = data.rebus[cellKey];
        // Skip the characters that are in the rebus
        answerIndex += data.rebus[cellKey].length;
      } else {
        grid[clue.row][col] = clue.answer[answerIndex];
        answerIndex++;
      }
      col++;
    }
  });
  
  // Fill in down clues
  data.clues.down.forEach(clue => {
    let row = clue.row;
    let answerIndex = 0;
    
    for (let i = 0; i < clue.length; i++) {
      const cellKey = `${row}-${clue.col}`;
      if (data.rebus && data.rebus[cellKey]) {
        grid[row][clue.col] = data.rebus[cellKey];
        // Skip the characters that are in the rebus
        answerIndex += data.rebus[cellKey].length;
      } else {
        grid[row][clue.col] = clue.answer[answerIndex];
        answerIndex++;
      }
      row++;
    }
  });
  
  return grid;
};

// Generate cell numbers
const generateNumbers = (data) => {
  const numbers = {};
  [...data.clues.across, ...data.clues.down].forEach(clue => {
    const key = `${clue.row}-${clue.col}`;
    numbers[key] = clue.number;
  });
  return numbers;
};

const grid = generateGrid(crosswordData);
const numbers = generateNumbers(crosswordData);

const CrosswordCell = ({ value, number, isBlack, isActive, isFocused, onClick, onChange, isRebus, rebusValue }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  if (isBlack) {
    return <div className="cell black-cell" />;
  }

  return (
    <div
      className={`cell ${isActive ? 'active' : ''} ${isFocused ? 'focused' : ''}`}
      onClick={onClick}
    >
      {number && <span className="cell-number">{number}</span>}
      <input
        ref={inputRef}
        type="text"
        maxLength={isRebus ? 10 : 1}
        value={isRebus ? rebusValue || value : value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        className={`cell-input ${isRebus ? 'rebus-input' : ''}`}
      />
    </div>
  );
};

const CustomCrossword = ({ data, onCorrect }) => {
  const grid = generateGrid(data);
  const numbers = generateNumbers(data);
  
  const [userGrid, setUserGrid] = useState(() => {
    return grid.map(row => row.map(cell => (cell === '' ? '' : '')));
  });
  const [rebusValues, setRebusValues] = useState({});
  const [focusedCell, setFocusedCell] = useState(null);
  const [direction, setDirection] = useState('across');

  const handleCellClick = (row, col) => {
    if (grid[row][col] === '') return;
    
    if (focusedCell?.row === row && focusedCell?.col === col) {
      setDirection(d => d === 'across' ? 'down' : 'across');
    } else {
      setFocusedCell({ row, col });
    }
  };

  const handleCellChange = (row, col, value) => {
    const cellKey = `${row}-${col}`;
    const isRebus = data.rebus && data.rebus[cellKey];

    if (isRebus) {
      setRebusValues(prev => ({ ...prev, [cellKey]: value }));
    } else {
      const newGrid = userGrid.map((r, i) =>
        r.map((c, j) => (i === row && j === col ? value : c))
      );
      setUserGrid(newGrid);
    }

    // Auto-advance
    if (value && !isRebus) {
      moveToNextCell(row, col);
    }
  };

  const moveToNextCell = (row, col) => {
    let nextRow = row;
    let nextCol = col;

    if (direction === 'across') {
      nextCol++;
      while (nextCol < grid[0].length && grid[nextRow][nextCol] === '') {
        nextCol++;
      }
      if (nextCol >= grid[0].length || grid[nextRow][nextCol] === '') {
        return;
      }
    } else {
      nextRow++;
      while (nextRow < grid.length && grid[nextRow][nextCol] === '') {
        nextRow++;
      }
      if (nextRow >= grid.length || grid[nextRow][nextCol] === '') {
        return;
      }
    }

    setFocusedCell({ row: nextRow, col: nextCol });
  };

  const checkAnswers = () => {
    let correct = true;
    
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        const cellKey = `${i}-${j}`;
        const isRebus = data.rebus && data.rebus[cellKey];
        
        if (grid[i][j] !== '') {
          if (isRebus) {
            if ((rebusValues[cellKey] || '') !== data.rebus[cellKey]) {
              correct = false;
            }
          } else {
            if (userGrid[i][j] !== grid[i][j]) {
              correct = false;
            }
          }
        }
      }
    }
    
    if (correct) {
      onCorrect();
    } else {
      alert('Not quite right yet. Keep trying!');
    }
  };

  return (
    <div className="crossword-container">
      <div className="crossword-grid">
        {grid.map((row, i) => (
          <div key={i} className="grid-row">
            {row.map((cell, j) => {
              const cellKey = `${i}-${j}`;
              const isRebus = data.rebus && data.rebus[cellKey];
              return (
                <CrosswordCell
                  key={`${i}-${j}`}
                  value={userGrid[i][j]}
                  number={numbers[cellKey]}
                  isBlack={cell === ''}
                  isActive={focusedCell?.row === i && focusedCell?.col === j}
                  isFocused={focusedCell?.row === i && focusedCell?.col === j}
                  onClick={() => handleCellClick(i, j)}
                  onChange={(val) => handleCellChange(i, j, val)}
                  isRebus={isRebus}
                  rebusValue={rebusValues[cellKey]}
                />
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="clues-container">
        <div className="clues-section">
          <h3>Across</h3>
          {data.clues.across.map((clue, idx) => (
            <div key={idx} className="clue">
              <strong>{clue.number}.</strong> {clue.clue}
            </div>
          ))}
        </div>
        <div className="clues-section">
          <h3>Down</h3>
          {data.clues.down.map((clue, idx) => (
            <div key={idx} className="clue">
              <strong>{clue.number}.</strong> {clue.clue}
            </div>
          ))}
        </div>
      </div>
      
      <button onClick={checkAnswers} className="check-button">
        Check Answers
      </button>

      <style jsx>{`
        .crossword-container {
          max-width: 600px;
          margin: 0 auto;
        }
        .crossword-grid {
          display: inline-block;
          border: 2px solid #000;
          margin-bottom: 2rem;
        }
        .grid-row {
          display: flex;
        }
        .cell {
          width: 50px;
          height: 50px;
          border: 1px solid #000;
          position: relative;
          background: white;
        }
        .black-cell {
          background: black;
        }
        .cell.active {
          background: #fff9c4;
        }
        .cell.focused {
          background: #ffeb3b;
        }
        .cell-number {
          position: absolute;
          top: 2px;
          left: 2px;
          font-size: 10px;
          color: rgba(0,0,0,0.5);
        }
        .cell-input {
          width: 100%;
          height: 100%;
          border: none;
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          background: transparent;
          outline: none;
          text-transform: uppercase;
        }
        .rebus-input {
          font-size: 12px;
          padding: 2px;
        }
        .clues-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          text-align: left;
          margin-bottom: 1rem;
        }
        .clues-section h3 {
          margin-top: 0;
        }
        .clue {
          margin-bottom: 0.5rem;
        }
        .check-button {
          padding: 0.5rem 1rem;
          font-size: 1rem;
          cursor: pointer;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};

const App = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [passInput, setPassInput] = useState('');

  const passphrase = 'happyvalentinesday';

  useEffect(() => {
    if (showGif) {
      const timer = setTimeout(() => setShowButtons(true), 4200);
      return () => clearTimeout(timer);
    }
  }, [showGif]);

  return (
    <div style={{ padding: '1rem', textAlign: 'center' }}>
      {!unlocked ? (
        <div style={{ marginTop: '20vh' }}>
          <h2>Let's find some things to show Maddie how much we love her!</h2>
          <input
            type="password"
            value={passInput}
            onChange={e => setPassInput(e.target.value)}
            style={{ padding: '0.5rem', fontSize: '1rem' }}
          />
          <button
            onClick={() => {
              if (passInput === passphrase) setUnlocked(true);
              else alert('Wrong passphrase!');
            }}
            style={{ marginLeft: '1rem', padding: '0.5rem 1rem', fontSize: '1rem' }}
          >
            Enter
          </button>
          <div style={{ marginTop: '1rem' }}>
            <img
              src="noah-sprite.png"
              alt="Cute sprite"
              style={{ width: '100px', height: 'auto' }}
            />
          </div>
        </div>
      ) : correct ? (
        <div>
          {!showGif ? (
            <div>
              <h1>🎉 You solved it! 💌</h1>
              <button
                onClick={() => setShowGif(true)}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
              >
                Let's go find Maddie! 🎉
              </button>
            </div>
          ) : (
            <div>
              <img
                src="vday.gif"
                alt="VDAY GIF"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              {showButtons && (
                <div style={{ marginTop: '1rem' }}>
                  <button
                    onClick={() => alert('yay!')}
                    style={{
                      marginRight: '1rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: 'green',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => alert('yay!')}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Yes but in red
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <CustomCrossword data={crosswordData} onCorrect={() => setCorrect(true)} />
      )}
    </div>
  );
};

export default App;