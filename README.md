# Chord project impl

This implementation only implements the base chord protocol described in section 4 of the paper. This means that it will not be able to handle concurrent joins or failures. (TODO: update readme in the event we implement section 5 of the paper).

## Running

### Running a single node

1. Install Nodejs/NPM
2. `npm install`
3. `node index.mjs`

### Docker compose instructions

TODO: need to make a Dockerfile and docker-compose.yml

### Stretch: Kubernetes instructions

TODO: need docker demo done first so we have something then we can Kubernetes for funnsies but this is definitely a stretch

## Project Structure

### `index.mjs`

Entrypoint for the program and place where details like how the key value lookup works on a given node will live.

### `chord_generic.mjs`

Helper functions and/or constants which don't fit under specifically client or server operations.

### `chord_client.mjs`

Functions which implement calling the rpc methods that the server provides. Used by the server for some things.

### `chord_server.mjs`

Describes all the logic necessary to respond to a given client http request and provides a method to attach handlers to an express app.

## Depdendencies

### Express

Used for http routing due to not being certain of if NodeJS's server routing is worth anything.

### sqlite3 (package)

Used to implement the per node key value store. Could be used for other things if needed.
