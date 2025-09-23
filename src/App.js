import React, { useState } from 'react';
import Crossword from '@jaredreisinger/react-crossword';

const crosswordData = {
  across: {
    1: { clue: 'Scrambled yam for permission?', answer: 'MAY', row: 0, col: 2 },
    3: { clue: 'Eco-friendly color in envy', answer: 'GREEN', row: 3, col: 3 },
    5: { clue: 'A letter to flowers', answer: 'BEE', row: 5, col: 5 },
    6: { clue: 'According to poets, uttered long ago, belonging to you', answer: 'YOUR', row: 4, col: 0 }
  },
  down: {
    2: { clue:'Scrambled yam is a type of puzzle', answer: 'ANAGRAM', row: 0, col: 3 },
    4: { clue: 'Almost a letter to see', answer: 'EYE', row: 3, col: 6 },
    5: { clue: 'Lad’s companion could be romantic (abbrv)', answer: 'BF', row: 5, col: 5 }
  },
};

const App = () => {
  const [unlocked, setUnlocked] = useState(true);
  const [correct, setCorrect] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [passInput, setPassInput] = useState('');

  const passphrase = 'noahsthebestatpips';


  return (
    <div style={{ padding: '1rem', textAlign: 'center' }}>
      {!unlocked ? (
        <div style={{ marginTop: '20vh' }}>
          <h2>Enter passphrase</h2>
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
                  cursor: 'pointer'
                }}
              >
                Click to celebrate 🎉
              </button>
            </div>
          ) : (
            <img
              src="/celebration.gif"
              alt="Celebration GIF"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '500px' }}>
            <Crossword
              data={crosswordData}
              onCrosswordCorrect={()=>setCorrect(true)}
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
        </div>
      )}
    </div>
  );
};

export default App;
