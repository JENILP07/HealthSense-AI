import { Heart, Activity, Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg animate-pulse-slow" />
              <div className="relative p-2 rounded-xl gradient-primary">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                HeartSense AI
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">
                Cardiovascular Risk Prediction
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/30">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-success">Model Ready</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
              <Activity className="w-4 h-4" />
              <span>Dashboard</span>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a 
                href="https://github.com/JENILP07/HealthSense-AI" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="View on GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
