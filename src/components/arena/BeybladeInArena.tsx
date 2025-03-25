
import React from "react";
import Beyblade, { BeybladeType, BeybladeColor, BeybladeCharacter } from "../Beyblade";
import { BitBeast } from "@/types/bitBeast";

interface BeybladeInArenaProps {
  name: string;
  color: BeybladeColor;
  type: BeybladeType;
  character: BeybladeCharacter;
  power: number;
  bitBeast?: BitBeast | null;
  spinning: boolean;
  x: number;
  y: number;
  hasCollisionEffect: boolean;
  specialAbilityActive?: boolean;
}

const BeybladeInArena: React.FC<BeybladeInArenaProps> = ({
  name,
  color,
  type,
  character,
  power,
  bitBeast,
  spinning,
  x,
  y,
  hasCollisionEffect,
  specialAbilityActive = false
}) => {
  // Use a fixed size for the collision boundary to ensure consistency
  const beybladeSize = 60; // pixels

  // Apply special effects based on bit-beast element if ability is active
  const getElementEffectClasses = () => {
    if (!specialAbilityActive || !bitBeast) return "";
    
    switch (bitBeast.element) {
      case "fire": return "fire-aura";
      case "water": return "water-aura";
      case "earth": return "earth-aura";
      case "air": return "air-aura";
      case "lightning": return "lightning-aura";
      case "ice": return "ice-aura";
      case "darkness": return "darkness-aura";
      case "light": return "light-aura";
      default: return "";
    }
  };

  return (
    <div 
      className={`absolute transition-all duration-50 z-10 ${hasCollisionEffect ? 'animate-pulse' : ''} ${getElementEffectClasses()}`}
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
        bitBeast={bitBeast}
        spinning={spinning}
        specialAbilityActive={specialAbilityActive}
        size="md"
        className={`transition-opacity duration-500 ${hasCollisionEffect ? 'scale-110' : ''}`}
      />
      
      {/* Special ability name text popup when activated */}
      {specialAbilityActive && bitBeast && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <div className="px-2 py-1 bg-background/80 text-primary text-xs font-bold rounded animate-bounce">
            {bitBeast.specialAbility.name}!
          </div>
        </div>
      )}
    </div>
  );
};

export default BeybladeInArena;
