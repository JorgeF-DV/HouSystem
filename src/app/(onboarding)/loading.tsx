import { Skeleton } from "@/components/ui/Skeleton";

export default function OnboardingLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-12 w-full mt-4" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
