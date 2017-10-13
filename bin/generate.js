#!/usr/bin/env node

require('../lib/generator.js').generateCode()
.then((code) => {
    console.log(code);
})
.catch((errorCode) => {
    console.error(`An error has occured while generating a code. Casper exit code: ${errorCode}`);
    process.exit(errorCode);
});
