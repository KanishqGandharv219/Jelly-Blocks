import React from 'react';
import { BoardState, BOARD_WIDTH, BOARD_HEIGHT } from '../game/useTetris';
import { Tetromino } from '../game/tetrominoes';
import { motion } from 'motion/react';

interface BoardProps {
  board: BoardState;
  piece: { tetromino: Tetromino; x: number; y: number } | null;
  lockedCells: {x: number, y: number}[];
}

export const Board: React.FC<BoardProps> = ({ board, piece, lockedCells }) => {
  const renderBoard = board.map(row => [...row]);
  
  if (piece) {
    piece.tetromino.shape.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          const y = piece.y + r;
          const x = piece.x + c;
          if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
            renderBoard[y][x] = piece.tetromino;
          }
        }
      });
    });
  }

  return (
    <div 
      className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-1"
      style={{
        width: '100%',
        maxWidth: '320px',
        aspectRatio: `${BOARD_WIDTH} / ${BOARD_HEIGHT}`,
        display: 'grid',
        gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`,
        gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
        gap: '2px',
      }}
    >
      {renderBoard.map((row, y) =>
        row.map((cell, x) => {
          const isJustLocked = lockedCells.some(lc => lc.x === x && lc.y === y);
          const isCurrentPiece = piece && 
            y >= piece.y && y < piece.y + piece.tetromino.shape.length &&
            x >= piece.x && x < piece.x + piece.tetromino.shape[0].length &&
            piece.tetromino.shape[y - piece.y][x - piece.x];

          return (
            <div key={`${y}-${x}`} className="relative w-full h-full rounded-sm overflow-hidden">
              {cell && (
                <motion.div
                  initial={isJustLocked ? { scale: 1.3, y: 5 } : false}
                  animate={isJustLocked ? { scale: 1, y: 0 } : false}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className={`absolute inset-0 jelly-block bg-gradient-to-br ${cell.color} ${isCurrentPiece ? 'animate-wobble' : ''}`}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
