import React, { useState, useEffect, useRef } from 'react';
import './BotEmulator.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const BotEmulator: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    addMessage(inputText, 'user');
    const userMessage = inputText;
    setInputText('');

    // Simulate bot response (in real implementation, this would call the bot API)
    setTimeout(() => {
      addMessage(getBotResponse(userMessage), 'bot');
    }, 1000);
  };

  const getBotResponse = (userMessage: string): string => {
    // Simple mock responses - in real implementation, this would be handled by the bot framework
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
    addMessage("Welcome to PI Bot! I'm here to help you with flight bookings and travel information.", 'bot');
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setMessages([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bot-emulator">
      <div className="bot-header">
        <h2>PI Bot Emulator</h2>
        <div className="bot-controls">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
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
        {messages.length === 0 && isConnected && (
          <div className="empty-state">
            <p>Start a conversation with the PI Bot!</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
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
          placeholder={isConnected ? "Type your message..." : "Connect to start chatting"}
          disabled={!isConnected}
          className="message-input"
          rows={1}
        />
        <button 
          onClick={handleSendMessage}
          disabled={!isConnected || !inputText.trim()}
          className="send-btn"
        >
          Send
        </button>
      </div>

      <div className="bot-info">
        <p>
          <strong>Bot Framework Emulator Alternative</strong> - 
          This interface simulates the Bot Framework Emulator for the PI Bot.
          The actual bot server should be running on port 3978.
        </p>
        <p>
          <em>Note: This is a mock UI. For full bot functionality, use the official Bot Framework Emulator.</em>
        </p>
      </div>
    </div>
  );
};
