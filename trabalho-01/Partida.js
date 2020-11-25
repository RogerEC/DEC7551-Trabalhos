module.exports = class Partida {
    
    constructor(jogador1, jogador2){
        
        this.id = jogador1.id + jogador2.id;
        this.jogador1 = jogador1;
        this.jogador2 = jogador2;
        this.status = "em andamento";
        this.ganhador = '';
        this.casa = [];
        this.casa.push(["casa00", "casa01", "casa02"]);
        this.casa.push(["casa10", "casa11", "casa12"]);
        this.casa.push(["casa20", "casa21", "casa22"]);
        this.casa.push(["casa00", "casa10", "casa20"]);
        this.casa.push(["casa01", "casa11", "casa21"]);
        this.casa.push(["casa02", "casa12", "casa22"]);
        this.casa.push(["casa00", "casa11", "casa22"]);
        this.casa.push(["casa20", "casa11", "casa02"]);
        
        this.jogador1.setStatusOcupado();
        this.jogador2.setStatusOcupado();
        
        if(Math.floor(Math.random()*1000)%2 === 0){
            this.jogador1.setMarcadorX();
            this.jogador2.setMarcadorO();
        }else{
            this.jogador1.setMarcadorO();
            this.jogador2.setMarcadorX();
        }
        
        this.tabuleiro = new Object();
        
        this.tabuleiro.casa00 = '';
        this.tabuleiro.casa01 = '';
        this.tabuleiro.casa02 = '';
        this.tabuleiro.casa10 = '';
        this.tabuleiro.casa11 = '';
        this.tabuleiro.casa12 = '';
        this.tabuleiro.casa20 = '';
        this.tabuleiro.casa21 = '';
        this.tabuleiro.casa22 = '';
    }

    getId(){
        return this.id;
    }

    getTabuleiro(){
        return this.tabuleiro;
    }

    setCasa(casa, marcador){
        
        this.tabuleiro[casa] = marcador;
    }

    verificaCasas(casa){
        
        if(this.tabuleiro[casa[0]] === this.tabuleiro[casa[1]] && this.tabuleiro[casa[1]] === this.tabuleiro[casa[2]]){
            
            if(this.tabuleiro[casa[0]] === this.jogador1.marcador){
                
                this.status = "encerrado";
                this.ganhador = this.jogador1;
                this.casas = casa;
            
            }else if(this.tabuleiro[casa[0]] === this.jogador2.marcador){
                
                this.status = "encerrado";
                this.ganhador = this.jogador2;
                this.casas = casa;
            }
        }
    }

    verificaTabuleiro(){

        for(var i = 0; i < this.casa.length; i++){
            
            this.verificaCasas(this.casa[i]);
            
            if(this.status != "em andamento"){
                
                return;
            }
        }

        if(this.tabuleiro.casa00 != '' && this.tabuleiro.casa01 != '' && this.tabuleiro.casa02 != '' &&
        this.tabuleiro.casa10 != '' && this.tabuleiro.casa11 != '' && this.tabuleiro.casa12 != '' &&
        this.tabuleiro.casa20 != '' && this.tabuleiro.casa21 != '' && this.tabuleiro.casa22 != '') {
            
            return this.status = "empate";
        }
    }

    setStatusInterrompido(){
        this.status = "interrompido";
    }

    getStatus(){
        return this.status;
    }

    getCasas(){
        return this.casas;
    }

    getGanhador(){
        return this.ganhador;
    }
    
    getOutroJogador(idJogador){
        if(this.jogador1 != '' && this.jogador1.id === idJogador){
            return this.jogador2;
        }else if(this.jogador2 != '' && this.jogador2.id === idJogador){
            return this.jogador1;
        }
        return '';
    }
}