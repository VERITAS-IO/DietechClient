import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UserRegistrationForm } from "./wizard-steps/user-registration-form";
import { PersonalInfoForm } from "./wizard-steps/personal-info-form";
import { LifeStyleForm } from "./wizard-steps/life-style-form";
import { HealthInfoForm } from "./wizard-steps/health-info-form";


interface CreateClientWizardProps {
  onComplete: () => void;
}

const STEPS = [
  { title: "Account", component: UserRegistrationForm },
  { title: "Personal", component: PersonalInfoForm },
  { title: "Lifestyle", component: LifeStyleForm },
  { title: "Health", component: HealthInfoForm },
];

export function CreateClientWizard({ onComplete }: CreateClientWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    userRegistrationRequest: {},
    createPersonaInfoRequest: {},
    createLifeStyleInfoRequest: {},
    createHealthInfoRequest: {},
  });

  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const CurrentStepComponent = STEPS[currentStep].component;

  const handleNext = (stepData: any) => {
    const updatedData = {
      ...formData,
      [Object.keys(stepData)[0]]: stepData[Object.keys(stepData)[0]],
    };
    setFormData(updatedData);

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit the form
      console.log("Form submitted:", updatedData);
      onComplete();
    }
  };

  const handleBack = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm mb-2">
          <span>Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}</span>
          <span>{Math.round(progress)}% completed</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <CurrentStepComponent
        data={formData[Object.keys(formData)[currentStep]]}
        onSubmit={handleNext}
      />

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          Back
        </Button>
      </div>
    </div>
  );
}