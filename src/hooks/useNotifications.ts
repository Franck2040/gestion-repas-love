
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  data?: any;
  created_at: string;
}

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Notification[];
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const createNotificationMutation = useMutation({
    mutationFn: async (notification: { title: string; message: string; type: string; data?: any }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('notifications')
        .insert([{ ...notification, user_id: user.id }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notifications: notificationsQuery.data || [],
    unreadCount: notificationsQuery.data?.filter(n => !n.read).length || 0,
    isLoading: notificationsQuery.isLoading,
    error: notificationsQuery.error,
    markAsRead: markAsReadMutation.mutate,
    createNotification: createNotificationMutation.mutate,
  };
};
