const mongoose = require('mongoose');

// Definição do esquema para a configuração do chatbot
const chatbotConfigSchema = new mongoose.Schema({
  nomeChatbot: String,      
  prompt: String,           
  versaoGPT: String,        
  documentoTexto: [String], 
                            
});



const ChatbotConfig = mongoose.model('ChatBotConfig', chatbotConfigSchema);


module.exports = ChatbotConfig;
