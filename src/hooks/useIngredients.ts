
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Ingredient {
  id: string;
  name: string;
  description: string;
  unit: string;
  price_per_unit: number;
  photo_url: string;
  category_id: string;
  created_at: string;
  updated_at: string;
}

export const useIngredients = () => {
  const queryClient = useQueryClient();

  const ingredientsQuery = useQuery({
    queryKey: ['ingredients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Ingredient[];
    },
  });

  const addIngredientMutation = useMutation({
    mutationFn: async (newIngredient: Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('ingredients')
        .insert([newIngredient])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });

  return {
    ingredients: ingredientsQuery.data || [],
    isLoading: ingredientsQuery.isLoading,
    error: ingredientsQuery.error,
    addIngredient: addIngredientMutation.mutate,
    isAddingIngredient: addIngredientMutation.isPending,
  };
};
