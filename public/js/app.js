$(function() {
    function onError() {
        $('.loader > .video').remove();
        $('.loader > .label').text('An error has occurred. Sorry.');
    }

    function getCode() {
        $.ajax(
            {
                url: '/code',
                method: 'POST',
                success: function(data) {
                    switch(data.status) {
                        case 'success':
                            $('.loader > .label').addClass('done').text(data.code);
                            break;
                        case 'waiting':
                            $('.loader > .label').text('A Burger is already generating. Please wait a bit.');
                            setTimeout(getCode, 3 * 1e3);
                            break;
                        default:
                            onError();
                            break;
                    }
                },
                error: onError
            }
        );
    }

    getCode();
});