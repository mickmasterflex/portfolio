// next url stuff here
var handle_next_url = function()
{
    // check if next)url variable has been set for the prometheus page
    if ( next_url.length > 0 )
    {
        // adding usecase to next url handler so we can pass form fields as url params if needed
        var next_location = next_url;

        if ( get_prometheus_data()['exclusive_complete'] != undefined && get_prometheus_data()['exclusive_complete'] == 'true' )
        {
            next_location = next_no_offers_url;
            if ( brand_name == 'Ross Medical Education Center' || brand_name == 'Westwood College' || brand_name == 'Penn Commercial Business and Technology School' || brand_name == 'Redstone College' )
            {
                var brand_name_url = brand_name.replace( /\s+/g, '-').toLowerCase();
                next_location = '/thanks/' + brand_name_url + '.html';
            }
        }
        else
        {
            if ( typeof edu_next_url != 'undefined' && edu_next_url == 'true' )
            {
                next_location = edu_url;

                if ( typeof append_form_fields != 'undefined' && append_form_fields == 'true' )
                {
                    next_location = next_location + '&' + $.param(get_prometheus_data());
                }
            }
            else if ( typeof edu_next_url != 'undefined' && edu_next_url == 'false' )
            {
                next_location = next_location + $('#zip_code').val() + '&adid=' + $('#adid').val();
            }
            else
            {
                if ( typeof append_form_fields != 'undefined' && append_form_fields == 'true' )
                {
                    next_location = next_location + $(form_id).serializeAll();
                }
                if ( typeof follow_next != 'undefined' && follow_next == 'next' )
                {
                    if ( get_prometheus_data()['next'] != undefined )
                    {
                        next_location = decodeURIComponent(get_prometheus_data()['next']);
                    }
                }
            }
        }
        window.location.href = next_location;
    }
    else if ( use_form_action.length > 0 )
    {
        window.location.href = $(form_id).attr('action') + $(form_id).serializeAll();
    }

    if ( $('#next_url:checked').val() != undefined && $('#next_url:checked').val().length > 0 )
    {
        var next_location = $('#next_url:checked').val();
        window.location.href = next_location;
    }
};