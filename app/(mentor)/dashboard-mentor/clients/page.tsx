"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { LoadingBars } from "@/components/ui/loading-bars";
import ClientList from "@/components/mentor/listClient/ClientList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle } from "lucide-react";

interface Client {
  id: string;
  fullName: string;
  major: string | null;
  currentStatus: string | null;
  dreamJob: string | null;
  mentorshipStatus: 'NEW' | 'IN_PROGRESS' | 'COMPLETED';
  lastConsultation?: {
    id: string;
    status: string;
    createdAt: string;
  };
  careerAssessment?: {
    id: string;
    answers: any;
    geminiResponse: string;
  };
}

export default function MentorClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/mentor/clients");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setClients(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load clients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.major?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.dreamJob?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingBars />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Clients</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredClients.length === 0 ? (
        <div className="text-center py-10">
          <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No clients found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? "Try adjusting your search" : "You don't have any clients yet"}
          </p>
        </div>
      ) : (
        <ClientList clients={filteredClients} />
      )}
    </div>
  );
}