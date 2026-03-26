'use client';

import { useState, useCallback } from 'react';

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

export default function Home() {
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState('✨ Selecciona una bola del tablero');

  const selectBall = useCallback((number: number) => {
    if (number < 1 || number > 75) return;

    const isAlreadyCalled = calledNumbers.includes(number);

    if (isAlreadyCalled) {
      setCurrentNumber(number);
      const letter = getLetterByNumber(number);
      setStatusMessage(`⚠️ ¡${letter}${number} ya fue cantada! No se repite.`);
      
      setTimeout(() => {
        setStatusMessage((prev) => {
          if (prev.includes('ya fue cantada')) {
            return calledNumbers.length > 0 
              ? `🎤 Última bola: ${formatBallText(calledNumbers[calledNumbers.length - 1])}`
              : '✨ Selecciona una bola del tablero';
          }
          return prev;
        });
      }, 1800);
      return;
    }

    const newCalledNumbers = [...calledNumbers, number];
    setCalledNumbers(newCalledNumbers);
    setCurrentNumber(number);

    const formattedNew = formatBallText(number);
    setStatusMessage(`✅ ¡CANTADA! ${formattedNew} · Agregada al historial`);
    
    localStorage.setItem('bingo_currentNumber', number.toString());
    localStorage.setItem('bingo_lastUpdate', Date.now().toString());
    localStorage.setItem('bingo_calledNumbers', JSON.stringify(newCalledNumbers));

    setTimeout(() => {
      setStatusMessage(`🎤 Última bola: ${formatBallText(number)}`);
    }, 2000);
  }, [calledNumbers]);

  const selectRandomBall = useCallback(() => {
    const allNumbers = Array.from({ length: 75 }, (_, i) => i + 1);
    const available = allNumbers.filter(num => !calledNumbers.includes(num));

    if (available.length === 0) {
      setStatusMessage('🏆 ¡BINGO COMPLETO! Todas las bolas (1-75) han sido cantadas. Reinicia para nueva partida.');
      alert('🎉 ¡JUEGO COMPLETADO! Has cantado todas las bolas del 1 al 75. Presiona "Nuevo Juego" para seguir.');
      return;
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    const chosen = available[randomIndex];
    selectBall(chosen);
  }, [calledNumbers, selectBall]);

  const resetGame = useCallback(() => {
    setCalledNumbers([]);
    setCurrentNumber(null);
    setStatusMessage('🔄 Juego reiniciado · Todas las bolas están disponibles nuevamente');
    localStorage.removeItem('bingo_currentNumber');
    localStorage.removeItem('bingo_lastUpdate');
    localStorage.removeItem('bingo_calledNumbers');
  }, []);

  return (
    <div className="app-container">
      <div className="bingo-card">
        <div className="main-display">
          <div className="display-glow"></div>
          <div className="display-label">🎯 BOLA ACTUAL</div>
          <div className="bingo-ball-display">
            <div className="ball-unified" id="mainBall">
              <span className="ball-text">{formatBallText(currentNumber)}</span>
            </div>
          </div>
          <div className="last-call-modern">{statusMessage}</div>
        </div>

        <div className="dashboard">
          <div className="balls-selector">
            <div className="section-title">
              <span>🎰</span> BOLAS B·I·N·G·O
            </div>
            <div className="balls-grid">
              {Array.from({ length: 75 }, (_, i) => i + 1).map((num) => {
                const letter = getLetterByNumber(num);
                const isCalled = calledNumbers.includes(num);
                const isCurrent = currentNumber === num;

                return (
                  <div
                    key={num}
                    className={`ball-item ${isCalled ? 'called' : ''} ${isCurrent && !isCalled ? 'current-active' : ''}`}
                    onClick={() => selectBall(num)}
                  >
                    <span className="letter-prefix">{letter}</span>
                    <span className="number-suffix">{num}</span>
                  </div>
                );
              })}
            </div>
            <div className="btn-group">
              <button className="btn-modern btn-primary-modern" onClick={selectRandomBall}>
                🎲 BOLA ALEATORIA
              </button>
              <button className="btn-modern btn-secondary-modern" onClick={resetGame}>
                🔄 NUEVO JUEGO
              </button>
              <button className="btn-modern btn-display-modern" onClick={() => window.open('/display', '_blank', 'width=600,height=700')}>
                📺 ABRIR PANTALLA
              </button>
            </div>
            <p style={{ fontSize: '0.7rem', marginTop: '16px', color: '#AB8E64', textAlign: 'center', letterSpacing: '0.3px' }}>
              B (1-15) · I (16-30) · N (31-45) · G (46-60) · O (61-75)
            </p>
          </div>

          <div className="history-panel">
            <div className="section-title" style={{ marginBottom: '12px' }}>
              <span>📋</span> HISTORIAL
            </div>
            <div className="stats-modern">
              <div style={{ fontWeight: 600 }}>🎲 TOTAL CANTADAS</div>
              <div className="stats-number">{calledNumbers.length}</div>
            </div>
            <div className="history-scroll">
              {calledNumbers.length === 0 ? (
                <div className="empty-history-modern">📭 Aún no hay bolas cantadas</div>
              ) : (
                calledNumbers.map((num) => {
                  const letter = getLetterByNumber(num);
                  return (
                    <div key={num} className="history-chip">
                      <span>{letter}</span>
                      <span>{num}</span>
                    </div>
                  );
                })
              )}
            </div>
            <div className="last-ball-info">
              🧩 Última bola: <strong>{formatBallText(calledNumbers[calledNumbers.length - 1] || null)}</strong>
            </div>
          </div>
        </div>
        <footer>
          BINGO PRO | Gestor profesional con letra y número integrados | Haz clic en cualquier bola para cantar
        </footer>
      </div>
    </div>
  );
}