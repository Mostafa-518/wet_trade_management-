
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserDetailView } from '@/components/UserDetailView';

export function UserDetail() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/users');
  };

  const handleEdit = (user: any) => {
    navigate('/users', { state: { editUser: user } });
  };

  if (!userId) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
        <p className="text-muted-foreground">The requested user could not be found.</p>
      </div>
    );
  }

  const user = mockUsers.find(u => u.id === userId);

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
        <p className="text-muted-foreground">The requested user could not be found.</p>
      </div>
    );
  }

  return (
    <UserDetailView
      user={user}
      onBack={handleBack}
      onEdit={handleEdit}
    />
  );
}
