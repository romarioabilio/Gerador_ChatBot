require('dotenv').config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const ChatBotConfig = require("../models/ChatBotConfig");
const mongoose = require('./db'); 
const { Configuration, OpenAIApi } = require('openai');

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Rota POST para '/chat' - Processa solicitações de chat
app.post("/chat", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).send('A solicitação é obrigatória');
    }

    try {
        const configs = await ChatBotConfig.find().sort({ _id: -1 }).limit(1);
        const latestConfig = configs[0];

        if (!latestConfig || !latestConfig.documentoTexto) {
            return res.status(404).send('A configuração do chatbot não foi encontrada ou está incompleta');
        }

        const messages = [
            { role: "system", content: latestConfig.prompt }, // Usando o valor de prompt da configuração mais recente
            ...latestConfig.documentoTexto.map(text => ({ role: "system", content: text })),
            { role: "user", content: prompt }
        ];
        
        // Chama a API da OpenAI para processar a conversa
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo", 
            messages: messages,
        });

        console.log("Response from OpenAI:", completion.data.choices[0].message.content);
        res.send(completion.data.choices[0].message.content);
    } catch (error) {
        console.error('Erro na chamada da API OpenAI ou operação do banco de dados:', error);
        res.status(500).send('Erro ao processar sua solicitação: ' + error.message);
    }
});
  

const PORT = 8020;

app.listen(PORT,() => {
    console.log(`Servidor rodando na porta : ${PORT}`);

});