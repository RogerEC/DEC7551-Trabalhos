const HOST_IP = "http://localhost:3000";
var tokenAcesso = "";
var user = "";
var request;

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    //document.getElementById('deviceready').classList.add('ready');
    
    $("#BOTAO-REALIZAR-CADASTRO").on("click", function(event){
        event.preventDefault();
        ocultarTudo();
        $("#CADASTRO").show();
    });

    $("#BOTAO-CANCELAR-CADASTRO").on("click", function(event){
        event.preventDefault();
        ocultarTudo();
        $("#LOGIN").show();
    });

    $("#BOTAO-CADASTRAR").on("click", function(event){
        event.preventDefault();
        if(validarDadosCadastro() == false){
            return;
        }
        if(request){
            request.abort();
        }
        request = $.ajax({
            type: "POST",
            url: HOST_IP+"/cadastro",
            data: {
                "nome": $("#nomeCadastro").val(),
                "sobrenome": $("sobrenomeCadastro").val(),
                "user": $("#userCadastro").val(),
                "senha": $("#senhaCadastro").val(),
                "senha2": $("#senha2Cadastro").val()
            }
        });
        request.done(function (response, textStatus, jqXHR){
            console.log("Resposta POST Cadastro recebida!")
            console.log(response);
            if(response.codigo === "200"){
                // implementar comportamento aqui
            }else{
                reportarErro(response.codigo);
            }
        });
        request.fail(function (jqXHR, textStatus, errorThrown){
            console.log("Erro ao receber a resposta do POST Cadastro!");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            reportarErro("000");
        });
    });

    function validarDadosCadastro(){
        var retorno = jaValidou = true;
        if($("#nomeCadastro").val() === ""){
            $("#nomeCadastro").removeClass("is-valid");
            $("#nomeCadastro").addClass("is-invalid");
            $("#ERRO-NOME-CADASTRO-VAZIO").show();
            retorno = false;
        }else{
            $("#ERRO-NOME-CADASTRO-VAZIO").hide();
            $("#nomeCadastro").removeClass("is-invalid");
            $("#nomeCadastro").addClass("is-valid");
        }
        if($("#sobrenomeCadastro").val() === ""){
            $("#sobrenomeCadastro").removeClass("is-valid");
            $("#sobrenomeCadastro").addClass("is-invalid");
            $("#ERRO-SOBRENOME-CADASTRO-VAZIO").show();
            retorno = false;
        }else{
            $("#ERRO-SOBRENOME-CADASTRO-VAZIO").hide();
            $("#sobrenomeCadastro").removeClass("is-invalid");
            $("#sobrenomeCadastro").addClass("is-valid");
        }
        if($("#userCadastro").val() === ""){
            $("#userCadastro").removeClass("is-valid");
            $("#userCadastro").addClass("is-invalid");
            $("#ERRO-USER-CADASTRO-VAZIO").show();
            retorno = false;
        }else{
            $("#ERRO-USER-CADASTRO-VAZIO").hide();
            $("#userCadastro").removeClass("is-invalid");
            $("#userCadastro").addClass("is-valid");
        }
        if($("#senhaCadastro").val() === ""){
            $("#senhaCadastro").removeClass("is-valid");
            $("#senhaCadastro").addClass("is-invalid");
            $("#ERRO-SENHA-CADASTRO-VAZIA").show();
            retorno = false;
        }else{
            $("#ERRO-SENHA-CADASTRO-VAZIO").hide();
            $("#senhaCadastro").removeClass("is-invalid");
            $("#senhaCadastro").addClass("is-valid");
        }
        if($("#senha2Cadastro").val() === ""){
            $("#senha2Cadastro").removeClass("is-valid");
            $("#senha2Cadastro").addClass("is-invalid");
            $("#ERRO-SENHA2-CADASTRO-VAZIA").show();
            $("#ERRO-SENHA2-CADASTRO-DIFERENTE").hide();
            retorno = false;
        }else{
            if($("#senha2Cadastro").val() != $("#senhaCadastro").val()){
                $("#senha2Cadastro").removeClass("is-valid");
                $("#senha2Cadastro").addClass("is-invalid");
                $("#ERRO-SENHA2-CADASTRO-DIFERENTE").show();
                $("#ERRO-SENHA2-CADASTRO-VAZIA").hide();
                retorno = false;
            }else{
                $("#ERRO-SENHA2-CADASTRO-DIFERENTE").hide();
                $("#ERRO-SENHA2-CADASTRO-VAZIA").hide();
                $("#senha2Cadastro").removeClass("is-invalid");
                $("#senha2Cadastro").addClass("is-valid");
            }
        }
        return retorno;
    };

    $("#senha2Cadastro").keyup(function(){
        colorirSenha2();
    });

    function colorirSenha2(){
        if(jaValidou){
            if($("#senha2Cadastro").val() != ''){
                $("#ERRO-SENHA2-CADASTRO-VAZIA").hide();
                if($("#senha2Cadastro").val() == $("#senhaCadastro").val()){
                    $("#ERRO-SENHA2-CADASTRO-DIFERENTE").hide();
                    $("#senha2Cadastro").removeClass("is-invalid");
                    $("#senha2Cadastro").addClass("is-valid");
                }else{
                    $("#ERRO-SENHA2-CADASTRO-DIFERENTE").show();
                    $("#senha2Cadastro").removeClass("is-valid");
                    $("#senha2Cadastro").addClass("is-invalid");
                }
            }else{
                $("#ERRO-SENHA2-CADASTRO-DIFERENTE").hide();
                $("#ERRO-SENHA2-CADASTRO-VAZIA").show();
                $("#senha2Cadastro").removeClass("is-valid");
                $("#senha2Cadastro").addClass("is-invalid");
            }
        }
    }

    $("#nomeCadastro").keyup(function(){
        if(jaValidou){
            if($("#nomeCadastro").val() != ''){
                $("#ERRO-NOME-CADASTRO-VAZIO").hide();
                $("#nomeCadastro").removeClass("is-invalid");
                $("#nomeCadastro").addClass("is-valid");
            }else{
                $("#ERRO-NOME-CADASTRO-VAZIO").show();
                $("#nomeCadastro").removeClass("is-valid");
                $("#nomeCadastro").addClass("is-invalid");
            }
        }
    });

    $("#sobrenomeCadastro").keyup(function(){
        if(jaValidou){
            if($("#sobrenomeCadastro").val() != ''){
                $("#ERRO-SOBRENOME-CADASTRO-VAZIO").hide();
                $("#sobrenomeCadastro").removeClass("is-invalid");
                $("#sobrenomeCadastro").addClass("is-valid");
            }else{
                $("#ERRO-SOBRENOME-CADASTRO-VAZIO").show();
                $("#sobrenomeCadastro").removeClass("is-valid");
                $("#sobrenomeCadastro").addClass("is-invalid");
            }
        }
    });

    $("#userCadastro").keyup(function(){
        if(jaValidou){
            if($("#userCadastro").val() != ''){
                $("#ERRO-USER-CADASTRO-VAZIO").hide();
                $("#userCadastro").removeClass("is-invalid");
                $("#userCadastro").addClass("is-valid");
            }else{
                $("#ERRO-USER-CADASTRO-VAZIO").show();
                $("#userCadastro").removeClass("is-valid");
                $("#userCadastro").addClass("is-invalid");
            }
        }
    });

    $("#senhaCadastro").keyup(function(){
        if(jaValidou){
            if($("#senhaCadastro").val() != ''){
                $("#ERRO-SENHA-CADASTRO-VAZIA").hide();
                $("#senhaCadastro").removeClass("is-invalid");
                $("#senhaCadastro").addClass("is-valid");
            }else{
                $("#ERRO-SENHA-CADASTRO-VAZIA").show();
                $("#senhaCadastro").removeClass("is-valid");
                $("#senhaCadastro").addClass("is-invalid");
            }
            colorirSenha2();
        }
    });

    $("#BOTAO-ENTRAR").on("click", function(event){
        event.preventDefault();
        if(validarDadosLogin() == false){
            return;
        }
        if (request) {
            request.abort();
        }
        request = $.ajax({
            type: "POST",
            url: HOST_IP+"/login",
            data: {
                "user":$("#userLogin").val(),
                "senha":$("#senhaLogin").val()
            }
        });
        request.done(function (response, textStatus, jqXHR){
            console.log("Resposta do POST Login Recebida:");
            console.log(response);
            if(response.codigo === "200"){
                user = $("#userLogin").val();
                ocultarTudo();
                $("#BotaoSair").show();
                $("#SCANER").show();
                tokenAcesso = response.token;
            }else{
                reportarErro(response.codigo);
            }
        });
        request.fail(function (jqXHR, textStatus, errorThrown){
            console.log("Erro ao receber a resposta do POST Login.");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            reportarErro("000");
        });
    });

    var jaValidou = false;
    function validarDadosLogin(){
        var retorno = jaValidou = true;
        if($("#senhaLogin").val() === ""){
            $("#senhaLogin").removeClass("is-valid");
            $("#senhaLogin").addClass("is-invalid");
            $("#ERRO-SENHA").show();
            retorno = false;
        }else{
            $("#ERRO-SENHA").hide();
            $("#senhaLogin").removeClass("is-invalid");
            $("#senhaLogin").addClass("is-valid");
        }
        if($("#userLogin").val() === ""){
            $("#ERRO-USER").show();
            $("#userLogin").removeClass("is-valid");
            $("#userLogin").addClass("is-invalid");
            retorno = false;
        }else{
            $("#ERRO-USER").hide();
            $("#userLogin").removeClass("is-invalid");
            $("#userLogin").addClass("is-valid");
        }
        return retorno;
    }

    $("#senhaLogin").keyup(function(){
        if(jaValidou){
            if($("#senhaLogin").val() != ''){
                $("#ERRO-SENHA").hide();
                $("#senhaLogin").removeClass("is-invalid");
                $("#senhaLogin").addClass("is-valid");
            }else{
                $("#ERRO-SENHA").show();
                $("#senhaLogin").removeClass("is-valid");
                $("#senhaLogin").addClass("is-invalid");
            }
        }
    });

    $("#userLogin").keyup(function(){
        if(jaValidou){
            if($("#userLogin").val() != ''){
                $("#ERRO-USER").hide();
                $("#userLogin").removeClass("is-invalid");
                $("#userLogin").addClass("is-valid");
            }else{
                $("#ERRO-USER").show();
                $("#userLogin").removeClass("is-valid");
                $("#userLogin").addClass("is-invalid");
            }
        }
    });

    $("#BotaoSair").on("click", function(event){
        event.preventDefault();
        ocultarTudo();
        tokenAcesso = "";
        user = "";
        $("#LOGIN").show();
    });

    function ocultarTudo(){
        $("#LOGIN").hide();
        $("#CADASTRO").hide();
        $("#SCANER").hide();
        $("#senhaLogin").removeClass("is-valid").removeClass("is-invalid").val("");
        $("#userLogin").removeClass("is-valid").removeClass("is-invalid").val("");
        $("#nomeCadastro").removeClass("is-valid").removeClass("is-invalid").val("");
        $("#sobrenomeCadastro").removeClass("is-valid").removeClass("is-invalid").val("");
        $("#userCadastro").removeClass("is-valid").removeClass("is-invalid").val("");
        $("#senhaCadastro").removeClass("is-valid").removeClass("is-invalid").val("");
        $("#senha2Cadastro").removeClass("is-valid").removeClass("is-invalid").val("");
        $("#BotaoSair").hide();
        jaValidou = false;
    }

    function reportarErro(codigo){
        $("#MODAL-MENSAGEM p").remove();
        if(codigo === "000"){
            $("#MODAL-MENSAGEM").append("<p class='text-justfy'>Ocorreu uma falha ao tentar realizar a comunicação com o servidor.</p>");
        }else if(codigo === "001"){
            $("#MODAL-MENSAGEM").append("<p class='text-justfy'>O QR Code scaneado é inválido. Não pertence a loja!</p>");
        }else if(codigo === "400"){
            $("#MODAL-MENSAGEM").append("<p class='text-justfy'>Erro ao processar a sua requisição. Tente novamente!</p>");
        }else if(codigo === "401"){
            $("#MODAL-MENSAGEM").append("<p class='text-justfy'>Usuário não autenticado, realize o login novamente!</p>");
            tokenAcesso = "";
        }else if(codigo === "401s"){
            $("#MODAL-MENSAGEM").append("<p class='text-justfy'>Não foi possível realizar o login, senha incorreta!</p>");
            tokenAcesso = "";
        }else if(codigo === "404c"){
            $("#MODAL-MENSAGEM").append("<p class='text-justfy'>Não foi possível realizar o login, usuário não encontrado!</p>");
            tokenAcesso = "";
        }else if(codigo === "404p"){
            $("#MODAL-MENSAGEM").append("<p class='text-justfy'>Não foi possível localizar o produto scaneado.</p>");
            tokenAcesso = "";
        }else if(codigo === "500"){
            $("#MODAL-MENSAGEM").append("<p class='text-justfy'>Ocorreu um erro interno no servidor ao processar a sua requisição. Tente novamente!</p>");
        }else{
            $("#MODAL-MENSAGEM").append("<p class='text-justfy'>Ocorreu um erro desconhecido! Realize o Login novamente!</p>");
            tokenAcesso = "";
        }
        $("#BotaoAbrirModal").click();
        ocultarTudo();
        if(tokenAcesso != ""){
            $("#SCANER").show();
        }else{
            $("#LOGIN").show();
            $("#senhaLogin").val("");
            $("#userLogin").val("");
        }
    }
}

