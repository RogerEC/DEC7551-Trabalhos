const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');

server.listen(3000, () => {
    console.log("servidor na porta 3000!");
});

const Jogo = require("./Jogo");
const jogo = new Jogo();
var convites = [];

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
    
    socket.on("novaJogada", (idPartida, casa, marcador) => {

        console.log("NOVA JOGADA REALIZADA NA PARTIDA " + idPartida + " CASA/MARCADOR: " + casa + "/" + marcador);

        jogo.setCasaTabuleiro(idPartida, casa, marcador);

        var statusPartida = jogo.getStatusPartida(idPartida);
        var tabuleiro = jogo.getTabuleiro(idPartida);

        if(statusPartida === "em andamento"){

            var proximoAJogar = jogo.getIDOutroJogador(idPartida, socket.id);

            console.log("PARTIDA AINDA EM ANDAMENTO, PRÓXIMO A JOGAR: " + proximoAJogar.id);
            io.to(proximoAJogar.id).emit("realizarJogada", tabuleiro);

        }else if(statusPartida === "empate"){

            console.log("PARTIDA TERMINOU EM EMPATE");

            var idJogadores = jogo.getIDJogadores(idPartida);

            jogo.removerPartida(idPartida);
            io.to(idJogadores[0]).to(idJogadores[1]).emit("empate", tabuleiro);

        }else if(statusPartida === "encerrado"){

            var ganhador = jogo.getGanhadorPartida(idPartida);
            var casas = jogo.getCasasPartida(idPartida);
            var perdedor = jogo.getIDOutroJogador(idPartida, ganhador.id);

            console.log("PARTIDA ENCERRADA, JOGADOR: " + ganhador.id + " GANHOU COM AS CASAS:")
            console.log(casas);

            jogo.removerPartida(idPartida);

            io.to(ganhador.id).emit("vitoria", tabuleiro, casas);
            io.to(perdedor.id).emit("derrota", tabuleiro, casas);

        }else{

            console.log("ERRO => erro desconhecido ao verificar resultado da partida após a última jogada.");

            var idJogadores = jogo.getIDJogadores(idPartida);

            jogo.removerPartida(idPartida);
            io.to(idJogadores[0]).to(idJogadores[1]).emit("ERRO-desconhecido", tabuleiro);
        }
    });

    socket.on("jogarNovamente", () => {

        console.log("CLIENTE "+socket.id+" PRONTO PARA JOGAR NOVAMENTE");

        jogo.setStatusJogadorLivre(socket.id);
        io.emit("atualizarListaJogadores", jogo.jogador);
    });

    socket.on("novoJogador", nomeJogador => {

        console.log("ADICIONADO NOVO JOGADOR ID: " + socket.id + " E NOME: " + nomeJogador);

        jogo.adicionarJogador(socket.id, nomeJogador)

        socket.emit("cadastroOK", jogo.jogador[jogo.jogador.length - 1]);
        socket.broadcast.emit("atualizarListaJogadores", jogo.jogador);
    });

    socket.on("desconectarJogador", dadosJogador => {

        console.log("DESCONECTADO CLIENTE "+socket.id);

        if(dadosJogador != null){

            var indiceConvite = buscarConvites(dadosJogador.id);

            if(indiceConvite != -1){

                console.log("CLIENTE DESCONECTOU ANTES DE ACEITAR O CONVITE, ENVIADO AVISO AO CONVIDANTE");

                if(convites[indiceConvite][0] === dadosJogador.id){

                    io.to(convites[indiceConvite][1]).emit("ERRO-convidadoDesconectou");
                    jogo.setStatusJogadorLivre(convites[indiceConvite][1]);

                }else{

                    io.to(convites[indiceConvite][0]).emit("ERRO-convidadoDesconectou");
                    jogo.setStatusJogadorLivre(convites[indiceConvite][0]);
                }
                removeConvite(indiceConvite);
            }

            var idPartida = jogo.removerJogador(dadosJogador.id);

            if(idPartida != -1){

                console.log("CLIENTE DESCONECTOU COM PARTIDA EM CURSO, REALIZADA INTERRUPÇÃO DA PARTIDA");

                var idJogadorRestante = jogo.getIDJogadorRestante(idPartida);

                io.to(idJogadorRestante).emit("ERRO-adversarioDesconectou");
                jogo.setStatusJogadorLivre(idJogadorRestante);
                jogo.removerPartida(idPartida);
            }
        }
        socket.broadcast.emit("atualizarListaJogadores", jogo.jogador);
    });

    socket.on('solicitarListaJogadores', () => {

        console.log("ENVIADA LISTA DE JOGADORES PARA " + socket.id);
        socket.emit("atualizarListaJogadores", jogo.jogador);

    });

    socket.on("enviarConvite", (convidante, convidado) => {

        console.log("ENVIADO CONVITE DE " + convidante.id + " PARA " + convidado);

        io.to(convidado).emit("conviteRecebido", convidante);

        convites.push([convidante.id, convidado]);

        jogo.setStatusJogadorOcupado(convidante.id);
        jogo.setStatusJogadorOcupado(convidado);

        socket.broadcast.emit("atualizarListaJogadores", jogo.jogador);
    });

    socket.on("aceitarConvite", (convidado, convidante) => {

        console.log("CONVITE DE " + convidante + " PARA " + convidado + " ACEITO");

        removeConviteIDJogador(convidante);

        var idPartida = jogo.novaPartida(convidado, convidante);

        if(idPartida != false){

            var marcadorXO = jogo.getIDJogadorMarcadorXO(idPartida);

            if(marcadorXO != null){

                console.log("PARTIDA ENTRE " + marcadorXO[0] + " E " + marcadorXO[1] + " INICIADA");

                io.to(marcadorXO[0]).emit("partidaIniciada", idPartida, 'X');
                io.to(marcadorXO[1]).emit("partidaIniciada", idPartida, 'O');
            }else{

                console.log("ERRO => Retorno marcadorXO");

                io.to(convidado).to(convidante).emit("erroInicioPartida");
            }
        }else{

            console.log("ERRO => Ao criar a partida");

            io.to(convidado).to(convidante).emit("erroInicioPartida");
        }
    });

    socket.on("recusarConvite", (convidado, convidante) => {

        console.log("CONVITE DE " + convidante + " PARA " + convidado.id + " RECUSADO");

        jogo.setStatusJogadorLivre(convidante);
        jogo.setStatusJogadorLivre(convidado.id);

        io.emit("atualizarListaJogadores", jogo.jogador);
        io.to(convidante).emit("conviteRecusado", convidado);
    });
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

function removeConviteIDJogador(idJogador){
    removeConvite(buscarConvites(idJogador));
}