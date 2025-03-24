// Utility functions for Beyblade battle physics calculations

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

/**
 * Normalize a vector to have a magnitude of 1
 */
export const normalizeVector = (v: Velocity): Velocity => {
  const magnitude = Math.sqrt(v.x * v.x + v.y * v.y);
  if (magnitude === 0) return { x: 0, y: 0 };
  return { x: v.x / magnitude, y: v.y / magnitude };
};

/**
 * Handle arena boundary collisions
 */
export const handleBoundaryCollision = (position: Position, velocity: Velocity): { position: Position, velocity: Velocity } => {
  const newPosition = { ...position };
  const newVelocity = { ...velocity };
  
  if (newPosition.x < 10) { newPosition.x = 10; newVelocity.x *= -1; }
  if (newPosition.x > 90) { newPosition.x = 90; newVelocity.x *= -1; }
  if (newPosition.y < 10) { newPosition.y = 10; newVelocity.y *= -1; }
  if (newPosition.y > 90) { newPosition.y = 90; newVelocity.y *= -1; }
  
  return { position: newPosition, velocity: newVelocity };
};

/**
 * Calculate distance between two positions
 */
export const calculateDistance = (pos1: Position, pos2: Position): number => {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate collision response between two beyblades
 */
export const calculateCollision = (
  pos1: Position, 
  pos2: Position, 
  vel1: Velocity, 
  vel2: Velocity, 
  power1: number, 
  power2: number, 
  type1: string, 
  type2: string,
  launchPower: number
): { pos1: Position, pos2: Position, vel1: Velocity, vel2: Velocity } => {
  // Separate beyblades to prevent overlap
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  const overlap = 15 - distance;
  const separationX = (dx / distance) * overlap * 0.5;
  const separationY = (dy / distance) * overlap * 0.5;
  
  const newPos1 = {
    x: pos1.x + separationX,
    y: pos1.y + separationY
  };
  
  const newPos2 = {
    x: pos2.x - separationX,
    y: pos2.y - separationY
  };
  
  // Calculate collision response
  const angle = Math.atan2(dy, dx);
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  
  // Rotate velocities
  const vx1 = vel1.x * cos + vel1.y * sin;
  const vy1 = vel1.y * cos - vel1.x * sin;
  const vx2 = vel2.x * cos + vel2.y * sin;
  const vy2 = vel2.y * cos - vel2.x * sin;
  
  // Impact based on type
  const impact1 = type1 === "attack" ? 1.5 : 1;
  const impact2 = type2 === "attack" ? 1.5 : 1;
  
  // Defense type bonus
  const defense1 = type1 === "defense" ? 0.7 : 1;
  const defense2 = type2 === "defense" ? 0.7 : 1;
  
  // Launch power bonus for player (1.0 to 1.5)
  const launchBonus = 1 + (launchPower / 20);
  
  // Final velocities after collision - applying conservation of momentum and energy
  const totalMass = power1 + power2;
  
  // Exchange velocities based on beyblade types, power and launch bonus
  const finalVx1 = ((vx1 * (power1 - power2 * impact2) + 
                   2 * power2 * impact2 * vx2) / totalMass) * defense1 * launchBonus;
  
  const finalVx2 = ((vx2 * (power2 - power1 * impact1) + 
                   2 * power1 * impact1 * vx1) / totalMass) * defense2;
  
  // Keep vertical velocities but add some random variation
  const finalVy1 = vy1 * 0.9 + (Math.random() * 0.2 - 0.1);
  const finalVy2 = vy2 * 0.9 + (Math.random() * 0.2 - 0.1);
  
  // Rotate velocities back
  const newVel1 = {
    x: finalVx1 * cos - finalVy1 * sin,
    y: finalVy1 * cos + finalVx1 * sin
  };
  
  const newVel2 = {
    x: finalVx2 * cos - finalVy2 * sin,
    y: finalVy2 * cos + finalVx2 * sin
  };
  
  return {
    pos1: newPos1,
    pos2: newPos2,
    vel1: newVel1,
    vel2: newVel2
  };
};

/**
 * Ensure minimum velocity for beyblades
 */
export const ensureMinimumVelocity = (velocity: Velocity, minSpeed: number): Velocity => {
  const velMag = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
  
  if (velMag < minSpeed) {
    const normalized = normalizeVector(velocity);
    return {
      x: normalized.x * minSpeed,
      y: normalized.y * minSpeed
    };
  }
  
  return velocity;
};

/**
 * Calculate stamina based on beyblade type, power and launch power
 */
export const calculateStamina = (
  type: string, 
  power: number, 
  launchPower: number = 5
): number => {
  // Launch power affects stamina (higher launch = shorter duration)
  const launchStaminaFactor = Math.max(0.7, 1.1 - (launchPower / 20)); // 0.7 to 1.1
  
  // Different stamina values based on beyblade type
  if (type === "stamina") {
    return 1000 + power * 100 * launchStaminaFactor;
  } else if (type === "defense") {
    return 800 + power * 80 * launchStaminaFactor;
  } else {
    return 600 + power * 60 * launchStaminaFactor;
  }
};
