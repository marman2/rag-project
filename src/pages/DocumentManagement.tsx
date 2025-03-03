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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { documentService } from '../services/document.service';
import { Document } from '../types';

export const DocumentManagement = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      setError('');
      setLoading(true);

      if (editingDocument) {
        await documentService.updateDocument(editingDocument.id, {
          title: formData.get('title') as string,
          content: formData.get('content') as string
        });
      } else {
        await documentService.addDocument({
          title: formData.get('title') as string,
          content: formData.get('content') as string
        });
      }

      setOpen(false);
      setEditingDocument(null);
      loadDocuments();
    } catch (err) {
      setError(`Failed to ${editingDocument ? 'update' : 'add'} document`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (doc: Document) => {
    setEditingDocument(doc);
    setOpen(true);
  };

  const handleDeleteDocument = async (id: number) => {
    try {
      await documentService.deleteDocument(id);
      loadDocuments();
    } catch (err) {
      setError('Failed to delete document');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingDocument(null);
    setError('');
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
                  <Box>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEdit(doc)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteDocument(doc.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
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

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {editingDocument ? 'Edit Document' : 'Add New Document'}
          </DialogTitle>
          <Box component="form" onSubmit={handleSubmit}>
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
                defaultValue={editingDocument?.title || ''}
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
                defaultValue={editingDocument?.content || ''}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? (editingDocument ? 'Updating...' : 'Adding...') : (editingDocument ? 'Update' : 'Add')}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Box>
    </Container>
  );
}; 