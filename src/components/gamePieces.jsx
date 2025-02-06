import { useEffect, useRef, useState } from 'react';

const GamePieces = ({ score, setScore, onGameOver }) => {
  const canvasRef = useRef();
  const SNAKE_SPEED = 10;
  const TILE_SIZE = SNAKE_SPEED;
  const [apple, setApple] = useState({ x: 180, y: 100 });
  const [snake, setSnake] = useState([
    { x: 100, y: 50 },
    { x: 90, y: 50 },
  ]);
  const [direction, setDirection] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * 0.8;
      canvas.height = window.innerHeight * 0.8;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const drawGrid = (ctx, canvas) => {
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= canvas.width; x += TILE_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += TILE_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  const getRandomPosition = () => {
    return {
      x:
        Math.floor((Math.random() * (window.innerWidth * 0.8)) / TILE_SIZE) *
        TILE_SIZE,
      y:
        Math.floor((Math.random() * (window.innerHeight * 0.8)) / TILE_SIZE) *
        TILE_SIZE,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawSnake = () => {
      snake.forEach((segment) => {
        ctx.fillStyle = '#99EE90';
        ctx.fillRect(segment.x, segment.y, TILE_SIZE, TILE_SIZE);
      });
    };

    const drawApple = () => {
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(apple.x, apple.y, TILE_SIZE, TILE_SIZE);
    };

    const moveSnake = () => {
      if (!direction) return;

      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const snakeHead = { x: newSnake[0].x, y: newSnake[0].y };

        for (let i = newSnake.length - 1; i > 0; i--) {
          newSnake[i] = { ...newSnake[i - 1] };
        }

        switch (direction) {
          case 'right':
            snakeHead.x += TILE_SIZE;
            break;
          case 'left':
            snakeHead.x -= TILE_SIZE;
            break;
          case 'up':
            snakeHead.y -= TILE_SIZE;
            break;
          case 'down':
            snakeHead.y += TILE_SIZE;
            break;
          default:
            break;
        }

        // Check for wall collision
        if (
          snakeHead.x < 0 ||
          snakeHead.x >= canvas.width ||
          snakeHead.y < 0 ||
          snakeHead.y >= canvas.height
        ) {
          onGameOver();
          return [
            { x: 100, y: 50 },
            { x: 90, y: 50 },
          ];
        }

        // Check for apple collision
        if (snakeHead.x === apple.x && snakeHead.y === apple.y) {
          setScore(score + 1);
          newSnake.push({}); // Increase snake size
          setApple(getRandomPosition());
        }

        newSnake[0] = snakeHead;
        return newSnake;
      });
    };

    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowRight':
          if (direction !== 'left') setDirection('right');
          break;
        case 'ArrowLeft':
          if (direction !== 'right') setDirection('left');
          break;
        case 'ArrowUp':
          if (direction !== 'down') setDirection('up');
          break;
        case 'ArrowDown':
          if (direction !== 'up') setDirection('down');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    const interval = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid(ctx, canvas);
      drawSnake();
      drawApple();
      moveSnake();
    }, 100);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [snake, direction]);

  return <canvas className='game-canvas' ref={canvasRef} />;
};

export default GamePieces;
