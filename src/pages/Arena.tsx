
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import BeybladeArena from "@/components/BeybladeArena";
import LaunchControl from "@/components/LaunchControl";
import Beyblade, { BeybladeType, BeybladeColor, BeybladeCharacter } from "@/components/Beyblade";

interface SavedBeyblade {
  name: string;
  type: BeybladeType;
  color: BeybladeColor;
  character: BeybladeCharacter;
  power: number;
}

const Arena = () => {
  const [savedBeyblade, setSavedBeyblade] = useState<SavedBeyblade | null>(null);
  const [launchPower, setLaunchPower] = useState(0);
  const [battleStarted, setBattleStarted] = useState(false);

  useEffect(() => {
    // Load saved Beyblade from localStorage
    const savedData = localStorage.getItem("beyblade");
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setSavedBeyblade(parsedData);
      } catch (error) {
        console.error("Failed to parse saved Beyblade data", error);
      }
    }
  }, []);

  const handleLaunch = (power: number) => {
    if (power > 0) {
      setLaunchPower(power);
      
      const powerMessage = power <= 3 
        ? "Weak launch! Try to pull harder next time." 
        : power <= 7 
          ? "Good launch! Your Beyblade is spinning well." 
          : "Powerful launch! Your Beyblade is at maximum power!";
      
      toast.success("Beyblade launched!", {
        description: powerMessage,
        duration: 3000,
      });
    }
  };

  const handleBattleStateChange = (isStarted: boolean) => {
    setBattleStarted(isStarted);
  };

  return (
    <div className="page-container">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-beyblade-purple/10 to-transparent opacity-40 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-gradient-radial from-beyblade-blue/10 to-transparent opacity-30 blur-3xl"></div>
      </div>

      <section className="w-full max-w-6xl mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="section-title">Battle Arena</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in [animation-delay:600ms]">
            Launch your Beyblade and challenge your opponents
          </p>
        </div>
        
        {!savedBeyblade ? (
          <div className="glass-panel p-8 rounded-2xl text-center opacity-0 animate-fade-in [animation-delay:800ms]">
            <h2 className="text-xl font-semibold mb-4">No Beyblade Selected</h2>
            <p className="text-muted-foreground mb-6">
              You need to customize your Beyblade before entering the arena
            </p>
            <Link
              to="/customize"
              className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-full transition-all transform hover:scale-105 button-glow"
            >
              Go to Customization
            </Link>
          </div>
        ) : (
          <div className="opacity-0 animate-fade-in [animation-delay:800ms]">
            <div className="mb-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 glass-panel p-6 rounded-2xl mb-8">
                <div className="flex items-center gap-4">
                  <Beyblade
                    name={savedBeyblade.name}
                    color={savedBeyblade.color}
                    type={savedBeyblade.type}
                    character={savedBeyblade.character}
                    power={savedBeyblade.power}
                    spinning={false}
                    size="sm"
                  />
                  
                  <div>
                    <h3 className="text-lg font-semibold">{savedBeyblade.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <div className="text-xs bg-secondary px-2 py-1 rounded-full">
                        {savedBeyblade.type.charAt(0).toUpperCase() + savedBeyblade.type.slice(1)} Type
                      </div>
                      <div className="text-xs bg-secondary px-2 py-1 rounded-full">
                        Power: {savedBeyblade.power}/10
                      </div>
                    </div>
                  </div>
                </div>
                
                <Link
                  to="/customize"
                  className="px-4 py-2 bg-secondary/80 text-white text-sm font-medium rounded-full transition-all hover:bg-secondary"
                >
                  Change Beyblade
                </Link>
              </div>
              
              <LaunchControl 
                onLaunch={handleLaunch} 
                className="mb-12"
                disabled={battleStarted}
              />
            </div>
            
            <BeybladeArena
              playerLaunchPower={launchPower}
              onBattleStateChange={handleBattleStateChange}
              playerBeyblade={savedBeyblade}
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default Arena;
