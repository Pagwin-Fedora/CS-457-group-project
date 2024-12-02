import crypto from "node:crypto";
import { Buffer } from 'node:buffer';

const sha1 = crypto.hash.bind(null, "sha1");

/**
    * @param {string} str
    * @param {integer} bits - number of bits the return type will have
    * @returns {integer}
*/
export function string_to_id(str, bits) {
    // bad things happen if we end up with more than 2^64 nodes
    const ret = Buffer.from(sha1(str), 'hex').readBigUint64BE();
    return ret % Math.pow(2, bits);
}

/** 
    * @param {integer} id
    * @param {integer} lower_bound
    * @param {integer} upper_bound
    * @returns {boolean}
*/
export function id_in_range(id, lower_bound, upper_bound) {
    if (min < max) {
        return min < id && max > id;
    }
    else {
        return id < max || id > min;
    }
}

export const get_successor_path = "/successor";
export const closest_preceding_finger_path = "/close_prec_finger/:id";
export const find_predecessor_path = "/find_predecessor"

export default { string_to_id, id_in_range, get_successor_path, closest_preceding_finger_path, find_predecessor_path }
