"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  MAZE_LAYOUT, 
  CELL_SIZE, 
  CANVAS_WIDTH, 
  CANVAS_HEIGHT,
  PACMAN_START,
  GHOST_STARTS,
  GAME_SPEED,
  GHOST_SPEED,
  isValidMove
} from '../lib/mazeData';

interface Position {
  x: number;
  y: number;
}

interface Ghost {
  x: number;
  y: number;
  direction: Position;
  color: string;
}

const PacManGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | undefined>(undefined);
  const lastMoveTimeRef = useRef<number>(0);
  const lastGhostMoveTimeRef = useRef<number>(0);
  
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [pellets, setPellets] = useState<Set<string>>(new Set());
  
  const pacmanRef = useRef<Position>({ x: PACMAN_START.x, y: PACMAN_START.y });
  const pacmanDirectionRef = useRef<Position>({ x: 0, y: 0 });
  const nextDirectionRef = useRef<Position>({ x: 0, y: 0 });
  const ghostsRef = useRef<Ghost[]>([
    { x: GHOST_STARTS[0].x, y: GHOST_STARTS[0].y, direction: { x: -1, y: 0 }, color: '#ef4444' },
    { x: GHOST_STARTS[1].x, y: GHOST_STARTS[1].y, direction: { x: 1, y: 0 }, color: '#3b82f6' },
    { x: GHOST_STARTS[2].x, y: GHOST_STARTS[2].y, direction: { x: 0, y: 1 }, color: '#10b981' },
    { x: GHOST_STARTS[3].x, y: GHOST_STARTS[3].y, direction: { x: 0, y: -1 }, color: '#f59e0b' }
  ]);

  // Initialize pellets
  useEffect(() => {
    const initialPellets = new Set<string>();
    for (let y = 0; y < MAZE_LAYOUT.length; y++) {
      for (let x = 0; x < MAZE_LAYOUT[y].length; x++) {
        if (MAZE_LAYOUT[y][x] === 0) {
          initialPellets.add(`${x},${y}`);
        }
      }
    }
    setPellets(initialPellets);
  }, []);

  const resetGame = useCallback(() => {
    pacmanRef.current = { x: PACMAN_START.x, y: PACMAN_START.y };
    pacmanDirectionRef.current = { x: 0, y: 0 };
    nextDirectionRef.current = { x: 0, y: 0 };
    ghostsRef.current = [
      { x: GHOST_STARTS[0].x, y: GHOST_STARTS[0].y, direction: { x: -1, y: 0 }, color: '#ef4444' },
      { x: GHOST_STARTS[1].x, y: GHOST_STARTS[1].y, direction: { x: 1, y: 0 }, color: '#3b82f6' },
      { x: GHOST_STARTS[2].x, y: GHOST_STARTS[2].y, direction: { x: 0, y: 1 }, color: '#10b981' },
      { x: GHOST_STARTS[3].x, y: GHOST_STARTS[3].y, direction: { x: 0, y: -1 }, color: '#f59e0b' }
    ];
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    
    const initialPellets = new Set<string>();
    for (let y = 0; y < MAZE_LAYOUT.length; y++) {
      for (let x = 0; x < MAZE_LAYOUT[y].length; x++) {
        if (MAZE_LAYOUT[y][x] === 0) {
          initialPellets.add(`${x},${y}`);
        }
      }
    }
    setPellets(initialPellets);
  }, []);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameOver || gameWon) {
      if (e.key === ' ') {
        resetGame();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
        nextDirectionRef.current = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
        nextDirectionRef.current = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
        nextDirectionRef.current = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
        nextDirectionRef.current = { x: 1, y: 0 };
        break;
    }
  }, [gameOver, gameWon, resetGame]);

  const moveGhosts = useCallback(() => {
    ghostsRef.current = ghostsRef.current.map(ghost => {
      const directions = [
        { x: 0, y: -1 }, // up
        { x: 0, y: 1 },  // down
        { x: -1, y: 0 }, // left
        { x: 1, y: 0 }   // right
      ];

      // Try to continue in current direction
      let newX = ghost.x + ghost.direction.x;
      let newY = ghost.y + ghost.direction.y;

      if (!isValidMove(newX, newY)) {
        // Choose a random valid direction
        const validDirections = directions.filter(dir => 
          isValidMove(ghost.x + dir.x, ghost.y + dir.y)
        );
        
        if (validDirections.length > 0) {
          const randomDir = validDirections[Math.floor(Math.random() * validDirections.length)];
          ghost.direction = randomDir;
          newX = ghost.x + randomDir.x;
          newY = ghost.y + randomDir.y;
        } else {
          // Stay in place if no valid moves
          newX = ghost.x;
          newY = ghost.y;
        }
      }

      return { ...ghost, x: newX, y: newY };
    });
  }, []);

  const checkCollisions = useCallback(() => {
    const pacman = pacmanRef.current;
    
    // Check ghost collisions
    for (const ghost of ghostsRef.current) {
      if (ghost.x === pacman.x && ghost.y === pacman.y) {
        setGameOver(true);
        return;
      }
    }

    // Check pellet collection
    const pelletKey = `${pacman.x},${pacman.y}`;
    if (pellets.has(pelletKey)) {
      setPellets(prev => {
        const newPellets = new Set(prev);
        newPellets.delete(pelletKey);
        return newPellets;
      });
      setScore(prev => prev + 10);
    }
  }, [pellets]);

  const updateGame = useCallback((currentTime: number) => {
    if (gameOver || gameWon) return;

    // Move Pac-Man
    if (currentTime - lastMoveTimeRef.current > GAME_SPEED) {
      const pacman = pacmanRef.current;
      
      // Try to change direction if requested
      if (nextDirectionRef.current.x !== 0 || nextDirectionRef.current.y !== 0) {
        const nextX = pacman.x + nextDirectionRef.current.x;
        const nextY = pacman.y + nextDirectionRef.current.y;
        
        if (isValidMove(nextX, nextY)) {
          pacmanDirectionRef.current = { ...nextDirectionRef.current };
          nextDirectionRef.current = { x: 0, y: 0 };
        }
      }

      // Move in current direction
      if (pacmanDirectionRef.current.x !== 0 || pacmanDirectionRef.current.y !== 0) {
        const newX = pacman.x + pacmanDirectionRef.current.x;
        const newY = pacman.y + pacmanDirectionRef.current.y;
        
        if (isValidMove(newX, newY)) {
          pacmanRef.current = { x: newX, y: newY };
        } else {
          pacmanDirectionRef.current = { x: 0, y: 0 };
        }
      }

      lastMoveTimeRef.current = currentTime;
      checkCollisions();
    }

    // Move ghosts
    if (currentTime - lastGhostMoveTimeRef.current > GHOST_SPEED) {
      moveGhosts();
      lastGhostMoveTimeRef.current = currentTime;
      checkCollisions();
    }

    // Check win condition
    if (pellets.size === 0) {
      setGameWon(true);
    }
  }, [gameOver, gameWon, checkCollisions, moveGhosts, pellets.size]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw maze with Google Pac-Man style
    for (let y = 0; y < MAZE_LAYOUT.length; y++) {
      for (let x = 0; x < MAZE_LAYOUT[y].length; x++) {
        if (MAZE_LAYOUT[y][x] === 1) {
          // Blue walls like Google Pac-Man
          ctx.fillStyle = '#0066cc';
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          
          // Add border effect
          ctx.strokeStyle = '#0088ff';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }
    }

    // Draw pellets
    ctx.fillStyle = '#ffff00';
    pellets.forEach(pelletKey => {
      const [x, y] = pelletKey.split(',').map(Number);
      ctx.beginPath();
      ctx.arc(
        x * CELL_SIZE + CELL_SIZE / 2,
        y * CELL_SIZE + CELL_SIZE / 2,
        2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });

    // Draw Diamond Character (replacing Pac-Man)
    const pacman = pacmanRef.current;
    const centerX = pacman.x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = pacman.y * CELL_SIZE + CELL_SIZE / 2;
    const size = CELL_SIZE / 2 - 2;

    // Draw diamond shape with gradient
    const gradient = ctx.createLinearGradient(centerX - size, centerY - size, centerX + size, centerY + size);
    gradient.addColorStop(0, '#8bb5f7');
    gradient.addColorStop(0.5, '#6ba3f5');
    gradient.addColorStop(1, '#4a90e2');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - size); // Top point
    ctx.lineTo(centerX + size * 0.7, centerY); // Right point
    ctx.lineTo(centerX, centerY + size); // Bottom point
    ctx.lineTo(centerX - size * 0.7, centerY); // Left point
    ctx.closePath();
    ctx.fill();

    // Draw the face - eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(centerX - size * 0.3, centerY - size * 0.3, size * 0.15, size * 0.25); // Left eye
    ctx.fillRect(centerX + size * 0.15, centerY - size * 0.3, size * 0.15, size * 0.25); // Right eye

    // Draw the face - smile
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY + size * 0.1, size * 0.3, 0, Math.PI);
    ctx.stroke();

    // Draw the vertical line through the middle
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - size * 0.8);
    ctx.lineTo(centerX, centerY + size * 0.8);
    ctx.stroke();

    // Draw ghosts
    ghostsRef.current.forEach(ghost => {
      ctx.fillStyle = ghost.color;
      ctx.beginPath();
      ctx.arc(
        ghost.x * CELL_SIZE + CELL_SIZE / 2,
        ghost.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2 - 1,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });

    // Draw game over or win message
    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
      ctx.font = '16px sans-serif';
      ctx.fillText('Press SPACE to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
    } else if (gameWon) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('YOU WIN!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
      ctx.font = '16px sans-serif';
      ctx.fillText('Press SPACE to play again', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
    }
  }, [gameOver, gameWon, pellets]);

  const gameLoop = useCallback((currentTime: number) => {
    updateGame(currentTime);
    render();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [updateGame, render]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [handleKeyPress, gameLoop]);

  return (
    <div className="flex flex-col items-center p-4 bg-gray-900 min-h-screen">
      <div className="mb-6 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent mb-2">
          EthOS Pac-Man Labyrinth
        </h1>
        <p className="text-gray-300 mb-4 text-lg">Navigate through the EthOS maze and collect all pellets!</p>
        <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Score: {score}
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-4 border-blue-500 bg-black shadow-2xl shadow-blue-500/20"
      />
      
      <div className="mt-6 text-center text-gray-300 max-w-md">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="mb-2 text-blue-300">🎮 Use arrow keys to move the diamond character</p>
          <p className="mb-2 text-yellow-300">⭐ Collect all yellow pellets to win!</p>
          <p className="text-sm text-red-300">👻 Avoid the four colored ghosts</p>
          {(gameOver || gameWon) && (
            <p className="mt-4 text-lg font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Press SPACE to restart
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PacManGame;
