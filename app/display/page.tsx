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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(145deg, #1A2F2A 0%, #0D231F 100%)',
    padding: 'clamp(20px, 4vw, 60px)',
    gap: 'clamp(30px, 5vw, 80px)',
    boxSizing: 'border-box',
  },
  leftSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 auto',
  },
  ball: {
    width: 'clamp(320px, 40vw, 500px)',
    height: 'clamp(320px, 40vw, 500px)',
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
    fontSize: 'clamp(4rem, 10vw, 8rem)',
    fontWeight: 900,
    fontFamily: '"Inter", monospace',
    letterSpacing: '2px',
    color: '#3B2A1A',
    textShadow: '0 4px 8px rgba(255, 215, 120, 0.6)',
  },
  ballTextEmpty: {
    fontSize: 'clamp(3rem, 8vw, 6rem)',
    color: 'rgba(255, 215, 140, 0.4)',
    textShadow: 'none',
  },
  label: {
    fontSize: 'clamp(1rem, 2vw, 1.8rem)',
    textTransform: 'uppercase',
    letterSpacing: 'clamp(4px, 1vw, 8px)',
    fontWeight: 700,
    color: '#E8C88C',
    background: 'rgba(0, 0, 0, 0.5)',
    padding: 'clamp(10px, 2vw, 16px) clamp(20px, 4vw, 40px)',
    borderRadius: '60px',
    backdropFilter: 'blur(8px)',
    marginTop: 'clamp(16px, 3vw, 32px)',
  },
  rightSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: '1 1 auto',
    width: '100%',
  },
  historyTitle: {
    fontSize: 'clamp(1.2rem, 2.5vw, 2rem)',
    fontWeight: 700,
    color: '#E8C88C',
    textAlign: 'left',
    marginBottom: 'clamp(12px, 2vw, 20px)',
    letterSpacing: '3px',
    textTransform: 'uppercase',
  },
  historyContainer: {
    width: '100%',
    background: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 'clamp(20px, 3vw, 32px)',
    padding: 'clamp(20px, 3vw, 36px)',
    border: '1px solid rgba(232, 200, 140, 0.2)',
    maxHeight: 'clamp(400px, 70vh, 700px)',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  historyTable: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'clamp(16px, 2.5vw, 28px)',
  },
  chip: {
    background: 'linear-gradient(145deg, #3D5B4F, #2F4B3F)',
    padding: 'clamp(24px, 4vw, 40px) clamp(32px, 5vw, 56px)',
    borderRadius: '50px',
    fontWeight: 700,
    fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
    color: '#FFEBC4',
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: 'clamp(8px, 1.5vw, 14px)',
    justifyContent: 'center',
  },
  chipLetter: {
    fontWeight: 900,
    color: '#FFD58C',
    fontSize: 'clamp(2rem, 4vw, 3.4rem)',
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
        <div style={styles.leftSection}>
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
          <div style={styles.label}>NÚMERO CANTADO</div>
        </div>

        <div style={styles.rightSection}>
          <div style={styles.historyTitle}>HISTORIAL ({calledNumbers.length})</div>
          <div style={styles.historyContainer}>
            <div style={styles.historyTable}>
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
      </div>
    </>
  );
}
