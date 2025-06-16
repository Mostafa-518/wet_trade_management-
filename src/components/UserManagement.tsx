
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

export function UserManagement() {
  const location = useLocation();
  const { profile } = useAuth();
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
        let normalizedRole: 'admin' | 'manager' | 'viewer';
        if (user.role === 'admin') normalizedRole = 'admin';
        else if (user.role === 'viewer') normalizedRole = 'viewer';
        else normalizedRole = 'manager';
        return {
          id: user.id,
          name: user.full_name || '',
          email: user.email || '',
          role: normalizedRole,
          phone: user.phone || '',
          department: 'General',
          status: 'active' as const,
          createdAt: user.created_at,
          lastLogin: user.updated_at
        };
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
    <>
      <UsersTable
        users={users}
        onAdd={canModify ? handleAddUser : undefined}
        onEdit={canModify ? handleEditUser : undefined}
        onDelete={canModify ? handleDeleteUser : undefined}
        onView={handleViewUser}
        loading={isLoading}
        canModify={canModify}
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
        canModify={canModify}
        isDeleting={deleteUserMutation.isPending}
      />
    </>
  );
}
