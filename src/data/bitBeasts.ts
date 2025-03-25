
import { BitBeast, BitBeastAnimal, ElementalAffinity } from "@/types/bitBeast";
import { BeybladeType } from "@/components/Beyblade";

const createBitBeast = (
  id: string,
  name: string,
  animal: BitBeastAnimal,
  element: ElementalAffinity,
  combatStyle: BeybladeType,
  specialAbility: {
    name: string;
    description: string;
    battleEffect: string;
    activationThreshold: number;
  },
  description: string,
  powerBonus: number
): BitBeast => ({
  id,
  name,
  animal,
  element,
  combatStyle,
  specialAbility,
  description,
  powerBonus,
});

export const bitBeasts: BitBeast[] = [
  // Attack Type Bit-Beasts
  createBitBeast(
    "dragon-inferno",
    "Inferno Dragonoid",
    "dragon",
    "fire",
    "attack",
    {
      name: "Blaze Rush",
      description: "Engulfs the beyblade in flames, increasing attack power",
      battleEffect: "30% increased knockback on collision",
      activationThreshold: 7
    },
    "A fierce dragon that channels the raw power of fire into devastating attacks",
    3
  ),
  createBitBeast(
    "tiger-lightning",
    "Volt Tigera",
    "tiger",
    "lightning",
    "attack",
    {
      name: "Lightning Strike",
      description: "Charges the beyblade with electricity for rapid attacks",
      battleEffect: "20% increased attack speed",
      activationThreshold: 6
    },
    "A lightning-fast tiger that strikes with the precision and power of a thunderbolt",
    2
  ),
  createBitBeast(
    "eagle-air",
    "Stratosphere Eagle",
    "eagle",
    "air",
    "attack",
    {
      name: "Diving Talon",
      description: "Enables devastating aerial attacks",
      battleEffect: "Creates powerful air pressure waves on impact",
      activationThreshold: 8
    },
    "A majestic eagle that rules the skies, capable of diving at incredible speeds",
    2
  ),

  // Defense Type Bit-Beasts
  createBitBeast(
    "turtle-water",
    "Tsunami Tortoise",
    "turtle",
    "water",
    "defense",
    {
      name: "Tidal Shield",
      description: "Creates a water barrier that absorbs impact",
      battleEffect: "Reduces opponent knockback power by 40%",
      activationThreshold: 5
    },
    "An ancient turtle with a shell harder than steel, surrounded by a powerful water aura",
    3
  ),
  createBitBeast(
    "bear-earth",
    "Granite Grizzly",
    "bear",
    "earth",
    "defense",
    {
      name: "Earth Fortress",
      description: "Hardens the beyblade with earth energy",
      battleEffect: "50% chance to nullify damage from attacks",
      activationThreshold: 6
    },
    "A massive bear with skin like stone, capable of shrugging off the most powerful attacks",
    2
  ),
  createBitBeast(
    "lion-light",
    "Radiant Leo",
    "lion",
    "light",
    "defense",
    {
      name: "Solar Flare",
      description: "Emits blinding light to disorient opponents",
      battleEffect: "25% chance to stun opponent temporarily",
      activationThreshold: 7
    },
    "A noble lion whose mane radiates pure light, creating a defensive aura that repels attacks",
    2
  ),

  // Stamina Type Bit-Beasts
  createBitBeast(
    "phoenix-fire",
    "Eternal Phoenix",
    "phoenix",
    "fire",
    "stamina",
    {
      name: "Rebirth Flame",
      description: "Regenerates energy through continuous spinning",
      battleEffect: "Gradually restores stamina over time",
      activationThreshold: 5
    },
    "A legendary phoenix that burns eternally, drawing power from its own flames",
    3
  ),
  createBitBeast(
    "snake-darkness",
    "Shadow Serpent",
    "snake",
    "darkness",
    "stamina",
    {
      name: "Energy Drain",
      description: "Siphons energy from opponents during contact",
      battleEffect: "Steals stamina from opponent on collision",
      activationThreshold: 6
    },
    "A mysterious snake that thrives in darkness, capable of draining the life force from its prey",
    2
  ),
  createBitBeast(
    "shark-water",
    "Abyssal Shark",
    "shark",
    "water",
    "stamina",
    {
      name: "Whirlpool",
      description: "Creates a vortex that pulls in opponents",
      battleEffect: "Disrupts opponent's stability on proximity",
      activationThreshold: 7
    },
    "A relentless shark that circles its prey, maintaining perfect rhythm in its endless hunt",
    2
  ),

  // Balance Type Bit-Beasts
  createBitBeast(
    "wolf-ice",
    "Frost Lupus",
    "wolf",
    "ice",
    "balance",
    {
      name: "Winter's Howl",
      description: "Balances offense and defense with ice powers",
      battleEffect: "30% chance to slow opponent's movement",
      activationThreshold: 6
    },
    "A cunning wolf with fur like frost, capable of adapting to any battle situation",
    3
  ),
  createBitBeast(
    "dragon-lightning",
    "Thunder Drake",
    "dragon",
    "lightning",
    "balance",
    {
      name: "Storm Surge",
      description: "Harnesses lightning for balanced combat",
      battleEffect: "Random boost to attack, defense, or stamina",
      activationThreshold: 7
    },
    "A versatile dragon that channels lightning through its body, striking with perfect precision",
    2
  ),
  createBitBeast(
    "lion-earth",
    "Terra Leo",
    "lion",
    "earth",
    "balance",
    {
      name: "Seismic Roar",
      description: "Creates shockwaves that destabilize the arena",
      battleEffect: "Causes arena-wide disruption affecting all beyblades",
      activationThreshold: 8
    },
    "A powerful lion with a connection to the earth, maintaining perfect balance in any terrain",
    2
  ),
];
