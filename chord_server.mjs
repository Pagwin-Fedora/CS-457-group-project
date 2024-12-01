// NOTE: every time a function in the paper returns an id, return the ip addr instead we can hash as needed
import client from "./chord_client.mjs";
import generics from "./chord_generics.mjs";
import assert from "node:assert/strict";
const todo = assert.bind(false);

// finger_table[0] is successor (1 after us)
// finger_table[1] is 2 after us
// finger_table[2] is 4 after us
// etc.
// elements are ips
const finger_table = [];

const our_ip = await (async function() {
    // TODO:
    // need to grab our ip for various stuff like id
    return todo();
})()

export function add_endpoints(app) {
    app.get(generics.get_successor_path, get_successor);
    app.get(generics.closest_preceding_finger_path, closest_preceding_finger_endpoint);
    return app;
}

async function get_successor(_req, res) {
    res.end(JSON.stringify(finger_table[0]));
}

async function find_successor(id) {
    pred = find_predecessor(id)
    return await client.get_successor(pred);
}

async function find_predessor(id) {
    n_prime = our_ip;
    // wtf is their notation
    while (todo()) {
        n_prime = await client.closest_preceding_finger(n_prime, id);
    }
    return n_prime;
}

async function closest_preceding_finger_endpoint(req, res) {
    const { id: str_id } = req.params;
    const id = Number.parseInt(str_id);
    res.end(await closest_preceding_finger(id));
}

async function closest_preceding_finger(id) {
    for (let i = finger_table.length - 1; i >= 0; i--) {
        // wtf do they mean by their notation????
        if (todo()) {
            //string_to_id(finger_table[i])

        }
    }
    return our_ip;
}

export default { add_endpoints }
