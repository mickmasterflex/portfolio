// global vars
var content = '';
var offer_id = '';

// includes
// validation
{% include _validation_helper.js %}
{% include external/jquery.validate.min.js %}
{% include external/additional-methods.min.js %}
{% include _validation.js %}
// masked input
{% include external/jquery.mask.min.js %}
// data storage
{% include external/jquery.cookie.js %}
{% include _cookie_helper.js %}
// atlas brands query
{% include _atlas_brands.js %}
// debug
{% include _debug.js %}
// form post handler
{% include _post_form.js %}
// submit handler
{% include _submit.js %}
// form preopop
{% include _prepop.js %}
// next url handler
{% include _next_url.js %}

$(document).ready(function()
{
    // append url params
    append_url_parameters_to_prometheus_data();

    // run atlas brand search on offer_function
    atlas_brand_generate();

});