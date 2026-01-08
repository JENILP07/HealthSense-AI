import type { HealthData } from "@/components/HealthInputForm";

export interface FeatureData {
  name: string;
  value: number;
  impact: "positive" | "negative";
}

export interface PredictionResult {
  riskScore: number;
  features: FeatureData[];
  recommendations: string[];
  modelUsed: string;
}
  
// Simulates a SHAP-based prediction analysis
export async function analyzeCVDRisk(data: HealthData): Promise<PredictionResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const features: FeatureData[] = [];
  const recommendations: string[] = [];
  
  // Base Line Risk Score (Probability for an average person)
  let currentScore = 30; 

  // --- 1. Age Factor ---
  // Baseline: 50 years old
  // Impact: +/- 0.8 per year difference
  const ageBaseline = 50;
  const ageDiff = data.age - ageBaseline;
  const ageImpact = ageDiff * 0.8;
  currentScore += ageImpact;
  features.push({
    name: "Age",
    value: parseFloat(ageImpact.toFixed(2)),
    impact: ageImpact > 0 ? "positive" : "negative"
  });

  // --- 2. BMI Factor ---
  // BMI = weight(kg) / height(m)^2
  // Baseline: 25 (Upper end of normal)
  const heightInMeters = data.height / 100;
  // Prevent division by zero
  const h = heightInMeters > 0 ? heightInMeters : 1.7; 
  const bmi = data.weight / (h * h);
  
  const bmiBaseline = 25;
  const bmiDiff = bmi - bmiBaseline;
  // Impact: +/- 1 per BMI point difference
  const bmiImpact = bmiDiff * 1.5;
  currentScore += bmiImpact;
  
  features.push({
    name: "BMI",
    value: parseFloat(bmiImpact.toFixed(2)),
    impact: bmiImpact > 0 ? "positive" : "negative"
  });

  if (bmi > 30) {
    recommendations.push("Work towards a healthy weight through balanced nutrition and regular exercise.");
  }

  // --- 3. Systolic BP Factor ---
  // Baseline: 120 mmHg
  const sysBaseline = 120;
  const sysDiff = data.systolicBP - sysBaseline;
  // Impact: +/- 0.5 per unit
  const sysImpact = sysDiff * 0.5;
  currentScore += sysImpact;

  features.push({
    name: "Systolic BP",
    value: parseFloat(sysImpact.toFixed(2)),
    impact: sysImpact > 0 ? "positive" : "negative"
  });

  if (data.systolicBP > 130) {
    recommendations.push("Consider reducing sodium intake and increasing physical activity to help lower blood pressure.");
  }

  // --- 4. Cholesterol Factor ---
  // 1: Normal (-5), 2: Above Normal (+10), 3: Well Above (+20)
  let cholImpact = 0;
  if (data.cholesterol === 1) cholImpact = -5;
  else if (data.cholesterol === 2) cholImpact = 10;
  else if (data.cholesterol === 3) cholImpact = 20;

  currentScore += cholImpact;
  features.push({
    name: "Cholesterol Levels",
    value: cholImpact,
    impact: cholImpact > 0 ? "positive" : "negative"
  });

  if (data.cholesterol > 1) {
    recommendations.push("Focus on heart-healthy foods rich in omega-3 fatty acids and fiber.");
  }

  // --- 5. Glucose Factor ---
  // 1: Normal (-5), 2: Above (+8), 3: High (+15)
  let glucImpact = 0;
  if (data.gluc === 1) glucImpact = -5;
  else if (data.gluc === 2) glucImpact = 8;
  else if (data.gluc === 3) glucImpact = 15;

  currentScore += glucImpact;
  features.push({
    name: "Glucose Levels",
    value: glucImpact,
    impact: glucImpact > 0 ? "positive" : "negative"
  });

  if (data.gluc > 1) {
    recommendations.push("Reduce sugar intake and monitor blood glucose levels.");
  }

  // --- 6. Smoking ---
  // True: +15, False: -5
  const smokeImpact = data.smoke ? 15 : -5;
  currentScore += smokeImpact;
  features.push({
    name: "Smoking Status",
    value: smokeImpact,
    impact: smokeImpact > 0 ? "positive" : "negative"
  });

  if (data.smoke) {
    recommendations.push("Quitting smoking is the single most effective way to reduce your cardiovascular risk.");
  }

  // --- 7. Alcohol ---
  // True: +5, False: 0
  const alcoImpact = data.alco ? 5 : 0;
  currentScore += alcoImpact;
  if (alcoImpact !== 0) {
      features.push({
        name: "Alcohol Consumption",
        value: alcoImpact,
        impact: "positive"
      });
      recommendations.push("Moderating alcohol intake can improve heart health.");
  }

  // --- 8. Physical Activity ---
  // Active: -10, Inactive: +10
  const activeImpact = data.active ? -10 : 10;
  currentScore += activeImpact;
  features.push({
    name: "Physical Activity",
    value: activeImpact,
    impact: activeImpact > 0 ? "positive" : "negative"
  });

  if (!data.active) {
    recommendations.push("Aim for at least 150 minutes of moderate aerobic activity per week.");
  }

  // --- Finalize ---
  // Clamp score between 0 and 100
  const finalRiskScore = Math.min(100, Math.max(0, currentScore));

  // Sort features by absolute impact magnitude (SHAP style)
  features.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  // If no specific recommendations, add general ones
  if (recommendations.length < 2) {
    recommendations.push(
      "Continue maintaining your healthy lifestyle habits.",
      "Schedule regular check-ups with your healthcare provider."
    );
  }

  return {
    riskScore: Math.round(finalRiskScore),
    features: features.slice(0, 6), // Top 6 impactful features
    recommendations: recommendations.slice(0, 5),
    modelUsed: "Rule-Based Clinical Heuristics (Calibrated)",
  };
}
