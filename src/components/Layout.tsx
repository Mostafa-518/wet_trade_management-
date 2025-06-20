import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUserProfile } from '@/hooks/useUserProfile';
import { Skeleton } from "@/components/ui/skeleton"
import { ROUTES } from '@/config/routes';
import { AlertBadge } from './AlertBadge';

export function Layout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userProfile, isLoading } = useUserProfile();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (hidden on small screens) */}
      <div className="hidden md:flex md:w-64 lg:w-80 flex-shrink-0 bg-gray-50 border-r border-gray-200">
        <div className="h-full px-4 py-6 flex flex-col">
          <Link to="/" className="flex items-center text-2xl font-bold text-primary mb-6">
            Wet Trades
          </Link>

          <nav className="flex flex-col space-y-2 flex-1">
            <Link
              to={ROUTES.DASHBOARD}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100 ${pathname === ROUTES.DASHBOARD ? 'bg-gray-100 text-foreground' : 'text-muted-foreground'
                }`}
            >
              Dashboard
            </Link>
            <Link
              to={ROUTES.PROJECTS}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100 ${pathname.startsWith(ROUTES.PROJECTS) ? 'bg-gray-100 text-foreground' : 'text-muted-foreground'
                }`}
            >
              Projects
            </Link>
            <Link
              to={ROUTES.SUBCONTRACTORS}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100 ${pathname.startsWith(ROUTES.SUBCONTRACTORS) ? 'bg-gray-100 text-foreground' : 'text-muted-foreground'
                }`}
            >
              Subcontractors
            </Link>
            <Link
              to={ROUTES.TRADES}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100 ${pathname.startsWith(ROUTES.TRADES) ? 'bg-gray-100 text-foreground' : 'text-muted-foreground'
                }`}
            >
              Trades
            </Link>
            <Link
              to={ROUTES.RESPONSIBILITIES}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100 ${pathname.startsWith(ROUTES.RESPONSIBILITIES) ? 'bg-gray-100 text-foreground' : 'text-muted-foreground'
                }`}
            >
              Responsibilities
            </Link>
            <Link
              to={ROUTES.SUBCONTRACTS}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100 ${pathname.startsWith(ROUTES.SUBCONTRACTS) ? 'bg-gray-100 text-foreground' : 'text-muted-foreground'
                }`}
            >
              Subcontracts
            </Link>
            <Link
              to={ROUTES.ALERTS}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100 ${pathname.startsWith(ROUTES.ALERTS) ? 'bg-gray-100 text-foreground' : 'text-muted-foreground'
                }`}
            >
              Alerts
            </Link>
            <Link
              to={ROUTES.REPORT}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100 ${pathname === ROUTES.REPORT ? 'bg-gray-100 text-foreground' : 'text-muted-foreground'
                }`}
            >
              Reports
            </Link>
            <Link
              to={ROUTES.USERS}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100 ${pathname.startsWith(ROUTES.USERS) ? 'bg-gray-100 text-foreground' : 'text-muted-foreground'
                }`}
            >
              Users
            </Link>
          </nav>

          <div className="mt-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group flex items-center w-full rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-100 transition-colors">
                  <Avatar className="mr-2 h-8 w-8">
                    <AvatarImage src={userProfile?.avatar_url || ""} />
                    <AvatarFallback>{!isLoading ? (userProfile?.full_name?.charAt(0) || "U").toUpperCase() : <Skeleton className="h-8 w-8 rounded-full" />}</AvatarFallback>
                  </Avatar>
                  <span className="flex-1 text-left">{!isLoading ? userProfile?.full_name || 'User' : <Skeleton className="h-4 w-20" />}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(ROUTES.PROFILE)}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 px-6 border-b border-gray-200 flex items-center justify-between">
          <Link to="/" className="md:hidden text-2xl font-bold text-primary">
            Wet Trades
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/' ? 'text-foreground' : 'text-muted-foreground'
                }`}
            >
              Dashboard
            </Link>
            <Link
              to="/projects"
              className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/projects' ? 'text-foreground' : 'text-muted-foreground'
                }`}
            >
              Projects
            </Link>
            <Link
              to="/subcontractors"
              className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/subcontractors' ? 'text-foreground' : 'text-muted-foreground'
                }`}
            >
              Subcontractors
            </Link>
            <Link
              to="/trades"
              className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/trades' ? 'text-foreground' : 'text-muted-foreground'
                }`}
            >
              Trades
            </Link>
            <Link
              to="/responsibilities"
              className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/responsibilities' ? 'text-foreground' : 'text-muted-foreground'
                }`}
            >
              Responsibilities
            </Link>
            <Link
              to="/subcontracts"
              className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/subcontracts' ? 'text-foreground' : 'text-muted-foreground'
                }`}
            >
              Subcontracts
            </Link>
            <Link
              to="/alerts"
              className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/alerts' ? 'text-foreground' : 'text-muted-foreground'
                }`}
            >
              Alerts
            </Link>
            <Link
              to="/report"
              className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/report' ? 'text-foreground' : 'text-muted-foreground'
                }`}
            >
              Reports
            </Link>
            <Link
              to="/users"
              className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/users' ? 'text-foreground' : 'text-muted-foreground'
                }`}
            >
              Users
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <AlertBadge />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-100 transition-colors">
                  <Avatar className="mr-2 h-8 w-8">
                    <AvatarImage src={userProfile?.avatar_url || ""} />
                    <AvatarFallback>{!isLoading ? (userProfile?.full_name?.charAt(0) || "U").toUpperCase() : <Skeleton className="h-8 w-8 rounded-full" />}</AvatarFallback>
                  </Avatar>
                  <span className="text-left">{!isLoading ? userProfile?.full_name || 'User' : <Skeleton className="h-4 w-20" />}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(ROUTES.PROFILE)}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
