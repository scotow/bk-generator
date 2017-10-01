require('../lib/generator.js').generateCode()
.then((code) => {
    console.log(code);
})
.catch((casperErrorCode) => {
    console.error(`An error has occured while generating a code. Casper exit code: ${casperErrorCode}`);
    process.exit(casperErrorCode);
});
