
import React from "react";

interface BattleControlsProps {
  winner: string | null;
  battleStarted: boolean;
  onStartBattle: () => void;
}

const BattleControls = ({ winner, battleStarted, onStartBattle }: BattleControlsProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {winner && (
        <div className="text-2xl font-bold text-primary animate-fade-in">
          {winner} wins!
        </div>
      )}
      
      <button
        onClick={onStartBattle}
        disabled={battleStarted}
        className="px-8 py-3 bg-primary text-white font-semibold rounded-full transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none button-glow"
      >
        {battleStarted ? "Battle in progress..." : "Start Battle"}
      </button>
    </div>
  );
};

export default BattleControls;
