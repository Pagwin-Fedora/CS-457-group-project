
// finger_table[0] is successor (1 after us)
// finger_table[1] is 2 after us
// finger_table[2] is 4 after us
// etc.
const finger_table = [];

const lookup_table = new Map();

let our_id = null;

export function add_endpoints(app) {
    app.get("/pred/:id", find_predecessor);
    return app;
}

function join_chord() {

}

//
function find_predecessor(req, res) {
    const { id } = req.params;
    for (let i = 0; i < finger_table.length; i++) {
        if (finger_table[i])
    }
    //
    for (let i = 0; i < finger_table.length - 1; i++) {
        if (finger_table[i + 1] < finger_table[i] || finger_table[i + 1] > id) {

        }
    }
    // call to largest node lt id in finger table asking them to find the predecessor
    res.end();

}
