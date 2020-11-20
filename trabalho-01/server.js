const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const mongoClient = require('mongodb').MongoClient;
const assert = require('assert')
require('dotenv/config');

const dbName = 'jogo-da-velha';
const client = new mongoClient(process.env.URL_MONGODB, {useNewUrlParser: true, useUnifiedTopology: true});

client.connect(function(error) {
    if(error){
        console.log(error);
        process.exit(1);
    }
    
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    client.close();
    
});

server.listen(3000, () => {
    console.log("servidor na porta 3000!");
});

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
    console.log(socket.id);
    socket.on('sendMessage', data => {
        console.log(data);
    });
    socket.on("novaJogada", jogada => {
        console.log(jogada);
    });
    socket.on("novoJogador", nomeJogador => {
        console.log(nomeJogador);
    });
    socket.on("desconectarJogador", nomeJogador => {
        console.log(nomeJogador);
    });
});
