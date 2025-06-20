
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AuthRoutes } from '@/components/routing/AuthRoutes';
import { ProtectedRoutes } from '@/components/routing/ProtectedRoutes';
import { Toaster } from '@/components/ui/toaster';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <AuthRoutes />
            <ProtectedRoutes />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
