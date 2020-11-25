$(document).ready(function(){

    $("#TABULEIRO").hide();
    $("#LISTA-JOGADORES").hide();
    ocultarCamposModal();
    $("#MODAL-ENVIAR-NOME").show();
    $("#BotaoAbrirModal").click();
    $("#MODAL").modal('toggle');
    $("#MODAL").on('shown.bs.modal', function() {
        $('#nomeJogador').focus()
    });

    const socket = io('http://localhost:3000');

    var jogador;
    var idPartida;
    var casa = ["casa00", "casa01", "casa02", "casa10", "casa11", "casa12", "casa20", "casa21", "casa22"];

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

    socket.on("partidaIniciada", (id_partida, marcador) => {
        console.log("PARIDA INICIADA")
        idPartida = id_partida;
        jogador.marcador = marcador;
        $("#MARCADOR-PARTIDA").text(marcador);
        $("#MARCADOR-PARTIDA-LINHA").show();
        $("#BotaoModal2Cancelar").click();
        resetTabuleiro();
        desabilitaTabuleiro();
        $("#LISTA-JOGADORES").hide();
        $("#TABULEIRO").show();
        if(marcador === 'X'){
            $("#INDICADOR-VEZ-DE-JOGAR").text("É sua vez de jogar!");
            habilitaTabuleiro();
        }else{
            $("#INDICADOR-VEZ-DE-JOGAR").text("É vez do adversário jogar!");
        }
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
        resetPaginaPadrao();
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
        resetPaginaPadrao();
    });

    socket.on("ERRO-desconhecido", () => {
        $("#MODAL-AVISOS-E-ERROS p").remove();
        $("#MODAL-AVISOS-E-ERROS").append('<p>Houve um erro desconhecido durante a partida, tente iniciar uma nova partida!</p>');
        ocultarCamposModal();
        $("#BotaoModalConfirmar").text("OK");
        $("#TITULO-MODAL").text("ERRO DESCONHECIDO");
        $("#MODAL-AVISOS-E-ERROS").show();
        $("#BotaoAbrirModal").click();
        socket.emit("solicitarListaJogadores");
        resetPaginaPadrao();
    });

    socket.on("ERRO-adversarioDesconectou", () => {
        $("#MODAL-AVISOS-E-ERROS p").remove();
        $("#MODAL-AVISOS-E-ERROS").append('<p>Seu adversário desconectou durante a partida, reinicie a partida com outro usuário para continuar jogando.</p>');
        ocultarCamposModal();
        $("#BotaoModalConfirmar").text("OK");
        $("#TITULO-MODAL").text("ERRO DURANTE A PARTIDA");
        $("#MODAL-AVISOS-E-ERROS").show();
        $("#BotaoAbrirModal").click();
        resetPaginaPadrao();
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
    });

    $("#BotaoJogarNovamente").on("click", function(event){
        event.preventDefault();
        socket.emit("jogarNovamente");
        resetPaginaPadrao();
    });

    socket.on("vitoria", (tabuleiro, casasParaMarcar) => { 
        atualizaTabuleiro(tabuleiro);
        desabilitaTabuleiro();
        console.log("vitoria");
        console.log(tabuleiro);
        console.log(casasParaMarcar);
        $("#INDICADOR-VEZ-DE-JOGAR").text("Parabéns, você ganhou!");
        $("#BotaoJogarNovamente").show();
        casasParaMarcar.forEach((elemento) => {
            $("#"+elemento).addClass("quadrado-vitoria");
        })
    });

    socket.on("derrota", (tabuleiro, casasParaMarcar) => {
        atualizaTabuleiro(tabuleiro);
        desabilitaTabuleiro();
        console.log("derrota");
        console.log(tabuleiro);
        console.log(casasParaMarcar);
        $("#INDICADOR-VEZ-DE-JOGAR").text("Que pena, você perdeu!");
        $("#BotaoJogarNovamente").show();
        casasParaMarcar.forEach((elemento) => {
            $("#"+elemento).addClass("quadrado-derrota");
        });
    });

    socket.on("empate", (tabuleiro) => {
        atualizaTabuleiro(tabuleiro);
        desabilitaTabuleiro();
        $("#INDICADOR-VEZ-DE-JOGAR").text("Ninguém ganhou ou perdeu, deu empate!");
        $("#BotaoJogarNovamente").show();
    });




    socket.on("realizarJogada", (tabuleiro) => {
        $("#INDICADOR-VEZ-DE-JOGAR").text("É sua vez de jogar!");
        atualizaTabuleiro(tabuleiro);
    });

    function atualizaTabuleiro(tabuleiro){
        casa.forEach((elemento) => {
            if(tabuleiro[elemento] != ''){
                $("#"+elemento).val(tabuleiro[elemento]);
                $("#"+elemento).removeClass("livre");
                $("#"+elemento).css("cursor", "default");
            }
            habilitaTabuleiro();
        });
    }

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
            var nomeJogador = $("#nomeJogador").val();
            if(nomeJogador != ""){
                socket.emit("novoJogador", nomeJogador);
                $("#NOME-JOGADOR").text(nomeJogador);
                $("#NOME-JOGADOR-LINHA").show();
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
            $(this).val(jogador.marcador);
            $(this).removeClass("livre");
            $(this).css("cursor", "default");
            $("#INDICADOR-VEZ-DE-JOGAR").text("É vez do adversário jogar!");
            socket.emit('novaJogada', idPartida, $(this).attr('id'), jogador.marcador);
        }
    });

    function resetTabuleiro() {
        $(".quadrado").each(function(){
            $(this).val("");
            $(this).addClass("livre");
            $(this).removeClass("quadrado-vitoria");
            $(this).removeClass("quadrado-derrota");
            $(this).css("cursor", "pointer");
        });
    };

    function resetPaginaPadrao(){
        $("#MARCADOR-PARTIDA-LINHA").hide();
        $("#BotaoJogarNovamente").hide();
        $("#TABULEIRO").hide();
        $("#LISTA-JOGADORES").show();
    }

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