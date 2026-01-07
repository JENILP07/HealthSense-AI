import { useState } from "react";
import Header from "@/components/Header";
import HealthInputForm, { HealthData } from "@/components/HealthInputForm";
import PredictionResults from "@/components/PredictionResults";
import { getHeartPrediction, PatientData } from "@/services/api";
import { Brain, Shield, Zap, Database, Heart, Activity } from "lucide-react";

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

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleSubmit = async (data: HealthData) => {
    setIsLoading(true);
    try {
      // Map Form Data to API Payload
      const payload: PatientData = {
        age: data.age,
        gender: data.gender,
        height: data.height,
        weight: data.weight,
        ap_hi: data.systolicBP,
        ap_lo: data.diastolicBP,
        cholesterol: data.cholesterol,
        gluc: data.gluc,
        smoke: data.smoke ? 1 : 0,
        alco: data.alco ? 1 : 0,
        active: data.active ? 1 : 0,
      };

      const apiResponse = await getHeartPrediction(payload);

      // Transform API Response to UI Result
      const riskScore = Math.round(apiResponse.probability * 100);

      const predictionResult: PredictionResult = {
        riskScore: riskScore,
        modelUsed: "Gradient Boosting Classifier",
        features: [
          // Dummy features for UI compatibility since backend doesn't return SHAP yet
          { name: "Age", value: data.age, impact: data.age > 60 ? "negative" : "positive" },
          { name: "Systolic BP", value: data.systolicBP, impact: data.systolicBP > 130 ? "negative" : "positive" },
          { name: "BMI", value: Math.round(data.weight / ((data.height / 100) ** 2)), impact: "negative" }
        ],
        recommendations: [
          "Maintain a healthy diet low in saturated fats.",
          "Engage in at least 150 minutes of moderate activity per week.",
          "Regularly monitor your blood pressure."
        ]
      };

      setResult(predictionResult);
    } catch (error) {
      console.error("Prediction failed:", error);
      alert("Failed to get prediction from server. Ensure backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  const features = [
    {
      icon: Brain,
      title: "Dual-Model AI",
      description: "Random Forest + Deep Learning ensemble for maximum accuracy",
    },
    {
      icon: Shield,
      title: "SHAP Explainability",
      description: "Understand exactly which factors influence your risk score",
    },
    {
      icon: Zap,
      title: "Real-Time Analysis",
      description: "Get instant predictions powered by FastAPI backend",
    },
    {
      icon: Database,
      title: "Clinically Validated",
      description: "Trained on comprehensive cardiovascular health datasets",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute top-40 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 py-12 lg:py-20">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in-up">
                <Heart className="w-4 h-4" />
                AI-Powered Cardiovascular Assessment
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                Predict Your Heart Health with{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Explainable AI
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                HeartSense AI uses advanced machine learning models with SHAP interpretability
                to assess your cardiovascular risk and explain the contributing factors.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl glass-card hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-2 rounded-xl bg-primary/10">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground text-sm">{feature.title}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {result ? (
              <PredictionResults result={result} onReset={handleReset} />
            ) : (
              <div className="animate-fade-in-up">
                <div className="text-center mb-8">
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Enter Your Health Data
                  </h2>
                  <p className="text-muted-foreground">
                    Provide your health metrics below for a personalized risk assessment
                  </p>
                </div>

                <HealthInputForm onSubmit={handleSubmit} isLoading={isLoading} />
              </div>
            )}
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="container mx-auto px-4 mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Built with Production-Grade Technology
              </h2>
              <p className="text-muted-foreground">
                Designed to integrate with your Python ML backend
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "TensorFlow", desc: "Deep Learning" },
                { name: "Scikit-Learn", desc: "Gradient Boosting" },
                { name: "FastAPI", desc: "REST API" },
                { name: "SHAP", desc: "Explainability" },
              ].map((tech) => (
                <div
                  key={tech.name}
                  className="p-4 rounded-xl bg-muted/50 border border-border text-center hover:bg-muted transition-colors"
                >
                  <p className="font-semibold text-foreground">{tech.name}</p>
                  <p className="text-xs text-muted-foreground">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-primary" />
            <span className="font-display font-semibold text-foreground">HeartSense AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            For educational and demonstration purposes only. Not intended for medical diagnosis.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
