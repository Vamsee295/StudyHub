"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'LESSON_COMPLETED':
      return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    case 'COURSE_MILESTONE':
    case 'DSA_MILESTONE':
      return <Trophy className="w-4 h-4 text-amber-600" />;
    case 'DSA_PROBLEM_SOLVED':
      return <Code className="w-4 h-4 text-blue-600" />;
    case 'NEW_RESOURCE':
      return <FileText className="w-4 h-4 text-indigo-600" />;
    case 'PLACEMENT_UPDATE':
      return <Briefcase className="w-4 h-4 text-purple-600" />;
    case 'SYSTEM':
    default:
      return <Info className="w-4 h-4 text-slate-600" />;
  }
};

const getNotificationBg = (type: NotificationType) => {
  switch (type) {
    case 'LESSON_COMPLETED': return "bg-emerald-50";
    case 'COURSE_MILESTONE':
    case 'DSA_MILESTONE': return "bg-amber-50";
    case 'DSA_PROBLEM_SOLVED': return "bg-blue-50";
    case 'NEW_RESOURCE': return "bg-indigo-50";
    case 'PLACEMENT_UPDATE': return "bg-purple-50";
    case 'SYSTEM':
    default: return "bg-slate-100";
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
  onNavigate
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.98 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          className="absolute right-0 sm:right-0 -right-[60px] top-full mt-2.5 w-[360px] max-w-[calc(100vw-24px)] bg-white rounded-2xl border border-[var(--border)] shadow-xl shadow-[var(--ink)]/5 z-50 overflow-hidden font-sans"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-subdued)]/50">
            <h3 className="font-bold text-[14px] text-[var(--ink)]">Notifications</h3>
            {hasUnread && (
              <button
                onClick={onMarkAllAsRead}
                className="text-[12px] font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors flex items-center gap-1"
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
                <Loader2 className="w-6 h-6 text-[var(--accent)] animate-spin mb-2" />
                <span className="text-[12px] text-[var(--ink-tertiary)]">Loading notifications...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--surface-subdued)] flex items-center justify-center mb-3">
                  <Bell className="w-5 h-5 text-[var(--ink-tertiary)]" />
                </div>
                <h4 className="font-semibold text-[14px] text-[var(--ink)] mb-1">You're all caught up</h4>
                <p className="text-[12px] text-[var(--ink-secondary)]">No new notifications right now.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={clsx(
                      "w-full text-left p-4 border-b border-[var(--border)]/50 hover:bg-[var(--surface-subdued)]/50 transition-colors flex gap-3 group relative cursor-pointer",
                      !notification.read ? "bg-[var(--accent-soft)]/10" : "bg-white"
                    )}
                  >
                    {!notification.read && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--accent)] rounded-r-full" />
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
                          !notification.read ? "text-[var(--ink)]" : "text-[var(--ink-secondary)]"
                        )}>
                          {notification.title}
                        </span>
                        <span className="text-[11px] text-[var(--ink-tertiary)] shrink-0 whitespace-nowrap pt-0.5">
                          {formatTimeAgo(notification.created_at)}
                        </span>
                      </div>
                      <p className={clsx(
                        "text-[12px] leading-snug line-clamp-2",
                        !notification.read ? "text-[var(--ink-secondary)] font-medium" : "text-[var(--ink-tertiary)]"
                      )}>
                        {notification.message}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
