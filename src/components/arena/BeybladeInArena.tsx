
import React from "react";
import Beyblade, { BeybladeType, BeybladeColor, BeybladeCharacter } from "../Beyblade";

interface BeybladeInArenaProps {
  name: string;
  color: BeybladeColor;
  type: BeybladeType;
  character: BeybladeCharacter;
  power: number;
  spinning: boolean;
  x: number;
  y: number;
  hasCollisionEffect: boolean;
}

const BeybladeInArena: React.FC<BeybladeInArenaProps> = ({
  name,
  color,
  type,
  character,
  power,
  spinning,
  x,
  y,
  hasCollisionEffect
}) => {
  // Use a fixed size for the collision boundary to ensure consistency
  const beybladeSize = 60; // pixels

  return (
    <div 
      className={`absolute transition-all duration-50 z-10 ${hasCollisionEffect ? 'animate-pulse' : ''}`}
      style={{ 
        left: `${x}%`, 
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        width: `${beybladeSize}px`,
        height: `${beybladeSize}px`,
      }}
    >
      <Beyblade
        name={name}
        color={color}
        type={type}
        character={character}
        power={power}
        spinning={spinning}
        size="md"
        className={`transition-opacity duration-500 ${hasCollisionEffect ? 'scale-110' : ''}`}
      />
    </div>
  );
};

export default BeybladeInArena;