function exibirInfoProduto(dados, desconto, valorComDesconto){
    $("#MODAL-MENSAGEM p").remove();
    mensagem  = "<p class='text-justfy'><b>Nome produto:</b> "+dados.nome+"</p>";
    mensagem += "<p class='text-justfy'><b>Marca:</b> "+dados.marca+"</p>";
    mensagem += "<p class='text-justfy'><b>Modelo:</b> "+dados.modelo+"</p>";
    mensagem += "<p class='text-justfy'><b>Descrição:</b> "+dados.descricao+"</p>";
    mensagem += "<p class='text-justfy'><b>Preço: </b> R$"+dados.preco.toFixed(2)+"</p>";
    mensagem += "<p class='text-justfy'><b>Seu desconto: </b> "+desconto.toFixed(2)+"%</p>";
    mensagem += "<p class='text-justfy'><b>Você vai pagar: </b> R$ "+valorComDesconto.toFixed(2)+"</p>";
    $("#MODAL-MENSAGEM").append(mensagem);
    $("#BotaoAbrirModal").click();
}

// ====== LEITOR QR-CODE =========

function O(X) {
    return document.getElementById(X);
}

var contador=0;
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },
       // Update DOM on a Received Event
    receivedEvent: function(id) {
        window.plugin.CanvasCamera.initialize(O('canvas'));
        var options = {
            cameraPosition: 'back',
            width: 352,
            height: 288,
            canvas: {
                width: 352,
                height: 288
            },
            capture: {
                width: 352,
                height: 288
            },
            fps: 30,
            use: 'file',
            flashMode: false,
            thumbnailRatio: 1/6,
            onBeforeDraw: function(frame){
            // do something before drawing a frame
            },
            onAfterDraw: function(frame){
                var c = O('canvas');
                if (contador == 10){
                    const code = jsQR(((c.getContext("2d")).getImageData(0, 0, c.width, c.height)).data, c.width, c.height);
                    if (code){
                        window.plugin.CanvasCamera.stop();
                        if (request) {
                            request.abort();
                        }
                        request = $.ajax({
                            type: "POST",
                            url: HOST_IP+"/consulta",
                            data: {
                                "user":user,
                                "token":tokenAcesso,
                                "qrcode":code.data
                            }
                        });
                        request.done(function (response, textStatus, jqXHR){
                            console.log("Resposta do POST Consulta recebida:");
                            console.log(response);
                            if(response.codigo === "200"){
                                exibirInfoProduto(response.dados, response.desconto, response.valorComDesconto);
                            }else{
                                reportarErro(response.codigo);
                            }
                        });
                        request.fail(function (jqXHR, textStatus, errorThrown){
                            console.log("Erro ao receber a resposta do POST Login.");
                            console.log(jqXHR);
                            console.log(textStatus);
                            console.log(errorThrown);
                            reportarErro("000");
                        });
                    }
                    contador = 0;
                }
                else{
                    contador++;
                }         
            }
        };

       O('BOTAO-SCAN').addEventListener('click',function(){
            window.plugin.CanvasCamera.start(options);
       }, false);
    }
};

app.initialize();
