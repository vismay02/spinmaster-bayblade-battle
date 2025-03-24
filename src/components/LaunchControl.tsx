
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";

interface LaunchControlProps {
  className?: string;
  onLaunch: (power: number) => void;
}

const LaunchControl = ({ className, onLaunch }: LaunchControlProps) => {
  const [isPulling, setIsPulling] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [launchPower, setLaunchPower] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPulling(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPulling(true);
    setStartY(e.clientY);
    setCurrentY(e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return;
    const y = e.touches[0].clientY;
    setCurrentY(y);
    calculatePower(y);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPulling) return;
    const y = e.clientY;
    setCurrentY(y);
    calculatePower(y);
  };

  const handleTouchEnd = () => {
    if (!isPulling) return;
    handleLaunch();
  };

  const handleMouseUp = () => {
    if (!isPulling) return;
    handleLaunch();
  };

  const calculatePower = (y: number) => {
    // Calculate distance pulled (startY - y is positive when pulling up)
    const distance = Math.max(0, startY - y);
    // Lower the maxDistance to make it easier to reach higher power levels
    const maxDistance = 100; // Changed from 200 to 100 for easier high power reaches
    const power = Math.min(10, Math.floor((distance / maxDistance) * 10) + 1);
    setLaunchPower(power);
  };

  const handleLaunch = () => {
    onLaunch(launchPower);
    setIsPulling(false);
    setLaunchPower(0);
  };

  return (
    <div 
      className={cn(
        "w-full max-w-md mx-auto select-none", 
        className
      )}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchEnd={handleTouchEnd}
    >
      <div className="glass-panel p-6 flex flex-col items-center">
        <div className="text-lg font-medium mb-4">Launch Control</div>
        
        <div className="w-full h-40 bg-background/60 rounded-xl relative mb-4 overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none"></div>
          
          <div className="h-full flex flex-col items-center justify-end">
            <div 
              className={cn(
                "w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold cursor-grab transition-transform",
                isPulling ? "cursor-grabbing" : "",
                launchPower > 7 ? "animate-pulse-glow" : ""
              )}
              style={{ 
                transform: isPulling 
                  ? `translateY(-${Math.min(100, (launchPower / 10) * 100)}px)` 
                  : "translateY(0)" 
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            >
              <ArrowUp 
                className={cn(
                  "transition-transform", 
                  isPulling ? "scale-75" : "animate-bounce"
                )} 
              />
            </div>
          </div>
        </div>
        
        <div className="w-full bg-secondary/50 h-5 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-primary transition-all"
            style={{ width: `${(launchPower / 10) * 100}%` }}
          ></div>
        </div>
        
        <div className="text-lg font-bold">
          Power: {launchPower}/10
        </div>
        
        <div className="text-sm text-muted-foreground mt-2 text-center">
          {isPulling 
            ? "Release to launch!" 
            : "Pull up and release to launch your Beyblade"}
        </div>
      </div>
    </div>
  );
};

export default LaunchControl;
