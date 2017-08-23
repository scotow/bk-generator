function grammar(number) {
    switch(number) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

$(function() {
    const socket = io.connect();
    socket.emit('request');

    socket.on('queue', function(data) {
        $('.loader > .label').text(
            data.position === 1
            ? 'Loading your Burger'
            : 'You are ' + data.position + grammar(data.position) + '\nin the Free Burger queue'
        );
    });

    socket.on('code', function(data) {
        $('.loader > .label').addClass('done').text(data.code);
        document.title = data.code;
    });
});