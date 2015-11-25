// global vars
var content = '';
var offer_id = '';

// includes
// data storage
{% include external/jquery.cookie.js %}
{% include _cookie_helper.js %}
// debug
{% include _debug.js %}
// atlas brands query
{% include _atlas_brands.js %}

$(document).ready(function()
{
    // runtime init
    $('.atlas_loader').fadeIn(300);
    $('#offer_wrap').fadeOut(0);

    // append url params
    append_url_parameters_to_prometheus_data();

    // run atlas brand search on result_function
    atlas_brand_search(result_function);

});