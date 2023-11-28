require('dotenv').config();

const mongoose = require('mongoose');
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

// Função assíncrona para estabelecer a conexão com o MongoDB
const conn = async () => {
    try {
       
        const dbConn = await mongoose.connect(
            `mongodb+srv://${dbUser}:${dbPassword}@cluster0.nbghelx.mongodb.net/?retryWrites=true&w=majority`
        );
        console.log(`Conectado ao MongoDB`); 
        return dbConn; 

    } catch (error) {
        console.log(error); 
    }
}


conn();


module.exports = conn;
