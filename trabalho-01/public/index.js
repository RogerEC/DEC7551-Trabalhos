$(document).ready(function(){

    $("#TABULEIRO").hide();
    $("#LISTA-JOGADORES").hide();
    $("#LISTA-JOGADORES").removeClass("ocultar");
    $("#TABULEIRO").removeClass("ocultar");
    $("#BotaoInicio").click();

    const socket = io('http://localhost:3000');

    var jogador;
    var jogada = new Object();
    jogada.marcador;
    jogada.casaMarcada;
    jogada.nomeJogador;
    jogada.idPartida;

    socket.on("cadastroOK", function(dadosJogador){
        jogador = dadosJogador;
        console.log("SOLICITAR DADOS");
        socket.emit("solicitarListaJogadores");
        $("#LISTA-JOGADORES").show();
    });

    function limparListaJogadores(){
        $(".LINHA-LISTA-JOGADORES").remove();
    }

    socket.on("atualizarListaJogadores", function(listaJogadores){
        console.log("ATUALIZAR LISTA")
        limparListaJogadores();
        listaJogadores.forEach((elemento, index) => {
            if(elemento.id === jogador.id){
                elemento.nome = elemento.nome + " (você)"
                estado = "Livre"
                corEstado = "btn-success";
                desabilitar = 'hidden';
            }else if(elemento.status == true){
                estado = "Livre"
                corEstado = "btn-success";
                desabilitar = '';
            }else{
                estado = "Em partida"
                corEstado = "btn-warning";
                desabilitar = 'disabled';
            }
            $("#INICIO-LISTA-JOGADORES").append('<div class="form-row LINHA-LISTA-JOGADORES"><div class="form-group col-6"><input type="text" class="form-control" value="'+elemento.nome+'" readonly></div><div class="form-group col-3"><input type="text" class="btn '+corEstado+' w-100" value="'+estado+'" readonly></div><div class="form-group col-3"><button class="btn btn-primary botao-convidar w-100" id="botaoConvidar_'+index+'" '+desabilitar+'>CONVIDAR</button></div></div>');
        });
    });
    
    var jaValidouNome = false;

    $("#BotaoInicio").on("click", function(){
        jaValidouNome = false;
    })

    $("#EnviarNome").on("click", function(event){
        event.preventDefault();
        nomeJogador = $("#nomeJogador").val();
        if(nomeJogador != ""){
            socket.emit("novoJogador", nomeJogador);
        }else{
            jaValidouNome = true;
            $("#ERRO-NOME").show();
            $("#nomeJogador").addClass("is-invalid");
            return false;
        }
        
    });

    $("#nomeJogador").keyup(function(){
        console.log("VALIDAÇÃO")
        if(jaValidouNome){
            if($("#nomeJogador").val() != ''){
                $("#ERRO-NOME").hide();
                $("#nomeJogador").removeClass("is-invalid");
                $("#nomeJogador").addClass("is-valid");
            }else{
                $("#ERRO-NOME").show();
                $("#nomeJogador").removeClass("is-valid");
                $("#nomeJogador").addClass("is-invalid");
            }
        }
    })

    $(window).on("unload", function(event){
        event.preventDefault();
        //socket.emit("desconectarJogador", jogador);
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