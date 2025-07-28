
import { supabase } from '@/integrations/supabase/client';

export async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    // First, sign up the test user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'test@wettrades.com',
      password: 'test@2025',
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: 'Test User'
        }
      }
    });

    if (signUpError) {
      console.error('Error creating test user:', signUpError);
      throw signUpError;
    }

    console.log('Test user created:', signUpData.user);

    if (signUpData.user) {
      // Wait for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        // Update the profile with test user data
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({
            full_name: 'Test User',
            role: 'viewer', // Review-only role
            phone: '+1234567890'
          })
          .eq('id', signUpData.user.id);

        if (updateError) {
          console.error('Error updating test user profile:', updateError);
        } else {
          console.log('Test user profile updated successfully');
        }
      } catch (updateError) {
        console.warn('Could not update test user profile data:', updateError);
      }
    }

    return signUpData.user;
  } catch (error) {
    console.error('Create test user error:', error);
    throw error;
  }
}
