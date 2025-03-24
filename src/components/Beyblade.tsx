import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { User, Cat, Dog, Bird, UserRound } from "lucide-react";

export type BeybladeType = "attack" | "defense" | "stamina" | "balance";
export type BeybladeColor = "blue" | "red" | "green" | "yellow" | "purple";
export type BeybladeCharacter = "user" | "user-round" | "cat" | "dog" | "bird";

export interface BeybladeProps {
  color: BeybladeColor;
  type: BeybladeType;
  name: string;
  power: number;
  character: BeybladeCharacter;
  spinning?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const BEYBLADE_TYPES = {
  attack: { name: "Attack", description: "High attack power, low stamina" },
  defense: { name: "Defense", description: "High defense, medium stamina" },
  stamina: { name: "Stamina", description: "Low attack, very high stamina" },
  balance: { name: "Balance", description: "Balanced stats all around" },
};

export const BEYBLADE_COLORS: Record<BeybladeColor, string> = {
  blue: "bg-beyblade-blue",
  red: "bg-beyblade-red",
  green: "bg-beyblade-green",
  yellow: "bg-beyblade-yellow",
  purple: "bg-beyblade-purple",
};

export const BEYBLADE_CHARACTERS = {
  "user": { name: "Human", icon: User },
  "user-round": { name: "Champion", icon: UserRound },
  "cat": { name: "Cat", icon: Cat },
  "dog": { name: "Dog", icon: Dog },
  "bird": { name: "Bird", icon: Bird },
};

const Beyblade = ({
  color,
  type,
  name,
  power,
  character,
  spinning = false,
  size = "md",
  className,
}: BeybladeProps) => {
  const [isSpinning, setIsSpinning] = useState(spinning);
  const [spinClass, setSpinClass] = useState("");

  useEffect(() => {
    setIsSpinning(spinning);
    if (spinning) {
      const duration = 5 + power * 0.5;
      setSpinClass(`animate-spin-beyblade [animation-duration:${duration}s]`);
    } else {
      setSpinClass("");
    }
  }, [spinning, power]);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const getTypePattern = () => {
    switch (type) {
      case "attack":
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-3/4 border-t-4 border-l-4 border-r-4 border-white/40 rounded-full"></div>
            <div className="absolute w-1/2 h-1/2 border-2 border-white/30 rounded-full"></div>
          </div>
        );
      case "defense":
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-3/4 border-4 border-white/40 rounded-full"></div>
            <div className="absolute w-1/2 h-1/2 border-2 border-white/30 rounded-full"></div>
          </div>
        );
      case "stamina":
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-3/4 border-b-4 border-white/40 rounded-full"></div>
            <div className="absolute w-1/2 h-1/2 border-2 border-white/30 rounded-full"></div>
          </div>
        );
      case "balance":
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-3/4 border-4 border-dashed border-white/40 rounded-full"></div>
            <div className="absolute w-1/2 h-1/2 border-2 border-white/30 rounded-full"></div>
          </div>
        );
      default:
        return null;
    }
  };

  const CharacterIcon = BEYBLADE_CHARACTERS[character].icon;
  
  const getIconSize = () => {
    switch (size) {
      case "sm": return 12;
      case "md": return 16;
      case "lg": return 24;
      default: return 16;
    }
  };

  return (
    <div
      className={cn(
        "relative beyblade-shadow",
        sizeClasses[size],
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-full flex items-center justify-center overflow-hidden",
          BEYBLADE_COLORS[color],
          isSpinning ? spinClass : "",
          isSpinning ? "shadow-lg" : ""
        )}
      >
        {getTypePattern()}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40 pointer-events-none"></div>
        <div className="w-1/3 h-1/3 bg-background/80 rounded-full flex items-center justify-center z-10">
          <CharacterIcon size={getIconSize()} className="text-white/80" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
};

export default Beyblade;
