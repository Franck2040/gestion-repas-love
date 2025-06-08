
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UserLocation {
  id: string;
  user_id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const useUserLocations = () => {
  const queryClient = useQueryClient();

  const locationsQuery = useQuery({
    queryKey: ['user-locations'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_locations')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      return data as UserLocation[];
    },
  });

  const addLocationMutation = useMutation({
    mutationFn: async (location: Omit<UserLocation, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // If this is set as default, unset other defaults first
      if (location.is_default) {
        await supabase
          .from('user_locations')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      const { data, error } = await supabase
        .from('user_locations')
        .insert([{ ...location, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-locations'] });
    },
  });

  const updateLocationMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<UserLocation> }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // If setting as default, unset other defaults first
      if (updates.is_default) {
        await supabase
          .from('user_locations')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      const { data, error } = await supabase
        .from('user_locations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-locations'] });
    },
  });

  const deleteLocationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_locations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-locations'] });
    },
  });

  const getCurrentLocationMutation = useMutation({
    mutationFn: async (): Promise<{ latitude: number; longitude: number }> => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by this browser.'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      });
    },
  });

  return {
    locations: locationsQuery.data || [],
    defaultLocation: locationsQuery.data?.find(l => l.is_default),
    isLoading: locationsQuery.isLoading,
    error: locationsQuery.error,
    addLocation: addLocationMutation.mutate,
    updateLocation: updateLocationMutation.mutate,
    deleteLocation: deleteLocationMutation.mutate,
    getCurrentLocation: getCurrentLocationMutation.mutateAsync,
    isAddingLocation: addLocationMutation.isPending,
    isUpdatingLocation: updateLocationMutation.isPending,
    isDeletingLocation: deleteLocationMutation.isPending,
  };
};
