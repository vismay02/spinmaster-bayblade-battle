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

interface BeybladeData {
  name: string;
  type: BeybladeType;
  color: string;
  character: BeybladeCharacter;
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
  
  const battleRef = useRef(battleStarted);
  const frameCountRef = useRef(0);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const collisionDetectedRef = useRef(false);

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
    
    const playerStamina = calculateStamina(playerBeyblade.type, playerBeyblade.power, playerLaunchPower);
    const opponentStamina = calculateStamina(opponent.type, opponent.power);
    const maxStamina = Math.max(playerStamina, opponentStamina);
    
    const animate = () => {
      if (!battleRef.current) return;
      
      frameCountRef.current++;
      
      const playerSpeedFactor = (playerBeyblade.power / 10) * (1 + (playerLaunchPower / 10));
      const opponentSpeedFactor = opponent.power / 10;
      
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
      
      if (distance < collisionDistance && !collisionDetectedRef.current) {
        collisionDetectedRef.current = true;
        collisionCount++;
        setCollisionEffect(true);
        
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
        
        setTimeout(() => {
          setCollisionEffect(false);
          collisionDetectedRef.current = false;
        }, 300);
      } else if (distance >= collisionDistance * 1.5) {
        collisionDetectedRef.current = false;
      }
      
      setPosition1({ x: pos1.x, y: pos1.y });
      setPosition2({ x: pos2.x, y: pos2.y });
      
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
    };
  }, [battleStarted]);

  return { position1, position2, spinning, collisionEffect };
}
