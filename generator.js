// Setup
var MAX_ATTEMPTS = 50;
var attempts = 0;

var SURVEY_CODES = [22365, 23911];

// Utils
function pad(num, size) {
    var it = String(num);
    while (it.length < size) it = '0' + it;
    return it;
}

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

var casper = require('casper').create();

casper.start('https://www.bkvousecoute.fr');

casper.then(function() {
    this.click('input[type=submit]');
});

casper.then(function() {
    var date = new Date();
    var day = date.getUTCDate();
    var month = date.getUTCMonth() + 1; //months from 1-12
    var year = date.getUTCFullYear();

    this.fillSelectors('#surveyEntryForm', {
        '#SurveyCode':	String(randomElement(SURVEY_CODES)),
        '#InputDay':	String(day),
        '#InputMonth':	pad(month, 2),
        '#InputYear':	String(year).slice(-2),
        '#InputHour':	'12',
        '#InputMinute': String(10 + Math.floor(Math.random() * 25))
    }, false);

    this.click('input[type=submit]');
});

casper.continueUntilCode = function() {
    attempts++;
    if(attempts >= MAX_ATTEMPTS) this.die('Too many attempts.', 1);

    this.then(function() {
        if(this.getTitle() === 'Mon expérience BK - Merci') {
            this.echo(this.fetchText('.ValCode').split(':').reverse()[0].trim());
        } else {
            this.click('#NextButton');
            this.continueUntilCode();
        }
    });
};

casper.continueUntilCode();

casper.run();
