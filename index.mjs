import express from "express";
import sqlite from "sqlite3";
import chord_server from "./chord_server.mjs";

async function main() {
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





    chord_server.add_endpoints(app);

    app.listen(port, () => {
        console.log(`Listening on ${port}`);
    });

    // hacky solution to a dumb docker problem
    while (true) await new Promise(res => setTimeout(res, 1000));
}
/**
    * @param{string} key
    * @param{string} val
*/
async function insert_here(key, val) {
    return await new Promise((res, err) => kv_db.run('insert into kv (key,value) VALUES (?, ?)', key, value, (e) => {
        if (e) {
            err(e);
        } else res(null);
    }));
}

/**
    * @param{string} key
*/
async function get_here(key) {
    return await new Promise((res, err) => kv_db.get('select (value) from kv where key=?', key, (e, row) => {
        if (e) {
            err(e);
        } else {
            res(row);
        }
    }));

}
await main();
