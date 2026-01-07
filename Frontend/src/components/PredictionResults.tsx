import RiskGauge from "./RiskGauge";
import FeatureImportanceChart from "./FeatureImportanceChart";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Info, RotateCcw, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureData {
  name: string;
  value: number;
  impact: "positive" | "negative";
}

interface PredictionResult {
  riskScore: number;
  features: FeatureData[];
  recommendations: string[];
  modelUsed: string;
}

interface PredictionResultsProps {
  result: PredictionResult;
  onReset: () => void;
}

const PredictionResults = ({ result, onReset }: PredictionResultsProps) => {
  const getRiskCategory = (score: number) => {
    if (score < 25) return {
      level: "low",
      title: "Low Risk",
      description: "Your cardiovascular health indicators are within healthy ranges.",
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-success/30",
    };
    if (score < 50) return {
      level: "moderate",
      title: "Moderate Risk",
      description: "Some health indicators suggest room for improvement.",
      icon: Info,
      color: "text-warning",
      bgColor: "bg-warning/10",
      borderColor: "border-warning/30",
    };
    if (score < 75) return {
      level: "high",
      title: "High Risk",
      description: "Multiple risk factors detected. Consider consulting a healthcare provider.",
      icon: AlertTriangle,
      color: "text-risk-high",
      bgColor: "bg-risk-high/10",
      borderColor: "border-risk-high/30",
    };
    return {
      level: "critical",
      title: "Critical Risk",
      description: "Significant cardiovascular risk factors present. Seek medical attention.",
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/30",
    };
  };

  const category = getRiskCategory(result.riskScore);
  const Icon = category.icon;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Risk Score Card */}
      <div className={cn(
        "glass-card rounded-2xl p-8 border-2",
        category.borderColor
      )}>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <RiskGauge value={result.riskScore} size="lg" />
          
          <div className="flex-1 text-center lg:text-left">
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4",
              category.bgColor
            )}>
              <Icon className={cn("w-5 h-5", category.color)} />
              <span className={cn("font-semibold", category.color)}>
                {category.title}
              </span>
            </div>
            
            <p className="text-muted-foreground text-lg mb-4">
              {category.description}
            </p>
            
            <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span>Model: {result.modelUsed}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Importance */}
      <FeatureImportanceChart 
        features={result.features}
        title="SHAP Feature Analysis — Why This Score?"
      />

      {/* Recommendations */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Personalized Recommendations
        </h3>
        
        <ul className="space-y-3">
          {result.recommendations.map((rec, index) => (
            <li 
              key={index}
              className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-1.5 rounded-full bg-primary/10 mt-0.5">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              <span className="text-foreground">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-muted/50 border border-border">
        <p className="text-xs text-muted-foreground text-center">
          <strong>Medical Disclaimer:</strong> This prediction is based on statistical models and should not replace professional medical advice. 
          Always consult with a qualified healthcare provider for diagnosis and treatment decisions.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-center">
        <Button onClick={onReset} variant="outline" size="lg" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          New Assessment
        </Button>
      </div>
    </div>
  );
};

export default PredictionResults;
