const express = require('express');
const database = require('./database');
const server = express();
server.use(express.json());

server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

server.get('/', (req, res) => {
    return res.json({
        result: 'Api-Inventory'
    });
})

server.get('/inventory', async (req, res) => {
    let inventory;

    await database.query(`SELECT * FROM inventory;`,
    {type: database.QueryTypes.SELECT})
    .then(itens => {
        inventory = itens;
    })
    .catch(err => {
        return res.json(err);
    })
    return res.json({inventory});
})