"use strict";
// NOTE: every time a function in the paper returns an id, return the ip addr instead we can hash as needed
import chord_client from "./chord_client.mjs";
import client from "./chord_client.mjs";
import chord_generics, { string_to_id } from "./chord_generics.mjs";
import assert from "node:assert/strict";
import {
    networkInterfaces
} from 'os';
const todo = assert.bind(false);

let successor_node = null;
let predecessor_node = null;

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
    app.get(chord_generics.find_predecessor_path, find_predecessor_endpoint);
    app.get(chord_generics.find_successor_path, find_successor_endpoint);
    app.get(chord_generics.lookup_key_path, lookup_key_endpoint);
    app.post(chord_generics.insert_key_value_path, insert_key_value_endpoint);
    app.post(chord_generics.join_path, join_endpoint)
    return app;
}

async function get_successor(_req, res) {
    res.json(successor_node);
}

async function find_predecessor_endpoint(req, res) {
    const { id } = req.params;
    res.end(await find_predecessor(id));
}

/**
    * @returns{ip}
*/
async function find_successor(id) {
    let pred = await find_predecessor(id)
    return await client.get_successor(pred);
}

async function find_successor_endpoint(req, res) {
    const { id } = req.params;
    res.end(await find_successor(id));
}

/**
    * @returns{ip}
*/
async function find_predecessor(id) {
    let n_prime = our_ip;
    if (chord_client.get_successor(n_prime)) {
        return n_prime;
    }

    while (!chord_generics.id_in_range(id, n_prime, chord_generics.string_to_id())) {
        n_prime = await client.get_successor(n_prime);
    }
    return n_prime;
}

// public api which will use chord algos to find the node and request the key or perform the lookup in sqlite db if we are the correct node
async function insert_key_value_endpoint(req, res) {
    const { key, value, internal } = req.params;
    if (internal == "internal") {
        insertion_function(key, value);
        res.json({ [key]: value });
        return;
    }
    // need to figure out bit count
    const succ = await find_successor(chord_generics.string_to_id(key));
    if (succ == null) {
        res.json(await chord_client.insert_kv(our_ip, key, value, true));
        return;
    }
    res.json(await chord_client.insert_kv(succ, key, value, true));
}

async function lookup_key_endpoint(req, res) {
    const { key, internal } = req.params;
    const result = await retrieval_function(key);
    if (!result) {
        if (internal == "internal") {
            res.json(null);
            return;
        }
        const succ = await find_successor(chord_generics.string_to_id(key));
        if (succ == null) {
            res.json(await chord_client.lookup_key(our_ip, key, true));
            return;
        }
        res.json(await chord_client.lookup_key(succ, key, true));
    }
    else {
        console.log("e");
        res.json(result);
    }
}

async function join_endpoint(req, res) {
    const { known_member } = req.body; // Ensure req.body is parsed (use body-parser or express.json middleware)
    console.log(req.body);
    console.log(`Node joined with member: ${known_member}`);
    res.end(await join(known_member));
}


/**
    * addr is joining
    * @param{ip} addr
*/

async function join(known_member) {
    predecessor_node = null;
    successor_node = await chord_client.find_successor(known_member, chord_generics.string_to_id(our_ip));

}

// TODO: should be occasionally called probably with setInterval in index.mjs
export async function stabilize() {
    //
    todo();
    const x = chord_client.get_predecessor(successor_node);
}

// TODO: needs an api endpoint and client func def
async function notify(potential_pred) {
    if (potential_pred == predecessor_node) return;
    if (predecessor_node == null) {
        predecessor_node = potential_pred
        return;
    }
    const pred_id = chord_generics.string_to_id(predecessor_node);
    const our_id = chord_generics.string_to_id(our_ip);
    if (chord_generics.id_in_range(potential_pred, pred_id, our_id)) {
        predecessor_node = potential_pred
        return;
    }
}

export default { add_endpoints, stabilize }
