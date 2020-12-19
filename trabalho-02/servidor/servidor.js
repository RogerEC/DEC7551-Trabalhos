const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
const mongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('mongodb');
require('dotenv/config');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const server = https.createServer(options, app);

const dbName = 'loja-departamentos';
const client = new mongoClient(process.env.URL_MONGODB, {useNewUrlParser: true, useUnifiedTopology: true});

client.connect(function(error) {
    if(error){
        console.log(error);
        process.exit(1);
    }

    const db = client.db(dbName);

    console.log("Conectado ao banco de dados!");

    /*server.listen(process.env.PORT_SERVER, "0.0.0.0", () => {
        console.log("Servidor UP na porta " + process.env.PORT_SERVER + "!");
    });*/

    app.listen(process.env.PORT_SERVER, "0.0.0.0", () => {
        console.log("Servidor UP na porta " + process.env.PORT_SERVER + "!");
    });

    app.post("/login", function(req, resp){
        console.log("POST Login");
        console.log(req.body);
        // verifica se a requisição está no formato correto.
        if(req.body.user && req.body.senha){
            const user = req.body.user;
            const senha = req.body.senha;
            // realiza a busca do cliente no banco pelo user informado
            db.collection('cliente').findOne({"user":user}, (erroConsultaCliente, cliente) => {
                if(erroConsultaCliente){
                    console.log("Erro ao realizar consulta no Banco de Dados. Erro 500");
                    resp.send({"codigo":"500"}); // se ocorrer erro na busca retorna erro de servidor
                    return;
                }else{
                    // se o cliente foi encontrado realiza a comparação da senha
                    if(cliente){
                        bcrypt.compare(senha, cliente.senha, function(err, result) {
                            // se resut for true, realiza login. Se não retorna erro de altenticação
                            if(result){
                                // gera um token de acesso e envia para o cliente armazenar.
                                bcrypt.genSalt(saltRounds, function(err, salt) {
                                    bcrypt.hash("Hash", salt, function(err, token) {
                                        bcrypt.genSalt(saltRounds, function(err, salt) {
                                            bcrypt.hash(token, salt, function(err, hashToken) {
                                                // armazena o hash do token no banco de dados e envia o token para o cliente
                                                db.collection('cliente').updateOne({"user":user}, {$set: {'token':hashToken}});
                                                console.log("Cliente Autorizado. Retorno 200");
                                                resp.send({"codigo":"200", "token":token});
                                            });
                                        });
                                    });
                                });
                            }else{
                                console.log("Cliente não autorizado. Erro 401s (senha incorreta)");
                                resp.send({"codigo":"401s"});
                            }
                        });
                    }else{
                        console.log("Consulta realizada mas usuário não encontrado. Erro 404");
                        resp.send({"codigo":"404c"});
                    }
                }
            });
        }else{
            console.log("Requisição incorreta, erro 400");
            resp.send({"codigo":"400"});
        }
    });

    app.post("/cadastro", function(req, resp){
        if(req.body.user && req.body.senha && req.body.nome){
            // realizar veriricação dos dados recebidos e insert no banco
        }else{
            // erro requisição
        }
    })

    app.post("/consulta", function(req, resp){
        console.log("POST Consulta");
        console.log(req.body);
        if(req.body.user && req.body.qrcode && req.body.token){
            const user = req.body.user;
            const token = req.body.token;
            const qrcode = req.body.qrcode;
            if(!verificarID(qrcode)){
                console.log("Codigo do QR Code invalido!");
                resp.send({"codigo":"001"});
                return;
            }
            db.collection('cliente').findOne({"user":user},  (erroConsultaCliente, cliente) => {
                if(erroConsultaCliente){
                    resp.send({"codigo":"500"}); // erro interno de servidor
                    return;
                }else{
                    if(cliente){
                        bcrypt.compare(token, cliente.token, function(err, result) {
                            if(result){
                                db.collection('produto').findOne({"_id":ObjectID(qrcode)}, (erroConsultaProduto, produto) => {
                                    if(erroConsultaProduto){
                                        resp.send({"codigo":"500"}); // erro interno de servidor
                                        return;
                                    }else{
                                        if(produto){ // se o cliente está autorizado e os dados do produto foram encontrados
                                            var desconto = parseFloat(cliente.desconto)*100.0;
                                            var valorComDesconto = parseFloat(produto.preco) - parseFloat(produto.preco)*parseFloat(cliente.desconto);
                                            console.log(desconto);
                                            console.log(valorComDesconto);
                                            resp.send({"codigo":"200", "dados":produto, "desconto":desconto, "valorComDesconto":valorComDesconto});
                                        }else{ // erro produto não encontrado
                                            resp.send({"codigo":"404p"}); // erro produto não encontrado
                                            return;
                                        }
                                        
                                    }
                                });
                            }else{
                                resp.send({"codigo":"401"}); // erro cliente não autorizado
                                return;
                            }
                        })
                    }else{
                        resp.send({"codigo":"404c"}); // erro cliente não encontrado
                        return;
                    }
                    
                }
            });
        }else{
            resp.send({"codigo":"400"}); // erro POST em formato incorreto
            return;
        }
    });
});

function verificarID(code){
    for(var i=0; i<code.length; i++){
        if((code[i]>='0' && code[i]<= '9') || (code[i] >= 'a' && code[i] <= 'f')){
            continue;
        }else{
            return false;
        }
        
    }
    if(code.length != 24)
        return false;
    return true;
}