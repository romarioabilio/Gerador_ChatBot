import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './ChatBot.css';
import { ChatBotContext } from '../../context/ChatBotContext';

const ChatBot = () => {

  const [conversation, setConversation] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

 
  const { chatbotConfig, resetForm } = useContext(ChatBotContext);
  const HTTP = "http://localhost:8020/chat";

  
  useEffect(() => {
    if (chatbotConfig && chatbotConfig.promptInicial) {
      setPrompt(chatbotConfig.promptInicial);
    }
  }, [chatbotConfig]);

  
  const handlePrompt = (e) => setPrompt(e.target.value);

  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = { text: prompt, sender: 'user' };
    setConversation([...conversation, userMessage]);
    setIsBotTyping(true);

    axios.post(HTTP, { prompt })
      .then((res) => {
        setIsBotTyping(false);
        const botResponse = { text: res.data, sender: 'bot' };
        setConversation(conversation => [...conversation, botResponse]);
      })
      .catch(error => {
        setIsBotTyping(false);
        console.error('Erro ao enviar mensagem:', error);
      });

    setPrompt('');
  };

  // Manipulador para encerrar a conversa
  const handleEndConversation = () => {
    const confirmEnd = window.confirm("Tem certeza que deseja encerrar a conversa com o ChatBot?");
    if (confirmEnd) {
        resetForm();
    }
  };

  
  return (
    <div className="container">
      <h1 className='titulo'>{chatbotConfig.nomeChatbot || 'Chatbot'}</h1>
      <div className="conversation">
        {conversation.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        {isBotTyping && <div className="message bot">Digitando...</div>}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder='Digite sua pergunta aqui'
            value={prompt}
            onChange={handlePrompt}
          />
          <button type="submit" className="send-button">Enviar</button>
        </div>
        <button onClick={handleEndConversation} className="end-conversation-button">
          Encerrar Conversa
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
