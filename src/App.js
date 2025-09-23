import React, { useState, useRef, useEffect } from 'react';
import Crossword from '@jaredreisinger/react-crossword';

const crosswordData = {
  across: {
    1: { clue: 'The month of scrambled yam', answer: 'MAY', row: 0, col: 2 },
    3: { clue: 'Eco-friendly color in envy', answer: 'GREEN', row: 3, col: 3 },
    5: { clue: 'A letter to flowers', answer: 'BEE', row: 5, col: 5 },
    6: { clue: 'According to poets, uttered long ago, belonging to you', answer: 'YOUR', row: 4, col: 0 },
  },
  down: {
    2: { clue:'Scrambled yam is a type of puzzle', answer: 'ANAGRAM', row: 0, col: 3 },
    4: { clue: 'Almost a letter to see', answer: 'EYE', row: 3, col: 6 },
    5: { clue: 'Lad’s companion could be romantic (abbrv)', answer: 'BF', row: 5, col: 5 },
  },
};

const App = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [passInput, setPassInput] = useState('');
  const crosswordRef = useRef(null);

  const passphrase = 'password';

  const handleCheck = () => {
    if (crosswordRef.current?.isCrosswordCorrect()) {
      setCorrect(true);
    }
  };

  // When the GIF finishes playing, show the buttons
  useEffect(() => {
    if (showGif) {
      const timer = setTimeout(() => setShowButtons(true), 4200); // assuming 24 fps
      return () => clearTimeout(timer);
    }
  }, [showGif]);

  return (
    <div style={{ padding: '1rem', textAlign: 'center' }}>
      {!unlocked ? (
        <div style={{ marginTop: '20vh' }}>
          <h2>Noah's kinda shy. Help him find the right words to say to Maddie!</h2>
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
                src="celebration.gif"
                alt="Celebration GIF"
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
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: '500px' }}>
            <Crossword
              ref={crosswordRef}
              data={crosswordData}
              theme={{
                cellBackground: '#fff',
                cellBorder: '#000',
                focusBackground: '#ffeb3b',
                highlightBackground: '#fff9c4',
                textColor: '#000',
                numberColor: 'rgba(0,0,0,0.3)',
              }}
            />
          </div>
          <button
            onClick={handleCheck}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Check Answers
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
