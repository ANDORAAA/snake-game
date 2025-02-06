import { useEffect, useState } from 'react';
import GamePieces from './gamePieces';

const GameState = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('highScore')) || 0
  );
  const [gameOver, setGameOver] = useState(false);
  const [collisionType, setCollisionType] = useState('');

  const handleGameover = (type) => {
    setGameOver(true);

    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('highScore', score.toString());
    }

    setCollisionType(type);
  };

  const handleResetGame = () => {
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver && e.key === 'Enter') {
        handleResetGame();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
  }, [gameOver]);

  return (
    <div>
      <p>Score: {score}</p>
      <p>High Score: {highScore}</p>
      {gameOver && (
        <div className='game-over'>
          <p>
            Game Over!{' '}
            {collisionType === 'wall'
              ? 'You hit the wall!'
              : 'You ate yourself!'}
          </p>
          <p>Please press Enter to restart the game!</p>
        </div>
      )}
      {!gameOver && (
        <GamePieces
          score={score}
          setScore={setScore}
          onGameOver={(type) => handleGameover(type)}
        />
      )}
    </div>
  );
};

export default GameState;
