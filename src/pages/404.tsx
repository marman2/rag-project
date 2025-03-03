import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6 text-center px-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="min-w-[120px]"
        >
          Go Back
        </Button>
        <Button
          onClick={() => navigate('/')}
          className="min-w-[120px]"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound; 