
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-background/90 backdrop-blur-md shadow-md py-3" 
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-full bg-primary animate-pulse-glow">
            <div className="absolute inset-[20%] rounded-full bg-background flex items-center justify-center">
              <div className="w-1/2 h-1/2 bg-primary rounded-full"></div>
            </div>
          </div>
          <span className="text-xl font-bold">BeyGame</span>
        </Link>

        <nav className="flex gap-1">
          <NavLink to="/" isActive={isActive("/")}>
            Home
          </NavLink>
          <NavLink to="/customize" isActive={isActive("/customize")}>
            Customize
          </NavLink>
          <NavLink to="/arena" isActive={isActive("/arena")}>
            Arena
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, isActive, children }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-full transition-all ${
        isActive
          ? "bg-primary text-white" 
          : "text-foreground hover:bg-secondary/80"
      }`}
    >
      {children}
    </Link>
  );
};

export default Header;
