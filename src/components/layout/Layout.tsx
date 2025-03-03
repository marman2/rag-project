import { Link } from "react-router-dom";
import { ThemeToggle } from "../ThemeToggle";
import { useAuth } from "../../contexts/AuthProvider";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Provincia_di_Catania-Stemma.svg/806px-Provincia_di_Catania-Stemma.svg.png" alt="Logo" className="h-8 w-8" />
              <span className="text-lg font-bold">Poc Assistente Virtuale</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link to="/chat" className="text-sm font-medium transition-colors hover:text-primary">
                Chat
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/documents" className="text-sm font-medium transition-colors hover:text-primary">
                    Documents
                  </Link>
                  <Link to="/users" className="text-sm font-medium transition-colors hover:text-primary">
                    Users
                  </Link>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {user?.full_name || user?.username}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={logout}
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Logout</span>
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
} 