import { createChatBotMessage } from 'react-chatbot-kit';

const botName = 'WeatherBot';
const config = {
  botName: botName,
  initialMessages: [createChatBotMessage(`Hi! I'm ${botName}. Ask me about the weather!`)],
};

export default config; 