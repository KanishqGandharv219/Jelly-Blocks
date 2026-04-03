import { useState, useCallback } from "react";
import { TETROMINOES, randomTetromino, Tetromino } from "./tetrominoes";
import { useInterval } from "./useInterval";

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export type BoardCell = Tetromino | null;
export type BoardState = BoardCell[][];

export const createEmptyBoard = (): BoardState =>
  Array.from(Array(BOARD_HEIGHT), () => Array(BOARD_WIDTH).fill(null));

export const checkCollision = (
  piece: Tetromino,
  x: number,
  y: number,
  board: BoardState,
) => {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c]) {
        const newY = y + r;
        const newX = x + c;
        if (
          newY >= BOARD_HEIGHT ||
          newX < 0 ||
          newX >= BOARD_WIDTH ||
          (newY >= 0 && board[newY][newX] !== null)
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

export const useTetris = () => {
  const [board, setBoard] = useState<BoardState>(createEmptyBoard());
  const [piece, setPiece] = useState<{
    tetromino: Tetromino;
    x: number;
    y: number;
  } | null>(null);
  const [nextPiece, setNextPiece] = useState<Tetromino>(randomTetromino());
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lockedCells, setLockedCells] = useState<{ x: number; y: number }[]>(
    [],
  );

  const dropTime = isPlaying ? Math.max(100, 800 - (level - 1) * 50) : null;

  const startGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setPiece({ tetromino: randomTetromino(), x: 3, y: -2 });
    setNextPiece(randomTetromino());
    setIsGameOver(false);
    setScore(0);
    setLines(0);
    setLevel(1);
    setIsPlaying(true);
    setLockedCells([]);
  }, []);

  const lockPiece = useCallback(
    (currentPiece = piece) => {
      if (!currentPiece) return;

      const newBoard = board.map((row) => [...row]);
      let gameOver = false;
      const newlyLocked: { x: number; y: number }[] = [];

      currentPiece.tetromino.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell) {
            if (currentPiece.y + r < 0) {
              gameOver = true;
            } else {
              newBoard[currentPiece.y + r][currentPiece.x + c] =
                currentPiece.tetromino;
              newlyLocked.push({
                x: currentPiece.x + c,
                y: currentPiece.y + r,
              });
            }
          }
        });
      });

      if (gameOver) {
        setIsGameOver(true);
        setIsPlaying(false);
        return;
      }

      let linesCleared = 0;
      const finalBoard = newBoard.filter((row) => {
        const isLineFull = row.every((cell) => cell !== null);
        if (isLineFull) linesCleared++;
        return !isLineFull;
      });

      let nextBoard = newBoard;
      if (linesCleared > 0) {
        const newEmptyRows = Array.from(Array(linesCleared), () =>
          Array(BOARD_WIDTH).fill(null),
        );
        nextBoard = [...newEmptyRows, ...finalBoard];
        setBoard(nextBoard);
        setScore(
          (prev) => prev + [0, 100, 300, 500, 800][linesCleared] * level,
        );
        setLines((prev) => {
          const newLines = prev + linesCleared;
          setLevel(Math.floor(newLines / 10) + 1);
          return newLines;
        });
      } else {
        setBoard(nextBoard);
      }

      setLockedCells(newlyLocked);
      setTimeout(() => setLockedCells([]), 300);

      const nextSpawn = { tetromino: nextPiece, x: 3, y: -2 };
      if (
        checkCollision(nextSpawn.tetromino, nextSpawn.x, nextSpawn.y, nextBoard)
      ) {
        setIsGameOver(true);
        setIsPlaying(false);
      }

      setPiece(nextSpawn);
      setNextPiece(randomTetromino());
    },
    [board, piece, nextPiece, level],
  );

  const movePiece = useCallback(
    (dx: number, dy: number) => {
      if (!piece || isGameOver || !isPlaying) return false;

      if (!checkCollision(piece.tetromino, piece.x + dx, piece.y + dy, board)) {
        setPiece({ ...piece, x: piece.x + dx, y: piece.y + dy });
        return true;
      } else if (dy > 0) {
        lockPiece();
      }
      return false;
    },
    [piece, board, isGameOver, isPlaying, lockPiece],
  );

  const rotatePiece = useCallback(() => {
    if (!piece || isGameOver || !isPlaying) return;

    const rotatedShape = piece.tetromino.shape[0].map((_, index) =>
      piece.tetromino.shape.map((row) => row[index]).reverse(),
    );

    const rotatedPiece = { ...piece.tetromino, shape: rotatedShape };

    let newX = piece.x;
    if (checkCollision(rotatedPiece, newX, piece.y, board)) {
      newX += 1;
      if (checkCollision(rotatedPiece, newX, piece.y, board)) {
        newX -= 2;
        if (checkCollision(rotatedPiece, newX, piece.y, board)) {
          return;
        }
      }
    }

    setPiece({ ...piece, tetromino: rotatedPiece, x: newX });
  }, [piece, board, isGameOver, isPlaying]);

  const hardDrop = useCallback(() => {
    if (!piece || isGameOver || !isPlaying) return;
    let newY = piece.y;
    while (!checkCollision(piece.tetromino, piece.x, newY + 1, board)) {
      newY += 1;
    }
    lockPiece({ ...piece, y: newY });
  }, [piece, board, isGameOver, isPlaying, lockPiece]);

  useInterval(() => {
    movePiece(0, 1);
  }, dropTime);

  return {
    board,
    piece,
    nextPiece,
    isGameOver,
    score,
    lines,
    level,
    isPlaying,
    startGame,
    movePiece,
    rotatePiece,
    hardDrop,
    lockedCells,
  };
};
