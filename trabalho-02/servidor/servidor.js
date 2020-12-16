const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
const mongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('mongodb');
require('dotenv/config');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const dbName = 'loja-departamentos';
const client = new mongoClient(process.env.URL_MONGODB, {useNewUrlParser: true, useUnifiedTopology: true});

client.connect(function(error) {
    if(error){
        console.log(error);
        process.exit(1);
    }

    const db = client.db(dbName);

    console.log("Conectado ao banco de dados!");

    app.listen(process.env.PORT_SERVER, "0.0.0.0", () => {
        console.log("Servidor UP na porta " + process.env.PORT_SERVER + "!");
    });

    app.post("/login", function(req, resp){
        if(req.body.user && req.body.senha){
            const user = req.body.user;
            const senha = req.body.senha;
        }else{
            // retorna erro entrada
        }
    });

    app.post("/cadastro", function(req, resp){
        if(req.body.user && req.body.senha){

        }else{
            // erro requisição
        }
    })

    app.post("/consulta", function(req, resp){
        if(req.body.iduser && req.body.qrcode){
            db.collection('produto').findOne({"_id":ObjectID("5fd8639428022a18ac8cd944")},  (erroConsultaProduto, produto) => {
                if(erroConsultaProduto){
                    console.log("Erro Consulta Produto");
                }else{
                    db.collection('cliente').findOne({"_id":ObjectID("5fd85dd5d122514728cb9aa9")}, (erroConsultaCliente, cliente) => {
                        if(erroConsultaCliente){
                            console.log("Erro Consulta Cliente");
                        }else{
                            console.log(produto);
                            console.log(cliente);
                        }
                    });
                }
            });
        }else{
            resp.send();
        }
    });
});

bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash("040404", salt, function(err, hash) {
        console.log(hash);
    });
});
// $2b$10$yMxEUcfc7iHZA6SUAagktOuOrAq.soLnc7IEKOdyyJfRJsTwbZLPq
//bcrypt.compare("000001", "$2b$10$yMxEUcfc7iHZA6SUAagktOuOrAq.soLnc7IEKOdyyJfRJsTwbZLPq", function(err, result) {
//    console.log(result);
//});