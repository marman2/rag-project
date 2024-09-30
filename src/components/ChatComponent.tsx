// src/components/ChatComponent.tsx
import React, { useState } from 'react';
import axios from 'axios';
import './ChatComponent.css';

interface QueryResponse {
  answer: string;
  resources: { source: string; page_number: number }[];
}

const ChatComponent: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<
    { question: string; response: QueryResponse }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() === '') return;

    setLoading(true);
    try {
      const response = await axios.post<QueryResponse>(
        'https://0924-34-148-119-38.ngrok-free.app/query',
        { question }
      );
      setChatHistory([...chatHistory, { question, response: response.data }]);
      setQuestion('');
    } catch (error) {
      const response: QueryResponse = {
        answer: "Al momento il servizio non è disponibile. Riprovare più tardi",
        resources: [
          
        ]
      };
      setChatHistory([...chatHistory, { question, response: response }]);
      console.error('Error fetching response:', error);
    }
    setLoading(false);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="app-container">
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <button className="toggle-button" onClick={toggleSidebar}>
          {sidebarCollapsed ? '>' : '<'}
        </button>
        {!sidebarCollapsed && (
          <>
            <h2>Resources</h2>
            <ul className="pdf-list">
              <li>ITAS-1.pdf</li>
              <li>ITAS-2.pdf</li>
              <li>ITAS-3.pdf</li>
              <li>ITAS-4.pdf</li>
              <li>ITAS-5.pdf</li>
              <li>ITAS-6.pdf</li>
              <li>ITAS-7.pdf</li>
              <li>ITAS-8.pdf</li>
            
            </ul>
          </>
        )}
      </div>
      <div className="chat-container">
        <div className="chat-window">
          {chatHistory.map((entry, index) => (
            <div key={index} className="chat-entry">
              <p>
                <b>Domanda:</b> {entry.question}
              </p>
              <p>
                <b>Risposta:</b> {entry.response.answer}
              </p>
              <ResourceSection resources={entry.response.resources} />
            </div>
          ))}
          {loading && <div className="loading">Loading...</div>}
        </div>
        <form onSubmit={handleSubmit} className="chat-form">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Send a message"
            className="chat-input"
          />
          <button type="submit" className="send-button">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

interface ResourceProps {
  resources: { source: string; page_number: number }[];
}

const ResourceSection: React.FC<ResourceProps> = ({ resources }) => {
  const [showResources, setShowResources] = useState(false);

  return (
    <div className="resource-section">
      <button
        className="toggle-resources"
        onClick={() => setShowResources(!showResources)}
      >
        {showResources ? 'Nascondi Riferimenti' : 'Mostra Riferimenti'}
      </button>
      <div
        className="resource-content"
        style={{
          maxHeight: showResources ? '200px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease',
        }}
      >
        <ul>
          {resources.map((resource, idx) => (
            <li key={idx}>
              {resource.source} - Page {resource.page_number}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatComponent;
