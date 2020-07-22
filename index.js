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

let nextId = null;

async function getNextId(req, res, next) {
    await database.query(`SELECT MAX(id) FROM inventory;`,
        { type: database.QueryTypes.SELECT })
        .then(id => {
            nextId = id[0].max++;
            nextId++;
        })

    next();
}


server.get('/', (req, res) => {
    return res.json({
        result: 'Api-Inventory-Control'
    });
});

server.get('/inventory', async (req, res) => {
    let inventory;

    await database.query(`SELECT * FROM inventory;`,
        { type: database.QueryTypes.SELECT })
        .then(result => {
            inventory = result;
        })
        .catch(err => {
            return res.json(err);
        })
    return res.json({ inventory });
})

server.get('/inventory/:id', async (req, res) => {
    const { id } = req.params;
    let item;

    await database.query(`SELECT * FROM inventory WHERE id=${id};`,
        { type: database.QueryTypes.SELECT })
        .then(result => {
            item = result;
        })
        .catch(err => {
            return res.json(err);
        })
    return res.json({ item });
})

server.post('/inventory', getNextId, async (req, res) => {
    const { name, brand, amount, perishable } = req.body;
    let inserted;

    await database.query(`INSERT INTO inventory VALUES(${nextId}, '${name}', 
    '${brand}', '${amount}', '${perishable}');`,
        { type: database.QueryTypes.INSERT })
        .then(result => {
            inserted = result;
        })
        .catch(err => {
            return res.json(err);
        })

    if (inserted[1]) {
        return res.json({
            result: 'successfully inserted item'
        });
    } else {
        return res.json({
            result: 'item could note be registered'
        });
    }
})

server.put('/inventory/:id', async (req, res) => {
    const { id } = req.params;
    const { name, brand, amount, perishable } = req.body;
    let itemUpdate;

    await database.query(`UPDATE inventory SET name='${name}', brand='${brand}', 
    amount='${amount}', perishable='${perishable}' WHERE id=${id};`,
        { type: database.QueryTypes.UPDATE })
        .then(result => {
            itemUpdate = result;
        })
        .catch(err => {
            return res.json(err);
        })
    if (itemUpdate) {
        return res.json({
            result: 'inventory update successfully.'
        });
    } else {
        return res.json({
            result: 'inventory cannot be update.'
        });
    }
})

server.delete('/inventory/:id', async (req, res) => {
    const { id } = req.params;


    await database.query(`DELETE FROM inventory WHERE id = ${id};`,
        { type: database.QueryTypes.DELETE })
        .catch(err => {
            return res.json(err);
        })
    return res.json({
        result: 'item deleted.'
    });
})

server.listen(process.env.PORT); 