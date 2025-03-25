
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Beyblade, { 
  BeybladeType, 
  BeybladeColor, 
  BeybladeCharacter,
  BEYBLADE_TYPES, 
  BEYBLADE_COLORS,
  BEYBLADE_CHARACTERS
} from "./Beyblade";
import { BitBeast } from "@/types/bitBeast";
import BitBeastSelectionDialog from "./bitbeast/BitBeastSelectionDialog";
import BitBeastIcon from "./bitbeast/BitBeastIcon";

interface BeybladeCustomizerProps {
  className?: string;
  onSave?: (config: {
    name: string;
    type: BeybladeType;
    color: BeybladeColor;
    character: BeybladeCharacter;
    power: number;
    bitBeast: BitBeast | null;
  }) => void;
}

const BeybladeCustomizer = ({ className, onSave }: BeybladeCustomizerProps) => {
  const [name, setName] = useState("Striker");
  const [type, setType] = useState<BeybladeType>("attack");
  const [color, setColor] = useState<BeybladeColor>("blue");
  const [character, setCharacter] = useState<BeybladeCharacter>("user");
  const [power, setPower] = useState(8);
  const [spinning, setSpinning] = useState(false);
  const [selectedBitBeast, setSelectedBitBeast] = useState<BitBeast | null>(null);
  const [showBitBeastDialog, setShowBitBeastDialog] = useState(false);
  const [showSpecialEffect, setShowSpecialEffect] = useState(false);

  const handleSave = () => {
    if (onSave) {
      onSave({ name, type, color, character, power, bitBeast: selectedBitBeast });
    }
  };

  const toggleSpin = () => {
    setSpinning(!spinning);
  };

  const selectBitBeast = (bitBeast: BitBeast) => {
    setSelectedBitBeast(bitBeast);
    setShowBitBeastDialog(false);
    // Automatically update type to match bit-beast combat style
    setType(bitBeast.combatStyle);
    // Show special effect animation
    setShowSpecialEffect(true);
    setTimeout(() => setShowSpecialEffect(false), 1500);
  };

  const testSpecialAbility = () => {
    if (selectedBitBeast) {
      setShowSpecialEffect(true);
      setTimeout(() => setShowSpecialEffect(false), 1500);
    }
  };

  return (
    <div className={cn("w-full max-w-3xl mx-auto", className)}>
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="mb-8 relative">
            <Beyblade
              name={name}
              type={type}
              color={color}
              character={character}
              power={power}
              bitBeast={selectedBitBeast}
              spinning={spinning}
              specialAbilityActive={showSpecialEffect}
              size="lg"
              className="mx-auto"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={toggleSpin}
              className="px-6 py-2 bg-secondary text-white font-medium rounded-full transition-all hover:bg-secondary/80 active:scale-95 button-glow"
            >
              {spinning ? "Stop Spinning" : "Test Spin"}
            </button>
            {selectedBitBeast && (
              <button
                onClick={testSpecialAbility}
                className="px-6 py-2 bg-primary text-white font-medium rounded-full transition-all hover:bg-primary/80 active:scale-95 button-glow"
              >
                Test Special Ability
              </button>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 glass-panel p-6">
          <h3 className="text-xl font-bold mb-4">Customize Your Beyblade</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              maxLength={20}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Type</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(BEYBLADE_TYPES).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setType(key as BeybladeType)}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-all",
                    type === key 
                      ? "bg-primary text-white" 
                      : "bg-secondary/50 text-gray-300 hover:bg-secondary"
                  )}
                >
                  {value.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {type ? BEYBLADE_TYPES[type].description : ""}
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Color</label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(BEYBLADE_COLORS).map((key) => (
                <button
                  key={key}
                  onClick={() => setColor(key as BeybladeColor)}
                  className={cn(
                    "w-8 h-8 rounded-full transition-all",
                    BEYBLADE_COLORS[key as BeybladeColor],
                    color === key 
                      ? "ring-2 ring-white scale-110" 
                      : "hover:scale-105"
                  )}
                  aria-label={`Select ${key} color`}
                />
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Bit-Beast</label>
              {selectedBitBeast && (
                <button 
                  onClick={() => setSelectedBitBeast(null)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              )}
            </div>
            
            {selectedBitBeast ? (
              <div 
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-700 bg-background/50 cursor-pointer hover:bg-background/80 transition-colors"
                onClick={() => setShowBitBeastDialog(true)}
              >
                <BitBeastIcon 
                  animal={selectedBitBeast.animal}
                  element={selectedBitBeast.element}
                  size="md"
                />
                <div>
                  <div className="font-medium">{selectedBitBeast.name}</div>
                  <div className="text-xs text-muted-foreground flex gap-2 items-center">
                    <span className="capitalize">{selectedBitBeast.animal}</span>
                    <span>•</span>
                    <span className="capitalize">{selectedBitBeast.element}</span>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowBitBeastDialog(true)}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-gray-600 hover:border-primary text-muted-foreground hover:text-primary transition-colors"
              >
                <Plus size={16} />
                <span>Select a Bit-Beast</span>
              </button>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Character</label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {Object.entries(BEYBLADE_CHARACTERS).map(([key, value]) => {
                const Icon = value.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setCharacter(key as BeybladeCharacter)}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-md transition-all",
                      character === key 
                        ? "bg-primary text-white" 
                        : "bg-secondary/50 text-gray-300 hover:bg-secondary"
                    )}
                  >
                    <Icon size={24} className="mb-1" />
                    <span className="text-xs">{value.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between">
              <label className="block text-sm font-medium">Power</label>
              <span className="text-sm">{power}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={power}
              onChange={(e) => setPower(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
          
          <button
            onClick={handleSave}
            className="w-full py-3 bg-primary text-white font-semibold rounded-full transition-all hover:scale-105 active:scale-95 button-glow"
          >
            Save Beyblade
          </button>
        </div>
      </div>

      <BitBeastSelectionDialog
        open={showBitBeastDialog}
        onOpenChange={setShowBitBeastDialog}
        selectedBitBeast={selectedBitBeast}
        onSelect={selectBitBeast}
        preferredCombatStyle={type}
      />
    </div>
  );
};

export default BeybladeCustomizer;
