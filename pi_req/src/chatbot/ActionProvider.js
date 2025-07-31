class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handlePrivacy = () => {
    const msg = this.createChatBotMessage(
      "You can review our privacy policy on the main page or ask me specific questions about your data."
    );
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, msg],
    }));
  };

  handleContact = () => {
    const msg = this.createChatBotMessage(
      "You can contact MetLife support at 1-800-638-5433."
    );
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, msg],
    }));
  };

  handleDefault = () => {
    const msg = this.createChatBotMessage(
      "I'm here to help with privacy, contact, and general questions. Try asking about privacy or how to contact support."
    );
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, msg],
    }));
  };
}

export default ActionProvider;
