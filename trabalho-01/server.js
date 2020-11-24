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
        socket.broadcast.emit("atualizarListaJogadores", jogo.jogador);
    });
    socket.on("desconectarJogador", dadosJogador => {
        console.log("Desconectar");
        if(dadosJogador != null){
            var indicePartida = jogo.removerJogador(dadosJogador.id);
            if(indicePartida != -1){
                console.log("encerra partida");
            }
        }
        socket.broadcast.emit("atualizarListaJogadores", jogo.jogador);
    });
    socket.on('solicitarListaJogadores', () => {
        console.log("Enviada lista Jogadores");
        socket.emit("atualizarListaJogadores", jogo.jogador);
    });
    socket.on("enviarConvite", (convidante, convidado) => {
        console.log("Convite enviado");
        io.to(convidado).emit("conviteRecebido", convidante);
        jogo.setStatusJogadorOcupado(convidante.id);
        jogo.setStatusJogadorOcupado(convidado);
        socket.broadcast.emit("atualizarListaJogadores", jogo.jogador);
    });
    socket.on("aceitarConvite", (convidado, convidante) => {
        var idPartida = jogo.novaPartida(convidado, convidante);
        if(idPartida != false){
            io.to(convidado).to(convidante).emit("partidaIniciada", idPartida);
        }else{
            io.to(convidado).to(convidante).emit("erroInicioPartida");
        }
    });
    socket.on("recusarConvite", (convidado, convidante) => {
        jogo.setStatusJogadorLivre(convidante);
        jogo.setStatusJogadorLivre(convidado.id);
        io.emit("atualizarListaJogadores", jogo.jogador);
        io.to(convidante).emit("conviteRecusado", convidado);
    });
});

io.on('disconection', socket => {
    console.log("desconectou " + socket.id);
});