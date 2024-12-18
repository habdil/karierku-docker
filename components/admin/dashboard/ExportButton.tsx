// components/admin/dashboard/ExportButton.tsx
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import * as XLSX from 'xlsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface ExportButtonProps {
  onExport?: (data: any) => Promise<void>;
}

// Define interfaces for data types
interface ExportDataConfig {
  headers: string[];
  mapData: (item: any) => Record<string, any>;
}

const EXPORT_CONFIGS: Record<string, ExportDataConfig> = {
  users: {
    headers: ['ID', 'Email', 'Name', 'Role', 'Created At'],
    mapData: (item: any) => ({
      'ID': item.id,
      'Email': item.email,
      'Name': item.client?.fullName || item.mentor?.fullName || '',
      'Role': item.role,
      'Created At': new Date(item.createdAt).toLocaleString()
    })
  },
  consultations: {
    headers: ['ID', 'Client', 'Mentor', 'Status', 'Start Time', 'Created At'],
    mapData: (item: any) => ({
      'ID': item.id,
      'Client': item.client.fullName,
      'Mentor': item.mentor.fullName,
      'Status': item.status,
      'Start Time': item.slot?.startTime ? new Date(item.slot.startTime).toLocaleString() : 'Not scheduled',
      'Created At': new Date(item.createdAt).toLocaleString()
    })
  },
  events: {
    headers: ['ID', 'Title', 'Location', 'Event Date', 'Created By', 'Registrations'],
    mapData: (item: any) => ({
      'ID': item.id,
      'Title': item.title,
      'Location': item.location,
      'Event Date': new Date(item.date).toLocaleString(),
      'Created By': item.admin.fullName,
      'Registrations': item.registrations.length.toString()
    })
  }
};

export function ExportButton({ onExport }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [type, setType] = useState<string>('users');
  const [dateRange, setDateRange] = useState<string>('all');
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      setIsExporting(true);

      let startDate, endDate;
      const now = new Date();

      switch (dateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
          endDate = new Date(now.setHours(23, 59, 59, 999)).toISOString();
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7)).toISOString();
          endDate = new Date().toISOString();
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
          endDate = new Date().toISOString();
          break;
      }

      const queryParams = new URLSearchParams({
        type,
        ...(startDate && { startDate }),
        ...(endDate && { endDate })
      });

      const response = await fetch(`/api/admin/dashboard/export?${queryParams}`);
      const result = await response.json();

      if (!response.ok) throw new Error(result.error);

      const config = EXPORT_CONFIGS[type];
      if (!config) throw new Error('Invalid export type');

      const transformedData = result.data.map(config.mapData);
      downloadExcel(transformedData, config.headers, type);

      toast({
        title: "Export Successful",
        description: "Your data has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Failed to export data",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const downloadExcel = (
    data: Record<string, any>[],
    headers: string[],
    sheetName: string
  ) => {
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data, {
      header: headers
    });

    // Set column widths
    const colWidths = headers.map(h => ({ wch: Math.max(h.length, 15) }));
    worksheet['!cols'] = colWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      sheetName.charAt(0).toUpperCase() + sheetName.slice(1)
    );

    // Generate Excel file
    XLSX.writeFile(
      workbook,
      `${sheetName}-export-${new Date().toISOString().split('T')[0]}.xlsx`
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className='text-white'>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Export Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="users">Users</SelectItem>
                <SelectItem value="consultations">Consultations</SelectItem>
                <SelectItem value="events">Events</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full text-white" 
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4 text-white" />
                Export to Excel
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}