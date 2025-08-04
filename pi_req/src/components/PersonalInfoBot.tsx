import React, { useState, useEffect, useRef } from 'react';
import './PersonalInfoBot.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'message' | 'activity' | 'confirmation';
  questionIndex?: number;
  isEditable?: boolean;
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  fullAddress: string;
  email: string;
  primaryStateOfResidence: string;
  dateOfBirth: string;
  ssn: string;
  verificationMethod: 'text' | 'voice' | '';
  phoneNumber: string;
  customerType: string[];
  requestType: string[];
  correctionDetails: string;
  deliveryMethod: 'electronic' | 'postal' | '';
  username: string;
  password: string;
  securityQuestions: {
    question1: string;
    answer1: string;
    question2: string;
    answer2: string;
    question3: string;
    answer3: string;
  };
}

export const PersonalInfoBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    fullAddress: '',
    email: '',
    primaryStateOfResidence: '',
    dateOfBirth: '',
    ssn: '',
    verificationMethod: '',
    phoneNumber: '',
    customerType: [],
    requestType: [],
    correctionDetails: '',
    deliveryMethod: '',
    username: '',
    password: '',
    securityQuestions: {
      question1: '',
      answer1: '',
      question2: '',
      answer2: '',
      question3: '',
      answer3: '',
    }
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [isWaitingConfirmation, setIsWaitingConfirmation] = useState(false);
  const [pendingAnswer, setPendingAnswer] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Array<{step: number, info: PersonalInfo}>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, sender: 'user' | 'bot', type: 'message' | 'activity' | 'confirmation' = 'message', isEditable: boolean = false) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random(),
      text,
      sender,
      timestamp: new Date(),
      type,
      questionIndex: currentStep,
      isEditable
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const questions = [
    {
      key: 'firstName',
      text: "What's your first name?",
      validation: (value: string) => value.trim().length > 0
    },
    {
      key: 'lastName',
      text: "What's your last name?",
      validation: (value: string) => value.trim().length > 0
    },
    {
      key: 'fullAddress',
      text: "Please provide your complete address in one response. Include street number, street name, apartment/suite (if applicable), city, state, and ZIP code.\n\nExample: 123 Main Street, Apt 4B, New York, NY 10001",
      validation: (value: string) => {
        const address = value.trim();
        // Check for basic address components: street, city, state, ZIP
        const hasStreet = /\d+\s+\w+/.test(address); // Number + street name
        const hasState = /\b[A-Z]{2}\b/.test(address); // 2-letter state code
        const hasZip = /\b\d{5}(-\d{4})?\b/.test(address); // ZIP code
        const hasCommas = address.includes(','); // Basic formatting check
        
        return hasStreet && hasState && hasZip && hasCommas && address.length > 15;
      }
    },
    {
      key: 'email',
      text: "What's your email address?",
      validation: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    },
    {
      key: 'primaryStateOfResidence',
      text: "What is your primary state or territory of residence?",
      validation: (value: string) => value.trim().length > 0
    },
    {
      key: 'dateOfBirth',
      text: "When is your date of birth? (Please use MM/DD/YYYY format)",
      validation: (value: string) => /^\d{2}\/\d{2}\/\d{4}$/.test(value.trim())
    },
    {
      key: 'ssn',
      text: "What is your Social Security Number? (Format: XXX-XX-XXXX)",
      validation: (value: string) => /^\d{3}-\d{2}-\d{4}$/.test(value.trim())
    },
    {
      key: 'verificationMethod',
      text: "How would you like to receive your verification code? Please type 'text' for text message or 'voice' for voice message.",
      validation: (value: string) => ['text', 'voice'].includes(value.toLowerCase().trim())
    },
    {
      key: 'phoneNumber',
      text: "What is your phone number? (Please include area code, format: XXX-XXX-XXXX)",
      validation: (value: string) => /^\d{3}-\d{3}-\d{4}$/.test(value.trim())
    },
    {
      key: 'customerType',
      text: "Please tell me about your relationship with MetLife. Type the numbers (separated by commas) that apply:\n1. I am a current or former customer or have been eligible for coverage by MetLife\n2. I am a current or former client of MetLife's Investment Management or Real Estate/Agriculture business\n3. I have another relationship with MetLife that is not listed",
      validation: (value: string) => {
        const choices = value.split(',').map(v => v.trim());
        return choices.every(choice => ['1', '2', '3'].includes(choice));
      }
    },
    {
      key: 'requestType',
      text: "What would you like MetLife to do? Type the numbers (separated by commas) that apply:\n1. Provide all the personal information collected about me\n2. Delete all the personal information collected about me (within retention guidelines)\n3. Correct personal information collected about me",
      validation: (value: string) => {
        const choices = value.split(',').map(v => v.trim());
        return choices.every(choice => ['1', '2', '3'].includes(choice));
      }
    },
    {
      key: 'correctionDetails',
      text: "Since you selected correction, please provide details about what information needs to be corrected:",
      validation: () => true, // Will be shown conditionally
      conditional: (info: PersonalInfo) => info.requestType.includes('3')
    },
    {
      key: 'deliveryMethod',
      text: "How would you like the results of your request delivered? Type 'electronic' for electronic delivery or 'postal' for postal delivery.",
      validation: (value: string) => ['electronic', 'postal'].includes(value.toLowerCase().trim())
    },
    {
      key: 'username',
      text: "For electronic delivery, please create a username:",
      validation: (value: string) => value.trim().length >= 3,
      conditional: (info: PersonalInfo) => info.deliveryMethod === 'electronic'
    },
    {
      key: 'password',
      text: "Please create a password (minimum 8 characters):",
      validation: (value: string) => value.length >= 8,
      conditional: (info: PersonalInfo) => info.deliveryMethod === 'electronic'
    }
  ];

  const processAnswer = (answer: string) => {
    const currentQuestion = questions[currentStep];
    
    if (!currentQuestion.validation(answer)) {
      addMessage("I'm sorry, but that doesn't seem to be a valid response. Please try again.", 'bot');
      setTimeout(() => {
        addMessage("💡 Tip: " + getValidationHint(currentQuestion.key), 'bot', 'activity');
      }, 1000);
      return;
    }

    // Store pending answer and ask for confirmation
    setPendingAnswer(answer);
    setIsWaitingConfirmation(true);
    
    const formattedAnswer = formatAnswerForConfirmation(currentQuestion.key, answer);
    const confirmationMessage = `I understand your ${currentQuestion.key.replace(/([A-Z])/g, ' $1').toLowerCase()} is: "${formattedAnswer}". Is this correct?`;
    
    setTimeout(() => {
      addMessage(confirmationMessage, 'bot', 'confirmation');
      addMessage("Please type 'yes' to confirm, 'no' to re-enter, or 'back' to go to the previous question.", 'bot', 'activity');
    }, 800);
  };

  const formatAnswerForConfirmation = (key: string, answer: string): string => {
    switch (key) {
      case 'customerType':
      case 'requestType':
        const choices = answer.split(',').map(v => v.trim());
        const labels = key === 'customerType' 
          ? ['Current/former customer', 'Investment/Real Estate client', 'Other relationship']
          : ['Provide information', 'Delete information', 'Correct information'];
        return choices.map(choice => labels[parseInt(choice) - 1]).join(', ');
      case 'verificationMethod':
        return answer.toLowerCase() === 'text' ? 'Text Message' : 'Voice Message';
      case 'deliveryMethod':
        return answer.toLowerCase() === 'electronic' ? 'Electronic Delivery' : 'Postal Delivery';
      default:
        return answer;
    }
  };

  const getValidationHint = (key: string): string => {
    switch (key) {
      case 'fullAddress':
        return 'Please include Street Number, Street Name, City, State (2 letters), and ZIP code, separated by commas (e.g., 123 Main St, New York, NY 10001)';
      case 'email':
        return 'Please enter a valid email address (e.g., user@example.com)';
      case 'dateOfBirth':
        return 'Please use MM/DD/YYYY format (e.g., 01/15/1990)';
      case 'ssn':
        return 'Please use XXX-XX-XXXX format (e.g., 123-45-6789)';
      case 'phoneNumber':
        return 'Please use XXX-XXX-XXXX format (e.g., 555-123-4567)';
      case 'verificationMethod':
        return 'Please type either "text" or "voice"';
      case 'deliveryMethod':
        return 'Please type either "electronic" or "postal"';
      case 'customerType':
      case 'requestType':
        return 'Please enter numbers (1, 2, 3) separated by commas';
      case 'password':
        return 'Password must be at least 8 characters long';
      case 'username':
        return 'Username must be at least 3 characters long';
      default:
        return 'This field is required and cannot be empty';
    }
  };

  const handleConfirmation = (response: string) => {
    const lowerResponse = response.toLowerCase().trim();
    
    if (lowerResponse === 'yes' || lowerResponse === 'y') {
      confirmAnswer();
    } else if (lowerResponse === 'no' || lowerResponse === 'n') {
      rejectAnswer();
    } else if (lowerResponse === 'back') {
      goToPreviousQuestion();
    } else {
      addMessage("Please respond with 'yes' to confirm, 'no' to re-enter, or 'back' to go to the previous question.", 'bot');
    }
  };

  const confirmAnswer = () => {
    const currentQuestion = questions[currentStep];
    
    // Save current state to history
    const historyEntry = { step: currentStep, info: { ...personalInfo } };
    setConversationHistory(prev => [...prev, historyEntry]);
    
    // Store the confirmed answer
    const updatedInfo = { ...personalInfo };
    
    if (currentQuestion.key === 'customerType' || currentQuestion.key === 'requestType') {
      const choices = pendingAnswer.split(',').map(v => v.trim());
      (updatedInfo as any)[currentQuestion.key] = choices;
    } else if (currentQuestion.key === 'verificationMethod' || currentQuestion.key === 'deliveryMethod') {
      (updatedInfo as any)[currentQuestion.key] = pendingAnswer.toLowerCase().trim();
    } else {
      (updatedInfo as any)[currentQuestion.key] = pendingAnswer.trim();
    }
    
    setPersonalInfo(updatedInfo);
    setIsWaitingConfirmation(false);
    setPendingAnswer('');

    addMessage("Great! Moving to the next question...", 'bot', 'activity');

    // Move to next question
    moveToNextQuestion(updatedInfo);
  };

  const rejectAnswer = () => {
    setIsWaitingConfirmation(false);
    setPendingAnswer('');
    addMessage("No problem! Let's try again.", 'bot', 'activity');
    setTimeout(() => {
      addMessage(questions[currentStep].text, 'bot');
    }, 1000);
  };

  const goToPreviousQuestion = () => {
    if (conversationHistory.length === 0) {
      addMessage("We're already at the beginning of the conversation.", 'bot', 'activity');
      return;
    }

    const lastEntry = conversationHistory[conversationHistory.length - 1];
    setConversationHistory(prev => prev.slice(0, -1));
    setCurrentStep(lastEntry.step);
    setPersonalInfo(lastEntry.info);
    setIsWaitingConfirmation(false);
    setPendingAnswer('');

    addMessage("↩️ Going back to the previous question...", 'bot', 'activity');
    setTimeout(() => {
      addMessage(questions[lastEntry.step].text, 'bot');
    }, 1000);
  };

  const moveToNextQuestion = (updatedInfo: PersonalInfo) => {
    let nextStep = currentStep + 1;
    
    // Skip conditional questions if they don't apply
    while (nextStep < questions.length) {
      const nextQuestion = questions[nextStep];
      if (!nextQuestion.conditional || nextQuestion.conditional(updatedInfo)) {
        break;
      }
      nextStep++;
    }

    if (nextStep >= questions.length) {
      setIsCompleted(true);
      addMessage("🎉 Thank you for providing all the necessary information!", 'bot', 'activity');
      setTimeout(() => {
        addMessage("Your personal information request has been submitted. You will receive a confirmation and further instructions soon.", 'bot');
        generateSummary(updatedInfo);
      }, 1500);
    } else {
      setCurrentStep(nextStep);
      setTimeout(() => {
        addMessage(questions[nextStep].text, 'bot');
      }, 1500);
    }
  };

  const generateSummary = (info: PersonalInfo) => {
    setTimeout(() => {
      const summary = `
Request Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━
Personal Information:
  - Name: ${info.firstName} ${info.lastName}
  - Address: ${info.fullAddress}
  - Email: ${info.email}
  - Phone: ${info.phoneNumber}
  - Date of Birth: ${info.dateOfBirth}
  - Primary State of Residence: ${info.primaryStateOfResidence}

Contact Preferences:
  - Verification Method: ${info.verificationMethod === 'text' ? 'Text Message' : 'Voice Message'}

Relationship with MetLife:
  - Customer Type: ${info.customerType.join(', ')}

Request Details:
  - Request Type: ${info.requestType.join(', ')}
${info.correctionDetails ? `   • Correction Details: ${info.correctionDetails}` : ''}
  - Delivery Method: ${info.deliveryMethod === 'electronic' ? 'Electronic' : 'Postal'}
${info.username ? `   • Username: ${info.username}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━
Your request has been logged and will be processed according to MetLife's privacy policies and procedures.
      `;
      addMessage(summary, 'bot');
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!inputText.trim() || isCompleted) return;

    const userMessage = inputText;
    setInputText('');
    
    addMessage(userMessage, 'user');

    setTimeout(() => {
      if (isWaitingConfirmation) {
        handleConfirmation(userMessage);
      } else {
        processAnswer(userMessage);
      }
    }, 500);
  };

  const handleQuickAction = (action: string) => {
    if (isWaitingConfirmation) {
      addMessage(action, 'user');
      setTimeout(() => {
        handleConfirmation(action);
      }, 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const restartConversation = () => {
    setMessages([]);
    setCurrentStep(0);
    setPersonalInfo({
      firstName: '',
      lastName: '',
      fullAddress: '',
      email: '',
      primaryStateOfResidence: '',
      dateOfBirth: '',
      ssn: '',
      verificationMethod: '',
      phoneNumber: '',
      customerType: [],
      requestType: [],
      correctionDetails: '',
      deliveryMethod: '',
      username: '',
      password: '',
      securityQuestions: {
        question1: '',
        answer1: '',
        question2: '',
        answer2: '',
        question3: '',
        answer3: '',
      }
    });
    setIsCompleted(false);
    setTimeout(() => {
      addMessage(questions[0].text, 'bot');
    }, 500);
  };

  useEffect(() => {
    // Start the conversation with a welcome message and the first question
    addMessage("Welcome to MetLife Personal Information Request Assistant!", 'bot', 'activity');
    addMessage("I will guide you through a series of questions to help process your request. You can type 'back' at any time to return to the previous question.", 'bot');
    setTimeout(() => {
      addMessage(questions[0].text, 'bot');
    }, 1500);
  }, []);

  return (
    <div className="personal-info-bot">
      <div className="bot-header">
        <h2>Submit a Personal Information Request</h2>
        <div className="progress-indicator">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <span className="progress-text">
            Step {currentStep + 1} of {questions.length}
            {isCompleted && " - Completed"}
          </span>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender} ${message.type}`}>
            <div className="message-content">
              <div className="message-text">
                {message.text.split('\n').map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
              <div className="message-timestamp">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Buttons */}
      {isWaitingConfirmation && (
        <div className="quick-actions">
          <button 
            className="quick-action-btn confirm" 
            onClick={() => handleQuickAction('yes')}
          >
            Yes, Correct
          </button>
          <button 
            className="quick-action-btn reject" 
            onClick={() => handleQuickAction('no')}
          >
            No, Re-enter
          </button>
          <button 
            className="quick-action-btn back" 
            onClick={() => handleQuickAction('back')}
            disabled={conversationHistory.length === 0}
          >
            Go Back
          </button>
        </div>
      )}

      <div className="input-container">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            isCompleted 
              ? "Conversation completed" 
              : isWaitingConfirmation 
                ? "Type 'yes', 'no', or 'back'..." 
                : "Type your response..."
          }
          disabled={isCompleted}
          className="message-input"
          rows={1}
        />
        <button 
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isCompleted}
          className="send-btn"
        >
          {isWaitingConfirmation ? '✓' : '→'}
        </button>
      </div>

      {/* Help Section */}
      {!isCompleted && !isWaitingConfirmation && (
        <div className="help-section">
          <div className="help-hint">
            💡 <strong>Tip:</strong> {getValidationHint(questions[currentStep]?.key || '')}
            {conversationHistory.length > 0 && (
              <span> | Type 'back' to return to the previous question.</span>
            )}
          </div>
        </div>
      )}

      {isCompleted && (
        <div className="completion-actions">
          <button onClick={restartConversation} className="restart-btn">
            Start New Request
          </button>
          <button 
            onClick={() => window.print()} 
            className="print-btn"
          >
            Print Summary
          </button>
        </div>
      )}

      <div className="bot-info">
        <p>
          <strong>🔒 Privacy Notice:</strong> This information is collected to process your personal information request 
          in accordance with applicable privacy laws and MetLife's privacy policies.
        </p>
        {!isCompleted && (
          <p className="conversation-controls">
            <strong>Navigation:</strong> You can type 'back' at any time to return to the previous question.
          </p>
        )}
      </div>
    </div>
  );
};
