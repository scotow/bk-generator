$(function() {
    function onError() {
        $('.loader > .video').remove();
        $('.loader > .label').text('An error has occurred. Sorry.');
    }

    $.ajax(
        {
            url: '/code',
            method: 'POST',
            success: function(data) {
                if(data.status === 'success') {
                    $('.loader > .label').addClass('done').text(data.code);
                } else {
                    onError();
                }
            },
            error: onError
        }
    );
});