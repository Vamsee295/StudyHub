import { supabase } from '@/lib/supabase/client';

export type NotificationType = 
  | 'LESSON_COMPLETED' 
  | 'COURSE_MILESTONE' 
  | 'DSA_PROBLEM_SOLVED' 
  | 'DSA_MILESTONE' 
  | 'NEW_RESOURCE' 
  | 'PLACEMENT_UPDATE' 
  | 'SYSTEM';

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  link?: string;
  created_at: string;
}

export interface CreateNotificationDTO {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
}

export const notificationService = {
  /**
   * Fetch the latest 50 notifications for the current user
   */
  async getNotifications(): Promise<AppNotification[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.warn('[NotificationService] Could not fetch notifications (table may not exist yet or RLS issue):', error.message || error);
        return [];
      }

      return (data || []) as AppNotification[];
    } catch (err) {
      console.warn('[NotificationService] Unexpected error fetching notifications:', err);
      return [];
    }
  },

  /**
   * Get unread count for the current user
   */
  async getUnreadCount(): Promise<number> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) {
        console.warn('[NotificationService] Could not fetch unread count:', error.message || error);
        return 0;
      }

      return count || 0;
    } catch (err) {
      console.warn('[NotificationService] Unexpected error fetching unread count:', err);
      return 0;
    }
  },

  /**
   * Create a new notification
   */
  async createNotification(data: CreateNotificationDTO): Promise<AppNotification | null> {
    try {
      const { data: result, error } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: data.userId,
            title: data.title,
            message: data.message,
            type: data.type,
            link: data.link
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return result as AppNotification;
    } catch (err) {
      console.error('Failed to create notification:', err);
      // Fail gracefully so we don't break the main flow if notification fails
      return null;
    }
  },

  /**
   * Mark a single notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) {
        console.warn('[NotificationService] Error marking notification as read:', error.message || error);
      }
    } catch (err) {
      console.warn('[NotificationService] Unexpected error marking as read:', err);
    }
  },

  /**
   * Mark all unread notifications for the user as read
   */
  async markAllAsRead(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) {
        console.warn('[NotificationService] Error marking all notifications as read:', error.message || error);
      }
    } catch (err) {
      console.warn('[NotificationService] Unexpected error marking all as read:', err);
    }
  },

  /**
   * Set up realtime subscription for notifications
   */
  subscribeToNotifications(userId: string, callback: (notification: AppNotification) => void) {
    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as AppNotification);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
