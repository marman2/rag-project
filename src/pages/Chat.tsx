import { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button
} from '@mui/material';

interface ChatMessage {
  id: number;
  text: string;
  timestamp: string;
}

export const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now(),
      text: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Chat Room
        </Typography>
        
        <Paper elevation={3} sx={{ height: '60vh', mb: 2, overflow: 'auto' }}>
          <List>
            {messages.map((message) => (
              <ListItem key={message.id}>
                <ListItemText
                  primary={message.text}
                  secondary={new Date(message.timestamp).toLocaleString()}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              variant="outlined"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!newMessage.trim()}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}; 