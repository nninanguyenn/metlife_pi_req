import React, { useRef } from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";

import config from "../chatbot/config";
import MessageParser from "../chatbot/MessageParser";
import ActionProvider from "../chatbot/ActionProvider";
import SpeechButton from "./SpeechButton";

const VirtualAssistant = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSpeechResult = (text: string) => {
    // Find the chatbot input and set its value, then trigger Enter
    const input = document.querySelector(
      '.react-chatbot-kit-chat-input input'
    ) as HTMLInputElement | null;
    if (input) {
      input.value = text;
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
      // Simulate Enter key
      const keyboardEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: 'Enter',
        code: 'Enter',
        which: 13,
        keyCode: 13,
      });
      input.dispatchEvent(keyboardEvent);
    }
  };
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000 }}>
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <SpeechButton onResult={handleSpeechResult} />
      </div>
    </div>
  );
};

export default VirtualAssistant;
