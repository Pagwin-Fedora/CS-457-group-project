import express from "express";
import sqlite from "sqlite3";

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
        res.end("no such key present here");
    }
    else {
        res.end(`${result.value}`);
    }
});
app.post("/entry/:key/:value", async (req, res) => {
    const { key, value } = req.params;
    await new Promise((res, err) => kv_db.run('insert into kv (key,value) VALUES (?, ?)', key, value, (e) => {
        if (e) {
            err(e);
        } else res(null);
    }));
    res.end(`${key}:${value}`)
});


app.listen(port, () => {
    console.log(`Listening on ${port}`);
});
