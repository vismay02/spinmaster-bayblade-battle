
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BeybladeType } from "@/components/Beyblade";
import { bitBeasts } from "@/data/bitBeasts";
import { BitBeast } from "@/types/bitBeast";
import BitBeastIcon from "./BitBeastIcon";

interface BitBeastSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBitBeast: BitBeast | null;
  onSelect: (bitBeast: BitBeast) => void;
  preferredCombatStyle?: BeybladeType;
}

const BitBeastSelectionDialog: React.FC<BitBeastSelectionDialogProps> = ({
  open,
  onOpenChange,
  selectedBitBeast,
  onSelect,
  preferredCombatStyle
}) => {
  const [activeTab, setActiveTab] = useState<BeybladeType>(preferredCombatStyle || "attack");
  
  // Filter bitbeasts by combat style for the active tab
  const filteredBitBeasts = bitBeasts.filter(beast => beast.combatStyle === activeTab);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-panel">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Choose Your Bit-Beast
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as BeybladeType)}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger 
              value="attack" 
              className="data-[state=active]:bg-beyblade-red/80 data-[state=active]:text-white"
            >
              Attack
            </TabsTrigger>
            <TabsTrigger 
              value="defense" 
              className="data-[state=active]:bg-beyblade-blue/80 data-[state=active]:text-white"
            >
              Defense
            </TabsTrigger>
            <TabsTrigger 
              value="stamina" 
              className="data-[state=active]:bg-beyblade-green/80 data-[state=active]:text-white"
            >
              Stamina
            </TabsTrigger>
            <TabsTrigger 
              value="balance" 
              className="data-[state=active]:bg-beyblade-yellow/80 data-[state=active]:text-white"
            >
              Balance
            </TabsTrigger>
          </TabsList>
          
          {["attack", "defense", "stamina", "balance"].map((type) => (
            <TabsContent key={type} value={type} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bitBeasts
                  .filter(beast => beast.combatStyle === type)
                  .map((beast) => (
                    <BitBeastCard
                      key={beast.id}
                      bitBeast={beast}
                      isSelected={selectedBitBeast?.id === beast.id}
                      onSelect={() => onSelect(beast)}
                    />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

interface BitBeastCardProps {
  bitBeast: BitBeast;
  isSelected: boolean;
  onSelect: () => void;
}

const BitBeastCard: React.FC<BitBeastCardProps> = ({ 
  bitBeast, 
  isSelected,
  onSelect 
}) => {
  // Get element color for styling
  const getElementColor = () => {
    switch (bitBeast.element) {
      case "fire": return "from-amber-500/20 to-red-700/10 border-amber-500/30";
      case "water": return "from-blue-500/20 to-cyan-700/10 border-blue-500/30";
      case "earth": return "from-amber-700/20 to-yellow-900/10 border-amber-700/30";
      case "air": return "from-sky-300/20 to-blue-400/10 border-sky-300/30";
      case "lightning": return "from-yellow-300/20 to-amber-500/10 border-yellow-300/30";
      case "ice": return "from-cyan-300/20 to-blue-400/10 border-cyan-300/30";
      case "darkness": return "from-purple-900/20 to-slate-900/10 border-purple-900/30";
      case "light": return "from-yellow-100/20 to-amber-200/10 border-yellow-100/30";
      default: return "from-gray-500/20 to-gray-700/10 border-gray-500/30";
    }
  };

  return (
    <div 
      className={`
        relative p-4 rounded-xl cursor-pointer transition-all duration-300
        bg-gradient-to-br ${getElementColor()} border
        ${isSelected ? 'ring-2 ring-primary scale-105' : 'hover:scale-105'}
      `}
      onClick={onSelect}
    >
      <div className="flex items-center gap-4 mb-3">
        <BitBeastIcon 
          animal={bitBeast.animal} 
          element={bitBeast.element} 
          size="lg"
          isActive={isSelected}
        />
        <div>
          <h3 className="text-lg font-bold">{bitBeast.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm capitalize">{bitBeast.animal}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-background/50">
              {bitBeast.element}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {bitBeast.description}
      </p>
      
      <div className="bg-background/30 p-2 rounded-lg">
        <h4 className="text-sm font-semibold mb-1">
          {bitBeast.specialAbility.name}
        </h4>
        <p className="text-xs text-muted-foreground">
          {bitBeast.specialAbility.description}
        </p>
      </div>
      
      {isSelected && (
        <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      )}
    </div>
  );
};

export default BitBeastSelectionDialog;
