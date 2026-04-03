export type Tetromino = {
  shape: number[][];
  color: string;
  hex: string;
};

export const TETROMINOES: Record<string, Tetromino> = {
  I: { shape: [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]], color: 'from-cyan-400 to-cyan-600 shadow-cyan-500/50', hex: '#22d3ee' },
  J: { shape: [[1,0,0], [1,1,1], [0,0,0]], color: 'from-blue-400 to-blue-600 shadow-blue-500/50', hex: '#3b82f6' },
  L: { shape: [[0,0,1], [1,1,1], [0,0,0]], color: 'from-orange-400 to-orange-600 shadow-orange-500/50', hex: '#f97316' },
  O: { shape: [[1,1], [1,1]], color: 'from-yellow-400 to-yellow-600 shadow-yellow-500/50', hex: '#eab308' },
  S: { shape: [[0,1,1], [1,1,0], [0,0,0]], color: 'from-green-400 to-green-600 shadow-green-500/50', hex: '#22c55e' },
  T: { shape: [[0,1,0], [1,1,1], [0,0,0]], color: 'from-purple-400 to-purple-600 shadow-purple-500/50', hex: '#a855f7' },
  Z: { shape: [[1,1,0], [0,1,1], [0,0,0]], color: 'from-red-400 to-red-600 shadow-red-500/50', hex: '#ef4444' }
};

export const randomTetromino = (): Tetromino => {
  const keys = Object.keys(TETROMINOES);
  const randKey = keys[Math.floor(Math.random() * keys.length)];
  return TETROMINOES[randKey];
};

