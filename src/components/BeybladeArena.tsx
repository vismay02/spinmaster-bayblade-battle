
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { BeybladeType, BeybladeColor, BeybladeCharacter } from "./Beyblade";
import ArenaDesign from "./arena/ArenaDesign";
import BattleControls from "./arena/BattleControls";
import BattleSimulation from "./arena/BattleSimulation";
import { BitBeast } from "@/types/bitBeast";

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
    bitBeast?: BitBeast | null;
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
  const [specialAbilityActive, setSpecialAbilityActive] = useState<string | null>(null);

  // Use player beyblade from props or fallback to default
  const player = playerBeyblade || {
    name: "Striker",
    color: "blue" as const,
    type: "attack" as BeybladeType,
    character: "user" as BeybladeCharacter,
    power: 8,
    bitBeast: null
  };

  const opponent = {
    name: "Defender",
    color: "red" as const,
    type: "defense" as BeybladeType,
    character: "cat" as BeybladeCharacter,
    power: 7,
    bitBeast: null
  };

  const startBattle = () => {
    setWinner(null);
    setBattleStarted(true);
    setSpecialAbilityActive(null);
  };

  const handleBattleEnd = (winnerName: string) => {
    setBattleStarted(false);
    setWinner(winnerName);
    setSpecialAbilityActive(null);
  };

  const handleBattleStateChange = (isStarted: boolean) => {
    setBattleStarted(isStarted);
    onBattleStateChange?.(isStarted);
  };

  const handleSpecialAbilityActivation = (beybladeId: string) => {
    setSpecialAbilityActive(beybladeId);
    
    // Show special ability effect for a limited time
    setTimeout(() => {
      setSpecialAbilityActive(null);
    }, 2000);
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
            onSpecialAbilityActivation={handleSpecialAbilityActivation}
            specialAbilityActiveFor={specialAbilityActive}
          />
        )}
      </div>
      
      <BattleControls
        winner={winner}
        battleStarted={battleStarted}
        onStartBattle={startBattle}
        playerBitBeast={player.bitBeast}
        opponentBitBeast={opponent.bitBeast}
      />
    </div>
  );
};

export default BeybladeArena;
