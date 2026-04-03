import React from "react";
import { Canvas } from "@react-three/fiber";
import { Tetromino } from "../game/tetrominoes";
import { JellyBlock } from "./JellyBlock";
import { OrbitControls, Environment } from "@react-three/drei";

export const NextPiece: React.FC<{ tetromino: Tetromino }> = ({
  tetromino,
}) => {
  const width = tetromino.shape[0].length;
  const height = tetromino.shape.length;

  const offsetX = -width / 2 + 0.5;
  const offsetY = height / 2 - 0.5;

  return (
    <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center w-28 h-28">
      <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">
        Next
      </div>
      <div className="w-full h-full relative">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <Environment preset="city" />
          <group position={[0, 0, 0]}>
            {tetromino.shape.map((row, r) =>
              row.map((cell, c) => {
                if (cell) {
                  return (
                    <JellyBlock
                      key={`${r}-${c}`}
                      position={[c + offsetX, offsetY - r, 0]}
                      color={tetromino.hex}
                      impact={0}
                    />
                  );
                }
                return null;
              }),
            )}
          </group>
        </Canvas>
      </div>
    </div>
  );
};
