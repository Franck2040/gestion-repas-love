
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ShoppingList {
  id: string;
  user_id: string;
  name: string;
  is_shared: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShoppingListItem {
  id: string;
  shopping_list_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  is_checked: boolean;
  added_by: string;
  created_at: string;
  ingredient?: {
    id: string;
    name: string;
    photo_url?: string;
    price_per_unit: number;
  };
}

export const useShoppingList = () => {
  const queryClient = useQueryClient();

  const shoppingListsQuery = useQuery({
    queryKey: ['shopping-lists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shopping_lists')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as ShoppingList[];
    },
  });

  const shoppingListItemsQuery = useQuery({
    queryKey: ['shopping-list-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shopping_list_items')
        .select(`
          *,
          ingredient:ingredients(
            id, name, photo_url, price_per_unit
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ShoppingListItem[];
    },
  });

  const addShoppingListMutation = useMutation({
    mutationFn: async (list: Omit<ShoppingList, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('shopping_lists')
        .insert([list])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-lists'] });
    },
  });

  const addShoppingListItemMutation = useMutation({
    mutationFn: async (item: Omit<ShoppingListItem, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('shopping_list_items')
        .insert([item])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-list-items'] });
    },
  });

  const updateShoppingListItemMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ShoppingListItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('shopping_list_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-list-items'] });
    },
  });

  const removeShoppingListItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('shopping_list_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-list-items'] });
    },
  });

  const deleteShoppingListMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('shopping_lists')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-lists'] });
      queryClient.invalidateQueries({ queryKey: ['shopping-list-items'] });
    },
  });

  return {
    shoppingLists: shoppingListsQuery.data || [],
    shoppingListItems: shoppingListItemsQuery.data || [],
    isLoading: shoppingListsQuery.isLoading,
    error: shoppingListsQuery.error,
    addShoppingList: addShoppingListMutation.mutate,
    addShoppingListItem: addShoppingListItemMutation.mutate,
    updateShoppingListItem: updateShoppingListItemMutation.mutate,
    removeShoppingListItem: removeShoppingListItemMutation.mutate,
    deleteShoppingList: deleteShoppingListMutation.mutate,
    isAddingList: addShoppingListMutation.isPending,
    isAddingItem: addShoppingListItemMutation.isPending,
    isUpdatingItem: updateShoppingListItemMutation.isPending,
    isRemovingItem: removeShoppingListItemMutation.isPending,
    isDeletingList: deleteShoppingListMutation.isPending,
  };
};
