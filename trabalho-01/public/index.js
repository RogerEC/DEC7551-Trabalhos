$(document).ready(function(){

    $("#TABULEIRO").hide();
    $("#LISTA-JOGADORES").hide();
    ocultarCamposModal();
    $("#MODAL-ENVIAR-NOME").show();
    $("#BotaoAbrirModal").click();

    const socket = io('http://localhost:3000');

    var jogador;
    var idPart;
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
            $("#INICIO-LISTA-JOGADORES").append('<div class="form-row LINHA-LISTA-JOGADORES"><div class="form-group col-6"><input type="text" class="form-control" value="'+elemento.nome+'" readonly></div><div class="form-group col-3"><input type="text" class="btn '+corEstado+' w-100" value="'+estado+'" readonly></div><div class="form-group col-3"><button class="btn btn-primary botao-convidar w-100" id="botaoConvidar_'+index+'" value="'+elemento.id+'" '+desabilitar+'>CONVIDAR</button></div></div>');
        });
    });

    function ocultarCamposModal(){
        $("#BotaoModalCancelar").hide();
        $("#BotaoModalConfirmar").show();
        $("#MODAL-CONVITE-RECEBIDO").hide();
        $("#MODAL-AVISOS-E-ERROS").hide();
        $("#MODAL-ENVIAR-NOME").hide();
    }

    socket.on("partidaIniciada", id_partida => {
        idPart = id_partida;
        $("#BotaoModal2Cancelar").click();
        resetTabuleiro();
        desabilitaTabuleiro();
        $("#LISTA-JOGADORES").hide();
        $("#TABULEIRO").show();
    })

    socket.on("ERRO-convidadoDesconectou", () => {
        $("#BotaoModal2Cancelar").click();
        $("#MODAL-AVISOS-E-ERROS p").remove();
        $("#MODAL-AVISOS-E-ERROS").append('<p  class="text-justify mb-2">Houve um erro ao tentar enviar o seu convite, o jogador convidado desconectou.</p><p class="text-justify">Convide outro jogador.</p>');
        ocultarCamposModal();
        $("#BotaoModalConfirmar").text("OK");
        $("#TITULO-MODAL").text("ERRO AO ENVIAR CONVITE");
        $("#MODAL-AVISOS-E-ERROS").show();
        $("#BotaoAbrirModal").click();
        socket.emit("solicitarListaJogadores");
        $("#LISTA-JOGADORES").show();
    })

    socket.on("erroInicioPartida", () => {
        $("#BotaoModal2Cancelar").click();
        $("#MODAL-AVISOS-E-ERROS p").remove();
        $("#MODAL-AVISOS-E-ERROS").append('<p>Houve um erro ao tentar iniciar a partida. Tente novamente!</p>');
        ocultarCamposModal();
        $("#BotaoModalConfirmar").text("OK");
        $("#TITULO-MODAL").text("ERRO AO INICIAR PARTIDA");
        $("#MODAL-AVISOS-E-ERROS").show();
        $("#BotaoAbrirModal").click();
        socket.emit("solicitarListaJogadores");
        $("#LISTA-JOGADORES").show();
    })

    socket.on("conviteRecebido", convidante => {
        $("#BotaoModalConfirmar").val(convidante.id);
        $("#BotaoModalCancelar").val(convidante.id);
        $("#MODAL-CONVITE-RECEBIDO p").remove();
        $("#MODAL-CONVITE-RECEBIDO").append('<p>'+convidante.nome+' te convidou para uma partida!</p>');
        ocultarCamposModal();
        $("#BotaoModalConfirmar").text("Aceitar");
        $("#TITULO-MODAL").text("Você recebeu um convite!");
        $("#MODAL-CONVITE-RECEBIDO").show();
        $("#BotaoModalCancelar").show();
        $("#BotaoAbrirModal").click();
    });

    socket.on("conviteRecusado", convidado => {
        $("#BotaoModal2Cancelar").click();
        $("#MODAL-AVISOS-E-ERROS p").remove();
        $("#MODAL-AVISOS-E-ERROS").append('<p>'+convidado.nome+' recusou o seu convite para uma partida!</p>');
        ocultarCamposModal();
        $("#BotaoModalConfirmar").text("OK");
        $("#TITULO-MODAL").text("Seu convite foi recusado!");
        $("#MODAL-AVISOS-E-ERROS").show();
        $("#BotaoAbrirModal").click();
    })

    $("#BotaoModalCancelar").on("click", function(event){
        event.preventDefault();
        if($("#MODAL-CONVITE-RECEBIDO").is(":visible")){
            socket.emit("recusarConvite", jogador, $("#BotaoModalConfirmar").val());
        }
    })

    $("#BotaoModalConfirmar").on("click", function(event){
        if($("#MODAL-ENVIAR-NOME").is(":visible")){
            event.preventDefault();
            console.log("ENVIAR NOME")
            nomeJogador = $("#nomeJogador").val();
            if(nomeJogador != ""){
                socket.emit("novoJogador", nomeJogador);
            }else{
                jaValidouNome = true;
                $("#ERRO-NOME").show();
                $("#nomeJogador").addClass("is-invalid");
                return false;
            }
        }else if($("#MODAL-CONVITE-RECEBIDO").is(":visible")){
            event.preventDefault();
            socket.emit("aceitarConvite", jogador.id, $("#BotaoModalConfirmar").val());
        }
        
    });

    $("#INICIO-LISTA-JOGADORES").on("click", ".botao-convidar", function(event){
        event.preventDefault();
        socket.emit("enviarConvite", jogador, $(this).val());
        $("#BotaoAbrirModal2").click();
    })
    
    var jaValidouNome = false;

    $("#BotaoAbrirModal").on("click", function(){
        jaValidouNome = false;
    })

    $("#nomeJogador").keyup(function(){
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
            $("#BotaoModalConfirmar").click();
            return false;
        }else{
            return true;
        }                
   });
});