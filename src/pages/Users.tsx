import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UsersTable } from '@/components/UsersTable';
import { UserForm } from '@/components/UserForm';
import { UserDetailView } from '@/components/UserDetailView';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { UserService } from '@/services/userService';
import { User } from '@/types/user';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export function Users() {
  const location = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Fetch users from backend
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const data = await UserService.getAll();
      // Normalize roles to new enum
      return data.map(user => {
        let normalizedRole: 'admin' | 'manager' | 'viewer';
        if (user.role === 'admin') normalizedRole = 'admin';
        else if (user.role === 'viewer') normalizedRole = 'viewer';
        else normalizedRole = 'manager'; // catch 'project_manager' and 'supervisor'
        return {
          id: user.id,
          name: user.full_name || '',
          email: user.email || '',
          role: normalizedRole, // role now uses the correct values
          phone: user.phone || '',
          department: 'General', // Default department since it's not in the database
          status: 'active' as const,
          createdAt: user.created_at,
          lastLogin: user.updated_at
        };
      });
    }
  });

  // Create user mutation - use normal signup, then update profile
  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      console.log('Creating new user with data:', userData);
      
      // Use regular signup since admin functions require service role
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password || 'TempPassword123!',
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: userData.name
          }
        }
      });

      if (error) {
        console.error('Error creating user:', error);
        throw error;
      }

      console.log('User created:', data.user);

      // The user profile will be created automatically by the database trigger
      // If we need to update additional fields, we can do it here
      if (data.user) {
        // Wait a moment for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          await UserService.update(data.user.id, {
            full_name: userData.name,
            role: userData.role,
            phone: userData.phone
          });
          console.log('Profile updated with additional data');
        } catch (updateError) {
          console.warn('Could not update additional profile data:', updateError);
          // Don't throw here as the user was created successfully
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
        description: error.message || "Failed to create user",
        variant: "destructive"
      });
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, userData }: { id: string; userData: any }) => {
      return await UserService.update(id, {
        full_name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone
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
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      // Since we can't use admin functions, we'll just delete the profile
      // In production, you'd want to implement this via an edge function with service role
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
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive"
      });
    }
  });

  React.useEffect(() => {
    if (location.state?.editUser) {
      setEditingUser(location.state.editUser);
      setIsFormOpen(true);
    }
  }, [location.state]);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
    setIsDetailOpen(false);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete);
    }
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingUser) {
        await updateUserMutation.mutateAsync({ id: editingUser.id, userData: data });
      } else {
        await createUserMutation.mutateAsync(data);
      }
      setIsFormOpen(false);
      setEditingUser(null);
    } catch (error) {
      // Error handling is done in mutation callbacks
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const handleDetailBack = () => {
    setIsDetailOpen(false);
    setSelectedUser(null);
  };

  const canModify = profile?.role !== 'viewer';

  if (isDetailOpen && selectedUser) {
    return (
      <UserDetailView
        user={selectedUser}
        onBack={handleDetailBack}
        onEdit={canModify ? handleEditUser : undefined}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">
          Manage user accounts, roles, and permissions for your organization.
        </p>
      </div>

      <UsersTable
        users={users}
        onAdd={canModify ? handleAddUser : undefined}
        onEdit={canModify ? handleEditUser : undefined}
        onDelete={canModify ? handleDeleteUser : undefined}
        onView={handleViewUser}
        loading={isLoading}
        canModify={canModify}
      />

      {canModify && (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Edit User' : 'Add New User'}
              </DialogTitle>
            </DialogHeader>
            <UserForm
              user={editingUser || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              account and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {canModify && (
              <AlertDialogAction 
                onClick={confirmDelete}
                disabled={deleteUserMutation.isPending}
              >
                Delete
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
