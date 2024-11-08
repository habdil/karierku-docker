"use client";

import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface ClientHeaderProps {
  clientName?: string;
  notificationCount?: number;
}

export function ClientHeader({ 
  clientName = "Client", 
  notificationCount = 0 
}: ClientHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        {/* Mobile Search Trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="flex lg:hidden ml-auto">
              <Search className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="w-full p-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search events, mentors..."
                className="w-full pl-9 bg-muted/50"
              />
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Search */}
        <div className="hidden lg:flex lg:flex-1 max-w-sm">
          <div className="relative w-full left-7">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events, mentors..."
              className="w-full pl-9 bg-muted/50"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge 
                    variant="error" 
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[280px] sm:w-[320px]">
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Notifications</span>
                  {notificationCount > 0 && (
                    <Badge variant="info" className="ml-auto">
                      {notificationCount} new
                    </Badge>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                {/* Add notifications here */}
                <div className="text-sm text-center py-4 text-muted-foreground">
                  No new notifications
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 right-2">
                  <AvatarImage 
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(clientName)}&backgroundColor=3b82f6`} 
                    alt={clientName} 
                  />
                  <AvatarFallback>
                    {clientName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-[200px] sm:w-[240px]" 
              align="end" 
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none truncate">
                    {clientName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Career Seeker
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="focus:bg-primary/5">
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-primary/5">
                My Career Plan
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-primary/5">
                Consultations History
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:bg-destructive/5">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}