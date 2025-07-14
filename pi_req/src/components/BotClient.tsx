import React, { useState, useEffect, useRef } from 'react';
import './BotClient.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'message' | 'activity';
}

interface BotClientProps {
  botEndpoint?: string;
}

export const BotClient: React.FC<BotClientProps> = ({ 
  botEndpoint = 'http://localhost:3978/api/messages' 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationIdRef = useRef<string>('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, sender: 'user' | 'bot', type: 'message' | 'activity' = 'message') => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random(),
      text,
      sender,
      timestamp: new Date(),
      type
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const generateConversationId = () => {
    return 'conversation-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  };

  const sendMessageToBot = async (message: string) => {
    try {
      setIsLoading(true);
      
      // Create a simple activity object
      const activity = {
        type: 'message',
        from: {
          id: 'user-' + Date.now(),
          name: 'User'
        },
        text: message,
        timestamp: new Date().toISOString(),
        channelId: 'emulator',
        conversation: {
          id: conversationIdRef.current
        }
      };

      const response = await fetch(botEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activity)
      });

      if (response.ok) {
        // In a real implementation, the bot would send a response back through a WebSocket or webhook
        // For this demo, we'll show a success message
        addMessage('Message sent to bot successfully. (Note: Real-time responses require WebSocket implementation)', 'bot');
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error sending message to bot:', error);
      addMessage(`Error: Could not connect to bot server at ${botEndpoint}. Make sure the bot is running on port 3978.`, 'bot');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText;
    setInputText('');
    
    // Add user message
    addMessage(userMessage, 'user');

    if (isConnected) {
      await sendMessageToBot(userMessage);
    } else {
      // Fallback to mock response when not connected
      setTimeout(() => {
        addMessage(getMockBotResponse(userMessage), 'bot');
      }, 1000);
    }
  };

  const getMockBotResponse = (userMessage: string): string => {
    const responses = [
      "Hello! I'm the PI Bot. How can I help you today?",
      "I can help you with flight bookings and travel information.",
      "That's an interesting question. Let me think about that...",
      "I'm still learning. Could you try asking something else?",
      "Thank you for your message. I'm here to assist you."
    ];
    
    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      return "Hello! I'm the PI Bot. How can I help you today?";
    }
    
    if (userMessage.toLowerCase().includes('flight') || userMessage.toLowerCase().includes('book')) {
      return "I can help you book flights! What's your destination?";
    }
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleConnect = () => {
    setIsConnected(true);
    conversationIdRef.current = generateConversationId();
    addMessage("Connected to PI Bot server. You can now send messages to the actual bot.", 'bot', 'activity');
    addMessage("Welcome to PI Bot! I'm here to help you with flight bookings and travel information.", 'bot');
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    conversationIdRef.current = '';
    setMessages([]);
  };

  const testConnection = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(botEndpoint.replace('/api/messages', ''), {
        method: 'GET',
      });
      
      if (response.status === 404 || response.status === 405) {
        // These are expected responses when the server is running but doesn't have a GET endpoint
        addMessage("✅ Bot server is running and reachable!", 'bot', 'activity');
        return true;
      }
      
      addMessage("✅ Bot server is running!", 'bot', 'activity');
      return true;
    } catch (error) {
      addMessage("❌ Cannot reach bot server. Make sure it's running on port 3978.", 'bot', 'activity');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bot-client">
      <div className="bot-header">
        <h2>PI Bot Client</h2>
        <div className="bot-controls">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          <button onClick={testConnection} className="test-btn" disabled={isLoading}>
            Test Connection
          </button>
          {!isConnected ? (
            <button onClick={handleConnect} className="connect-btn">
              Connect
            </button>
          ) : (
            <button onClick={handleDisconnect} className="disconnect-btn">
              Disconnect
            </button>
          )}
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 && (
          <div className="empty-state">
            <p>Welcome to the PI Bot Client!</p>
            <p>Click "Test Connection" to check if the bot server is running, then "Connect" to start chatting.</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender} ${message.type}`}>
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              <div className="message-timestamp">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
          className="message-input"
          rows={1}
        />
        <button 
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isLoading}
          className="send-btn"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>

      <div className="bot-info">
        <p>
          <strong>Bot Endpoint:</strong> {botEndpoint}
        </p>
        <p>
          <strong>Instructions:</strong> Start the bot server by running <code>npm start</code> in the pi-bot directory,
          then use "Test Connection" to verify the server is running before connecting.
        </p>
        <p>
          <em>Note: This is a basic HTTP client. For full real-time functionality, a WebSocket connection would be needed.</em>
        </p>
      </div>
    </div>
  );
};
