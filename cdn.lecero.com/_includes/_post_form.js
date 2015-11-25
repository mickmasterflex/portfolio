// Post form data to Proton, Yodel, and Cake.
var _post_form = function( data ) {
    debug( 'Data: ' + data );
    $.ajax({
        url: post_url,
        type: 'POST',
        data: data,
        async: false,
        success: function( response ) {
            debug( 'Response: ' + response );

            return false;
        },
        error: function(event, response, ajaxSettings, thrownError) {
            // alert(thrownError);
        },
        timeout: 30000 // sets timeout to 30 seconds
    });
}