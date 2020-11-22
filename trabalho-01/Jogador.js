module.exports = class Jogador {

    constructor(id, nome){
        this.nome = nome;
        this.id = id;
        this.marcador = ''; // peça do jogador na partida
        this.status = true; // true jogador livre, false ocupado
    }

    getStatus(){
        return this.status;
    }

    getNome(){
        return this.nome;
    }

    getId(){
        return this.id;
    }

    setStatusOcupado(){
        this.status = false;
    }

    setStatusLivre(){
        this.status = true;
        this.marcador = '';
    }

    setMarcadorX(){
        this.marcador = "X";
    }

    setMarcadorO(){
        this.marcador = "O";
    }

    getMarcador(){
        return this.marcador;
    }
}