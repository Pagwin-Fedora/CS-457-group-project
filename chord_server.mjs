// NOTE: every time a function in the paper returns an id, return the ip addr instead we can hash as needed
import chord_client from "./chord_client.mjs";
import client from "./chord_client.mjs";
import chord_generics from "./chord_generics.mjs";
import assert from "node:assert/strict";
import {
    networkInterfaces
} from 'os';
const todo = assert.bind(false);

// finger_table[0] is successor (1 after us)
// finger_table[1] is 2 after us
// finger_table[2] is 4 after us
// etc.
// elements are ips
const finger_table = [];

/** @type {ip}*/
const our_ip = (function() {
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            //net.family === 'IPv4'
            if (!net.internal) {
                return net.address;
            }
        }
    }
})();

let insertion_function = null;
let retrieval_function = null;
export function add_endpoints(app, insert, retrieve) {
    // using globals because doing the correct thing is too much effor for the time given
    insertion_function = insert;
    retrieval_function = retrieve;

    app.get(chord_generics.get_successor_path, get_successor);
    app.get(chord_generics.closest_preceding_finger_path, closest_preceding_finger_endpoint);
    app.get(chord_generics.find_predecessor_path, find_predecessor_endpoint);
    app.get(chord_generics.lookup_key_path, lookup_key_endpoint);
    app.post(chord_generics.insert_key_value_path, insert_key_value_endpoint);
    return app;
}

async function get_successor(_req, res) {
    res.end(JSON.stringify(finger_table[0]));
}

async function find_predecessor_endpoint(req, res) {
    const id = req.params;
    res.end(await find_predecessor(id));
}

async function find_successor(id) {
    pred = await find_predecessor(id)
    return await client.get_successor(pred);
}

async function find_predecessor(id) {
    n_prime = our_ip;
    while (!chord_generics.id_in_range(id, n_prime, chord_generics.string_to_id(chord_client.get_successor(n_prime)))) {
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
        // first node such that the id is greater than or equal to n.finger[k].start
        // what .start is isn't clear
        if (chord_generics.id_in_range(todo(), chord_generics.string_to_id(our_ip), id)) {
            //string_to_id(finger_table[i])

        }
    }
    return our_ip;
}

// public api which will use chord algos to find the node and request the key or perform the lookup in sqlite db if we are the correct node
async function insert_key_value_endpoint(req, res) {
    const { key, value, internal } = req.params;
    if (internal) {
        insert_here(key, value);
        res.end(`${key}:${value}`);
        return;
    }
    // find_successor and do insertion with internal set
    todo();
}

async function lookup_key_endpoint(req, res) {
    const { key, internal } = req.params;
    const result = get_here(key);
    if (!result) {
        if (internal) {
            res.write(JSON.stringify(null));
        }
        // use find_successor and then do the RPC to the relevant node with internal set to true to avoid infinite loops
        todo();
    }
    else {
        res.end(`${result.value}`);
    }
}

export default { add_endpoints }
