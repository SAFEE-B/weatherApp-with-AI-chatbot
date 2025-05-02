class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state; // Contains state passed down from config
  }

  parse(message) {
    console.log('User message:', message);
    const lowerCaseMessage = message.toLowerCase();

    // Example: Respond to a greeting (Optional: Keep or remove)
    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
      this.actionProvider.greet();
    } else {
      // Send other messages to the AI handler
      this.actionProvider.handleGeneralQuery(message);
    }
  }
}

export default MessageParser; 