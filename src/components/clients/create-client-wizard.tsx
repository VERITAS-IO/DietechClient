import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { UserRegistrationForm } from "./wizard-steps/user-registration-form";
import { PersonalInfoForm } from "./wizard-steps/personal-info-form";
import { LifeStyleForm } from "./wizard-steps/life-style-form";
import { HealthInfoForm } from "./wizard-steps/health-info-form";
import { useCreateClient } from "@/hooks/client-hooks";
import { useClientStore } from "@/stores/client-store";

interface CreateClientWizardProps {
  onComplete: () => void;
}

type StepKey = 'userRegistrationRequest' | 'createPersonaInfoRequest' | 'createLifeStyleInfoRequest' | 'createHealthInfoRequest';

const STEPS = [
  { title: "Account", key: "userRegistrationRequest" as StepKey, component: UserRegistrationForm },
  { title: "Personal", key: "createPersonaInfoRequest" as StepKey, component: PersonalInfoForm },
  { title: "Lifestyle", key: "createLifeStyleInfoRequest" as StepKey, component: LifeStyleForm },
  { title: "Health", key: "createHealthInfoRequest" as StepKey, component: HealthInfoForm },
];

export function CreateClientWizard({ onComplete }: CreateClientWizardProps) {
  const { toast } = useToast();
  const createClientMutation = useCreateClient();
  
  const {
    formData,
    currentStep,
    updateStepData,
    setCurrentStep,
    resetForm
  } = useClientStore();

  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const currentStepData = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  const handleStepSubmit = async (stepData: any) => {
    try {
      // Now TypeScript knows this is a valid step key
      const stepKey = currentStepData.key;
      updateStepData(stepKey, stepData);

      if (!isLastStep) {
        setCurrentStep(currentStep + 1);
      } else {
        await createClientMutation.mutateAsync(formData, {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Client created successfully",
            });
            resetForm();
            onComplete();
          },
          onError: (error: Error) => {
            toast({
              title: "Error",
              description: error.message || "Failed to create client. Please try again.",
              variant: "destructive",
            });
          },
        });
      }
    } catch (error) {
      console.error("Error handling step submission:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const StepComponent = currentStepData.component;

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm mb-2">
          <span>
            Step {currentStep + 1} of {STEPS.length}: {currentStepData.title}
          </span>
          <span>{Math.round(progress)}% completed</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <StepComponent
        data={formData[currentStepData.key]}
        onSubmit={handleStepSubmit}
        isSubmitting={createClientMutation.isPending}
      />

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0 || createClientMutation.isPending}
        >
          Back
        </Button>
      </div>

      {createClientMutation.isError && (
        <div className="text-sm text-destructive mt-2">
          {createClientMutation.error.message || "An error occurred while creating the client"}
        </div>
      )}
    </div>
  );
}