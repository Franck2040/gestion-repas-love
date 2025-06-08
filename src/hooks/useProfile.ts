
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Profile {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  bio: string;
  created_at: string;
  updated_at: string;
}

interface UserStats {
  dishesCount: number;
  mealPlansCount: number;
  marketplaceSales: number;
  ingredientsCount: number;
}

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user,
  });

  const statsQuery = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Get dishes count
      const { count: dishesCount } = await supabase
        .from('dishes')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', user.id);

      // Get meal plans count
      const { count: mealPlansCount } = await supabase
        .from('meal_plans')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get marketplace sales count
      const { count: marketplaceSales } = await supabase
        .from('marketplace_items')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', user.id);

      // Get ingredients count (from inventory)
      const { count: ingredientsCount } = await supabase
        .from('inventory')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      return {
        dishesCount: dishesCount || 0,
        mealPlansCount: mealPlansCount || 0,
        marketplaceSales: marketplaceSales || 0,
        ingredientsCount: ingredientsCount || 0,
      } as UserStats;
    },
    enabled: !!user,
  });

  const favoriteDishesQuery = useQuery({
    queryKey: ['favorite-dishes', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          dish:dishes(
            id,
            name,
            photo_url
          )
        `)
        .eq('user_id', user.id)
        .limit(3);

      if (error) throw error;
      return data.map(fav => fav.dish).filter(Boolean);
    },
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return {
    profile: profileQuery.data,
    stats: statsQuery.data,
    favoriteDishes: favoriteDishesQuery.data || [],
    isLoading: profileQuery.isLoading || statsQuery.isLoading,
    error: profileQuery.error || statsQuery.error,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
  };
};
