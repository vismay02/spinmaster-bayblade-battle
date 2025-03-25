
import { BeybladeType } from "@/components/Beyblade";

export type BitBeastAnimal = 
  | "dragon" 
  | "phoenix" 
  | "turtle" 
  | "tiger" 
  | "wolf" 
  | "eagle" 
  | "snake" 
  | "lion" 
  | "bear" 
  | "shark";

export type ElementalAffinity = 
  | "fire" 
  | "water" 
  | "earth" 
  | "air" 
  | "lightning" 
  | "ice" 
  | "darkness" 
  | "light";

export interface SpecialAbility {
  name: string;
  description: string;
  battleEffect: string;
  activationThreshold: number; // 0-10, determines how often ability triggers
}

export interface BitBeast {
  id: string;
  name: string;
  animal: BitBeastAnimal;
  element: ElementalAffinity;
  combatStyle: BeybladeType;
  specialAbility: SpecialAbility;
  description: string;
  powerBonus: number; // 0-3, additional power this bit-beast provides
  imageUrl?: string; // For future image uploads
}
