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
// debug
{% include _debug.js %}
// form post handler
{% include _post_form.js %}
// submit handler
{% include _submit.js %}
// atlas query
{% include _atlas.js %}
// form preopop
{% include _prepop.js %}
// next url handler
{% include _next_url.js %}

$(document).ready(function()
{
    // runtime init
    $('.atlas_loader').fadeIn(300);
    $('#offer_wrap').fadeOut(0);
    // append url params
    append_url_parameters_to_prometheus_data();
    // atlas search
    var prometheus_data = get_prometheus_data();
    var offer_id = null;
    if( 'offer_id' in prometheus_data )
    {
        offer_id = prometheus_data['offer_id'];
        // atlas field generation
        atlas_form_fields(offer_id);
    }
    else
    {
        var result_function = function(schools)
        {
            if ( schools.offers.length > 0 )
            {
                var submitted_offer_ids = prometheus_data[0];
                for ( var i = 0; i < schools.offers.length; i++ )
                {
                    // set offer type and form url for use in linkout offers
                    offer_type = schools.offers[i].type;
                    form_url = schools.offers[i].form_url;

                    // if offer id matches id in submitted list, do nothing and move onto next offer
                    if ( submitted_offer_ids == undefined || submitted_offer_ids.indexOf(schools.offers[i].id) == -1 )
                    {
                        if ( schools.offers[i].exclusive == 'true' && submitted_offer_ids.length > 0 )
                        {
                            // it is exclusive and we have submitted offers, don't do anything -> continue to next school
                        }
                        else
                        {
                            // if offer type is linkout set next url to form url
                            if ( typeof offer_type != 'undefined' && offer_type == 'linkout' )
                            {
                                if ( typeof form_url != 'undefined' )
                                {
                                    next_url = form_url;
                                }
                            }
                            else
                            {
                                offer_id = schools.offers[i].id;
                                exclusive = schools.offers[i].exclusive;
                                brand_name = schools.school_name;
                                break;
                            }
                        }
                    }
                }
                if ( offer_id != null )
                {
                    $('#render_form_fields').empty();
                    atlas_form_fields(offer_id);
                }
                else
                {
                    if ( typeof offer_type != 'undefined' && offer_type == 'linkout' )
                    {
                        window.location.href = next_url;
                    }
                    else
                    {
                        var data = get_prometheus_data();
                        data['controller'] = 'PrometheusNoOfferController';
                        data['referrer_url'] = document.referrer;
                        if ( data['email']  == undefined )
                        {
                            data['email'] = '';
                        }
                        post_url = 'http://valkyrie.neutronnetwork.com/api/post_school_lead/';
                        _post_form(data);
                        window.location.href = next_no_offers_url;
                    }
                }
            }
            else
            {
                var data = get_prometheus_data();
                data['controller'] = 'PrometheusNoOfferController';
                data['referrer_url'] = document.referrer;
                if ( data['email']  == undefined )
                {
                    data['email'] = '';
                }
                post_url = 'http://valkyrie.neutronnetwork.com/api/post_school_lead/';
                _post_form(data);
                window.location.href = next_no_offers_url;
            }
        };
        atlas_search(result_function);
    }

});