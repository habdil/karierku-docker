'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CareerStatusData, RegistrationData, ConsultationStats, EventParticipation } from "@/lib/types/analytics";

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface CareerStatusChartProps {
  data: CareerStatusData[];
}

export function CareerStatusChart({ data }: CareerStatusChartProps) {
  return (
    <Card className="col-span-4 md:col-span-2">
      <CardHeader>
        <CardTitle>Career Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={(entry) => `${entry.status}: ${entry.count}`}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

interface RegistrationChartProps {
  data: RegistrationData[];
}

export function RegistrationChart({ data }: RegistrationChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short' })
  }));

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Monthly Registrations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#8884d8" 
                name="Registrations"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

interface ConsultationChartProps {
  data: ConsultationStats[];
}

export function ConsultationChart({ data }: ConsultationChartProps) {
  const formattedData = data.map(item => ({
    status: item.status,
    count: item._count.id
  }));

  return (
    <Card className="col-span-4 md:col-span-2">
      <CardHeader>
        <CardTitle>Consultation Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData}>
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Consultations" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

interface EventParticipationTableProps {
  data: EventParticipation[];
}

export function EventParticipationTable({ data }: EventParticipationTableProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Event Participation</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event ID</TableHead>
              <TableHead className="text-right">Participants</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((event) => (
              <TableRow key={event.eventId}>
                <TableCell>{event.eventId}</TableCell>
                <TableCell className="text-right">{event._count.id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}