const express = require('express');
const mongoose = require('./db'); 
const openai = require('./openai');
const cors = require('cors');
const bodyParser = require('body-parser');
const ChatbotConfig = require('../models/ChatBotConfig');
const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' });

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

function segmentarEmParagrafos(texto) {
    return texto.split(/\n\s*\n/);
}


app.post('/config', upload.single('documento'), async (req, res) => {
    

    try {
        let segmentos = [];
        if (req.file) {
            const conteudoArquivo = fs.readFileSync(req.file.path, 'utf8');
            segmentos = segmentarEmParagrafos(conteudoArquivo); 
        }

        const newConfig = new ChatbotConfig({
            ...req.body,
            documentoTexto: segmentos
        });

        console.log("Objeto a ser salvo:", newConfig);
        await newConfig.save();
        res.status(200).json({ message: 'Configuração salva com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota GET para '/config' para recuperar as configurações do chatbot
app.get('/config', async (req, res) => {
    try {
        
        const latestConfig = await ChatbotConfig.findOne().sort({ _id: -1 });
        if (latestConfig) {
            res.json(latestConfig);
        } else {
            res.status(404).json({ message: 'Configuração não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciando o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta : ${PORT}`);
});