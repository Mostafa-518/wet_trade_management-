
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { Building2, FileText, Users, Settings, BarChart3, AlertTriangle, ClipboardList, Wrench, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { id: 'dashboard', title: 'Dashboard', icon: BarChart3, path: '/' },
  { id: 'projects', title: 'Projects', icon: FolderOpen, path: '/projects' },
  { id: 'subcontracts', title: 'Subcontracts', icon: FileText, path: '/subcontracts' },
  { id: 'subcontractors', title: 'Subcontractors', icon: Building2, path: '/subcontractors' },
  { id: 'trades', title: 'Trades & Items', icon: Wrench, path: '/trades' },
  { id: 'responsibilities', title: 'Responsibilities', icon: ClipboardList, path: '/responsibilities' },
  { id: 'users', title: 'User Management', icon: Users, path: '/users' },
  { id: 'alerts', title: 'Alerts', icon: AlertTriangle, path: '/alerts' },
  { id: 'settings', title: 'Settings', icon: Settings, path: '/settings' },
];

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentPage = () => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find(item => item.path === currentPath);
    return currentItem?.id || 'dashboard';
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-lg font-bold">SMS</h1>
                <p className="text-sm text-muted-foreground">Subcontractor Management</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => handleNavigate(item.path)}
                    isActive={getCurrentPage() === item.id}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                العربية
              </Button>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            </div>
          </header>
          <main className="flex-1 p-4">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
