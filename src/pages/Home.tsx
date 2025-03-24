import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Beyblade from "@/components/Beyblade";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowRight } from "lucide-react";

const Home = () => {
  const [loaded, setLoaded] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="page-container">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-primary/10 to-transparent opacity-70 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-gradient-radial from-beyblade-purple/10 to-transparent opacity-50 blur-3xl"></div>
      </div>

      <section className="w-full max-w-6xl mx-auto pt-20 pb-16 px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2 text-left">
            <div className="inline-block px-3 py-1 bg-primary/10 rounded-full mb-4 opacity-0 animate-fade-in">
              <span className="text-primary text-sm font-medium">Ultimate Spinning Top Battles</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 opacity-0 animate-fade-in [animation-delay:200ms]">
              Master the <span className="text-primary text-glow">Beyblade</span> Arena
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 opacity-0 animate-fade-in [animation-delay:400ms]">
              Customize your Beyblade, perfect your launch technique, and battle against opponents in fast-paced, strategic spinning top duels.
            </p>
            
            <div className="flex flex-wrap gap-4 opacity-0 animate-fade-in [animation-delay:600ms]">
              <Link
                to="/customize"
                className="px-6 py-3 bg-primary text-white font-semibold rounded-full transition-all transform hover:scale-105 flex items-center gap-2 button-glow"
              >
                Start Customizing
                <ArrowRight size={16} />
              </Link>
              
              <Link
                to="/arena"
                className="px-6 py-3 bg-secondary/80 text-white font-semibold rounded-full transition-all transform hover:scale-105 hover:bg-secondary"
              >
                Battle Arena
              </Link>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 flex justify-center opacity-0 animate-fade-in [animation-delay:800ms]">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent rounded-full blur-xl"></div>
              
              <div className="relative">
                <Beyblade
                  name="Striker"
                  color="blue"
                  type="attack"
                  character="user-round"
                  power={9}
                  spinning={loaded}
                  size="lg"
                />
              </div>
              
              <div className="absolute -bottom-16 -right-16 opacity-80">
                <Beyblade
                  name="Defender"
                  color="red"
                  type="defense"
                  character="dog"
                  power={8}
                  spinning={loaded}
                  size="md"
                />
              </div>
              
              <div className="absolute -top-10 -left-10 opacity-80">
                <Beyblade
                  name="Endurance"
                  color="green"
                  type="stamina"
                  character="bird"
                  power={7}
                  spinning={loaded}
                  size="md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-6xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Game Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in [animation-delay:600ms]">
            Experience the thrill of Beyblade battles with these exciting features
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            title="Customize Beyblades" 
            description="Design your perfect Beyblade with different types, colors, and power levels."
            delay={100}
            icon={
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-primary"></div>
              </div>
            }
          />
          
          <FeatureCard 
            title="Perfect Your Launch" 
            description="Master the launch technique to give your Beyblade the perfect spin and power."
            delay={300}
            icon={
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ArrowRight className="text-primary" />
              </div>
            }
          />
          
          <FeatureCard 
            title="Strategic Battles" 
            description="Engage in tactical battles where type advantages and launch timing matter."
            delay={500}
            icon={
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-primary rounded-full"></div>
              </div>
            }
          />
        </div>
      </section>
      
      <section className="w-full max-w-6xl mx-auto py-16 px-4">
        <div className="glass-panel p-8 md:p-12 rounded-2xl">
          <div className="text-center">
            <h2 className="section-title">Ready to Battle?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8 opacity-0 animate-fade-in [animation-delay:600ms]">
              Choose your Beyblade, perfect your launch, and challenge opponents in the arena!
            </p>
            
            <Link
              to="/arena"
              className="inline-block px-8 py-4 bg-primary text-white font-semibold rounded-full transition-all transform hover:scale-105 opacity-0 animate-fade-in [animation-delay:800ms] button-glow"
            >
              Enter the Arena
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

const FeatureCard = ({ title, description, icon, delay = 0 }: FeatureCardProps) => {
  return (
    <div 
      className="glass-panel p-6 rounded-xl opacity-0 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Home;
