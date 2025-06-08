
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface FamilyMember {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  photo_url?: string;
  gender?: 'homme' | 'femme' | 'autre';
  weight?: number;
  height?: number;
  allergies?: string[];
  dietary_restrictions?: string[];
  birth_date?: string;
  created_at: string;
  updated_at: string;
}

export const useFamilyMembers = () => {
  const queryClient = useQueryClient();

  const familyMembersQuery = useQuery({
    queryKey: ['family-members'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as FamilyMember[];
    },
  });

  const addFamilyMemberMutation = useMutation({
    mutationFn: async (newMember: Omit<FamilyMember, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('family_members')
        .insert([{ ...newMember, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-members'] });
    },
  });

  const updateFamilyMemberMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<FamilyMember> }) => {
      const { data, error } = await supabase
        .from('family_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-members'] });
    },
  });

  const deleteFamilyMemberMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-members'] });
    },
  });

  return {
    familyMembers: familyMembersQuery.data || [],
    isLoading: familyMembersQuery.isLoading,
    error: familyMembersQuery.error,
    addFamilyMember: addFamilyMemberMutation.mutate,
    updateFamilyMember: updateFamilyMemberMutation.mutate,
    deleteFamilyMember: deleteFamilyMemberMutation.mutate,
    isAddingMember: addFamilyMemberMutation.isPending,
    isUpdatingMember: updateFamilyMemberMutation.isPending,
    isDeletingMember: deleteFamilyMemberMutation.isPending,
  };
};
