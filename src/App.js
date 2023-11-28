import React from 'react';
import './App.css'; 
import FormularioChatBot from './components/FormularioChatBot/FormularioChatBot'; 
import { ChatBotProvider } from './context/ChatBotContext'; 


function App() {
  return (
    <div className="App">
      {/* ChatBotProvider fornece o contexto do ChatBot para seus componentes filhos */}
      <ChatBotProvider>
        <FormularioChatBot />
      </ChatBotProvider>
    </div>
  );
}

export default App; 
