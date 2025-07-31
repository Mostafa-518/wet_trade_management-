
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { UsersTable } from '@/components/UsersTable';
import { UserDetailView } from '@/components/UserDetailView';
import { UserDialogs } from '@/components/UserDialogs';
import { useUserMutations } from '@/hooks/useUserMutations';
import { UserService } from '@/services/userService';
import { User } from '@/types/user';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';

export function UserManagement() {
  const location = useLocation();
  const { profile } = useAuth();
  const { canManageUsers } = usePermissions();
  const { createUserMutation, updateUserMutation, deleteUserMutation } = useUserMutations();
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const data = await UserService.getAll();
      return data.map(user => {
        let normalizedRole: 'admin' | 'project_manager' | 'supervisor' | 'viewer';
        if (user.role === 'admin') normalizedRole = 'admin';
        else if (user.role === 'viewer') normalizedRole = 'viewer';
        else if (user.role === 'project_manager') normalizedRole = 'project_manager';
        else if (user.role === 'supervisor') normalizedRole = 'supervisor';
        else normalizedRole = 'viewer'; // fallback
        return {
          id: user.id,
          name: user.full_name || '',
          email: user.email || '',
          role: normalizedRole,
          phone: user.phone || '',
          department: 'General',
          status: 'active' as const,
          createdAt: user.created_at,
          lastLogin: user.last_login,
          avatar: user.avatar_url
        };
      });
    },
    staleTime: 0, // Always refetch to ensure fresh data
    refetchOnWindowFocus: true, // Refetch when window gains focus
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
    console.log('UserManagement: handleFormSubmit called with data:', data);
    console.log('UserManagement: editingUser:', editingUser);
    try {
      if (editingUser) {
        console.log('UserManagement: Calling updateUserMutation with:', { id: editingUser.id, userData: data });
        const result = await updateUserMutation.mutateAsync({ id: editingUser.id, userData: data });
        console.log('UserManagement: Update result:', result);
      } else {
        console.log('UserManagement: Calling createUserMutation with:', data);
        const result = await createUserMutation.mutateAsync(data);
        console.log('UserManagement: Create result:', result);
      }
      setIsFormOpen(false);
      setEditingUser(null);
      console.log('UserManagement: Form submitted successfully');
    } catch (error) {
      console.error('UserManagement: Form submission error:', error);
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

  // Debug information about user role and permissions
  console.log('UserManagement: User profile and permissions check:', {
    profile,
    profileRole: profile?.role,
    canManageUsers
  });

  if (isDetailOpen && selectedUser) {
    return (
      <UserDetailView
        user={selectedUser}
        onBack={handleDetailBack}
        onEdit={canManageUsers ? handleEditUser : () => {}}
      />
    );
  }

  return (
    <>
      <UsersTable
        users={users}
        onAdd={canManageUsers ? handleAddUser : undefined}
        onEdit={canManageUsers ? handleEditUser : undefined}
        onDelete={canManageUsers ? handleDeleteUser : undefined}
        onView={handleViewUser}
        loading={isLoading}
        canModify={canManageUsers}
      />

      <UserDialogs
        isFormOpen={isFormOpen}
        setIsFormOpen={setIsFormOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        editingUser={editingUser}
        onFormSubmit={handleFormSubmit}
        onFormCancel={handleFormCancel}
        onConfirmDelete={confirmDelete}
        canModify={canManageUsers}
        isDeleting={deleteUserMutation.isPending}
      />
    </>
  );
}
