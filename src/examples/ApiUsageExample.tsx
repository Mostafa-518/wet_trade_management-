
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useApi } from '@/hooks/useApi';
import UserService from '@/services/userService';
import AuthService from '@/services/authService';
import { User } from '@/types/user';

// Example component showing how to use the API services
export function ApiUsageExample() {
  const [users, setUsers] = useState<User[]>([]);

  // Using the useApi hook for automatic loading states
  const {
    data: userData,
    loading: userLoading,
    error: userError,
    execute: fetchUsers
  } = useApi(UserService.getUsers, {
    immediate: true, // Fetch immediately on mount
    onSuccess: (response) => {
      setUsers(response.data);
    }
  });

  // Manual API call example
  const handleCreateUser = async () => {
    try {
      const newUser = await UserService.createUser({
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        department: 'Engineering'
      });
      
      console.log('User created:', newUser);
      // Refresh the user list
      fetchUsers();
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  // Authentication example
  const handleLogin = async () => {
    try {
      const authResponse = await AuthService.login({
        email: 'user@example.com',
        password: 'password123'
      });
      
      console.log('Login successful:', authResponse);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">API Usage Example</h2>
      
      <div className="space-y-2">
        <Button onClick={handleLogin}>
          Login Example
        </Button>
        
        <Button onClick={handleCreateUser}>
          Create User Example
        </Button>
        
        <Button onClick={() => fetchUsers()}>
          Refresh Users
        </Button>
      </div>

      {userLoading && <p>Loading users...</p>}
      {userError && <p className="text-red-500">Error: {userError.message}</p>}
      
      <div>
        <h3 className="text-lg font-semibold">Users ({users.length})</h3>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name} - {user.email}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
