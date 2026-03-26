'use client';

import { useState, useEffect } from 'react';

function getLetterByNumber(num: number): string {
  if (num <= 15) return 'B';
  if (num <= 30) return 'I';
  if (num <= 45) return 'N';
  if (num <= 60) return 'G';
  return 'O';
}

function formatBallText(number: number | null): string {
  if (number === null || number === undefined) return '—';
  const letter = getLetterByNumber(number);
  return `${letter}${number}`;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(145deg, #1A2F2A 0%, #0D231F 100%)',
    padding: 'clamp(16px, 3vw, 40px)',
    gap: 'clamp(12px, 2vw, 24px)',
    boxSizing: 'border-box',
  },
  ballWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ball: {
    width: 'clamp(280px, 35vw, 420px)',
    height: 'clamp(280px, 35vw, 420px)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    flexShrink: 0,
  },
  ballNormal: {
    background: 'radial-gradient(circle at 35% 35%, #FFF3CF, #FFDF9C)',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), inset 0 -5px 0 rgba(0, 0, 0, 0.1), inset 0 2px 15px rgba(255, 255, 200, 0.8)',
    border: 'clamp(3px, 0.5vw, 6px) solid #FFD966',
  },
  ballEmpty: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'clamp(3px, 0.5vw, 6px) dashed rgba(255, 215, 140, 0.3)',
    boxShadow: 'none',
  },
  ballText: {
    fontSize: 'clamp(3.5rem, 8vw, 6rem)',
    fontWeight: 900,
    fontFamily: '"Inter", monospace',
    letterSpacing: '2px',
    color: '#3B2A1A',
    textShadow: '0 4px 8px rgba(255, 215, 120, 0.6)',
  },
  ballTextEmpty: {
    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
    color: 'rgba(255, 215, 140, 0.4)',
    textShadow: 'none',
  },
  label: {
    fontSize: 'clamp(1rem, 2vw, 1.5rem)',
    textTransform: 'uppercase',
    letterSpacing: 'clamp(4px, 1vw, 8px)',
    fontWeight: 700,
    color: '#E8C88C',
    background: 'rgba(0, 0, 0, 0.5)',
    padding: 'clamp(8px, 1.5vw, 14px) clamp(16px, 3vw, 32px)',
    borderRadius: '60px',
    backdropFilter: 'blur(8px)',
  },
  historyContainer: {
    width: 'clamp(320px, 80vw, 700px)',
    background: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 'clamp(20px, 3vw, 32px)',
    padding: 'clamp(10px, 2vw, 16px)',
    border: '1px solid rgba(232, 200, 140, 0.2)',
    maxHeight: 'clamp(120px, 25vh, 200px)',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  historyTitle: {
    fontSize: 'clamp(0.85rem, 1.5vw, 1.2rem)',
    fontWeight: 700,
    color: '#E8C88C',
    textAlign: 'center',
    marginBottom: 'clamp(6px, 1vw, 12px)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  historyChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'clamp(4px, 1vw, 10px)',
    justifyContent: 'center',
    alignContent: 'flex-start',
  },
  chip: {
    background: 'linear-gradient(145deg, #3D5B4F, #2F4B3F)',
    padding: 'clamp(4px, 0.8vw, 8px) clamp(8px, 1.5vw, 14px)',
    borderRadius: '50px',
    fontWeight: 700,
    fontSize: 'clamp(0.8rem, 1.2vw, 1.1rem)',
    color: '#FFEBC4',
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: '2px',
  },
  chipLetter: {
    fontWeight: 900,
    color: '#FFD58C',
  },
  emptyText: {
    color: '#9BAA9C',
    fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
    textAlign: 'center',
    padding: '12px',
    fontStyle: 'italic',
  },
  globalStyle: {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  } as React.CSSProperties,
};

function GlobalStyles() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { 
        overflow: hidden !important; 
        height: 100%;
        background: linear-gradient(145deg, #1A2F2A 0%, #0D231F 100%);
      }
    ` }} />
  );
}

export default function DisplayPage() {
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);

  useEffect(() => {
    const checkStorage = () => {
      const stored = localStorage.getItem('bingo_currentNumber');
      const storedHistory = localStorage.getItem('bingo_calledNumbers');

      if (stored && stored !== 'null' && stored !== 'undefined') {
        const num = parseInt(stored, 10);
        setCurrentNumber(!isNaN(num) ? num : null);
      } else {
        setCurrentNumber(null);
      }

      if (storedHistory && storedHistory !== '[]') {
        try {
          const parsed = JSON.parse(storedHistory);
          setCalledNumbers(Array.isArray(parsed) ? parsed : []);
        } catch {
          setCalledNumbers([]);
        }
      } else {
        setCalledNumbers([]);
      }
    };

    checkStorage();

    const interval = setInterval(checkStorage, 300);
    return () => clearInterval(interval);
  }, []);

  const isEmpty = currentNumber === null;

  return (
    <>
      <GlobalStyles />
      <div style={styles.container}>
        <div style={styles.ballWrapper}>
          <div
            style={{
              ...styles.ball,
              ...(isEmpty ? styles.ballEmpty : styles.ballNormal),
            }}
          >
            <span style={{ ...styles.ballText, ...(isEmpty ? styles.ballTextEmpty : {}) }}>
              {isEmpty ? '🎯' : formatBallText(currentNumber)}
            </span>
          </div>
        </div>

        <div style={styles.label}>NÚMERO CANTADO</div>

        <div style={styles.historyContainer}>
          <div style={styles.historyTitle}>HISTORIAL ({calledNumbers.length})</div>
          <div style={styles.historyChips}>
            {calledNumbers.length === 0 ? (
              <div style={styles.emptyText}>Sin números cantados</div>
            ) : (
              [...calledNumbers].reverse().map((num) => {
                const letter = getLetterByNumber(num);
                return (
                  <div key={num} style={styles.chip}>
                    <span style={styles.chipLetter}>{letter}</span>
                    <span>{num}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
