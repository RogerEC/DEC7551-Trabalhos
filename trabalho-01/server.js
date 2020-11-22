const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');
require('dotenv/config');

server.listen(3000, () => {
    console.log("servidor na porta 3000!");
});

const Jogo = require("./Jogo");
const jogo = new Jogo();

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
    console.log("conectou " + socket.id);
    
    socket.on("novaJogada", jogada => {
        console.log(jogada);
    });
    socket.on("novoJogador", nomeJogador => {
        console.log("Adicionado Jogador "+nomeJogador);
        jogo.adicionarJogador(socket.id, nomeJogador)
        socket.emit("cadastroOK", jogo.jogador[jogo.jogador.length - 1]);
    });
    socket.on("desconectarJogador", dadosJogador => {
        jogo.removerJogador(dadosJogador.id);
    });
    socket.on('solicitarListaJogadores', () => {
        console.log("Enviada lista Jogadores");
        socket.emit("atualizarListaJogadores", jogo.jogador);
    });
});

io.on('disconection', socket => {
    console.log("desconectou " + socket.id);
});