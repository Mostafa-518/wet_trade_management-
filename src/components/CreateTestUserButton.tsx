
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createTestUser } from '@/utils/createTestUser';

export function CreateTestUserButton() {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreateTestUser = async () => {
    setIsCreating(true);
    try {
      await createTestUser();
      toast({
        title: "Test user created",
        description: "Test user (test@wettrades.com) with viewer role has been created successfully.",
      });
    } catch (error: any) {
      console.error('Error creating test user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create test user",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Button 
      onClick={handleCreateTestUser}
      disabled={isCreating}
      variant="outline"
      className="mb-4"
    >
      {isCreating ? 'Creating Test User...' : 'Create Test User'}
    </Button>
  );
}
