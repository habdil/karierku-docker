"use client";

export default function Error() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    </div>
  );
}