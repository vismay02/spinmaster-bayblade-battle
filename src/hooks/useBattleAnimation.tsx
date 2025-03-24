
import { useState, useEffect, useRef } from "react";
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
  
  // Use refs to avoid dependency issues in the useEffect
  const battleRef = useRef(battleStarted);
  const frameCountRef = useRef(0);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const collisionDetectedRef = useRef(false);

  // Set initial positions when battle starts
  useEffect(() => {
    if (battleStarted) {
      setPosition1({ x: 30, y: 30 });
      setPosition2({ x: 70, y: 70 });
      setSpinning(true);
      setCollisionEffect(false);
      battleRef.current = true;
      frameCountRef.current = 0;
      onBattleStateChange(true);
    } else {
      battleRef.current = false;
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
        animationTimerRef.current = null;
      }
      setSpinning(false);
    }
  }, [battleStarted, onBattleStateChange]);

  // Main animation effect
  useEffect(() => {
    if (!battleStarted) return;
    
    let pos1 = { ...position1 };
    let pos2 = { ...position2 };
    let collisionCount = 0;
    
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
    
    // Calculate stamina for both beyblades
    const playerStamina = calculateStamina(playerBeyblade.type, playerBeyblade.power, playerLaunchPower);
    const opponentStamina = calculateStamina(opponent.type, opponent.power);
    const maxStamina = Math.max(playerStamina, opponentStamina);
    
    const animate = () => {
      if (!battleRef.current) return;
      
      frameCountRef.current++;
      
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
      
      // Check for collision between beyblades - using a more precise collision distance
      const distance = calculateDistance(pos1, pos2);
      const collisionDistance = 15; // Adjusted for better collision detection
      
      // Only process collision if not already in collision state
      if (distance < collisionDistance && !collisionDetectedRef.current) {
        collisionDetectedRef.current = true;
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
          collisionDetectedRef.current = false;
        }, 300);
      } else if (distance >= collisionDistance * 1.5) {
        // Make sure we're far enough apart to reset collision detection
        collisionDetectedRef.current = false;
      }
      
      // Apply positions
      setPosition1({ x: pos1.x, y: pos1.y });
      setPosition2({ x: pos2.x, y: pos2.y });
      
      // End battle conditions
      if (frameCountRef.current > maxStamina) {
        battleRef.current = false;
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
      
      animationTimerRef.current = setTimeout(animate, 50);
    };
    
    animate();
    
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
        animationTimerRef.current = null;
      }
      // Don't call onBattleStateChange here as it causes the infinite loop
    };
    
    // Only depend on battleStarted to trigger the animation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battleStarted]);

  return { position1, position2, spinning, collisionEffect };
}
