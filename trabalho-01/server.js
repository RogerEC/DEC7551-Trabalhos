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
var convites = [];

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
            var indiceConvite = buscarConvites(dadosJogador.id);
            if(indiceConvite != -1){
                if(convites[indiceConvite][0] === dadosJogador.id){
                    io.to(convites[indiceConvite][1]).emit("ERRO-convidadoDesconectou");
                    jogo.setStatusJogadorLivre(convites[indiceConvite][1]);
                }else{
                    io.to(convites[indiceConvite][0]).emit("ERRO-convidadoDesconectou");
                    jogo.setStatusJogadorLivre(convites[indiceConvite][0]);
                }
                removeConvite(indiceConvite);
            }
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
        convites.push([convidante.id, convidado]);
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

function buscarConvites(idJogador){
    for(var i = 0; i < convites.length; i++){
        if(convites[i][0] === idJogador || convites[i][1] === idJogador){
            return i;
        }
    }
    return -1;
}

function removeConvite(indice){
    if(indice >= 0 && indice < convites.length){
        convites.splice(indice, 1);
    }
}