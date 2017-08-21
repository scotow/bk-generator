const express = require('express');
const shell = require('shelljs');

const app = express();
app.use(express.static(__dirname + '/public'));

const PORT = 4002;

app.post('/code', function(req, res) {
    shell.exec('node /root/casperjs/casperjs/bin/casperjs.js /root/casperjs/casperjs/bk-code-generator.js', {silent: true}, function(code, stdout, stderr) {
        if(code && code !== 0) {
            res.status(404).send('Not found');
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(
                {
                    status: 'success',
                    code: stdout.trim()
                }
            ));
        }
    });
});

app.listen(PORT, function () {
    console.log(`bk.scotow.com started on port ${PORT}.`);
});