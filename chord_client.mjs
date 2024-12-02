import generics from "./chord_generics.mjs";

/**
    * @param {string} endpoint - the api endpoint like "/a/b/:abc"
    * @param {ip} node - ip of the    * @returns {any} - json deserialized result
*/
async function api_req(endpoint, node) {
    const result = await fetch(new URL(endpoint, `http://${node}/`))
        .then(resp => resp.json());
    return result;

}

export const get_successor = api_req.bind(generics.get_successor_path);

export function closest_preceding_finger(node, id) {
    return api_req(generics.closest_preceding_finger_path.replace(":id", id), node);
}

export default { get_successor, closest_preceding_finger };
