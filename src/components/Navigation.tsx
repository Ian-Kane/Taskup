import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckSquare, Plus, Home, Target } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Target className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              TaskUp
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </Button>
            
            <Button
              variant={isActive("/goals/new") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/goals/new" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>New Goal</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;