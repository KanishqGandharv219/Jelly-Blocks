import React, { useEffect, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  RotateCw,
  ChevronsDown,
} from "lucide-react";

interface ControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotate,
  onHardDrop,
}) => {
  const btnClass =
    "glass-panel p-4 rounded-2xl active:scale-95 transition-transform flex items-center justify-center text-gray-700 hover:bg-white/50 active:bg-white/80 touch-manipulation select-none";

  // Prevent default touch behavior on buttons to avoid zooming/scrolling
  const preventDefault = (e: React.TouchEvent) => e.preventDefault();

  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-[320px] mt-6">
      <button
        className={btnClass}
        onClick={onMoveLeft}
        onTouchStart={preventDefault}
        onPointerDown={onMoveLeft}
        aria-label="Left"
      >
        <ArrowLeft size={28} />
      </button>
      <button
        className={btnClass}
        onClick={onRotate}
        onTouchStart={preventDefault}
        onPointerDown={onRotate}
        aria-label="Rotate"
      >
        <RotateCw size={28} />
      </button>
      <button
        className={btnClass}
        onClick={onMoveRight}
        onTouchStart={preventDefault}
        onPointerDown={onMoveRight}
        aria-label="Right"
      >
        <ArrowRight size={28} />
      </button>
      <div className="col-span-3 grid grid-cols-2 gap-4">
        <button
          className={btnClass}
          onClick={onMoveDown}
          onTouchStart={preventDefault}
          onPointerDown={onMoveDown}
          aria-label="Down"
        >
          <ArrowDown size={28} />
        </button>
        <button
          className={`${btnClass} !bg-red-100 hover:!bg-red-200 border-red-200`}
          onClick={onHardDrop}
          onTouchStart={preventDefault}
          onPointerDown={onHardDrop}
          aria-label="Hard Drop"
        >
          <ChevronsDown size={28} className="text-red-500" />
        </button>
      </div>
    </div>
  );
};
