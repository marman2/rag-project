import { useState, useEffect, useCallback } from "react";
import { AlertCircle, UserPlus, User, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import { useAuth } from '../contexts/AuthProvider';

interface UserData {
  username: string;
  full_name: string;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    full_name: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();

  // Use useCallback to memoize the fetchUsers function
  const fetchUsers = useCallback(async () => {
    // Skip API call if we don't have a token yet
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get('http://192.168.30.4:5000/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Check the structure of the response and extract users array
      console.log('API Response:', response.data);
      
      if (response.data && response.data.users && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        console.error('Unexpected API response format:', response.data);
        setUsers([]);
        setError('Received unexpected data format from server');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Only run the effect once when the component mounts or when token changes
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUser.username || !newUser.password || !newUser.full_name) {
      setError('All fields are required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await axios.post('http://192.168.30.4:5000/register', newUser, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      // Add the new user to the local state (without the password)
      setUsers(prev => [...prev, {
        username: newUser.username,
        full_name: newUser.full_name
      }]);

      // Reset form and close dialog
      setNewUser({
        username: '',
        password: '',
        full_name: ''
      });
      setIsAddUserOpen(false);
      
      // Refresh the user list
      fetchUsers();
    } catch (err: any) {
      console.error('Error registering user:', err);
      setError(err.response?.data?.detail || 'Failed to register user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Aggiungi Nuovo Utente</CardTitle>
          <CardDescription>Crea account utente per accedere alla gestione dei documenti.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <p className="text-sm text-muted-foreground">
              Clicca sul pulsante qui sotto per aggiungere un nuovo utente
            </p>
            {error && (
              <div className="flex items-center text-destructive text-sm">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account for the document chat system.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddUser}>
                <div className="space-y-4 py-4">
                  {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={newUser.username}
                      onChange={handleInputChange}
                      placeholder="Enter username"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={newUser.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={newUser.full_name}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddUserOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create User'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Utenti Esistenti</CardTitle>
          <CardDescription>Gestione degli utenti</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              {error}
            </div>
          ) : (
            <div className="space-y-4">
              {Array.isArray(users) && users.map((user) => (
                <div key={user.username} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{user.full_name}</p>
                      <p className="text-sm text-muted-foreground">{user.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-secondary/50 text-secondary-foreground text-xs px-2 py-1 rounded-full flex items-center">
                      <Shield className="h-3 w-3 mr-1" />
                      User
                    </div>
                  </div>
                </div>
              ))}
              {(!Array.isArray(users) || users.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  No users found. Add a user to get started.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 