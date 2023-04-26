import dotenv from "dotenv";
dotenv.config();
import express from "express";

//Conexao com o banco de dados
import knex from "./database/knexInit";
//Importando o arquivo principal das rotas
import routes from "./app/routes/routes";

const server = express();
server.use(routes);

const port = process.env.PORT || 3000;
knex.select(knex.raw('1')).then(() => {
    console.log("--Banco de dados conectado");
    server.listen(port, () => {
        console.log(`--Servidor rodando na porta ${port}`);
    });
}).catch((error) => {
    console.log(`>>Erro ao iniciar aplicacao: ${error}`)
});

