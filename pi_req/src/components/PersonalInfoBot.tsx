import React, { useState, useEffect, useRef } from 'react';
import './PersonalInfoBot.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'message' | 'activity';
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  streetNumber: string;
  streetName: string;
  apartmentSuite: string;
  city: string;
  state: string;
  zipCode: string;
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
    streetNumber: '',
    streetName: '',
    apartmentSuite: '',
    city: '',
    state: '',
    zipCode: '',
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      key: 'streetNumber',
      text: "What's your street number?",
      validation: (value: string) => value.trim().length > 0
    },
    {
      key: 'streetName',
      text: "What's your street name?",
      validation: (value: string) => value.trim().length > 0
    },
    {
      key: 'apartmentSuite',
      text: "Is there an apartment/suite number? (You can say 'none' if not applicable)",
      validation: () => true // Optional field
    },
    {
      key: 'city',
      text: "What's the city you're located in?",
      validation: (value: string) => value.trim().length > 0
    },
    {
      key: 'state',
      text: "What's the state you're located in?",
      validation: (value: string) => value.trim().length > 0
    },
    {
      key: 'zipCode',
      text: "What's your ZIP code?",
      validation: (value: string) => /^\d{5}(-\d{4})?$/.test(value.trim())
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
      return;
    }

    // Store the answer
    const updatedInfo = { ...personalInfo };
    
    if (currentQuestion.key === 'customerType' || currentQuestion.key === 'requestType') {
      const choices = answer.split(',').map(v => v.trim());
      (updatedInfo as any)[currentQuestion.key] = choices;
    } else if (currentQuestion.key === 'verificationMethod' || currentQuestion.key === 'deliveryMethod') {
      (updatedInfo as any)[currentQuestion.key] = answer.toLowerCase().trim();
    } else {
      (updatedInfo as any)[currentQuestion.key] = answer.trim();
    }
    
    setPersonalInfo(updatedInfo);

    // Move to next question
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
      addMessage("Thank you for providing all the necessary information. Your personal information request has been submitted. You will receive a confirmation and further instructions soon.", 'bot');
      generateSummary(updatedInfo);
    } else {
      setCurrentStep(nextStep);
      setTimeout(() => {
        addMessage(questions[nextStep].text, 'bot');
      }, 1000);
    }
  };

  const generateSummary = (info: PersonalInfo) => {
    setTimeout(() => {
      const summary = `
Request Summary:
- Name: ${info.firstName} ${info.lastName}
- Address: ${info.streetNumber} ${info.streetName}${info.apartmentSuite ? `, ${info.apartmentSuite}` : ''}, ${info.city}, ${info.state} ${info.zipCode}
- Email: ${info.email}
- Phone: ${info.phoneNumber}
- Date of Birth: ${info.dateOfBirth}
- Primary State of Residence: ${info.primaryStateOfResidence}
- Verification Method: ${info.verificationMethod === 'text' ? 'Text Message' : 'Voice Message'}
- Customer Type: ${info.customerType.join(', ')}
- Request Type: ${info.requestType.join(', ')}
${info.correctionDetails ? `- Correction Details: ${info.correctionDetails}` : ''}
- Delivery Method: ${info.deliveryMethod === 'electronic' ? 'Electronic' : 'Postal'}
${info.username ? `- Username: ${info.username}` : ''}

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
      processAnswer(userMessage);
    }, 500);
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
      streetNumber: '',
      streetName: '',
      apartmentSuite: '',
      city: '',
      state: '',
      zipCode: '',
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
    addMessage("I will guide you through a series of questions to help process your request.", 'bot');
    setTimeout(() => {
      addMessage(questions[0].text, 'bot');
    }, 1500);
  }, []);

  return (
    <div className="personal-info-bot">
      <div className="bot-header">
        <h2>Submit a Personal Information Request</h2>
        <div className="progress-indicator">
          Step {currentStep + 1} of {questions.length}
          {isCompleted && " - Completed"}
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

      <div className="input-container">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isCompleted ? "Conversation completed" : "Type your response..."}
          disabled={isCompleted}
          className="message-input"
          rows={1}
        />
        <button 
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isCompleted}
          className="send-btn"
        >
          Send
        </button>
      </div>

      {isCompleted && (
        <div className="completion-actions">
          <button onClick={restartConversation} className="restart-btn">
            Start New Request
          </button>
        </div>
      )}

      <div className="bot-info">
        <p>
          <strong>Privacy Notice:</strong> This information is collected to process your personal information request 
          in accordance with applicable privacy laws and MetLife's privacy policies.
        </p>
      </div>
    </div>
  );
};
