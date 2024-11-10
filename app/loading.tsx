// src/app/loading.tsx
import { LoadingBars } from "@/components/ui/loading-bars";

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
    <LoadingBars text="Please wait..." />
  </div>
  );
}