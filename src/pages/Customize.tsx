
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import BeybladeCustomizer from "@/components/BeybladeCustomizer";
import { BeybladeType, BeybladeColor, BeybladeCharacter } from "@/components/Beyblade";
import { ArrowRight } from "lucide-react";
import { BitBeast } from "@/types/bitBeast";

const Customize = () => {
  const [savedBeyblade, setSavedBeyblade] = useState<{
    name: string;
    type: BeybladeType;
    color: BeybladeColor;
    character: BeybladeCharacter;
    power: number;
    bitBeast: BitBeast | null;
  } | null>(null);

  useEffect(() => {
    // Load saved Beyblade from localStorage on component mount
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

  const handleSaveBeyblade = (config: {
    name: string;
    type: BeybladeType;
    color: BeybladeColor;
    character: BeybladeCharacter;
    power: number;
    bitBeast: BitBeast | null;
  }) => {
    setSavedBeyblade(config);
    
    // Save to localStorage
    localStorage.setItem("beyblade", JSON.stringify(config));
    
    // Show success toast with bit-beast info if present
    if (config.bitBeast) {
      toast.success(`${config.name} with ${config.bitBeast.name} has been customized!`, {
        description: "Your powerful Beyblade is ready for battle.",
        duration: 3000,
      });
    } else {
      toast.success(`${config.name} has been customized and saved!`, {
        description: "Your Beyblade is ready for battle.",
        duration: 3000,
      });
    }
  };

  return (
    <div className="page-container">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-3/4 h-3/4 bg-gradient-radial from-beyblade-blue/10 to-transparent opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-beyblade-purple/10 to-transparent opacity-30 blur-3xl"></div>
      </div>

      <section className="w-full max-w-6xl mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="section-title">Customize Your Beyblade</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in [animation-delay:600ms]">
            Create a powerful Beyblade with a Bit-Beast that matches your battle style
          </p>
        </div>
        
        <BeybladeCustomizer 
          className="opacity-0 animate-fade-in [animation-delay:800ms]" 
          onSave={handleSaveBeyblade}
        />
        
        {savedBeyblade && (
          <div className="mt-12 text-center opacity-0 animate-fade-in [animation-delay:300ms]">
            <Link
              to="/arena"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-full transition-all transform hover:scale-105 button-glow"
            >
              Go to Battle Arena
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>
      
      <section className="w-full max-w-6xl mx-auto py-12 px-4">
        <div className="glass-panel p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Beyblade Guide</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4">Beyblade Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TypeCard
                  name="Attack"
                  description="Attack types focus on offensive power and are designed to knock out opponent Beyblades. They have high attack stats but lower stamina and defense."
                  strengths="Strong against Stamina types"
                  weaknesses="Vulnerable to Defense types"
                  color="red"
                />
                
                <TypeCard
                  name="Defense"
                  description="Defense types are built to withstand attacks and remain stable. They have excellent defensive capabilities and decent stamina."
                  strengths="Strong against Attack types"
                  weaknesses="Can be outlasted by Stamina types"
                  color="blue"
                />
                
                <TypeCard
                  name="Stamina"
                  description="Stamina types are designed to spin longer than other Beyblades. They have exceptional stamina but lower attack power."
                  strengths="Can outlast Defense types"
                  weaknesses="Vulnerable to strong Attack types"
                  color="green"
                />
                
                <TypeCard
                  name="Balance"
                  description="Balance types combine elements of Attack, Defense, and Stamina. They have no major weaknesses but also no overwhelming strengths."
                  strengths="Well-rounded performance"
                  weaknesses="No specialized advantages"
                  color="yellow"
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Bit-Beast Elements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ElementCard
                  name="Fire"
                  description="Fire element bit-beasts have explosive offensive power and can overwhelm opponents quickly."
                  color="from-amber-500/20 to-red-700/10 border-amber-500/30"
                />
                
                <ElementCard
                  name="Water"
                  description="Water element bit-beasts are adaptable and fluid, with good defensive capabilities and sustained attacks."
                  color="from-blue-500/20 to-cyan-700/10 border-blue-500/30"
                />
                
                <ElementCard
                  name="Earth"
                  description="Earth element bit-beasts are stable and powerful, with excellent defensive strength and resistance to knockback."
                  color="from-amber-700/20 to-yellow-900/10 border-amber-700/30"
                />
                
                <ElementCard
                  name="Air"
                  description="Air element bit-beasts are agile and unpredictable, with the ability to quickly change direction and evade attacks."
                  color="from-sky-300/20 to-blue-400/10 border-sky-300/30"
                />
                
                <ElementCard
                  name="Lightning"
                  description="Lightning element bit-beasts strike with precision and power, capable of devastating burst damage."
                  color="from-yellow-300/20 to-amber-500/10 border-yellow-300/30"
                />
                
                <ElementCard
                  name="Ice"
                  description="Ice element bit-beasts can slow down opponents and maintain control of the arena with their freezing capabilities."
                  color="from-cyan-300/20 to-blue-400/10 border-cyan-300/30"
                />
                
                <ElementCard
                  name="Darkness"
                  description="Darkness element bit-beasts drain energy from opponents and thrive in prolonged battles, growing stronger over time."
                  color="from-purple-900/20 to-slate-900/10 border-purple-900/30"
                />
                
                <ElementCard
                  name="Light"
                  description="Light element bit-beasts can disrupt opponent's strategies and have balanced capabilities with occasional power bursts."
                  color="from-yellow-100/20 to-amber-200/10 border-yellow-100/30"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

interface TypeCardProps {
  name: string;
  description: string;
  strengths: string;
  weaknesses: string;
  color: string;
}

const TypeCard = ({ name, description, strengths, weaknesses, color }: TypeCardProps) => {
  const colorClasses = {
    red: "from-beyblade-red/20 to-transparent border-beyblade-red/30",
    blue: "from-beyblade-blue/20 to-transparent border-beyblade-blue/30",
    green: "from-beyblade-green/20 to-transparent border-beyblade-green/30",
    yellow: "from-beyblade-yellow/20 to-transparent border-beyblade-yellow/30",
    purple: "from-beyblade-purple/20 to-transparent border-beyblade-purple/30",
  };

  return (
    <div className={`p-6 rounded-xl bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} border`}>
      <h3 className="text-xl font-semibold mb-3">{name} Type</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <div className="w-20 shrink-0 font-medium">Strengths:</div>
          <div className="text-muted-foreground">{strengths}</div>
        </div>
        
        <div className="flex items-start gap-2">
          <div className="w-20 shrink-0 font-medium">Weaknesses:</div>
          <div className="text-muted-foreground">{weaknesses}</div>
        </div>
      </div>
    </div>
  );
};

interface ElementCardProps {
  name: string;
  description: string;
  color: string;
}

const ElementCard = ({ name, description, color }: ElementCardProps) => {
  return (
    <div className={`p-4 rounded-xl bg-gradient-to-br ${color} border`}>
      <h3 className="text-lg font-semibold mb-2">{name}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default Customize;
