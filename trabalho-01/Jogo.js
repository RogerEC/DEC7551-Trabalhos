const Jogador = require("./Jogador");
const Partida = require("./Partida");

module.exports = class Jogo {

    constructor(){
        this.jogador = [];
        this.partida = [];
    }

    setStatusJogadorLivre(idJogador){
        var indiceJogador = this.procurarJogadorPeloID(idJogador);
        if(indiceJogador != -1){
            this.jogador[indiceJogador].setStatusLivre();
        }
    }

    setStatusJogadorOcupado(idJogador){
        var indiceJogador = this.procurarJogadorPeloID(idJogador);
        if(indiceJogador != -1){
            this.jogador[indiceJogador].setStatusOcupado();
        }
    }

    procurarJogadorPeloID(idJogador){
        for(var i = 0; i < this.jogador.length; i++){
            if(this.jogador[i].id === idJogador){
                return i;
            }
        }
        return -1;
    }

    procurarPartidaPeloID(idPartida){
        for(var i = 0; i < this.partida.length; i++){
            if(this.partida[i].id === idPartida){
                return i;
            }
        }
        return -1;
    }

    procurarPartidaPeloIDJogador(idJogador){
        for(var i = 0; i < this.partida.length; i++){
            if(this.partida[i].jogador1.id === idJogador
            || this.partida[i].jogador2.id === idJogador){
                return i;
            }
        }
        return -1;
    }

    adicionarJogador(id, nome){
        this.jogador.push(new Jogador(id, nome));
    }

    novaPartida(idJogador1, idJogador2){
        
        var id1 = this.procurarJogadorPeloID(idJogador1);
        var id2 = this.procurarJogadorPeloID(idJogador2);

        if(id1 != -1 && id2 != -1){
            
            this.partida.push(new Partida(this.jogador[id1], this.jogador[id2]));

            return this.partida[this.partida.length - 1].getId();
        }

        return false;
    }

    removerPartida(idPartida){

        var indice = this.procurarIndexPartida(idPartida);
        
        if(indice != -1){
            this.partida[indice].jogador1.setStatusLivre();
            this.partida[indice].jogador2.setStatusLivre();
            this.partida.splice(indice, 1);
        }
    }

    removerJogador(idJogador){

        var indiceJogador = this.procurarJogadorPeloID(idJogador);
        var indicePartida = -1;

        if(indiceJogador != -1){
            
            indicePartida = this.procurarPartidaPeloIDJogador(idJogador);
           
            if(indicePartida != -1){

                this.partida[indicePartida].setStatusInterrompido();
                
                if(this.partida[indicePartida].jogador1.id === idJogador){
                    this.partida[indicePartida].jogador1 = false;
                }else{
                    this.partida[indicePartida].jogador2 = false;
                }
            }
            this.jogador.splice(indiceJogador, 1);
        }

        return indicePartida;
    }
}