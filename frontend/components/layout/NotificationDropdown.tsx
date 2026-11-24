"use client";

import React, { useEffect, useRef } from "react";
import { 
  Bell,
  CheckCircle2, 
  Trophy, 
  Code,
  FileText,
  Briefcase,
  Info,
  Check,
  Loader2
} from "lucide-react";
import { AppNotification, NotificationType } from "@/lib/services/notificationService";
import { clsx } from "clsx";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  isLoading: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNavigate?: (link: string) => void;
  /** where the menu opens relative to its trigger */
  placement?: string;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'LESSON_COMPLETED':
      return <CheckCircle2 className="w-4 h-4 text-note" />;
    case 'COURSE_MILESTONE':
    case 'DSA_MILESTONE':
      return <Trophy className="w-4 h-4 text-warning" />;
    case 'DSA_PROBLEM_SOLVED':
      return <Code className="w-4 h-4 text-accent-ink" />;
    case 'NEW_RESOURCE':
      return <FileText className="w-4 h-4 text-ink" />;
    case 'PLACEMENT_UPDATE':
      return <Briefcase className="w-4 h-4 text-accent-ink" />;
    case 'SYSTEM':
    default:
      return <Info className="w-4 h-4 text-mute" />;
  }
};

const getNotificationBg = (type: NotificationType) => {
  switch (type) {
    case 'LESSON_COMPLETED': return "bg-success-soft";
    case 'COURSE_MILESTONE':
    case 'DSA_MILESTONE': return "bg-warning-soft";
    case 'DSA_PROBLEM_SOLVED': return "bg-accent-soft";
    case 'NEW_RESOURCE': return "bg-card-2";
    case 'PLACEMENT_UPDATE': return "bg-accent-soft";
    case 'SYSTEM':
    default: return "bg-card-2";
  }
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
};

export function NotificationDropdown({
  isOpen,
  onClose,
  notifications,
  isLoading,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigate,
  placement = "right-0 top-full mt-2.5"
}: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleNotificationClick = (notification: AppNotification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    if (notification.link && onNavigate) {
      onNavigate(notification.link);
      onClose();
    }
  };

  const hasUnread = notifications.some(n => !n.read);

  return (
    <>
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`pop-in brut absolute ${placement} w-[360px] max-w-[calc(100vw-24px)] bg-card rounded-2xl z-50 overflow-hidden font-sans`}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-hair bg-paper-2/50">
            <h3 className="label-cond text-[17px]">Notifications</h3>
            {hasUnread && (
              <button
                onClick={onMarkAllAsRead}
                className="text-[12px] font-semibold text-accent-ink hover:text-accent-ink transition-colors flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                Mark all as read
              </button>
            )}
          </div>

          {/* CONTENT */}
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader2 className="w-6 h-6 text-accent-ink animate-spin mb-2" />
                <span className="text-[12px] text-mute">Loading notifications...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="w-12 h-12 rounded-full bg-paper-2 flex items-center justify-center mb-3">
                  <Bell className="w-5 h-5 text-mute" />
                </div>
                <h4 className="font-semibold text-[14px] text-ink mb-1">You're all caught up</h4>
                <p className="text-[12px] text-body">No new notifications right now.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={clsx(
                      "group relative flex w-full cursor-pointer gap-3 border-b-[1.5px] border-hair p-4 text-left transition-colors hover:bg-card-2",
                      !notification.read ? "bg-accent-soft" : "bg-card"
                    )}
                  >
                    {!notification.read && (
                      <span aria-label="Unread" className="absolute right-4 top-4 size-2 rounded-full bg-accent" />
                    )}
                    
                    <div className={clsx(
                      "w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                      getNotificationBg(notification.type)
                    )}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2 mb-0.5">
                        <span className={clsx(
                          "text-[13px] font-semibold truncate pr-2",
                          !notification.read ? "text-ink" : "text-body"
                        )}>
                          {notification.title}
                        </span>
                        <span className="text-[11px] text-mute shrink-0 whitespace-nowrap pt-0.5">
                          {formatTimeAgo(notification.created_at)}
                        </span>
                      </div>
                      <p className={clsx(
                        "text-[12px] leading-snug line-clamp-2",
                        !notification.read ? "text-body font-medium" : "text-mute"
                      )}>
                        {notification.message}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
