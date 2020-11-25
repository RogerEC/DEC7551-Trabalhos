const Jogador = require("./Jogador");
const Partida = require("./Partida");

module.exports = class Jogo {

    constructor(){
        this.jogador = [];
        this.partida = [];
    }

    getGanhadorPartida(idPartida){
        
        var indicePartida = this.procurarPartidaPeloID(idPartida);
        
        if(indicePartida != -1){
            
            return this.partida[indicePartida].getGanhador();
        }
        
        return null;
    }

    getCasasPartida(idPartida){

        var indicePartida = this.procurarPartidaPeloID(idPartida);
        
        if(indicePartida != -1){
            
            return this.partida[indicePartida].getCasas();
        }
        
        return null;
    }

    getIDJogadores(idPartida){

        var indicePartida = this.procurarPartidaPeloID(idPartida);

        if(indicePartida != -1){

            return [this.partida[indicePartida].jogador1.id, this.partida[indicePartida].jogador2.id];
        }

        return null;
    }

    getStatusPartida(idPartida){

        var indicePartida = this.procurarPartidaPeloID(idPartida);

        if(indicePartida != -1){

            this.partida[indicePartida].verificaTabuleiro();
            return this.partida[indicePartida].getStatus();
        }

        return null;
    }

    getIDOutroJogador(idPartida, idJogador){
        
        var indicePartida = this.procurarPartidaPeloID(idPartida);
        
        if(indicePartida != -1){
            
            return this.partida[indicePartida].getOutroJogador(idJogador);
        }
        
        return null;
    }

    getIDJogadorRestante(idPartida){
        var indicePartida = this.procurarPartidaPeloID(idPartida);
        if(indicePartida != -1){
            if(this.partida[indicePartida].jogador1 != null){
                return this.partida[indicePartida].jogador1.id;
            }else{
                return this.partida[indicePartida].jogador2.id;
            }
        }
    }

    setCasaTabuleiro(idPartida, casa, marcador){
        
        var indicePartida = this.procurarPartidaPeloID(idPartida);
        
        if(indicePartida != -1){
            
            this.partida[indicePartida].setCasa(casa, marcador);
        }
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

    getTabuleiro(idPartida){
        
        var indicePartida = this.procurarPartidaPeloID(idPartida);
        
        if(indicePartida != -1){
            
            return this.partida[indicePartida].getTabuleiro();
        }
        
        return null;
    }

    getIDJogadorMarcadorXO(idPartida){
        
        var indicePartida = this.procurarPartidaPeloID(idPartida);
        
        if(indicePartida != -1){
            
            if(this.partida[indicePartida].jogador1.marcador === 'X'){
                
                return [this.partida[indicePartida].jogador1.id, this.partida[indicePartida].jogador2.id];
            
            }else{
                
                return [this.partida[indicePartida].jogador2.id, this.partida[indicePartida].jogador1.id];
            }
        }
        
        return null;
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

        var indice = this.procurarPartidaPeloID(idPartida);
        
        if(indice != -1){
            this.partida.splice(indice, 1);
        }
    }

    removerJogador(idJogador){

        var indiceJogador = this.procurarJogadorPeloID(idJogador);
        var retorno = -1;

        if(indiceJogador != -1){
            
            var indicePartida = this.procurarPartidaPeloIDJogador(idJogador);
           
            if(indicePartida != -1){

                this.partida[indicePartida].setStatusInterrompido();
                
                if(this.partida[indicePartida].jogador1.id === idJogador){
                    this.partida[indicePartida].jogador1 = null;
                }else{
                    this.partida[indicePartida].jogador2 = null;
                }

                retorno = this.partida[indicePartida].id;
            }
            this.jogador.splice(indiceJogador, 1);
        }

        return retorno;
    }
}