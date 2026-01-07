import type { HealthData } from "@/components/HealthInputForm";

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
  
// Simulates a SHAP-based prediction analysis
export async function analyzeCVDRisk(data: HealthData): Promise<PredictionResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Calculate base risk score using weighted factors
  let baseScore = 0;
  const features: FeatureData[] = [];
  const recommendations: string[] = [];

  // 1. Age factor
  // Risk increases significantly after 50
  const ageImpact = Math.max(0, (data.age - 40) * 0.5);
  baseScore += ageImpact;
  if (data.age > 50) {
    features.push({ name: "Age", value: ageImpact / 10, impact: "positive" });
  }

  // 2. BMI Calculation and Factor
  // BMI = weight(kg) / height(m)^2
  const heightInMeters = data.height / 100;
  const bmi = data.weight / (heightInMeters * heightInMeters);
  
  // Normal BMI is roughly 18.5 - 24.9
  const bmiExcess = Math.max(0, bmi - 25); 
  const bmiImpact = bmiExcess * 1.5;
  baseScore += bmiImpact;
  
  if (bmi > 28) {
    features.push({ name: "Body Mass Index", value: bmiImpact / 10, impact: "positive" });
    recommendations.push("Work towards a healthy weight through balanced nutrition and regular exercise.");
  }

  // 3. Blood Pressure Factor (Systolic)
  // Normal < 120
  const systolicImpact = Math.max(0, (data.systolicBP - 120) * 0.3);
  baseScore += systolicImpact;
  if (data.systolicBP > 130) {
    features.push({ name: "Systolic Blood Pressure", value: systolicImpact / 10, impact: "positive" });
    recommendations.push("Consider reducing sodium intake and increasing physical activity to help lower blood pressure.");
  }

  // 4. Cholesterol Factor
  // data.cholesterol is 1 (Normal), 2 (Above Normal), 3 (Well Above Normal)
  if (data.cholesterol === 2) {
    baseScore += 10;
    features.push({ name: "Cholesterol", value: 1.0, impact: "positive" });
    recommendations.push("Focus on heart-healthy foods rich in omega-3 fatty acids and fiber.");
  } else if (data.cholesterol === 3) {
    baseScore += 20;
    features.push({ name: "High Cholesterol", value: 2.0, impact: "positive" });
    recommendations.push("Consult a doctor about managing high cholesterol levels.");
  }

  // 5. Glucose / Diabetes Factor
  // data.gluc is 1 (Normal), 2 (Above Normal), 3 (Well Above Normal)
  if (data.gluc === 2) {
    baseScore += 8;
    features.push({ name: "Glucose Levels", value: 0.8, impact: "positive" });
    recommendations.push("Reduce sugar intake and monitor blood glucose levels.");
  } else if (data.gluc === 3) {
    baseScore += 15;
    features.push({ name: "High Glucose", value: 1.5, impact: "positive" });
    recommendations.push("Strictly control blood sugar and follow medical advice for diabetes management.");
  }

  // 6. Smoking Factor
  if (data.smoke) {
    baseScore += 15;
    features.push({ name: "Smoking Status", value: 1.5, impact: "positive" });
    recommendations.push("Quitting smoking is the single most effective way to reduce your cardiovascular risk.");
  }

  // 7. Alcohol Factor
  if (data.alco) {
    baseScore += 5;
    features.push({ name: "Alcohol Consumption", value: 0.5, impact: "positive" });
    recommendations.push("Moderating alcohol intake can improve heart health.");
  }

  // 8. Physical Activity Factor
  if (!data.active) {
    // Inactive
    baseScore += 10;
    features.push({ name: "Low Physical Activity", value: 1.0, impact: "positive" });
    recommendations.push("Aim for at least 150 minutes of moderate aerobic activity per week.");
  } else {
    // Active (Reduces risk)
    baseScore -= 5;
    features.push({ name: "Regular Exercise", value: 0.5, impact: "negative" });
  }

  // Normalize score to 0-100 range
  // We assume a 'max' bad score might be around 80-100 based on the weights above.
  const riskScore = Math.min(100, Math.max(0, baseScore));

  // Sort features by absolute impact
  features.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  // Limit to top 6 features
  const topFeatures = features.slice(0, 6);

  // Add general recommendations if list is short
  if (recommendations.length < 3) {
    recommendations.push(
      "Continue maintaining your healthy lifestyle habits.",
      "Schedule regular check-ups with your healthcare provider.",
      "Stay hydrated and maintain a balanced diet."
    );
  }

  return {
    riskScore: Math.round(riskScore),
    features: topFeatures,
    recommendations: recommendations.slice(0, 5),
    modelUsed: "Rule-Based Clinical Heuristics (Mock)",
  };
}
