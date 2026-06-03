import { Skeleton } from "@/components/ui/Skeleton";

export default function MainLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 md:px-6 pb-24 md:pb-10">
      <div className="mb-6">
        <Skeleton className="h-8 w-56 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-20 w-full mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Skeleton className="h-52 w-full" />
        <Skeleton className="h-52 w-full" />
      </div>
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
