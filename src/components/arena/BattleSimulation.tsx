import { useEffect, useState } from "react";
import Beyblade, { BeybladeType, BeybladeColor } from "../Beyblade";

interface BeybladeData {
  name: string;
  type: BeybladeType;
  color: BeybladeColor;
  power: number;
}

interface BattleSimulationProps {
  playerBeyblade: BeybladeData;
  opponent: BeybladeData;
  battleStarted: boolean;
  playerLaunchPower: number;
  onBattleEnd: (winner: string) => void;
  onBattleStateChange: (isStarted: boolean) => void;
}

const BattleSimulation = ({
  playerBeyblade,
  opponent,
  battleStarted,
  playerLaunchPower,
  onBattleEnd,
  onBattleStateChange
}: BattleSimulationProps) => {
  const [position1, setPosition1] = useState({ x: 30, y: 30 });
  const [position2, setPosition2] = useState({ x: 70, y: 70 });
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
    
    let vel1 = { 
      x: (Math.random() * 2 - 1) * powerMultiplier, 
      y: (Math.random() * 2 - 1) * powerMultiplier 
    };
    let vel2 = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
    
    const normalizeVector = (v: {x: number, y: number}) => {
      const magnitude = Math.sqrt(v.x * v.x + v.y * v.y);
      if (magnitude === 0) return { x: 0, y: 0 };
      return { x: v.x / magnitude, y: v.y / magnitude };
    };
    
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
      if (pos1.x < 10) { pos1.x = 10; vel1.x *= -1; }
      if (pos1.x > 90) { pos1.x = 90; vel1.x *= -1; }
      if (pos1.y < 10) { pos1.y = 10; vel1.y *= -1; }
      if (pos1.y > 90) { pos1.y = 90; vel1.y *= -1; }
      
      if (pos2.x < 10) { pos2.x = 10; vel2.x *= -1; }
      if (pos2.x > 90) { pos2.x = 90; vel2.x *= -1; }
      if (pos2.y < 10) { pos2.y = 10; vel2.y *= -1; }
      if (pos2.y > 90) { pos2.y = 90; vel2.y *= -1; }
      
      // Check for collision between beyblades
      const dx = pos1.x - pos2.x;
      const dy = pos1.y - pos2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 15) {  // Reduced collision distance for more realistic interaction
        collisionCount++;
        setCollisionEffect(true);
        
        // Separate beyblades to prevent overlap
        const overlap = 15 - distance;
        const separationX = (dx / distance) * overlap * 0.5;
        const separationY = (dy / distance) * overlap * 0.5;
        
        pos1.x += separationX;
        pos1.y += separationY;
        pos2.x -= separationX;
        pos2.y -= separationY;
        
        // Calculate collision response
        const angle = Math.atan2(dy, dx);
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        
        // Rotate velocities
        const vx1 = vel1.x * cos + vel1.y * sin;
        const vy1 = vel1.y * cos - vel1.x * sin;
        const vx2 = vel2.x * cos + vel2.y * sin;
        const vy2 = vel2.y * cos - vel2.x * sin;
        
        // Impact based on type and power
        const impact1 = playerBeyblade.type === "attack" ? 1.5 : 1;
        const impact2 = opponent.type === "attack" ? 1.5 : 1;
        
        // Defense type bonus
        const defense1 = playerBeyblade.type === "defense" ? 0.7 : 1;
        const defense2 = opponent.type === "defense" ? 0.7 : 1;
        
        // Launch power bonus for player (1.0 to 1.5)
        const launchBonus = 1 + (playerLaunchPower / 20);
        
        // Final velocities after collision - applying conservation of momentum and energy
        const totalMass = playerBeyblade.power + opponent.power;
        
        // Exchange velocities based on beyblade types, power and launch bonus
        const finalVx1 = ((vx1 * (playerBeyblade.power - opponent.power * impact2) + 
                          2 * opponent.power * impact2 * vx2) / totalMass) * defense1 * launchBonus;
        
        const finalVx2 = ((vx2 * (opponent.power - playerBeyblade.power * impact1) + 
                          2 * playerBeyblade.power * impact1 * vx1) / totalMass) * defense2;
        
        // Keep vertical velocities but add some random variation
        const finalVy1 = vy1 * 0.9 + (Math.random() * 0.2 - 0.1);
        const finalVy2 = vy2 * 0.9 + (Math.random() * 0.2 - 0.1);
        
        // Rotate velocities back
        vel1.x = finalVx1 * cos - finalVy1 * sin;
        vel1.y = finalVy1 * cos + finalVx1 * sin;
        vel2.x = finalVx2 * cos - finalVy2 * sin;
        vel2.y = finalVy2 * cos + finalVx2 * sin;
        
        // Make sure neither beyblade stops completely
        const minSpeed = 0.2;
        const vel1Mag = Math.sqrt(vel1.x * vel1.x + vel1.y * vel1.y);
        const vel2Mag = Math.sqrt(vel2.x * vel2.x + vel2.y * vel2.y);
        
        if (vel1Mag < minSpeed) {
          const normalized = normalizeVector(vel1);
          vel1.x = normalized.x * minSpeed;
          vel1.y = normalized.y * minSpeed;
        }
        
        if (vel2Mag < minSpeed) {
          const normalized = normalizeVector(vel2);
          vel2.x = normalized.x * minSpeed;
          vel2.y = normalized.y * minSpeed;
        }
        
        // Clear collision effect after a short time
        setTimeout(() => {
          setCollisionEffect(false);
        }, 300);
      }
      
      // Apply positions
      setPosition1({ x: pos1.x, y: pos1.y });
      setPosition2({ x: pos2.x, y: pos2.y });
      
      // Determine winner based on frame count (simulating stamina)
      // Launch power affects stamina (higher launch = shorter duration)
      const launchStaminaFactor = Math.max(0.7, 1.1 - (playerLaunchPower / 20)); // 0.7 to 1.1
      
      // Defense type has better stamina
      const playerStamina = playerBeyblade.type === "stamina" 
        ? 1000 + playerBeyblade.power * 100 * launchStaminaFactor
        : playerBeyblade.type === "defense" 
          ? 800 + playerBeyblade.power * 80 * launchStaminaFactor
          : 600 + playerBeyblade.power * 60 * launchStaminaFactor;
          
      const opponentStamina = opponent.type === "stamina" 
        ? 1000 + opponent.power * 100 
        : opponent.type === "defense" 
          ? 800 + opponent.power * 80
          : 600 + opponent.power * 60;
      
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

  return (
    <>
      <div 
        className={`absolute transition-all duration-50 z-10 ${collisionEffect ? 'animate-pulse' : ''}`}
        style={{ 
          left: `${position1.x}%`, 
          top: `${position1.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <Beyblade
          name={playerBeyblade.name}
          color={playerBeyblade.color}
          type={playerBeyblade.type}
          power={playerBeyblade.power}
          spinning={spinning}
          size="md"
          className="transition-opacity duration-500"
        />
      </div>
      
      <div 
        className={`absolute transition-all duration-50 z-10 ${collisionEffect ? 'animate-pulse' : ''}`}
        style={{ 
          left: `${position2.x}%`, 
          top: `${position2.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <Beyblade
          name={opponent.name}
          color={opponent.color}
          type={opponent.type}
          power={opponent.power}
          spinning={spinning}
          size="md"
          className="transition-opacity duration-500"
        />
      </div>
    </>
  );
};

export default BattleSimulation;
