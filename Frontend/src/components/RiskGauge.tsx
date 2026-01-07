import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RiskGaugeProps {
  value: number; // 0-100
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
}

const RiskGauge = ({ value, size = "md", showLabel = true, animated = true }: RiskGaugeProps) => {
  const [displayValue, setDisplayValue] = useState(animated ? 0 : value);
  
  useEffect(() => {
    if (!animated) {
      setDisplayValue(value);
      return;
    }
    
    const duration = 1500;
    const startTime = Date.now();
    const startValue = 0;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(startValue + (value - startValue) * easeOut));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, animated]);

  const sizeConfig = {
    sm: { width: 120, strokeWidth: 8, fontSize: "text-2xl" },
    md: { width: 180, strokeWidth: 12, fontSize: "text-4xl" },
    lg: { width: 240, strokeWidth: 16, fontSize: "text-5xl" },
  };
  
  const config = sizeConfig[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = Math.PI * radius; // Half circle
  const offset = circumference - (displayValue / 100) * circumference;
  
  const getRiskLevel = (val: number) => {
    if (val < 25) return { label: "Low Risk", color: "text-success", bgColor: "stroke-success" };
    if (val < 50) return { label: "Moderate", color: "text-warning", bgColor: "stroke-warning" };
    if (val < 75) return { label: "High Risk", color: "text-risk-high", bgColor: "stroke-risk-high" };
    return { label: "Critical", color: "text-destructive", bgColor: "stroke-destructive" };
  };
  
  const risk = getRiskLevel(displayValue);
  
  return (
    <div className="flex flex-col items-center">
      <svg 
        width={config.width} 
        height={config.width / 2 + 20}
        className="transform"
      >
        {/* Background arc */}
        <path
          d={`M ${config.strokeWidth / 2} ${config.width / 2} 
              A ${radius} ${radius} 0 0 1 ${config.width - config.strokeWidth / 2} ${config.width / 2}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          className="text-muted"
          strokeLinecap="round"
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--success))" />
            <stop offset="40%" stopColor="hsl(var(--warning))" />
            <stop offset="70%" stopColor="hsl(var(--risk-high))" />
            <stop offset="100%" stopColor="hsl(var(--destructive))" />
          </linearGradient>
        </defs>
        
        {/* Value arc */}
        <path
          d={`M ${config.strokeWidth / 2} ${config.width / 2} 
              A ${radius} ${radius} 0 0 1 ${config.width - config.strokeWidth / 2} ${config.width / 2}`}
          fill="none"
          stroke="url(#riskGradient)"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-100"
          style={{ filter: "drop-shadow(0 2px 8px hsl(var(--primary) / 0.3))" }}
        />
        
        {/* Center text */}
        <text
          x={config.width / 2}
          y={config.width / 2 - 10}
          textAnchor="middle"
          className={cn("font-display font-bold fill-foreground", config.fontSize)}
        >
          {displayValue}%
        </text>
      </svg>
      
      {showLabel && (
        <div className={cn("mt-2 font-semibold text-lg", risk.color)}>
          {risk.label}
        </div>
      )}
    </div>
  );
};

export default RiskGauge;
