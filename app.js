const shell = require('shelljs');
const express = require('express')
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const PORT = 4002;
const VALIDATION_LIMIT = 24 * 60 * 60 * 1e3; // 24h.
const CODE_GENERATOR_COMMAND = 'node /root/casperjs/casperjs/bin/casperjs.js /root/casperjs/casperjs/bk-code-generator.js';

app.use(express.static(__dirname + '/public'));

let codePool = [];
let queue = [];
let surveying = false;

io.on('connection', socket => {
    socket.on('request', () => {
        askCode(socket);
    });

    socket.on('disconnect', () => {
        let placeInQueue = queue.indexOf(socket);
        if(~placeInQueue) queue.splice(placeInQueue, 1);
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

    shell.exec(CODE_GENERATOR_COMMAND, {silent: true}, (code, stdout, stderr) => {
        // If casperJS succeed.
        if(code) return;

        // Set state to ready.
        surveying = false;

        // Send code to the first person in queue, otherwise put it in the pool.
        codeGenerated({code: stdout.trim(), creation: Date.now()});

        // Generate another code if needed.
        if(queue.length) {
            queue.forEach(socket => {
                socket.emit('queue', {position: queue.length});
            });
            setTimeout(generateCode, 500);
        }
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

server.listen(PORT, function () {
    console.log(`bk.scotow.com started on port ${PORT}.`);
});