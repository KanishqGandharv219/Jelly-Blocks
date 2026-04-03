import React, { useMemo, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { BoardState, BOARD_WIDTH, BOARD_HEIGHT } from "../game/useTetris";
import { Tetromino } from "../game/tetrominoes";
import { JellyBlock } from "./JellyBlock";

interface Board3DProps {
  board: BoardState;
  piece: { tetromino: Tetromino; x: number; y: number } | null;
  lockedCells: { x: number; y: number }[];
}

const GameScene: React.FC<Board3DProps> = ({ board, piece, lockedCells }) => {
  // Center the board
  const offsetX = -BOARD_WIDTH / 2 + 0.5;
  const offsetY = BOARD_HEIGHT / 2 - 0.5;

  const [impacts, setImpacts] = useState<Record<string, number>>({});

  // Trigger impact on locked cells
  useEffect(() => {
    if (lockedCells.length > 0) {
      const newImpacts = { ...impacts };
      lockedCells.forEach((lc) => {
        newImpacts[`${lc.x}-${lc.y}`] = 1.0; // Max impact
      });
      setImpacts(newImpacts);
    }
  }, [lockedCells]);

  // Render static board blocks
  const staticBlocks = useMemo(() => {
    const blocks: React.ReactNode[] = [];
    board.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const impact = impacts[`${x}-${y}`] || 0;
          blocks.push(
            <JellyBlock
              key={`static-${x}-${y}`}
              position={[x + offsetX, offsetY - y, 0]}
              color={cell.hex}
              impact={impact}
            />,
          );
        }
      });
    });
    return blocks;
  }, [board, impacts, offsetX, offsetY]);

  // Render falling piece blocks
  const fallingBlocks = useMemo(() => {
    const blocks: React.ReactNode[] = [];
    if (piece) {
      piece.tetromino.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell) {
            const x = piece.x + c;
            const y = piece.y + r;
            // Only render if it's within the board
            if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
              blocks.push(
                <JellyBlock
                  key={`falling-${x}-${y}`}
                  position={[x + offsetX, offsetY - y, 0]}
                  color={piece.tetromino.hex}
                  impact={0.2} // Constant slight wobble while falling
                />,
              );
            }
          }
        });
      });
    }
    return blocks;
  }, [piece, offsetX, offsetY]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <Environment preset="city" resolution={256} />

      {/* Board Bounds (Optional visual guide) */}
      <mesh position={[0, 0, -0.6]}>
        <planeGeometry args={[BOARD_WIDTH, BOARD_HEIGHT]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
      </mesh>

      {/* Blocks */}
      <group>
        {staticBlocks}
        {fallingBlocks}
      </group>

      {/* Blob Shadow underneath */}
      <ContactShadows
        position={[0, -BOARD_HEIGHT / 2, 0]}
        opacity={0.5}
        scale={20}
        blur={2}
        far={10}
        resolution={256}
        frames={1}
      />
    </>
  );
};

export const Board3D: React.FC<Board3DProps> = (props) => {
  return (
    <div className="w-full h-full max-w-[400px] max-h-[800px] aspect-[10/20] relative rounded-2xl overflow-hidden glass-panel">
      <Canvas camera={{ position: [0, 0, 22], fov: 50 }} dpr={[1, 1.5]}>
        <GameScene {...props} />
      </Canvas>
    </div>
  );
};
