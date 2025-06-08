
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface MealPlan {
  id: string;
  user_id: string;
  dish_id: string;
  planned_date: string;
  meal_type: string;
  servings: number;
  created_at: string;
  dish: {
    id: string;
    name: string;
    photo_url: string;
    cooking_time: number;
    servings: number;
    description?: string;
    dish_ingredients?: Array<{
      quantity: number;
      unit: string;
      ingredient: {
        name: string;
        price_per_unit: number;
      };
    }>;
  };
}

export const useMealPlans = (startDate?: Date, endDate?: Date) => {
  const queryClient = useQueryClient();

  const mealPlansQuery = useQuery({
    queryKey: ['meal-plans', startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      let query = supabase
        .from('meal_plans')
        .select(`
          *,
          dish:dishes(
            id, 
            name, 
            photo_url, 
            cooking_time, 
            servings, 
            description,
            dish_ingredients(
              quantity,
              unit,
              ingredient:ingredients(
                name,
                price_per_unit
              )
            )
          )
        `)
        .order('planned_date', { ascending: true });

      if (startDate) {
        query = query.gte('planned_date', startDate.toISOString().split('T')[0]);
      }
      if (endDate) {
        query = query.lte('planned_date', endDate.toISOString().split('T')[0]);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as MealPlan[];
    },
    enabled: !!startDate && !!endDate,
  });

  const addMealPlanMutation = useMutation({
    mutationFn: async (mealPlan: {
      user_id: string;
      dish_id: string;
      planned_date: string;
      meal_type?: string;
      servings?: number;
    }) => {
      const { data, error } = await supabase
        .from('meal_plans')
        .insert([mealPlan])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meal-plans'] });
    },
  });

  const removeMealPlanMutation = useMutation({
    mutationFn: async (mealPlanId: string) => {
      const { error } = await supabase
        .from('meal_plans')
        .delete()
        .eq('id', mealPlanId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meal-plans'] });
    },
  });

  return {
    mealPlans: mealPlansQuery.data || [],
    isLoading: mealPlansQuery.isLoading,
    error: mealPlansQuery.error,
    addMealPlan: addMealPlanMutation.mutate,
    isAddingMealPlan: addMealPlanMutation.isPending,
    removeMealPlan: removeMealPlanMutation.mutate,
  };
};
