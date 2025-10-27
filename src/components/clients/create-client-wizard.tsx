import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { UserRegistrationForm } from "./wizard-steps/user-registration-form";
import { PersonalInfoForm } from "./wizard-steps/personal-info-form";
import { LifeStyleForm } from "./wizard-steps/life-style-form";
import { HealthInfoForm } from "./wizard-steps/health-info-form";
import { useCreateClient } from "@/hooks/client-hooks";
import { useClientStore } from "@/stores/client-store";
import { useTranslation } from "react-i18next";

interface CreateClientWizardProps {
  onComplete: () => void;
}

type StepKey = 'userRegistrationRequest' | 'createPersonaInfoRequest' | 'createLifeStyleInfoRequest' | 'createHealthInfoRequest';

export function CreateClientWizard({ onComplete }: CreateClientWizardProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const createClientMutation = useCreateClient();
  
  const {
    formData,
    currentStep,
    updateStepData,
    setCurrentStep,
    resetForm
  } = useClientStore();

  const STEPS = [
    { title: t('auth.register.form.firstName.label'), key: "userRegistrationRequest" as StepKey, component: UserRegistrationForm },
    { title: t('client.details'), key: "createPersonaInfoRequest" as StepKey, component: PersonalInfoForm },
    { title: t('client.lifestyle'), key: "createLifeStyleInfoRequest" as StepKey, component: LifeStyleForm },
    { title: t('client.health'), key: "createHealthInfoRequest" as StepKey, component: HealthInfoForm },
  ];
  
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const currentStepData = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  const handleStepSubmit = async (stepData: Record<string, unknown>) => {
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
              title: t('common.success'),
              description: t('client.createSuccess'),
            });
            resetForm();
            onComplete();
          },
          onError: (error: Error) => {
            toast({
              title: t('common.error'),
              description: error.message || t('client.createError'),
              variant: "destructive",
            });
          },
        });
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('client.createError'),
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm mb-2">
          <span>
            {t('client.wizard.step', { current: currentStep + 1, total: STEPS.length, title: currentStepData.title })}
          </span>
          <span>{Math.round(progress)}% {t('client.wizard.completed')}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {currentStepData.key === "userRegistrationRequest" && (
        <UserRegistrationForm
          data={formData}
          onSubmit={handleStepSubmit}
          isSubmitting={createClientMutation.isPending}
        />
      )}
      
      {currentStepData.key === "createPersonaInfoRequest" && (
        <PersonalInfoForm
          data={formData}
          onSubmit={handleStepSubmit}
          isSubmitting={createClientMutation.isPending}
        />
      )}
      
      {currentStepData.key === "createLifeStyleInfoRequest" && (
        <LifeStyleForm
          data={formData}
          onSubmit={handleStepSubmit}
        />
      )}
      
      {currentStepData.key === "createHealthInfoRequest" && (
        <HealthInfoForm
          data={formData}
          onSubmit={handleStepSubmit}
        />
      )}

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0 || createClientMutation.isPending}
        >
          {t('client.wizard.back')}
        </Button>
      </div>

      {createClientMutation.isError && (
        <div className="text-sm text-destructive mt-2">
          {createClientMutation.error.message || t('client.createError')}
        </div>
      )}
    </div>
  );
}