
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface MarketplaceItem {
  id: string;
  seller_id: string;
  ingredient_id: string;
  quantity: number;
  price_per_unit: number;
  description: string;
  location: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  ingredient: {
    id: string;
    name: string;
    unit: string;
    photo_url?: string;
    category_id?: string;
  };
  seller: {
    id: string;
    first_name?: string;
    last_name?: string;
    username?: string;
  };
}

export const useMarketplace = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const marketplaceQuery = useQuery({
    queryKey: ['marketplace-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select(`
          *,
          ingredient:ingredients(
            id,
            name,
            unit,
            photo_url,
            category_id
          ),
          seller:profiles(id, first_name, last_name, username)
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        seller: item.seller || { id: item.seller_id, first_name: '', last_name: '', username: '' },
        ingredient: item.ingredient || { id: '', name: '', unit: '', photo_url: '', category_id: '' }
      })) as MarketplaceItem[];
    },
  });

  const myItemsQuery = useQuery({
    queryKey: ['my-marketplace-items', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('marketplace_items')
        .select(`
          *,
          ingredient:ingredients(
            id,
            name,
            unit,
            photo_url,
            category_id
          )
        `)
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        seller: { id: user.id, first_name: '', last_name: '', username: '' },
        ingredient: item.ingredient || { id: '', name: '', unit: '', photo_url: '', category_id: '' }
      })) as MarketplaceItem[];
    },
    enabled: !!user,
  });

  const addItemMutation = useMutation({
    mutationFn: async (newItem: Omit<MarketplaceItem, 'id' | 'created_at' | 'updated_at' | 'ingredient' | 'seller'>) => {
      const { data, error } = await supabase
        .from('marketplace_items')
        .insert([newItem])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-items'] });
      queryClient.invalidateQueries({ queryKey: ['my-marketplace-items'] });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MarketplaceItem> }) => {
      const { data, error } = await supabase
        .from('marketplace_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-items'] });
      queryClient.invalidateQueries({ queryKey: ['my-marketplace-items'] });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('marketplace_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-items'] });
      queryClient.invalidateQueries({ queryKey: ['my-marketplace-items'] });
    },
  });

  return {
    marketplaceItems: marketplaceQuery.data || [],
    myItems: myItemsQuery.data || [],
    isLoading: marketplaceQuery.isLoading,
    error: marketplaceQuery.error,
    addItem: addItemMutation.mutate,
    updateItem: updateItemMutation.mutate,
    deleteItem: deleteItemMutation.mutate,
    isAddingItem: addItemMutation.isPending,
    isUpdatingItem: updateItemMutation.isPending,
    isDeletingItem: deleteItemMutation.isPending,
  };
};
