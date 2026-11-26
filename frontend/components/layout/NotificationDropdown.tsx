"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, CheckCircle2, Trophy, Code, FileText, Briefcase, Info, Check, Loader2, X, Settings, Heart, MessageCircle, UserPlus, AtSign } from "lucide-react";
import { AppNotification, NotificationType } from "@/lib/services/notificationService";
import { clsx } from "clsx";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  isLoading: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
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
    case 'POST_LIKED':
      return <Heart className="w-4 h-4 text-danger fill-current" />;
    case 'POST_REPLY':
      return <MessageCircle className="w-4 h-4 text-accent-ink" />;
    case 'NEW_FOLLOWER':
      return <UserPlus className="w-4 h-4 text-note" />;
    case 'MENTION':
      return <AtSign className="w-4 h-4 text-accent-ink" />;
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
    case 'POST_LIKED': return "bg-danger/10";
    case 'POST_REPLY': return "bg-accent-soft";
    case 'NEW_FOLLOWER': return "bg-success-soft";
    case 'MENTION': return "bg-accent-soft";
    case 'SYSTEM':
    default: return "bg-card-2";
  }
};

const formatTimeAgo = (dateString: string) => {
  const diffInSeconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return new Date(dateString).toLocaleDateString();
};

export function NotificationDropdown({
  isOpen,
  onClose,
  notifications,
  isLoading,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
  onNavigate,
  placement = "right-0 top-full mt-2.5"
}: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const el = dropdownRef.current;
      // The layout renders one menu for desktop and one for phones; the hidden copy must not react,
      // or every click inside the visible menu counts as "outside" and closes it before the click lands.
      if (!el || !el.offsetParent) return;
      const target = event.target as Element;
      // the bell toggles the menu itself
      if (el.contains(target) || target.closest?.("[data-notif-bell]")) return;
      onClose();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleNotificationClick = (notification: AppNotification) => {
    if (!notification.read) onMarkAsRead(notification.id);
    if (notification.link && onNavigate) {
      onNavigate(notification.link);
      onClose();
    }
  };

  if (!isOpen) return null;

  const unread = notifications.filter((n) => !n.read).length;
  const shown = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div
      ref={dropdownRef}
      role="dialog"
      aria-label="Notifications"
      className={`pop-in brut absolute ${placement} w-[360px] max-w-[calc(100vw-24px)] bg-card rounded-2xl z-50 overflow-hidden font-sans`}
    >
      {/* HEADER */}
      <div className="border-b border-hair bg-paper-2/50 px-4 pt-3">
        <div className="flex items-center justify-between">
          <h3 className="label-cond text-[17px]">Notifications</h3>
          {unread > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="flex items-center gap-1 text-[12px] font-semibold text-accent-ink hover:underline"
            >
              <Check className="w-3.5 h-3.5" />
              Mark all as read
            </button>
          )}
        </div>
        <div role="tablist" className="mt-2 flex gap-4 text-[12.5px] font-semibold">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={clsx(
                "-mb-px border-b-2 pb-2 capitalize transition-colors",
                filter === f ? "border-accent text-ink" : "border-transparent text-mute hover:text-ink"
              )}
            >
              {f}
              {f === "unread" && unread > 0 && (
                <span className="ml-1.5 rounded-full bg-accent px-1.5 py-px font-mono text-[10px] text-paper">{unread}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="w-6 h-6 text-accent-ink animate-spin mb-2" />
            <span className="text-[12px] text-mute">Loading notifications...</span>
          </div>
        ) : shown.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-12 h-12 rounded-full bg-paper-2 flex items-center justify-center mb-3">
              <Bell className="w-5 h-5 text-mute" />
            </div>
            <h4 className="font-semibold text-[14px] text-ink mb-1">You’re all caught up</h4>
            <p className="text-[12px] text-body">
              {filter === "unread" && notifications.length ? "No unread notifications." : "Finish lessons and solve problems to see updates here."}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col">
            {shown.map((notification) => (
              <li
                key={notification.id}
                className={clsx(
                  "group relative border-b-[1.5px] border-hair transition-colors hover:bg-card-2",
                  !notification.read ? "bg-accent-soft" : "bg-card"
                )}
              >
                <button
                  onClick={() => handleNotificationClick(notification)}
                  className="flex w-full cursor-pointer gap-3 p-4 pr-10 text-left"
                >
                  <div className={clsx("w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5", getNotificationBg(notification.type))}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <span className={clsx("text-[13px] font-semibold truncate", !notification.read ? "text-ink" : "text-body")}>
                        {notification.title}
                      </span>
                      <span className="text-[11px] text-mute shrink-0 whitespace-nowrap pt-0.5">{formatTimeAgo(notification.created_at)}</span>
                    </div>
                    <p className={clsx("text-[12px] leading-snug line-clamp-2", !notification.read ? "text-body font-medium" : "text-mute")}>
                      {notification.message}
                    </p>
                  </div>
                </button>
                {/* unread dot, swapped for a dismiss button on hover/focus */}
                {!notification.read && (
                  <span aria-label="Unread" className="absolute right-4 top-5 size-2 rounded-full bg-accent group-hover:hidden group-focus-within:hidden max-md:hidden" />
                )}
                <button
                  onClick={() => onDelete(notification.id)}
                  aria-label={`Dismiss "${notification.title}"`}
                  title="Dismiss"
                  className="absolute right-2 top-3 grid size-7 place-items-center rounded-lg text-mute opacity-0 transition-opacity hover:bg-ink/[0.08] hover:text-ink focus-visible:opacity-100 group-hover:opacity-100 max-md:opacity-100"
                >
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between border-t border-hair bg-paper-2/50 px-4 py-2.5 text-[12px] font-semibold">
        <Link href="/settings?tab=learning" onClick={onClose} className="flex items-center gap-1 text-mute hover:text-ink">
          <Settings className="size-3.5" /> Settings
        </Link>
        {notifications.length > 0 && (
          <button onClick={onClearAll} className="text-mute hover:text-danger">
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
