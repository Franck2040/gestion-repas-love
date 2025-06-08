
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Author {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
}

interface DishIngredient {
  id: string;
  quantity: number;
  unit: string;
  ingredient: {
    id: string;
    name: string;
    unit: string;
  };
}

interface Dish {
  id: string;
  name: string;
  description: string;
  photo_url: string;
  cooking_time: number;
  servings: number;
  is_public: boolean;
  author_id: string;
  rating: number;
  recipe_content: string;
  recipe_file_url: string;
  created_at: string;
  updated_at: string;
  author: Author;
  dish_ingredients: DishIngredient[];
  is_favorite?: boolean;
}

export const useDishes = () => {
  const queryClient = useQueryClient();

  const dishesQuery = useQuery({
    queryKey: ['dishes'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Requête simplifiée pour les plats publics
      const { data: dishesData, error } = await supabase
        .from('dishes')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Récupérer les profils des auteurs séparément
      const authorIds = dishesData?.map(dish => dish.author_id).filter(Boolean) || [];
      const { data: authorsData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, username')
        .in('id', authorIds);

      // Récupérer les ingrédients séparément
      const dishIds = dishesData?.map(dish => dish.id) || [];
      const { data: ingredientsData } = await supabase
        .from('dish_ingredients')
        .select(`
          id,
          dish_id,
          quantity,
          unit,
          ingredient:ingredients(id, name, unit)
        `)
        .in('dish_id', dishIds);

      // Récupérer les favoris de l'utilisateur
      let favoriteIds: string[] = [];
      if (user) {
        const { data: favorites } = await supabase
          .from('favorites')
          .select('dish_id')
          .eq('user_id', user.id);
        favoriteIds = favorites?.map(f => f.dish_id) || [];
      }

      // Combiner les données
      const dishes = (dishesData || []).map(dish => ({
        ...dish,
        author: authorsData?.find(author => author.id === dish.author_id) || { 
          id: '', 
          first_name: '', 
          last_name: '', 
          username: '' 
        },
        dish_ingredients: ingredientsData?.filter(ing => ing.dish_id === dish.id) || [],
        is_favorite: favoriteIds.includes(dish.id)
      })) as Dish[];

      return dishes;
    },
  });

  const myDishesQuery = useQuery({
    queryKey: ['my-dishes'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Requête simplifiée pour mes plats
      const { data: dishesData, error } = await supabase
        .from('dishes')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Récupérer mon profil
      const { data: authorData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, username')
        .eq('id', user.id)
        .single();

      // Récupérer les ingrédients
      const dishIds = dishesData?.map(dish => dish.id) || [];
      const { data: ingredientsData } = await supabase
        .from('dish_ingredients')
        .select(`
          id,
          dish_id,
          quantity,
          unit,
          ingredient:ingredients(id, name, unit)
        `)
        .in('dish_id', dishIds);

      // Combiner les données
      const dishes = (dishesData || []).map(dish => ({
        ...dish,
        author: authorData || { id: '', first_name: '', last_name: '', username: '' },
        dish_ingredients: ingredientsData?.filter(ing => ing.dish_id === dish.id) || []
      })) as Dish[];

      return dishes;
    },
    enabled: !!supabase.auth.getUser(),
  });

  const addDishMutation = useMutation({
    mutationFn: async (newDish: Omit<Dish, 'id' | 'created_at' | 'updated_at' | 'author' | 'dish_ingredients'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const dishData = { ...newDish, author_id: user.id };

      const { data, error } = await supabase
        .from('dishes')
        .insert([dishData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
      queryClient.invalidateQueries({ queryKey: ['my-dishes'] });
    },
  });

  const updateDishMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Dish> }) => {
      const { data, error } = await supabase
        .from('dishes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
      queryClient.invalidateQueries({ queryKey: ['my-dishes'] });
    },
  });

  const deleteDishMutation = useMutation({
    mutationFn: async (dishId: string) => {
      const { error } = await supabase
        .from('dishes')
        .delete()
        .eq('id', dishId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
      queryClient.invalidateQueries({ queryKey: ['my-dishes'] });
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (dishId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: existingFavorite } = await supabase
        .from('favorites')
        .select('id')
        .eq('dish_id', dishId)
        .eq('user_id', user.id)
        .single();

      if (existingFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('dish_id', dishId)
          .eq('user_id', user.id);
        if (error) throw error;
        return false;
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert([{ dish_id: dishId, user_id: user.id }]);
        if (error) throw error;
        return true;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
      queryClient.invalidateQueries({ queryKey: ['my-dishes'] });
    },
  });

  return {
    dishes: dishesQuery.data || [],
    myDishes: myDishesQuery.data || [],
    isLoading: dishesQuery.isLoading || myDishesQuery.isLoading,
    error: dishesQuery.error || myDishesQuery.error,
    addDish: addDishMutation.mutate,
    updateDish: updateDishMutation.mutate,
    deleteDish: deleteDishMutation.mutate,
    toggleFavorite: toggleFavoriteMutation.mutate,
    isAddingDish: addDishMutation.isPending,
    isUpdatingDish: updateDishMutation.isPending,
    isDeletingDish: deleteDishMutation.isPending,
    isTogglingFavorite: toggleFavoriteMutation.isPending,
  };
};
