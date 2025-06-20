
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserDetailView } from '@/components/UserDetailView';

// Mock data - this should be replaced with actual data fetching
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    department: 'Engineering',
    role: 'admin' as const,
    status: 'active' as const,
    avatar: '',
    createdAt: '2024-01-15T08:30:00Z',
    lastLogin: '2024-06-20T14:22:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 234 567 8901',
    department: 'Project Management',
    role: 'manager' as const,
    status: 'active' as const,
    avatar: '',
    createdAt: '2024-02-20T10:15:00Z',
    lastLogin: '2024-06-19T16:45:00Z'
  }
];

export function UserDetail() {
  const { id: userId } = useParams<{ id: string }>();
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
