$(function() {
    function grammar(number) {
        switch(number) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    const socket = io.connect();
    socket.emit('request');

    socket.on('queue', function(data) {
        if(data.position === 1) {
            $('.loader > .label').text('Loading your Burger');
        } else {
            $('.loader > .label').html('You\'re ' + data.position + grammar(data.position) + ' in the<br>Free Burger queue');
        }
    });

    socket.on('code', function(data) {
        $('.loader > .label').addClass('done').text(data.code);
        document.title = data.code;
        new Audio('sounds/burger.m4a').play();
    });

    socket.on('generation-error', function() {
        $('.loader > .label').removeClass('done').text('An error has occured. Feel free to send me an email at \'contact@scotow.com\' to help me improve this project.');
    });
});
