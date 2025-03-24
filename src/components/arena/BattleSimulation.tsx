
import { BeybladeType, BeybladeColor, BeybladeCharacter } from "../Beyblade";
import BeybladeInArena from "./BeybladeInArena";
import { useBattleAnimation } from "@/hooks/useBattleAnimation";

interface BeybladeData {
  name: string;
  type: BeybladeType;
  color: BeybladeColor;
  character: BeybladeCharacter;
  power: number;
}

interface BattleSimulationProps {
  playerBeyblade: BeybladeData;
  opponent: BeybladeData;
  battleStarted: boolean;
  playerLaunchPower: number;
  onBattleEnd: (winner: string) => void;
  onBattleStateChange: (isStarted: boolean) => void;
}

const BattleSimulation = ({
  playerBeyblade,
  opponent,
  battleStarted,
  playerLaunchPower,
  onBattleEnd,
  onBattleStateChange
}: BattleSimulationProps) => {
  const { position1, position2, spinning, collisionEffect } = useBattleAnimation({
    playerBeyblade,
    opponent,
    battleStarted,
    playerLaunchPower,
    onBattleEnd,
    onBattleStateChange
  });

  return (
    <>
      <BeybladeInArena
        name={playerBeyblade.name}
        color={playerBeyblade.color}
        type={playerBeyblade.type}
        character={playerBeyblade.character}
        power={playerBeyblade.power}
        spinning={spinning}
        x={position1.x}
        y={position1.y}
        hasCollisionEffect={collisionEffect}
      />
      
      <BeybladeInArena
        name={opponent.name}
        color={opponent.color}
        type={opponent.type}
        character={opponent.character}
        power={opponent.power}
        spinning={spinning}
        x={position2.x}
        y={position2.y}
        hasCollisionEffect={collisionEffect}
      />
    </>
  );
};

export default BattleSimulation;
