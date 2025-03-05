import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '../lib/utils';
import { FileText, ExternalLink } from "lucide-react";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from '../contexts/AuthProvider';

// Helper function to generate a UUID that works in all environments
function generateUUID() {
  // If crypto.randomUUID is available, use it
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  
  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

interface Message {
  id: number;
  content: string;
  timestamp: string;
  sender: 'user' | 'assistant';
  resources?: Resource[];
}

interface Resource {
  source: string;
  page_number: string | number;
}

interface QueryResponse {
  answer: string;
  resources: Resource[];
}

// Example messages for reference
/* const mockMessages: Message[] = [
  {
    id: 1,
    content: "Hello! How can I help you today?",
    sender: "assistant",
    timestamp: "2024-02-27T10:00:00",
  },
  {
    id: 2,
    content: "I have a question about the project requirements.",
    sender: "user",
    timestamp: "2024-02-27T10:01:00",
  },
  {
    id: 3,
    content: "Sure, I'd be happy to help. What would you like to know?",
    sender: "assistant",
    timestamp: "2024-02-27T10:01:30",
  },
]; */

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const { isAuthenticated } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session ID
  useEffect(() => {
    const storedSessionId = localStorage.getItem('chatSessionId');
    const newSessionId = storedSessionId || generateUUID();
    localStorage.setItem('chatSessionId', newSessionId);
    setSessionId(newSessionId);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFeedbackSubmit = async (rating: number, comment: string) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      content: input,
      timestamp: new Date().toISOString(),
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post<QueryResponse>(
        'http://192.168.30.4:5000/query', 
        { question: input },
        { 
          headers: { 
            'Content-Type': 'application/json',
            'x-session-id': sessionId
          } 
        }
      );

      // Store the new session ID if it was returned
      const returnedSessionId = response.headers['x-session-id'];
      if (returnedSessionId) {
        localStorage.setItem('chatSessionId', returnedSessionId);
        setSessionId(returnedSessionId);
      }

      const assistantMessage: Message = {
        id: Date.now() + 1,
        content: response.data.answer,
        timestamp: new Date().toISOString(),
        sender: 'assistant',
        resources: response.data.resources
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error querying API:', error);
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
        sender: 'assistant'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chat</h1>
        <FeedbackDialog onSubmit={handleFeedbackSubmit} />
      </div>
      
      <Card className="mb-4">
        <div className="h-[60vh] overflow-auto p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                <div className="w-32 h-32 mb-4">
                  <img
                    src="https://i.ibb.co/qtdDszD/New-Project.png"
                    alt="Chat Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h2 className="text-2xl font-semibold">Assistente AI per i tuoi documenti</h2>
                <p className="text-muted-foreground max-w-sm">
                  Fai domande sui tuoi documenti caricati. Il nostro assistente AI ti fornirà risposte basate sul contenuto dei tuoi file.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-lg p-4 max-w-[80%] ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.content}</p>
                    {message.resources && message.resources.length > 0 && (
                      <ResourceSection resources={message.resources} />
                    )}
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user'
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground'
                    }`}>
                      {new Date(message.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Fai una domanda sui tuoi documenti..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={!input.trim() || isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </form>
    </div>
  );
};

interface ResourceProps {
  resources: Resource[];
}

const ResourceSection: React.FC<ResourceProps> = ({ resources }) => {
  const [showResources, setShowResources] = useState(false);

  // Deduplicate resources by grouping pages
  const groupedResources = resources.reduce((acc, resource) => {
    const { source, page_number } = resource;
    if (!acc[source]) {
      acc[source] = [];
    }
    // Convert page_number to number if it's a string
    const pageNum = typeof page_number === 'string' ? parseInt(page_number, 10) : page_number;
    acc[source].push(pageNum);
    return acc;
  }, {} as Record<string, number[]>);

  if (resources.length === 0) return null;

  return (
    <div className="mt-2 border-t pt-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowResources(!showResources)}
        className="text-sm flex items-center"
      >
        <FileText className="h-4 w-4 mr-1" />
        {showResources ? 'Hide References' : 'Show References'} ({resources.length})
      </Button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          showResources ? "max-h-48" : "max-h-0"
        )}
      >
        <ScrollArea className="max-h-48">
          <div className="space-y-1 p-2">
            {Object.entries(groupedResources).map(([source, pages], idx) => (
              <a
                key={idx}
                href={`http://192.168.30.4:5000/pdfs/${source}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm hover:text-primary transition-colors flex items-center"
              >
                <FileText className="h-3 w-3 mr-1" />
                {source} - Pages {pages.join(', ')}
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ChatComponent;
