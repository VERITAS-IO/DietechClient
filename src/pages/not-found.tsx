import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

const NotFoundPage = () => {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center" data-theme={theme}>
      <div className="max-w-md w-full space-y-8">
        <div className="space-y-4">
          <h1 className="text-9xl font-extrabold text-primary">404</h1>
          <h2 className="text-3xl font-bold text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild variant="default">
            <Link to="/">
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard">
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
