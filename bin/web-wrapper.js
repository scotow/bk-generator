#!/usr/bin/env node

const generator = require('../lib/generator.js');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const PORT = 4002;
const VALIDATION_LIMIT = 24 * 60 * 60 * 1e3; // 24h.

app.use(express.static(__dirname + '../public'));

let codePool = [];
let queue = [];
let surveying = false;

io.on('connection', socket => {
    socket.on('request', () => {
        askCode(socket);
    });

    socket.on('disconnect', () => {
        let placeInQueue = queue.indexOf(socket);
        if(~placeInQueue) {
            queue.splice(placeInQueue, 1);
            sendQueueUpdate();
        }
    });
});

function askCode(socket) {
    // Unstack codes if any and still valid.
    while(codePool.length > 0) {
        let code = codePool.shift();
        if(Date.now() < code.creation + VALIDATION_LIMIT) {
            socket.emit('code', code);
            return;
        }
    }

    // Otherwise queue the client and start generating a new code.
    queue.push(socket);
    socket.emit('queue', {position: queue.length});
    generateCode();
}

function generateCode() {
    // Cancel if already running a survey.
    if(surveying) return;

    surveying = true;

    function continueIfNeeded() {
        // Generate another code if needed.
        if(queue.length) {
            sendQueueUpdate();
            // Set state to ready.
            surveying = false;
            setTimeout(generateCode, 500);
        }
    }

    generator.generateCode()
    .then((code) => {
        // Send code to the first person in queue, otherwise put it in the pool.
        codeGenerated({code: code, creation: Date.now()});
        continueIfNeeded();
    })
    .catch(() => {
        codeGenerationFailed();
        continueIfNeeded();
    });
}

function codeGenerated(code) {
    // If someone is waiting for a code, send it to him.
    // Otherwise put it in the pool.
    if(queue.length) {
        let socket = queue.shift();
        socket.emit('code', code);
    } else {
        codePool.push(code);
    }
}

function codeGenerationFailed() {
    if(queue.length) queue.shift().emit('error');
}

function sendQueueUpdate() {
    queue.forEach((socket, index) => {
        socket.emit('queue', {position: index + 1});
    });
}

server.listen(PORT, console.log.bind(null, `bk-generator started on port ${PORT}.`));
