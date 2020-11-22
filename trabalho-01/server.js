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
    console.log("conectou" + socket.id);
    socket.on('sendMessage', data => {
        console.log(data);
    });
    socket.on("novaJogada", jogada => {
        console.log(jogada);
    });
    socket.on("novoJogador", nomeJogador => {
        jogador.push(new Jogador(socket.id, nomeJogador));
        socket.emit("cadastroOK", jogador[jogador.length - 1]);
        socket.emit("listaJogadores", jogador);
    });
    socket.on("desconectarJogador", dadosJogador => {
        removerJogador(dadosJogador.id);
    });
    socket.on('disconect', data => {
        console.log("DESCONECTOU");
        console.log(data);
    })
});

io.on('disconection', socket => {
    console.log("desconectou " + socket.id);
});

jogo.adicionarJogador("001", "Roger");
jogo.adicionarJogador("002", "Tobias");
jogo.novaPartida("001", "002");