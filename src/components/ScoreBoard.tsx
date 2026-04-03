import React from 'react';

interface ScoreBoardProps {
  score: number;
  lines: number;
  level: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, lines, level }) => {
  return (
    <div className="flex flex-col gap-4 w-24">
      <div className="glass-panel p-3 rounded-xl flex flex-col items-center">
        <div className="text-[10px] text-white/70 uppercase tracking-widest font-semibold">Score</div>
        <div className="font-mono text-xl font-bold text-white drop-shadow-md">{score}</div>
      </div>
      <div className="glass-panel p-3 rounded-xl flex flex-col items-center">
        <div className="text-[10px] text-white/70 uppercase tracking-widest font-semibold">Lines</div>
        <div className="font-mono text-xl font-bold text-white drop-shadow-md">{lines}</div>
      </div>
      <div className="glass-panel p-3 rounded-xl flex flex-col items-center">
        <div className="text-[10px] text-white/70 uppercase tracking-widest font-semibold">Level</div>
        <div className="font-mono text-xl font-bold text-white drop-shadow-md">{level}</div>
      </div>
    </div>
  );
};
