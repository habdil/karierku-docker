// components/client/ClientSidebar.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Compass,
  Calendar,
  MessageSquare,
  LogOut,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const defaultItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Personalisasi Karir",
    href: "/dashboard/career",
    icon: <Compass className="h-5 w-5" />,
  },
  {
    title: "Event",
    href: "/dashboard/events",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: "Konsultasi",
    href: "/dashboard/consultation",
    icon: <MessageSquare className="h-5 w-5" />,
  },
];

interface ClientSidebarProps {
  items?: SidebarItem[];
  className?: string;
}

export function ClientSidebar({ items = defaultItems, className }: ClientSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  // Handle resize events
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await fetch("/api/client/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      if (typeof window !== 'undefined') {
        localStorage.removeItem("clientUser");
      }
      
      toast({
        title: "Logout berhasil",
        description: "Sampai jumpa kembali!",
      });

      window.location.href = "/";
      
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout gagal",
        description: "Terjadi kesalahan saat logout",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const MobileMenuButton = () => (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "fixed top-4 left-4 z-50 md:hidden transition-opacity duration-300",
        isMobileOpen ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
      onClick={() => setIsMobileOpen(!isMobileOpen)}
      aria-label="Toggle menu"
    >
      <Menu className="h-6 w-6" />
    </Button>
  );

  const SidebarContent = () => (
    <div className="flex h-screen flex-col border-r bg-card w-64">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-4">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-lg"
          priority
        />
        <span className="ml-2 font-semibold text-lg text-black">
          KarierKu
        </span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.icon}
              <span className="ml-3">{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="border-t p-3">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-background/80"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-3">
            {isLoggingOut ? "Logging out..." : "Logout"}
          </span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <MobileMenuButton />
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar with Backdrop */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-64 bg-card shadow-lg">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}