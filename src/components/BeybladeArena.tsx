
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Beyblade, { BeybladeProps } from "./Beyblade";

interface ArenaProps {
  className?: string;
}

const BeybladeArena = ({ className }: ArenaProps) => {
  const arenaRef = useRef<HTMLDivElement>(null);
  const [position1, setPosition1] = useState({ x: 30, y: 30 });
  const [position2, setPosition2] = useState({ x: 70, y: 70 });
  const [spinning, setSpinning] = useState(false);
  const [battleStarted, setBattleStarted] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const player = {
    name: "Striker",
    color: "blue" as const,
    type: "attack" as const,
    power: 8,
  };

  const opponent = {
    name: "Defender",
    color: "red" as const,
    type: "defense" as const,
    power: 7,
  };

  useEffect(() => {
    if (!battleStarted) return;

    let timer: NodeJS.Timeout;
    let collisionCount = 0;
    let frameCount = 0;
    let pos1 = { ...position1 };
    let pos2 = { ...position2 };
    let vel1 = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
    let vel2 = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
    
    const normalizeVector = (v: {x: number, y: number}) => {
      const magnitude = Math.sqrt(v.x * v.x + v.y * v.y);
      return { x: v.x / magnitude, y: v.y / magnitude };
    };
    
    vel1 = normalizeVector(vel1);
    vel2 = normalizeVector(vel2);
    
    const animate = () => {
      frameCount++;
      
      // Update positions with velocity
      pos1.x += vel1.x * (player.power / 10);
      pos1.y += vel1.y * (player.power / 10);
      pos2.x += vel2.x * (opponent.power / 10);
      pos2.y += vel2.y * (opponent.power / 10);
      
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
      
      if (distance < 20) {
        collisionCount++;
        
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
        const impact1 = player.type === "attack" ? 1.5 : 1;
        const impact2 = opponent.type === "attack" ? 1.5 : 1;
        
        // Rotation factor (just to make it more random and interesting)
        const rotFactor = Math.random() * 0.2 + 0.9;
        
        // Final velocities after collision
        const finalVx1 = ((player.power * impact1) / (player.power + opponent.power)) * vx2 * rotFactor;
        const finalVy1 = vy1;
        const finalVx2 = ((opponent.power * impact2) / (player.power + opponent.power)) * vx1 * rotFactor;
        const finalVy2 = vy2;
        
        // Rotate velocities back
        vel1.x = finalVx1 * cos - finalVy1 * sin;
        vel1.y = finalVy1 * cos + finalVx1 * sin;
        vel2.x = finalVx2 * cos - finalVy2 * sin;
        vel2.y = finalVy2 * cos + finalVx2 * sin;
        
        // Apply small random perturbation
        vel1.x += (Math.random() * 0.2 - 0.1);
        vel1.y += (Math.random() * 0.2 - 0.1);
        vel2.x += (Math.random() * 0.2 - 0.1);
        vel2.y += (Math.random() * 0.2 - 0.1);
        
        // Normalize vectors again
        const vel1Norm = normalizeVector(vel1);
        const vel2Norm = normalizeVector(vel2);
        vel1 = vel1Norm;
        vel2 = vel2Norm;
      }
      
      // Apply positions
      setPosition1({ x: pos1.x, y: pos1.y });
      setPosition2({ x: pos2.x, y: pos2.y });
      
      // Determine winner based on frame count (simulating stamina)
      // Defense type has better stamina
      const playerStamina = player.type === "stamina" 
        ? 1000 + player.power * 100 
        : player.type === "defense" 
          ? 800 + player.power * 80
          : 600 + player.power * 60;
          
      const opponentStamina = opponent.type === "stamina" 
        ? 1000 + opponent.power * 100 
        : opponent.type === "defense" 
          ? 800 + opponent.power * 80
          : 600 + opponent.power * 60;
      
      // End battle conditions
      if (frameCount > Math.max(playerStamina, opponentStamina)) {
        clearTimeout(timer);
        setSpinning(false);
        setBattleStarted(false);
        
        if (playerStamina > opponentStamina) {
          setWinner(player.name);
        } else if (opponentStamina > playerStamina) {
          setWinner(opponent.name);
        } else {
          // In case of a tie, the one with more power wins
          setWinner(player.power > opponent.power ? player.name : opponent.name);
        }
        
        return;
      }
      
      timer = setTimeout(animate, 50);
    };
    
    animate();
    
    return () => {
      clearTimeout(timer);
    };
  }, [battleStarted]);

  const startBattle = () => {
    setWinner(null);
    setSpinning(true);
    setPosition1({ x: 30, y: 30 });
    setPosition2({ x: 70, y: 70 });
    
    // Short delay before starting the battle animation
    setTimeout(() => {
      setBattleStarted(true);
    }, 500);
  };

  return (
    <div className={cn("w-full max-w-3xl mx-auto px-4", className)}>
      <div 
        ref={arenaRef}
        className="relative w-full aspect-square rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-gray-700 shadow-[inset_0_0_100px_rgba(0,0,0,0.6),0_0_30px_rgba(14,165,233,0.3)] overflow-hidden mb-8"
      >
        {/* Arena design elements */}
        <div className="absolute inset-[10%] rounded-full border border-gray-600"></div>
        <div className="absolute inset-[20%] rounded-full border border-gray-600"></div>
        <div className="absolute inset-[30%] rounded-full border border-gray-600"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/40 pointer-events-none"></div>
        
        {/* Beyblades */}
        <div 
          className="absolute transition-all duration-50 z-10"
          style={{ 
            left: `${position1.x}%`, 
            top: `${position1.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Beyblade
            name={player.name}
            color={player.color}
            type={player.type}
            power={player.power}
            spinning={spinning}
            size="md"
            className="transition-opacity duration-500"
          />
        </div>
        
        <div 
          className="absolute transition-all duration-50 z-10"
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
      </div>
      
      <div className="flex flex-col items-center justify-center space-y-4">
        {winner && (
          <div className="text-2xl font-bold text-primary animate-fade-in">
            {winner} wins!
          </div>
        )}
        
        <button
          onClick={startBattle}
          disabled={battleStarted}
          className="px-8 py-3 bg-primary text-white font-semibold rounded-full transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none button-glow"
        >
          {battleStarted ? "Battle in progress..." : "Start Battle"}
        </button>
      </div>
    </div>
  );
};

export default BeybladeArena;
