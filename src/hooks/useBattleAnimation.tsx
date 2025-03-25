
import { useState, useEffect, useRef } from "react";
import { BeybladeType, BeybladeCharacter } from "@/components/Beyblade";
import {
  Position,
  Velocity,
  normalizeVector,
  handleBoundaryCollision,
  calculateDistance,
  calculateCollision,
  ensureMinimumVelocity,
  calculateStamina
} from "@/utils/beybladePhysics";
import { BitBeast } from "@/types/bitBeast";

interface BeybladeData {
  name: string;
  type: BeybladeType;
  color: string;
  character: BeybladeCharacter;
  power: number;
  bitBeast?: BitBeast | null;
}

interface UseBattleAnimationProps {
  playerBeyblade: BeybladeData;
  opponent: BeybladeData;
  battleStarted: boolean;
  playerLaunchPower: number;
  onBattleEnd: (winner: string) => void;
  onBattleStateChange: (isStarted: boolean) => void;
  onSpecialAbilityActivation?: (beybladeId: string) => void;
}

interface BattleAnimationState {
  position1: Position;
  position2: Position;
  spinning: boolean;
  collisionEffect: boolean;
  activeSpecialAbility: string | null;
}

export function useBattleAnimation({
  playerBeyblade,
  opponent,
  battleStarted,
  playerLaunchPower,
  onBattleEnd,
  onBattleStateChange,
  onSpecialAbilityActivation
}: UseBattleAnimationProps): BattleAnimationState {
  const [position1, setPosition1] = useState<Position>({ x: 30, y: 30 });
  const [position2, setPosition2] = useState<Position>({ x: 70, y: 70 });
  const [spinning, setSpinning] = useState(false);
  const [collisionEffect, setCollisionEffect] = useState(false);
  const [activeSpecialAbility, setActiveSpecialAbility] = useState<string | null>(null);
  
  const battleRef = useRef(battleStarted);
  const frameCountRef = useRef(0);
  const collisionCountRef = useRef(0);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const collisionDetectedRef = useRef(false);
  const player1SpecialActivatedRef = useRef(false);
  const player2SpecialActivatedRef = useRef(false);

  useEffect(() => {
    if (battleStarted) {
      setPosition1({ x: 30, y: 30 });
      setPosition2({ x: 70, y: 70 });
      setSpinning(true);
      setCollisionEffect(false);
      setActiveSpecialAbility(null);
      battleRef.current = true;
      frameCountRef.current = 0;
      collisionCountRef.current = 0;
      player1SpecialActivatedRef.current = false;
      player2SpecialActivatedRef.current = false;
      onBattleStateChange(true);
      
      // Intro animation sequence
      if (playerBeyblade.bitBeast) {
        setTimeout(() => {
          setActiveSpecialAbility(playerBeyblade.name);
          onSpecialAbilityActivation?.(playerBeyblade.name);
          
          setTimeout(() => {
            setActiveSpecialAbility(null);
          }, 2000);
        }, 500);
      }
    } else {
      battleRef.current = false;
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
        animationTimerRef.current = null;
      }
      setSpinning(false);
    }
  }, [battleStarted, onBattleStateChange, playerBeyblade.name, playerBeyblade.bitBeast, onSpecialAbilityActivation]);

  useEffect(() => {
    if (!battleStarted) return;
    
    let pos1 = { ...position1 };
    let pos2 = { ...position2 };
    let collisionCount = 0;
    
    const powerMultiplier = (playerLaunchPower || 5) / 5;
    
    let vel1: Velocity = { 
      x: (Math.random() * 2 - 1) * powerMultiplier, 
      y: (Math.random() * 2 - 1) * powerMultiplier 
    };
    let vel2: Velocity = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
    
    vel1 = normalizeVector(vel1);
    vel2 = normalizeVector(vel2);
    
    vel1.x *= powerMultiplier;
    vel1.y *= powerMultiplier;
    
    // Calculate base stamina
    let playerStamina = calculateStamina(playerBeyblade.type, playerBeyblade.power, playerLaunchPower);
    let opponentStamina = calculateStamina(opponent.type, opponent.power);
    
    // Apply bit-beast bonuses
    if (playerBeyblade.bitBeast) {
      playerStamina += playerBeyblade.bitBeast.powerBonus * 20;
    }
    
    if (opponent.bitBeast) {
      opponentStamina += opponent.bitBeast.powerBonus * 20;
    }
    
    const maxStamina = Math.max(playerStamina, opponentStamina);
    
    const animate = () => {
      if (!battleRef.current) return;
      
      frameCountRef.current++;
      
      // Calculate speed factors including bit-beast bonuses
      let playerSpeedFactor = (playerBeyblade.power / 10) * (1 + (playerLaunchPower / 10));
      let opponentSpeedFactor = opponent.power / 10;
      
      // Apply bit-beast power bonuses to speed
      if (playerBeyblade.bitBeast) {
        playerSpeedFactor *= (1 + playerBeyblade.bitBeast.powerBonus / 10);
      }
      
      if (opponent.bitBeast) {
        opponentSpeedFactor *= (1 + opponent.bitBeast.powerBonus / 10);
      }
      
      // Apply special ability effects if active
      if (activeSpecialAbility === playerBeyblade.name && playerBeyblade.bitBeast) {
        switch (playerBeyblade.bitBeast.element) {
          case "fire":
            playerSpeedFactor *= 1.3; // Fire increases speed
            break;
          case "lightning":
            playerSpeedFactor *= 1.2; // Lightning increases speed
            break;
          case "ice":
            opponentSpeedFactor *= 0.7; // Ice slows down opponent
            break;
          // Add other element effects as needed
        }
      }
      
      if (activeSpecialAbility === opponent.name && opponent.bitBeast) {
        switch (opponent.bitBeast.element) {
          case "fire":
            opponentSpeedFactor *= 1.3;
            break;
          case "lightning":
            opponentSpeedFactor *= 1.2;
            break;
          case "ice":
            playerSpeedFactor *= 0.7;
            break;
          // Add other element effects as needed
        }
      }
      
      pos1.x += vel1.x * playerSpeedFactor;
      pos1.y += vel1.y * playerSpeedFactor;
      pos2.x += vel2.x * opponentSpeedFactor;
      pos2.y += vel2.y * opponentSpeedFactor;
      
      const boundary1 = handleBoundaryCollision(pos1, vel1);
      pos1 = boundary1.position;
      vel1 = boundary1.velocity;
      
      const boundary2 = handleBoundaryCollision(pos2, vel2);
      pos2 = boundary2.position;
      vel2 = boundary2.velocity;
      
      const distance = calculateDistance(pos1, pos2);
      const collisionDistance = 15;
      
      // Check for collision
      if (distance < collisionDistance && !collisionDetectedRef.current) {
        collisionDetectedRef.current = true;
        collisionCountRef.current++;
        setCollisionEffect(true);
        
        // Calculate collision outcomes based on beyblade properties and bit-beasts
        const collision = calculateCollision(
          pos1, 
          pos2, 
          vel1, 
          vel2, 
          playerBeyblade.power, 
          opponent.power, 
          playerBeyblade.type, 
          opponent.type,
          playerLaunchPower
        );
        
        pos1 = collision.pos1;
        pos2 = collision.pos2;
        vel1 = collision.vel1;
        vel2 = collision.vel2;
        
        const minSpeed = 0.2;
        vel1 = ensureMinimumVelocity(vel1, minSpeed);
        vel2 = ensureMinimumVelocity(vel2, minSpeed);
        
        // Check if special abilities should activate based on collision and thresholds
        if (playerBeyblade.bitBeast && 
            !player1SpecialActivatedRef.current && 
            Math.random() * 10 > (10 - playerBeyblade.bitBeast.specialAbility.activationThreshold)) {
          
          setActiveSpecialAbility(playerBeyblade.name);
          onSpecialAbilityActivation?.(playerBeyblade.name);
          player1SpecialActivatedRef.current = true;
          
          // Apply special effect
          setTimeout(() => {
            setActiveSpecialAbility(null);
          }, 2000);
        }
        
        if (opponent.bitBeast && 
            !player2SpecialActivatedRef.current && 
            Math.random() * 10 > (10 - opponent.bitBeast.specialAbility.activationThreshold)) {
          
          setActiveSpecialAbility(opponent.name);
          onSpecialAbilityActivation?.(opponent.name);
          player2SpecialActivatedRef.current = true;
          
          // Apply special effect
          setTimeout(() => {
            setActiveSpecialAbility(null);
          }, 2000);
        }
        
        setTimeout(() => {
          setCollisionEffect(false);
          collisionDetectedRef.current = false;
        }, 300);
      } else if (distance >= collisionDistance * 1.5) {
        collisionDetectedRef.current = false;
      }
      
      setPosition1({ x: pos1.x, y: pos1.y });
      setPosition2({ x: pos2.x, y: pos2.y });
      
      // Check if battle should end based on stamina or frameCount
      if (frameCountRef.current > maxStamina) {
        battleRef.current = false;
        setSpinning(false);
        onBattleStateChange(false);
        
        // Determine winner based on stamina and bit-beast bonuses
        let winner;
        let playerFinalStamina = playerStamina;
        let opponentFinalStamina = opponentStamina;
        
        // Apply bit-beast effects on final stamina calculation
        if (playerBeyblade.bitBeast && player1SpecialActivatedRef.current) {
          if (playerBeyblade.bitBeast.element === "fire") {
            playerFinalStamina *= 0.9; // Fire reduces final stamina
          } else if (playerBeyblade.bitBeast.element === "water" || 
                    playerBeyblade.bitBeast.element === "stamina") {
            playerFinalStamina *= 1.2; // Water and stamina increase final stamina
          }
        }
        
        if (opponent.bitBeast && player2SpecialActivatedRef.current) {
          if (opponent.bitBeast.element === "fire") {
            opponentFinalStamina *= 0.9;
          } else if (opponent.bitBeast.element === "water" || 
                    opponent.bitBeast.element === "stamina") {
            opponentFinalStamina *= 1.2;
          }
        }
        
        if (playerFinalStamina > opponentFinalStamina) {
          winner = playerBeyblade.name;
        } else if (opponentFinalStamina > playerFinalStamina) {
          winner = opponent.name;
        } else {
          // If stamina is equal, compare power + bit-beast bonus
          const playerTotalPower = playerBeyblade.power + (playerBeyblade.bitBeast?.powerBonus || 0);
          const opponentTotalPower = opponent.power + (opponent.bitBeast?.powerBonus || 0);
          winner = playerTotalPower >= opponentTotalPower ? playerBeyblade.name : opponent.name;
        }
        
        onBattleEnd(winner);
        return;
      }
      
      animationTimerRef.current = setTimeout(animate, 50);
    };
    
    animate();
    
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
        animationTimerRef.current = null;
      }
    };
  }, [battleStarted, playerBeyblade, opponent, playerLaunchPower, onBattleEnd, onBattleStateChange, onSpecialAbilityActivation]);

  return { 
    position1, 
    position2, 
    spinning, 
    collisionEffect,
    activeSpecialAbility
  };
}
