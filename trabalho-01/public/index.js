$(document).ready(function(){

    const socket = io('http://localhost:3000');

    var marcador = "";
    var jogador;
    var idPartida = "";
    var jogada = new Object();
    jogada.marcador;
    jogada.casaMarcada;
    jogada.nomeJogador;
    jogada.idPartida;

    socket.on("cadastroOK", function(dadosJogador){
        jogador = dadosJogador;
    });

    socket.on("listaJogadores", function(listaJogadores){
        console.log("listaJogadores");
    });

    $("#BotaoInicio").click();

    $("#EnviarNome").on("click", function(event){
        event.preventDefault();
        nomeJogador = $("#nomeJogador").val();
        //console.log(nomeJogador);
        if(nomeJogador != ""){
            socket.emit("novoJogador", nomeJogador);
        }else{
            $("#BotaoInicio").click();
        }
        
    });

    $(window).on("unload", function(event){
        event.preventDefault();
        socket.emit("desconectarJogador", jogador);
    });

    $(".quadrado").on("click", function(){
        if($(this).val() === ""){
            desabilitaTabuleiro();
            $(this).val(marcador);
            $(this).removeClass("livre");
            $(this).css("cursor", "default");
            jogada.marcador = marcador;
            jogada.casaMarcada = $(this).attr('id');
            jogada.idPartida = $.cookie('idPartida');
            jogada.nomeJogador = $.cookie('nomeJogador');
            socket.emit('novaJogada', jogada);
        }
    });

    function resetTabuleiro() {
        $(".quadrado").each(function(){
            $(this).val("");
            $(this).addClass("livre");
            $(this).css("cursor", "pointer");
        });
    };

    function desabilitaTabuleiro(){
        $(".quadrado").each(function(){
            $(this).attr("disabled", "disabled");
        });
    };

    function habilitaTabuleiro(){
        $(".quadrado").each(function(){
            $(this).removeAttr("disabled");
        });
    }

    $('input').keypress(function (e) {
        var code = null;
        code = (e.keyCode ? e.keyCode : e.which);
        if(code == 13 && $("#nomeJogador").is(":focus")){
            $("#EnviarNome").click();
            return false;
        }else{
            return true;
        }                
   });
});