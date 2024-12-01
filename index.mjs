import express from "express";
import sqlite from "sqlite3";
import assert from "node:assert/strict";
const todo = assert.bind(false);
//import chord_server from "./chord_server.mjs";

sqlite.verbose();
const app = express();
const port = 8080;
const kv_db = new sqlite.Database(":memory:");

kv_db.run(`
    create table kv(
        key text primary key,
        value text
    ) strict
`);


// public api which will use chord algos to find the node and request the key or perform the lookup in sqlite db if we are the correct node
// might need to move this into server, oop
app.get("/entry/:key", async (req, res) => {
    const { key } = req.params;
    const result = await new Promise((res, err) => kv_db.get('select (value) from kv where key=?', key, (e, row) => {
        if (e) {
            err(e);
        } else {
            res(row);
        }
    }));
    if (!result) {
        todo();
    }
    else {
        res.end(`${result.value}`);
    }
});
app.post("/entry/:key/:value", async (req, res) => {
    const { key, value } = req.params;
    todo();
    await new Promise((res, err) => kv_db.run('insert into kv (key,value) VALUES (?, ?)', key, value, (e) => {
        if (e) {
            err(e);
        } else res(null);
    }));
    res.end(`${key}:${value}`)
});

//chord_server.add_endpoints(app);

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});
