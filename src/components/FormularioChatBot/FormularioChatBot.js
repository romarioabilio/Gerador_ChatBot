import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './FormularioChatBot.css';
import { ChatBotContext } from '../../context/ChatBotContext';
import ChatBot from '../ChatBot/ChatBot';


const FormularioChatbot = () => {
 
  const [nomeChatbot, setNomeChatbot] = useState('');
  const [prompt, setPrompt] = useState('');
  const [documento, setDocumento] = useState(null);
  const [versaoGPT, setVersaoGPT] = useState('gpt-3.5-turbo');

  const { updateChatBotConfig, setResetForm } = useContext(ChatBotContext);

  // Estado para verificar se a configuração foi salva
  const [isConfigSaved, setIsConfigSaved] = useState(false);

  
  const resetForm = () => {
    setNomeChatbot('');
    setPrompt('');
    setDocumento(null);
    setVersaoGPT('gpt-3.5-turbo');
    setIsConfigSaved(false);
  };

  
  useEffect(() => {
    setResetForm(() => resetForm);
    return () => setResetForm(() => () => {});
  }, [setResetForm]);


  const handleFileChange = (event) => {
    setDocumento(event.target.files[0]);
  };

  
  const handleSubmit = async (event) => {
    event.preventDefault();

    
    if (!nomeChatbot.trim() || !prompt.trim() || !versaoGPT.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    
    const formData = new FormData();
    formData.append('nomeChatbot', nomeChatbot);
    formData.append('prompt', prompt);
    formData.append('versaoGPT', versaoGPT);
    if (documento) {
      formData.append('documento', documento);
    }

    
    try {
      const response = await axios.post('http://localhost:3001/config', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        updateChatBotConfig({ nomeChatbot, prompt, versaoGPT });
        setIsConfigSaved(true); 
        alert('Configurações do chatbot salvas com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao enviar configurações:', error);
      alert('Erro ao salvar as configurações do chatbot.');
    }
  };

  return (
    <div className="formulario-chatbot">
      <h1>Bem-vindo às configurações de chatbot WhatsApp</h1>
      <h4>Aqui você pode criar e editar seu chatbot</h4>
      <div className="navigation">
        <button className={`nav-button ${isConfigSaved ? 'active' : ''}`}>
          1 Base de informações
        </button>
        <button className={`nav-button ${!isConfigSaved ? 'active' : ''}`}>
          2 Chat
        </button>
      </div>
      {!isConfigSaved ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="nomeChatbot">Nome do chatbot</label>
          <input
            id="nomeChatbot"
            type="text"
            value={nomeChatbot}
            onChange={(e) => setNomeChatbot(e.target.value)}
          />

          <label htmlFor="prompt">Prompt</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <label htmlFor="versaoChatbot">Versão do chatbot</label>
          <select
            id="versaoChatbot"
            value={versaoGPT}
            onChange={(e) => setVersaoGPT(e.target.value)}
          >
            <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
          </select>

          <label htmlFor="documento">Documentos</label>
          <input
            id="documento"
            type="file"
            onChange={handleFileChange}
          />

          <button type="submit">Salvar chatbot</button>
        </form>
      ) : (
        <ChatBot />
      )}
    </div>
  );
};

export default FormularioChatbot;
