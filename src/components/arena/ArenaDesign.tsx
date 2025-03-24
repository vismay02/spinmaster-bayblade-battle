
import { cn } from "@/lib/utils";

interface ArenaDesignProps {
  className?: string;
}

const ArenaDesign = ({ className }: ArenaDesignProps) => {
  return (
    <div className={cn("relative w-full aspect-square rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-gray-700 shadow-[inset_0_0_100px_rgba(0,0,0,0.6),0_0_30px_rgba(14,165,233,0.3)] overflow-hidden", className)}>
      {/* Arena design elements */}
      <div className="absolute inset-[10%] rounded-full border border-gray-600"></div>
      <div className="absolute inset-[20%] rounded-full border border-gray-600"></div>
      <div className="absolute inset-[30%] rounded-full border border-gray-600"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/40 pointer-events-none"></div>
    </div>
  );
};

export default ArenaDesign;
