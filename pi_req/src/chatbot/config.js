import { createChatBotMessage } from "react-chatbot-kit";

const config = {
  botName: "MetLife Assistant",
  initialMessages: [
    createChatBotMessage("Hi! How can I help you with your privacy request today?")
  ],
};

export default config;
