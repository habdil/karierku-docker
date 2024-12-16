import { Analytics } from "@/components/admin/Analytics/index";

export default function AnalyticsPage() {
  return (
    <div className="container max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 pb-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-primary-900">Analytics Dashboard</h2>
          <div className="flex items-center gap-2">
            {/* Add future controls/filters here */}
          </div>
        </div>
        <div className="text-muted-foreground">
          Monitor and analyze your platform's performance metrics
        </div>
      </div>

      {/* Main Content */}
      <div className="relative">
        <div className="space-y-4">
          {/* Analytics Component */}
          <Analytics />
        </div>
      </div>

      {/* Footer info if needed */}
      <div className="mt-8 text-sm text-muted-foreground">
        <p>* Data diperbarui secara real-time</p>
      </div>
    </div>
  );
}