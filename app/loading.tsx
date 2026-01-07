import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
