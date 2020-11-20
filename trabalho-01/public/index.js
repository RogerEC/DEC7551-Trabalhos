$(document).ready(function(){

    const socket = io('http://localhost:3000');

    var marcador = "";
    var nomeJogador = "";
    var idPartida = "";
    var jogada = new Object();
    jogada.marcador;
    jogada.casaMarcada;
    jogada.nomeJogador;
    jogada.idPartida;

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
        socket.emit("desconectarJogador", nomeJogador);
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
});