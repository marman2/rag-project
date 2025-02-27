import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { authService } from '../services/auth.service';
import { User } from '../types';

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      const fetchedUsers = await authService.getUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      setError('Failed to load users');
    }
  };

  const handleAddUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      setError('');
      setLoading(true);
      await authService.addUser({
        username: formData.get('username') as string,
        password: formData.get('password') as string
      });
      setOpen(false);
      loadUsers();
    } catch (err) {
      setError('Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          sx={{ mb: 2 }}
        >
          Add New User
        </Button>
        
        <Paper elevation={3}>
          <List>
            {users.map((user) => (
              <ListItem key={user.id}>
                <ListItemText primary={user.username} />
              </ListItem>
            ))}
          </List>
        </Paper>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Add New User</DialogTitle>
          <Box component="form" onSubmit={handleAddUser}>
            <DialogContent>
              {error && (
                <Typography color="error" gutterBottom>
                  {error}
                </Typography>
              )}
              <TextField
                autoFocus
                margin="dense"
                id="username"
                name="username"
                label="Username"
                type="text"
                fullWidth
                required
              />
              <TextField
                margin="dense"
                id="password"
                name="password"
                label="Password"
                type="password"
                fullWidth
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add User'}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Box>
    </Container>
  );
}; 