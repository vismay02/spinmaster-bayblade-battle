
import { useState, useEffect } from "react";
import { BeybladeType } from "@/components/Beyblade";
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

interface BeybladeData {
  name: string;
  type: BeybladeType;
  color: string;
  power: number;
}

interface UseBattleAnimationProps {
  playerBeyblade: BeybladeData;
  opponent: BeybladeData;
  battleStarted: boolean;
  playerLaunchPower: number;
  onBattleEnd: (winner: string) => void;
  onBattleStateChange: (isStarted: boolean) => void;
}

interface BattleAnimationState {
  position1: Position;
  position2: Position;
  spinning: boolean;
  collisionEffect: boolean;
}

export function useBattleAnimation({
  playerBeyblade,
  opponent,
  battleStarted,
  playerLaunchPower,
  onBattleEnd,
  onBattleStateChange
}: UseBattleAnimationProps): BattleAnimationState {
  const [position1, setPosition1] = useState<Position>({ x: 30, y: 30 });
  const [position2, setPosition2] = useState<Position>({ x: 70, y: 70 });
  const [spinning, setSpinning] = useState(false);
  const [collisionEffect, setCollisionEffect] = useState(false);

  useEffect(() => {
    if (!battleStarted) return;

    // Notify parent component about battle state
    onBattleStateChange(true);

    let timer: NodeJS.Timeout;
    let collisionCount = 0;
    let frameCount = 0;
    let pos1 = { ...position1 };
    let pos2 = { ...position2 };
    
    // Apply launch power to initial velocity
    const powerMultiplier = (playerLaunchPower || 5) / 5; // Default to mid-power if not provided
    
    let vel1: Velocity = { 
      x: (Math.random() * 2 - 1) * powerMultiplier, 
      y: (Math.random() * 2 - 1) * powerMultiplier 
    };
    let vel2: Velocity = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
    
    vel1 = normalizeVector(vel1);
    vel2 = normalizeVector(vel2);
    
    // Scale velocity by launch power
    vel1.x *= powerMultiplier;
    vel1.y *= powerMultiplier;
    
    const animate = () => {
      frameCount++;
      
      // Adjust speed based on power and launch power
      const playerSpeedFactor = (playerBeyblade.power / 10) * (1 + (playerLaunchPower / 10));
      const opponentSpeedFactor = opponent.power / 10;
      
      // Update positions with velocity
      pos1.x += vel1.x * playerSpeedFactor;
      pos1.y += vel1.y * playerSpeedFactor;
      pos2.x += vel2.x * opponentSpeedFactor;
      pos2.y += vel2.y * opponentSpeedFactor;
      
      // Arena boundary collision
      const boundary1 = handleBoundaryCollision(pos1, vel1);
      pos1 = boundary1.position;
      vel1 = boundary1.velocity;
      
      const boundary2 = handleBoundaryCollision(pos2, vel2);
      pos2 = boundary2.position;
      vel2 = boundary2.velocity;
      
      // Check for collision between beyblades
      const distance = calculateDistance(pos1, pos2);
      
      if (distance < 15) {  // Collision detected
        collisionCount++;
        setCollisionEffect(true);
        
        // Calculate collision response
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
        
        // Make sure neither beyblade stops completely
        const minSpeed = 0.2;
        vel1 = ensureMinimumVelocity(vel1, minSpeed);
        vel2 = ensureMinimumVelocity(vel2, minSpeed);
        
        // Clear collision effect after a short time
        setTimeout(() => {
          setCollisionEffect(false);
        }, 300);
      }
      
      // Apply positions
      setPosition1({ x: pos1.x, y: pos1.y });
      setPosition2({ x: pos2.x, y: pos2.y });
      
      // Calculate stamina for both beyblades
      const playerStamina = calculateStamina(playerBeyblade.type, playerBeyblade.power, playerLaunchPower);
      const opponentStamina = calculateStamina(opponent.type, opponent.power);
      
      // End battle conditions
      if (frameCount > Math.max(playerStamina, opponentStamina)) {
        clearTimeout(timer);
        setSpinning(false);
        onBattleStateChange(false);
        
        let winner;
        if (playerStamina > opponentStamina) {
          winner = playerBeyblade.name;
        } else if (opponentStamina > playerStamina) {
          winner = opponent.name;
        } else {
          // In case of a tie, the one with more power wins
          winner = playerBeyblade.power > opponent.power ? playerBeyblade.name : opponent.name;
        }
        
        onBattleEnd(winner);
        return;
      }
      
      timer = setTimeout(animate, 50);
    };
    
    animate();
    
    return () => {
      clearTimeout(timer);
      onBattleStateChange(false);
    };
  }, [battleStarted, playerLaunchPower, playerBeyblade, opponent, onBattleEnd, onBattleStateChange, position1, position2]);

  useEffect(() => {
    setSpinning(battleStarted);
  }, [battleStarted]);

  return { position1, position2, spinning, collisionEffect };
}
