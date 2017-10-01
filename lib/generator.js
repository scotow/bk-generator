// Imports
const shell = require('shelljs');

// Setup
const CODE_GENERATOR_COMMAND = `casperjs ${__dirname}/../casper-generator.js`;

function generateCode() {
    return new Promise((resolve, reject) => {
        shell.exec(CODE_GENERATOR_COMMAND, {silent: true}, (code, stdout, stderr) => {
            // If casperJS failed.
            if(code) {
                reject(code);
                return
            }
            // If casperJS succeed.
            resolve(stdout.trim());
        });
    });
}

module.exports.generateCode = generateCode;
