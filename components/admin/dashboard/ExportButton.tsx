// components/admin/dashboard/ExportButton.tsx
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";

interface ExportButtonProps {
  onExport: () => Promise<void>;
}

export function ExportButton({ onExport }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      onClick={handleExport} 
      disabled={isExporting}
      variant="outline"
      size="sm"
    >
      <Download className="mr-2 h-4 w-4" />
      {isExporting ? "Exporting..." : "Export Data"}
    </Button>
  );
}