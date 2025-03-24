
import React from "react";
import Beyblade, { BeybladeType, BeybladeColor } from "../Beyblade";

interface BeybladeInArenaProps {
  name: string;
  color: BeybladeColor;
  type: BeybladeType;
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
  power,
  spinning,
  x,
  y,
  hasCollisionEffect
}) => {
  return (
    <div 
      className={`absolute transition-all duration-50 z-10 ${hasCollisionEffect ? 'animate-pulse' : ''}`}
      style={{ 
        left: `${x}%`, 
        top: `${y}%`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <Beyblade
        name={name}
        color={color}
        type={type}
        power={power}
        spinning={spinning}
        size="md"
        className="transition-opacity duration-500"
      />
    </div>
  );
};

export default BeybladeInArena;
