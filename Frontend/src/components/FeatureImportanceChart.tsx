import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface FeatureData {
  name: string;
  value: number; // Can be positive or negative
  impact: "positive" | "negative";
}

interface FeatureImportanceChartProps {
  features: FeatureData[];
  title?: string;
  animated?: boolean;
}

const FeatureImportanceChart = ({ 
  features, 
  title = "Risk Factor Analysis",
  animated = true 
}: FeatureImportanceChartProps) => {
  const [animatedFeatures, setAnimatedFeatures] = useState<FeatureData[]>(
    animated ? features.map(f => ({ ...f, value: 0 })) : features
  );
  
  useEffect(() => {
    if (!animated) return;
    
    const timer = setTimeout(() => {
      setAnimatedFeatures(features);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [features, animated]);
  
  const maxAbsValue = Math.max(...features.map(f => Math.abs(f.value)));
  
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-display text-lg font-semibold text-foreground mb-6">
        {title}
      </h3>
      
      <div className="space-y-4">
        {animatedFeatures.map((feature, index) => {
          const percentage = (Math.abs(feature.value) / maxAbsValue) * 100;
          const isPositive = feature.impact === "positive";
          
          return (
            <div 
              key={feature.name}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">
                  {feature.name}
                </span>
                <span className={cn(
                  "text-sm font-semibold",
                  isPositive ? "text-destructive" : "text-success"
                )}>
                  {isPositive ? "+" : "-"}{Math.abs(feature.value).toFixed(2)}
                </span>
              </div>
              
              <div className="h-3 bg-muted rounded-full overflow-hidden relative">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-700 ease-out",
                    isPositive 
                      ? "bg-gradient-to-r from-warning to-destructive" 
                      : "bg-gradient-to-r from-success/70 to-success"
                  )}
                  style={{ 
                    width: `${percentage}%`,
                    boxShadow: isPositive 
                      ? "0 0 10px hsl(var(--destructive) / 0.4)"
                      : "0 0 10px hsl(var(--success) / 0.4)"
                  }}
                />
              </div>
              
              <p className="text-xs text-muted-foreground mt-1">
                {isPositive ? "Increases" : "Decreases"} cardiovascular risk
              </p>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-warning to-destructive" />
            <span className="text-muted-foreground">Increases Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-success/70 to-success" />
            <span className="text-muted-foreground">Decreases Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureImportanceChart;
