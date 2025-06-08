
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface InventoryItem {
  id: string;
  user_id: string;
  ingredient_id: string;
  quantity: number;
  expiration_date?: string;
  location: string;
  low_stock_threshold?: number;
  created_at: string;
  updated_at: string;
  ingredient?: {
    id: string;
    name: string;
    unit: string;
    photo_url?: string;
    price_per_unit: number;
  };
}

export const useInventory = () => {
  const queryClient = useQueryClient();

  const inventoryQuery = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          ingredient:ingredients(
            id, name, unit, photo_url, price_per_unit
          )
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as InventoryItem[];
    },
  });

  const addInventoryMutation = useMutation({
    mutationFn: async (item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('inventory')
        .insert([item])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  const updateInventoryMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<InventoryItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('inventory')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  const removeInventoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  return {
    inventory: inventoryQuery.data || [],
    isLoading: inventoryQuery.isLoading,
    error: inventoryQuery.error,
    addInventoryItem: addInventoryMutation.mutate,
    updateInventoryItem: updateInventoryMutation.mutate,
    removeInventoryItem: removeInventoryMutation.mutate,
    isAddingItem: addInventoryMutation.isPending,
    isUpdatingItem: updateInventoryMutation.isPending,
    isRemovingItem: removeInventoryMutation.isPending,
  };
};
