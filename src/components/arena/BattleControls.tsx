
import React from "react";
import { BitBeast } from "@/types/bitBeast";
import BitBeastIcon from "../bitbeast/BitBeastIcon";

interface BattleControlsProps {
  winner: string | null;
  battleStarted: boolean;
  onStartBattle: () => void;
  playerBitBeast?: BitBeast | null;
  opponentBitBeast?: BitBeast | null;
}

const BattleControls = ({ 
  winner, 
  battleStarted, 
  onStartBattle,
  playerBitBeast,
  opponentBitBeast
}: BattleControlsProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {winner && (
        <WinnerAnnouncement winner={winner} winnerBitBeast={playerBitBeast || opponentBitBeast} />
      )}
      
      <button
        onClick={onStartBattle}
        disabled={battleStarted}
        className="px-8 py-3 bg-primary text-white font-semibold rounded-full transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none button-glow"
      >
        {battleStarted ? "Battle in progress..." : "Start Battle"}
      </button>
      
      {/* Show bit-beast information before battle if available */}
      {!battleStarted && !winner && playerBitBeast && (
        <div className="w-full max-w-md mt-4">
          <div className="glass-panel p-4 rounded-xl border border-primary/30">
            <div className="flex items-center gap-3 mb-2">
              <BitBeastIcon 
                animal={playerBitBeast.animal} 
                element={playerBitBeast.element}
                size="sm" 
              />
              <h3 className="font-semibold">{playerBitBeast.name}</h3>
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="mb-1">
                <span className="font-medium">Special Ability:</span> {playerBitBeast.specialAbility.name}
              </p>
              <p className="text-xs">{playerBitBeast.specialAbility.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface WinnerAnnouncementProps {
  winner: string;
  winnerBitBeast?: BitBeast | null;
}

const WinnerAnnouncement = ({ winner, winnerBitBeast }: WinnerAnnouncementProps) => {
  return (
    <div className="text-center mb-4 animate-fade-in">
      <div className="text-2xl font-bold text-primary mb-2">
        {winner} wins!
      </div>
      
      {winnerBitBeast && (
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <BitBeastIcon 
              animal={winnerBitBeast.animal} 
              element={winnerBitBeast.element}
              size="sm" 
              isActive={true}
            />
            <span className="font-medium">{winnerBitBeast.name} dominated the battle!</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            "{winnerBitBeast.specialAbility.name}" proved to be the decisive factor in this victory.
          </p>
        </div>
      )}
    </div>
  );
};

export default BattleControls;
