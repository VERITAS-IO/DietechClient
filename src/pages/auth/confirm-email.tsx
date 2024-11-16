/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Loader2, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/auth-service";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isRequestSent, setIsRequestSent] = useState<boolean>(false);

  const confirmEmailMutation = useMutation({
    mutationFn: authService.confirmEmail,
    onSuccess: () => {
      toast({
        title: "Email Confirmed",
        description: "Your email has been successfully confirmed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Confirmation Failed",
        description: error.response?.data?.detail || "Could not confirm email",
        variant: "destructive",
      });
    },
    retry: false,
  });

  useEffect(() => {
    const handleEmailConfirmation = () => {
      if(isRequestSent) {
        return; 
      }

      setIsRequestSent(true);
      const userId = searchParams.get("userId");
      const token = searchParams.get("token");
      const changedEmail = searchParams.get("changedEmail") || "";

      console.log(`userId:${userId}\ntoken:${token}\nchangedEmail:${changedEmail}`);

      if (!userId || !token) {
        setValidationError("Missing required parameters in the confirmation link.");
        return;
      }

      const parsedUserId = parseInt(userId);
      if (isNaN(parsedUserId) || parsedUserId <= 0) {
        setValidationError("Invalid user ID format in the confirmation link.");
        return;
      }

      if (token.trim().length === 0) {
        setValidationError("Invalid token format in the confirmation link.");
        return;
      }
      
      if (!confirmEmailMutation.isPending && !confirmEmailMutation.isSuccess && !confirmEmailMutation.isError) {
        confirmEmailMutation.mutate({
          userId: parsedUserId,
          token,
          changedEmail: changedEmail || "",
        });
      }
    };

    handleEmailConfirmation();
  }, []);

  const handleReturnToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-8">
          <Card className="w-full max-w-[400px]">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                Email Confirmation
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col items-center space-y-4 pt-4">
              {confirmEmailMutation.isPending ? (
                <>
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
                  <p className="text-lg font-medium">Confirming your email</p>
                  <p className="text-muted-foreground text-center">
                    Please wait while we confirm your email address...
                  </p>
                </>
              ) : confirmEmailMutation.isSuccess ? (
                <>
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                  <p className="text-lg font-medium">Email Confirmed!</p>
                  <p className="text-muted-foreground text-center">
                    Your email has been successfully confirmed. You can now sign in to your account.
                  </p>
                  <Button
                    onClick={handleReturnToLogin}
                    className="w-full max-w-[200px] mt-4"
                    variant="default"
                  >
                    Sign In
                  </Button>
                </>
              ) : validationError || confirmEmailMutation.isError ? (
                <>
                  <XCircle className="h-16 w-16 text-destructive" />
                  <p className="text-lg font-medium">Confirmation Failed</p>
                  <p className="text-muted-foreground text-center">
                    {validationError ||
                      "We couldn't confirm your email. The link might be expired or invalid."}
                  </p>
                  <Button
                    onClick={handleReturnToLogin}
                    className="w-full max-w-[200px] mt-4"
                    variant="outline"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to Login
                  </Button>
                </>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}