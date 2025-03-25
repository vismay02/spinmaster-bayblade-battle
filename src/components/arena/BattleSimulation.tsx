
import { BeybladeType, BeybladeColor, BeybladeCharacter } from "../Beyblade";
import BeybladeInArena from "./BeybladeInArena";
import { useBattleAnimation } from "@/hooks/useBattleAnimation";
import { BitBeast } from "@/types/bitBeast";

interface BeybladeData {
  name: string;
  type: BeybladeType;
  color: BeybladeColor;
  character: BeybladeCharacter;
  power: number;
  bitBeast?: BitBeast | null;
}

interface BattleSimulationProps {
  playerBeyblade: BeybladeData;
  opponent: BeybladeData;
  battleStarted: boolean;
  playerLaunchPower: number;
  onBattleEnd: (winner: string) => void;
  onBattleStateChange: (isStarted: boolean) => void;
  onSpecialAbilityActivation?: (beybladeId: string) => void;
  specialAbilityActiveFor?: string | null;
}

const BattleSimulation = ({
  playerBeyblade,
  opponent,
  battleStarted,
  playerLaunchPower,
  onBattleEnd,
  onBattleStateChange,
  onSpecialAbilityActivation,
  specialAbilityActiveFor
}: BattleSimulationProps) => {
  const { 
    position1, 
    position2, 
    spinning, 
    collisionEffect,
    activeSpecialAbility 
  } = useBattleAnimation({
    playerBeyblade,
    opponent,
    battleStarted,
    playerLaunchPower,
    onBattleEnd,
    onBattleStateChange,
    onSpecialAbilityActivation
  });

  // Determine if special abilities are active for each beyblade
  const isPlayer1SpecialActive = specialAbilityActiveFor === playerBeyblade.name || activeSpecialAbility === playerBeyblade.name;
  const isPlayer2SpecialActive = specialAbilityActiveFor === opponent.name || activeSpecialAbility === opponent.name;

  return (
    <>
      <BeybladeInArena
        name={playerBeyblade.name}
        color={playerBeyblade.color}
        type={playerBeyblade.type}
        character={playerBeyblade.character}
        power={playerBeyblade.power}
        bitBeast={playerBeyblade.bitBeast}
        spinning={spinning}
        x={position1.x}
        y={position1.y}
        hasCollisionEffect={collisionEffect}
        specialAbilityActive={isPlayer1SpecialActive}
      />
      
      <BeybladeInArena
        name={opponent.name}
        color={opponent.color}
        type={opponent.type}
        character={opponent.character}
        power={opponent.power}
        bitBeast={opponent.bitBeast}
        spinning={spinning}
        x={position2.x}
        y={position2.y}
        hasCollisionEffect={collisionEffect}
        specialAbilityActive={isPlayer2SpecialActive}
      />
    </>
  );
};

export default BattleSimulation;
