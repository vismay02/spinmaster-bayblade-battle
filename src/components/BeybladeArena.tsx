
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { BeybladeType, BeybladeColor, BeybladeCharacter } from "./Beyblade";
import ArenaDesign from "./arena/ArenaDesign";
import BattleControls from "./arena/BattleControls";
import BattleSimulation from "./arena/BattleSimulation";

interface ArenaProps {
  className?: string;
  playerLaunchPower?: number;
  onBattleStateChange?: (isStarted: boolean) => void;
  playerBeyblade?: {
    name: string;
    type: BeybladeType;
    color: BeybladeColor;
    character: BeybladeCharacter;
    power: number;
  };
}

const BeybladeArena = ({ 
  className, 
  playerLaunchPower = 0,
  onBattleStateChange,
  playerBeyblade 
}: ArenaProps) => {
  const arenaRef = useRef<HTMLDivElement>(null);
  const [battleStarted, setBattleStarted] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  // Use player beyblade from props or fallback to default
  const player = playerBeyblade || {
    name: "Striker",
    color: "blue" as const,
    type: "attack" as BeybladeType,
    character: "user" as BeybladeCharacter,
    power: 8,
  };

  const opponent = {
    name: "Defender",
    color: "red" as const,
    type: "defense" as BeybladeType,
    character: "cat" as BeybladeCharacter,
    power: 7,
  };

  const startBattle = () => {
    setWinner(null);
    setBattleStarted(true);
  };

  const handleBattleEnd = (winnerName: string) => {
    setBattleStarted(false);
    setWinner(winnerName);
  };

  const handleBattleStateChange = (isStarted: boolean) => {
    setBattleStarted(isStarted);
    onBattleStateChange?.(isStarted);
  };

  return (
    <div className={cn("w-full max-w-3xl mx-auto px-4", className)}>
      <div ref={arenaRef} className="relative mb-8">
        <ArenaDesign />
        
        {/* Battle simulation */}
        {battleStarted && (
          <BattleSimulation
            playerBeyblade={player}
            opponent={opponent}
            battleStarted={battleStarted}
            playerLaunchPower={playerLaunchPower}
            onBattleEnd={handleBattleEnd}
            onBattleStateChange={handleBattleStateChange}
          />
        )}
      </div>
      
      <BattleControls
        winner={winner}
        battleStarted={battleStarted}
        onStartBattle={startBattle}
      />
    </div>
  );
};

export default BeybladeArena;
