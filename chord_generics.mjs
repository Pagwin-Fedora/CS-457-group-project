import crypto from "node:crypto";
import { Buffer } from 'node:buffer';

const sha1 = crypto.hash.bind(null, "sha1");

export function string_to_id(str, bits) {
    // bad things happen if we end up with more than 2^64 nodes
    const ret = Buffer.from(sha1(str), 'hex').readBigUint64BE();
    return ret % Math.pow(2, bits);
}

export const get_successor_path = "/successor";
export const closest_preceding_finger_path = "/close_prec_finger/:id";

export default { string_to_id, get_successor_path, closest_preceding_finger_path }
