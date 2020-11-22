module.exports = class Partida {
    
    constructor(jogador1, jogador2){
        
        this.id = jogador1.id + jogador2.id;
        this.jogador1 = jogador1;
        this.jogador2 = jogador2;
        
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

    setCasa(casa, marcador){
        
        this.tabuleiro[casa] = marcador;
    }

    verificaCasas(casa){
        
        if(this.tabuleiro[casa[0]] === this.tabuleiro[casa[1]] && this.tabuleiro[casa[1]] === this.tabuleiro[casa[2]]){
            
            if(this.tabuleiro[casa[0]] === this.jogador1.marcador){
                
                return [this.jogador1, casa];
            
            }else if(this.tabuleiro[casa[0]] === this.jogador2.marcador){
                
                return [this.jogador2, casa];
            
            }
        }
        
        return [false, false];
    }

    verificaTabuleiro(){

        var casa = [];

        casa.push(["casa00", "casa01", "casa02"]);
        casa.push(["casa10", "casa11", "casa12"]);
        casa.push(["casa20", "casa21", "casa22"]);
        casa.push(["casa00", "casa10", "casa20"]);
        casa.push(["casa01", "casa11", "casa12"]);
        casa.push(["casa02", "casa12", "casa22"]);
        casa.push(["casa00", "casa11", "casa22"]);
        casa.push(["casa20", "casa11", "casa02"]);

        for(var i = 0; i < casa.length; i = i + 1){
            
            var retorno = this.verificaCasas(casa[i]);
            
            if(retorno[0] != false){
                
                return retorno;
            }
        }

        if(this.tabuleiro.casa00 != '' && this.tabuleiro.casa01 != '' && this.tabuleiro.casa02 != '' &&
        this.tabuleiro.casa10 != '' && this.tabuleiro.casa11 != '' && this.tabuleiro.casa12 != '' &&
        this.tabuleiro.casa20 != '' && this.tabuleiro.casa21 != '' && this.tabuleiro.casa22 != '') {
            
            return ["empate", "empate"];
        }

        return [false, false];
    }
    
}