import React, { useEffect, useCallback } from "react";
import { useTetris } from "./game/useTetris";
import { Board3D } from "./components/Board3D";
import { NextPiece } from "./components/NextPiece";
import { Controls } from "./components/Controls";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const {
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
  } = useTetris();

  // Keyboard controls
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isPlaying || isGameOver) return;
      switch (e.key) {
        case "ArrowLeft":
          movePiece(-1, 0);
          break;
        case "ArrowRight":
          movePiece(1, 0);
          break;
        case "ArrowDown":
          movePiece(0, 1);
          break;
        case "ArrowUp":
          rotatePiece();
          break;
        case " ":
          hardDrop();
          break;
      }
    },
    [isPlaying, isGameOver, movePiece, rotatePiece, hardDrop],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="h-[100dvh] w-screen bg-[#f8f9fa] overflow-hidden relative font-sans text-gray-800 flex flex-col items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-cyan-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="z-10 w-full max-w-md flex flex-col items-center h-full max-h-[900px]">
        {/* Header */}
        <div className="w-full flex justify-between items-end mb-4 px-2 shrink-0">
          <div>
            <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-500 drop-shadow-sm">
              JELLY
            </h1>
            <h1 className="text-4xl font-black tracking-tighter text-gray-800 -mt-2">
              BLOCKS
            </h1>
          </div>
          <div className="flex gap-4">
            <div className="glass-panel px-4 py-2 rounded-xl text-right">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                Score
              </div>
              <div className="text-xl font-mono font-bold text-cyan-600">
                {score}
              </div>
            </div>
            <div className="glass-panel px-4 py-2 rounded-xl text-right">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                Level
              </div>
              <div className="text-xl font-mono font-bold text-pink-600">
                {level}
              </div>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex gap-4 items-start justify-center w-full flex-1 min-h-0">
          <Board3D board={board} piece={piece} lockedCells={lockedCells} />
          <div className="flex flex-col gap-4 shrink-0">
            <NextPiece tetromino={nextPiece} />
            <div className="glass-panel p-3 rounded-xl flex flex-col items-center justify-center">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">
                Lines
              </div>
              <div className="text-lg font-mono font-bold text-gray-800">
                {lines}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="shrink-0 w-full mt-4">
          <Controls
            onMoveLeft={() => movePiece(-1, 0)}
            onMoveRight={() => movePiece(1, 0)}
            onMoveDown={() => movePiece(0, 1)}
            onRotate={rotatePiece}
            onHardDrop={hardDrop}
          />
        </div>

        {/* Overlays */}
        <AnimatePresence>
          {(!isPlaying || isGameOver) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            >
              <div className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center max-w-[300px]">
                <h2 className="text-3xl font-black mb-2 text-gray-800">
                  {isGameOver ? "GAME OVER" : "READY?"}
                </h2>
                {isGameOver && (
                  <p className="text-gray-600 mb-6">
                    Final Score:{" "}
                    <span className="text-cyan-600 font-bold">{score}</span>
                  </p>
                )}
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-pink-500/30 transition-all active:scale-95 w-full text-lg tracking-wide"
                >
                  {isGameOver ? "PLAY AGAIN" : "START GAME"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
