"use client";

import { Bell, Search, Calendar } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import classNames from "classnames"; // Pastikan library ini diinstal
import { Notification } from "@/lib/types";

interface MentorHeaderProps {
  mentorName?: string;
}

export function MentorHeader({ mentorName = "Mentor" }: MentorHeaderProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setError(null); // Reset error state
      const response = await fetch("/api/mentor/notifications");
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to fetch notifications");

      setNotifications(data.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch notifications");
    }
  };

  // Poll for new notifications
  useEffect(() => {
    let isMounted = true;

    const pollNotifications = async () => {
      if (isMounted) await fetchNotifications();
      if (isMounted) setTimeout(pollNotifications, 30000); // Poll every 30 seconds
    };

    pollNotifications();

    return () => {
      isMounted = false; // Cleanup to avoid setting state on unmounted component
    };
  }, []);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/mentor/notifications/${notificationId}/read`, {
        method: "PATCH",
      });

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    if (notification.type === "EVENT" && notification.eventId) {
      router.push(`/dashboard-mentor/events/${notification.eventId}`);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Search section */}
        <div className="flex items-center gap-4 flex-1">
          <form className="hidden lg:flex-1 lg:flex lg:max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="w-full pl-9 bg-muted/50 rounded-md shadow-sm"
              />
            </div>
          </form>
        </div>

        {/* Right Section - Notifications & User Menu */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="error"
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-lg shadow-md">
              <DropdownMenuLabel className="flex justify-between items-center">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Badge variant="info">{unreadCount} new</Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {error ? (
                <div className="text-sm text-red-500 text-center py-4">
                  {error}
                </div>
              ) : notifications.length > 0 ? (
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={classNames(
                        "flex items-start gap-2 p-3 cursor-pointer rounded-lg",
                        { "bg-muted/50": !notification.read }
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {notification.type === "EVENT" ? (
                          <Calendar className="h-5 w-5 text-blue-500" />
                        ) : (
                          <Bell className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-center py-4 text-muted-foreground">
                  No notifications
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      mentorName
                    )}&backgroundColor=3b82f6`}
                    alt={mentorName}
                  />
                  <AvatarFallback>
                    {mentorName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[200px] sm:w-[240px] rounded-lg shadow-md"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none truncate">
                    {mentorName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Career Mentor
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="focus:bg-primary/10">
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-primary/10">
                My Schedule
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-primary/10">
                Client History
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:bg-destructive/10">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
