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

async function ack_join(to, pred, succ) {
    // post request to the ip passed as the to variable
    // endpoint to post request to is generics.ack_join_path
    // body should be json with pred and succ being strings indicating what the pred and succ should be set to
    todo();
}
// 
async function join(to, ack_to) {
    // post request to the ip passed as the to variable
    // endpoint to post request is generics.join_path
    // body should be json with ack_to being the ack_to_variable
    todo();
}

export const get_successor = api_req.bind(null, generics.get_successor_path);

export function closest_preceding_finger(node, id) {
    return api_req(generics.closest_preceding_finger_path.replace(":id", id), node);
}

export default { get_successor, closest_preceding_finger, ack_join, join };
