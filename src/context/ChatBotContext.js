import React, { createContext, useState } from 'react';


export const ChatBotContext = createContext();

export const ChatBotProvider = ({ children }) => {
    
    const [chatbotConfig, setChatbotConfig] = useState({
        nomeChatbot: '',       
        promptInicial: '',     
        versaoGPT: 'gpt-3.5-turbo', 
    });

    const [resetForm, setResetForm] = useState(() => () => {});

    
    const updateChatBotConfig = (newConfig) => {
        console.log('Atualizando contexto com:', newConfig);
        setChatbotConfig(newConfig); // Atualiza o estado com a nova configuração
    };

  
    
    return (
        <ChatBotContext.Provider value={{ chatbotConfig, updateChatBotConfig, resetForm, setResetForm }}>
            {children} 
        </ChatBotContext.Provider>
    );
};

