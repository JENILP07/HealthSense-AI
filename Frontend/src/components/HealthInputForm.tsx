import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Activity, Heart, Droplets, Scale, Clock, Cigarette, Wine, Zap, User, Ruler } from "lucide-react";

export interface HealthData {
  age: number;
  gender: number; // 1: Female, 2: Male
  height: number;
  weight: number;
  systolicBP: number;
  diastolicBP: number;
  cholesterol: number; // 1: Normal, 2: Above Normal, 3: Well Above Normal
  gluc: number; // 1: Normal, 2: Above Normal, 3: Well Above Normal
  smoke: boolean;
  alco: boolean;
  active: boolean;
}

interface HealthInputFormProps {
  onSubmit: (data: HealthData) => void;
  isLoading?: boolean;
}

const HealthInputForm = ({ onSubmit, isLoading = false }: HealthInputFormProps) => {
  const [formData, setFormData] = useState<HealthData>({
    age: 50,
    gender: 1, // Female
    height: 165,
    weight: 70,
    systolicBP: 120,
    diastolicBP: 80,
    cholesterol: 1,
    gluc: 1,
    smoke: false,
    alco: false,
    active: true,
  });

  const [bmi, setBmi] = useState(0);

  useEffect(() => {
    // Calculate BMI for display
    const h = formData.height / 100;
    if (h > 0) {
      const b = formData.weight / (h * h);
      setBmi(Math.round(b * 10) / 10);
    }
  }, [formData.height, formData.weight]);

  const updateField = <K extends keyof HealthData>(field: K, value: HealthData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const SliderInput = ({
    label,
    field,
    min,
    max,
    step = 1,
    unit,
    icon: Icon,
    warning,
  }: {
    label: string;
    field: keyof HealthData;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    icon: React.ElementType;
    warning?: { threshold: number; message: string };
  }) => {
    const value = formData[field] as number;
    const isWarning = warning && value > warning.threshold;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Icon className="w-4 h-4 text-primary" />
            {label}
          </Label>
          <span className={cn(
            "text-sm font-semibold tabular-nums",
            isWarning ? "text-warning" : "text-foreground"
          )}>
            {value}{unit}
          </span>
        </div>
        <Slider
          value={[value]}
          onValueChange={([v]) => updateField(field, v)}
          min={min}
          max={max}
          step={step}
          className="cursor-pointer"
        />
        {isWarning && (
          <p className="text-xs text-warning">{warning.message}</p>
        )}
      </div>
    );
  };

  const ToggleInput = ({
    label,
    field,
    icon: Icon,
    description,
  }: {
    label: string;
    field: keyof HealthData;
    icon: React.ElementType;
    description: string;
  }) => (
    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div>
          <Label className="text-sm font-medium text-foreground cursor-pointer">
            {label}
          </Label>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch
        checked={formData[field] as boolean}
        onCheckedChange={(checked) => updateField(field, checked)}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Demographics Section */}
      <div className="glass-card rounded-2xl p-6 space-y-6">
        <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Demographics & Body Stats
        </h3>

        <div className="grid gap-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Gender</Label>
            <RadioGroup
              value={formData.gender.toString()}
              onValueChange={(v) => updateField("gender", parseInt(v))}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="g-female" />
                <Label htmlFor="g-female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="g-male" />
                <Label htmlFor="g-male">Male</Label>
              </div>
            </RadioGroup>
          </div>

          <SliderInput
            label="Age"
            field="age"
            min={18}
            max={100}
            unit=" years"
            icon={Clock}
          />

          <div className="grid sm:grid-cols-2 gap-6">
            <SliderInput
              label="Height"
              field="height"
              min={140}
              max={220}
              unit=" cm"
              icon={Ruler}
            />
            <SliderInput
              label="Weight"
              field="weight"
              min={40}
              max={150}
              unit=" kg"
              icon={Scale}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5">
            <span className="text-sm font-medium">Calculated BMI</span>
            <span className="text-lg font-bold text-primary">{bmi}</span>
          </div>
        </div>
      </div>

      {/* Vital Signs Section */}
      <div className="glass-card rounded-2xl p-6 space-y-6">
        <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          Vital Signs
        </h3>

        <div className="grid gap-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <SliderInput
              label="Systolic BP"
              field="systolicBP"
              min={90}
              max={200}
              unit=" mmHg"
              icon={Activity}
              warning={{ threshold: 140, message: "Elevated" }}
            />
            <SliderInput
              label="Diastolic BP"
              field="diastolicBP"
              min={60}
              max={130}
              unit=" mmHg"
              icon={Activity}
              warning={{ threshold: 90, message: "Elevated" }}
            />
          </div>
        </div>
      </div>

      {/* Lab Results */}
      <div className="glass-card rounded-2xl p-6 space-y-6">
        <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
          <Droplets className="w-5 h-5 text-primary" />
          Lab Values
        </h3>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Cholesterol Level</Label>
            <RadioGroup
              value={formData.cholesterol.toString()}
              onValueChange={(v) => updateField("cholesterol", parseInt(v))}
              className="grid sm:grid-cols-3 gap-2"
            >
              {[
                { val: 1, label: "Normal" },
                { val: 2, label: "Above Normal" },
                { val: 3, label: "Well Above Normal" }
              ].map(opt => (
                <div key={opt.val} className="flex items-center space-x-2 border rounded-lg p-2 hover:bg-muted/50">
                  <RadioGroupItem value={opt.val.toString()} id={`chol-${opt.val}`} />
                  <Label htmlFor={`chol-${opt.val}`}>{opt.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Glucose Level</Label>
            <RadioGroup
              value={formData.gluc.toString()}
              onValueChange={(v) => updateField("gluc", parseInt(v))}
              className="grid sm:grid-cols-3 gap-2"
            >
              {[
                { val: 1, label: "Normal" },
                { val: 2, label: "Above Normal" },
                { val: 3, label: "Well Above Normal" }
              ].map(opt => (
                <div key={opt.val} className="flex items-center space-x-2 border rounded-lg p-2 hover:bg-muted/50">
                  <RadioGroupItem value={opt.val.toString()} id={`gluc-${opt.val}`} />
                  <Label htmlFor={`gluc-${opt.val}`}>{opt.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Lifestyle Section */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Lifestyle & History
        </h3>

        <div className="space-y-3">
          <ToggleInput
            label="Smoking"
            field="smoke"
            icon={Cigarette}
            description="Do you currently smoke?"
          />

          <ToggleInput
            label="Alcohol Intake"
            field="alco"
            icon={Wine}
            description="Do you consume alcohol regularly?"
          />

          <ToggleInput
            label="Physical Activity"
            field="active"
            icon={Activity}
            description="Do you exercise regularly?"
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="default"
        size="lg"
        className="w-full text-lg h-12 shadow-lg hover:shadow-xl transition-all"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            Processing...
          </>
        ) : (
          <>
            <Heart className="w-5 h-5 mr-2 fill-current" />
            Analyze Risk
          </>
        )}
      </Button>
    </form>
  );
};

export default HealthInputForm;
