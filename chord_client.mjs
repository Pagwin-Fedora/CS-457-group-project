import chord_generics from "./chord_generics.mjs";
import generics from "./chord_generics.mjs";
import assert from "node:assert/strict";
const todo = assert.bind(null, false);
/**
    * @param {string} endpoint - the api endpoint like "/a/b/:abc"
    * @param {ip} node - ip of the    * @returns {any} - json deserialized result
*/
async function api_req(endpoint, node) {
    const result = await fetch(new URL(endpoint, `http://${node}/`))
        .then(resp => resp.json());
    return result;

}

// 
async function join(to, known_member) {
    // post request to the ip passed as the to variable
    // endpoint to post request is generics.join_path
    // body should be json with known_member being the ip of a known member
    const endpoint = chord_generics.join_path;
    const opts = {
        body: `{"known_member":"${known_member}"}`
    };
    return await fetch(new URL(endpoint, `http://${to}/`), opts).then(res => res.json());
}

export const get_successor = api_req.bind(null, generics.get_successor_path);

export const get_predecessor = api_req.bind(null, generics.get_predecessor_path);
export async function find_predecessor(to, id) {
    return await api_req(chord_generics.find_predecessor_path.replace(":id", id), to)
}

export async function closest_preceding_finger(node, id) {
    return await api_req(generics.closest_preceding_finger_path.replace(":id", id), node);
}
export async function insert_kv(node, key, value, internal = false) {
    const endpoint = chord_generics.insert_key_value_path
        .replace(":internal", internal ? "internal" : "external")
        .replace(":value", value)
        .replace(":key", key);
    const opts = {
        method: "POST",
    };
    return await fetch(new URL(endpoint, `http://${node}/`), opts).then(res => res.json());
}
export async function lookup_key(node, key, internal = false) {
    const endpoint = chord_generics.lookup_key_path
        .replace(":internal", internal ? "internal" : "external")
        .replace(":key", key);
    const opts = {};
    return await fetch(new URL(endpoint, `http://${node}/`), opts).then(res => res.json());
}
export default { get_successor, closest_preceding_finger, join, insert_kv, lookup_key };
