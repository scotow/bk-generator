function pad(num, size) {
    var it = String(num);
    while (it.length < size) it = '0' + it;
    return it;
}

var casper = require('casper').create();

casper.then(function() {
    this.click('input[type=submit]');
});

casper.then(function() {
    this.sendKeys('#SurveyCode', '22365');

    var date = new Date();
    var day = date.getUTCDate();
    var month = date.getUTCMonth() + 1; //months from 1-12
    var year = date.getUTCFullYear();

    this.fillSelectors('#surveyEntryForm', {
        '#SurveyCode':	'22365',
        '#InputDay':	String(day),
        '#InputMonth':	pad(month, 2),
        '#InputYear':	String(year).slice(-2),
        '#InputHour':	'12',
        '#InputMinute': String(10 + Math.floor(Math.random() * 25))
    }, false);

    this.click('input[type=submit]');
});

casper.continueUntilCode = function() {
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