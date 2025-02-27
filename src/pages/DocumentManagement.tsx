import { useState, useEffect } from 'react';
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
  ListItemSecondary,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { documentService } from '../services/document.service';
import { Document } from '../types';

export const DocumentManagement = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadDocuments = async () => {
    try {
      const fetchedDocs = await documentService.getDocuments();
      setDocuments(fetchedDocs);
    } catch (err) {
      setError('Failed to load documents');
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleAddDocument = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      setError('');
      setLoading(true);
      await documentService.addDocument({
        title: formData.get('title') as string,
        content: formData.get('content') as string
      });
      setOpen(false);
      loadDocuments();
    } catch (err) {
      setError('Failed to add document');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (id: number) => {
    try {
      await documentService.deleteDocument(id);
      loadDocuments();
    } catch (err) {
      setError('Failed to delete document');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Document Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          sx={{ mb: 2 }}
        >
          Add New Document
        </Button>
        
        <Paper elevation={3}>
          <List>
            {documents.map((doc) => (
              <ListItem
                key={doc.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteDocument(doc.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={doc.title}
                  secondary={new Date(doc.createdAt).toLocaleDateString()}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Add New Document</DialogTitle>
          <Box component="form" onSubmit={handleAddDocument}>
            <DialogContent>
              {error && (
                <Typography color="error" gutterBottom>
                  {error}
                </Typography>
              )}
              <TextField
                autoFocus
                margin="dense"
                id="title"
                name="title"
                label="Title"
                type="text"
                fullWidth
                required
              />
              <TextField
                margin="dense"
                id="content"
                name="content"
                label="Content"
                multiline
                rows={4}
                fullWidth
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Document'}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Box>
    </Container>
  );
}; 