import { GoogleGenerativeAI } from "@google/generative-ai";
class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage, stateRef, createCustomMessage) {
    // Store the initial stateRef value
    this.initialStateRef = stateRef;
    


    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
    this.stateRef = stateRef; // Allows access to the chatbot's internal state
    this.createCustomMessage = createCustomMessage;
  }

  // Example action: Handle greetings
  greet() {
    const greetingMessage = this.createChatBotMessage("Hi, friend.");
    this.addMessageToState(greetingMessage);
  }

  // Example action: Handle unknown messages
  handleUnknown() {
    const message = this.createChatBotMessage("Sorry, I didn't understand that. Try asking about the current weather or forecast.");
    this.addMessageToState(message);
  }

  // New method to handle general queries using an AI API
  async handleGeneralQuery(message) {
    try {
      
      // IMPORTANT: Handle your API Key securely.
      const apiKey = import.meta.env.VITE_CHATBOT_API_KEY;  // Replace with your actual API key
      if (!apiKey || apiKey === "YOUR_API_KEY") {
         console.error("API Key not configured.");
         this.addMessageToState(this.createChatBotMessage("Sorry, the AI service is not configured correctly."));
         return;
      }
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

      // Try different ways to access the weather data
      let weatherData = {};
      
      if (window && window.weatherDataForChatbot) {
        // Try to access global variable if available
        weatherData = window.weatherDataForChatbot;
      } else {
        this.addMessageToState(this.createChatBotMessage("I'm sorry, I don't have access to the weather data right now."));
        return;
      }
      


      const weatherContext = JSON.stringify(weatherData, null, 2);


      const prompt = `You are a helpful weather assistant chatbot embedded in a weather app.\nCurrent Weather Data Context:\n--- START WEATHER DATA ---\n${weatherContext}\n--- END WEATHER DATA ---\nUser's query: \"${message}\"\n\nBased ONLY on the provided weather data context, answer the user's query concisely. If the data doesn't contain the answer, say so. You may give recommendations if the user asks for them based on the weather`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponseText = await response.text();
      const botMessage = this.createChatBotMessage(aiResponseText);
      this.addMessageToState(botMessage);

    } catch (error) {
      console.error("Error calling AI API:", error);
      this.addMessageToState(this.createChatBotMessage("Sorry, I encountered an error trying to respond."));
    }
  }

  // Helper function to add messages to the chatbot state
  addMessageToState(message) {
    this.setState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  }
}

export default ActionProvider; 