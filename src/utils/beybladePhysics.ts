
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
  
  if (newPosition.x < 10) { newPosition.x = 10; newVelocity.x *= -0.9; }
  if (newPosition.x > 90) { newPosition.x = 90; newVelocity.x *= -0.9; }
  if (newPosition.y < 10) { newPosition.y = 10; newVelocity.y *= -0.9; }
  if (newPosition.y > 90) { newPosition.y = 90; newVelocity.y *= -0.9; }
  
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
  // Calculate direction vector from pos2 to pos1
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Ensure minimum distance to prevent division by zero
  if (distance < 0.1) {
    return {
      pos1: { x: pos1.x + 1, y: pos1.y },
      pos2: { x: pos2.x - 1, y: pos2.y },
      vel1, vel2
    };
  }
  
  // Separate beyblades to prevent overlap - minimum 18 units apart
  const minDistance = 18;
  const overlap = minDistance - distance;
  
  if (overlap > 0) {
    // Normalize direction vector
    const nx = dx / distance;
    const ny = dy / distance;
    
    // Move each beyblade half the overlap distance
    const moveX = nx * overlap * 0.5;
    const moveY = ny * overlap * 0.5;
    
    const newPos1 = {
      x: pos1.x + moveX,
      y: pos1.y + moveY
    };
    
    const newPos2 = {
      x: pos2.x - moveX,
      y: pos2.y - moveY
    };
    
    // Calculate collision angle
    const angle = Math.atan2(dy, dx);
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    
    // Rotate velocities to collision space
    const vx1 = vel1.x * cos + vel1.y * sin;
    const vy1 = vel1.y * cos - vel1.x * sin;
    const vx2 = vel2.x * cos + vel2.y * sin;
    const vy2 = vel2.y * cos - vel2.x * sin;
    
    // Impact modifiers based on beyblade types
    const impact1 = type1 === "attack" ? 1.5 : 1;
    const impact2 = type2 === "attack" ? 1.5 : 1;
    
    // Defense type bonus - defense types lose less momentum in collisions
    const defense1 = type1 === "defense" ? 0.7 : 1;
    const defense2 = type2 === "defense" ? 0.7 : 1;
    
    // Launch power bonus for player (1.0 to 1.5)
    const launchBonus = 1 + (launchPower / 20);
    
    // Calculate masses for collision (based on power)
    const totalMass = power1 + power2;
    
    // Final velocities after collision - applying elastic collision formula with modifiers
    const finalVx1 = ((vx1 * (power1 - power2 * impact2) + 
                     2 * power2 * impact2 * vx2) / totalMass) * defense1 * launchBonus;
    
    const finalVx2 = ((vx2 * (power2 - power1 * impact1) + 
                     2 * power1 * impact1 * vx1) / totalMass) * defense2;
    
    // Add some random variation to vertical velocities to make battles less predictable
    const finalVy1 = vy1 * 0.95 + (Math.random() * 0.4 - 0.2);
    const finalVy2 = vy2 * 0.95 + (Math.random() * 0.4 - 0.2);
    
    // Rotate velocities back to world space
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
  }
  
  // If no actual overlap, just return the original values
  return { pos1, pos2, vel1, vel2 };
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
