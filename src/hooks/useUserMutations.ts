
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { UserService } from '@/services/userService';
import { supabase } from '@/integrations/supabase/client';

export function useUserMutations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      console.log('Creating new user with data:', userData);
      
      // Generate a default password if none provided
      const password = userData.password || 'TempPassword123!';
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: userData.name
          }
        }
      });

      if (error) {
        console.error('Error creating user:', error);
        throw new Error(error.message);
      }

      console.log('User created:', data.user);

      if (data.user) {
        // Wait a bit for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
          // Update the profile with additional data including avatar
          await UserService.update(data.user.id, {
            full_name: userData.name,
            role: userData.role,
            phone: userData.phone,
            avatar_url: userData.avatar
          });
          console.log('Profile updated with additional data');
        } catch (updateError) {
          console.warn('Could not update additional profile data:', updateError);
          // Still consider this a success since the user was created
        }
      }

      return data.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "User created",
        description: "The new user has been successfully created. They will receive a confirmation email.",
      });
    },
    onError: (error: any) => {
      console.error('Create user mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create user. Please check the email and try again.",
        variant: "destructive"
      });
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, userData }: { id: string; userData: any }) => {
      return await UserService.update(id, {
        full_name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
        avatar_url: userData.avatar
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "User updated",
        description: "The user has been successfully updated.",
      });
    },
    onError: (error) => {
      console.error('Update user mutation error:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return await UserService.delete(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "User profile deleted",
        description: "The user profile has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      console.error('Delete user mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive"
      });
    }
  });

  return {
    createUserMutation,
    updateUserMutation,
    deleteUserMutation
  };
}
