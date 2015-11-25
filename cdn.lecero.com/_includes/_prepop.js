// data mapper
var cake_to_proton_mapper = {
    // cake:proton
    'email_address': 'email',
    'phone_home': 'phone',
    'zip_code': 'postal_code',
    'level_education': 'education_level'
};

// map data function
var map_data = function(data, prometheus_data, mapper)
{
    for(var key in prometheus_data)
    {
        // no mapping required use case
        if(key in data)
        {
            prometheus_data[key] = prometheus_data[key].replace(/\+/g, ' ');
            data[key] = prometheus_data[key];
        }
        // mapping required use case
        if(key in mapper)
        {
            // check prometheus_data for mapped key
            if(mapper[key] in prometheus_data)
            {
                data[key] = prometheus_data[mapper[key]];
            }
            else
            {
                // check if key in prometheus_data -> then map to mapper key
                if(key in prometheus_data)
                {
                    data[mapper[key]] = prometheus_data[key];
                }
            }
        }
    }
    return data;
};

// prepop form json
function pop_form_json_from_prometheus_data( data )
{
    var prometheus_data = get_prometheus_data();
    data = map_data(data, prometheus_data, cake_to_proton_mapper);
    // line below causes an issue when mapping cake fields to proton in that it
    // also adds the unneeded cake specific fields to proton submits.
    // when we want to enable the ability to map proton fields to cake we will need to re-enable this line
    // data = map_data(data, prometheus_data, invert_dict(cake_to_proton_mapper));
    return data;
};

// prepop from data storage
var prepop = function()
{
    // get form json
    var form_json = get_form_json(form_id);
    // prepop form json with prometheus data
    form_json = pop_form_json_from_prometheus_data(form_json);
    // prepop fields
    for( var key in form_json )
    {
        // if prepop_hidden var is defined, convert prepopped fields into hidden fields
        if ( prepop_hidden.length > 0 && prepop_hidden == 'true' ) {
            if ( form_json[key].length > 0 )
            {
                // this will need to be resolved so we aren't explicitly listing keys
                if ( form_id != '#flex_form' )
                {
                    if ( (key != 'education_level') && (key != 'email_address') && (key != 'phone_home') && (key != 'zip_code') )
                    {
                        $('[id=' + key + ']').remove();
                        $('label[for=' + key + ']').remove();
                        $('#render_form_fields').append(
                            '<input type="hidden" class="required" id="'
                            + key
                            + '" name="'
                            + key
                            + '" value="'
                            + form_json[key]
                            + '" />'
                        );
                    }
                    else
                    {
                        $('#' + key).val();
                    }
                }
                else
                {
                    if ( key != 'education_level' )
                    {
                        $('[id=' + key + ']').remove();
                        $('label[for=' + key + ']').remove();
                        $('label.radio').remove();
                        $('#render_form_fields').append(
                            '<input type="hidden" class="required" id="'
                            + key
                            + '" name="'
                            + key
                            + '" value="'
                            + form_json[key]
                            + '" />'
                        );
                    }
                    else
                    {
                        $('#' + key).val();
                    }
                }
            }
        }
        else
        {
            $('#' + key).val(form_json[key]);
        }


    }
};


// invert mapper
var invert_dict = function (obj) {

    var new_obj = {};

    for (var prop in obj) {
        if(obj.hasOwnProperty(prop)) {
            new_obj[obj[prop]] = prop;
        }
    }

    return new_obj;
};

var getPositionJsonZip = function(zipcode, status)
{

    //make google call
    var geocoder = new google.maps.Geocoder();
    if (geocoder)
    {
        geocoder.geocode( { 'address': zipcode}, function(results, status)
        {
            if (status == google.maps.GeocoderStatus.OK)
            {
                parse_google_results(results, status);
            }
            else
            {
                debug("Geocode was not successful for the following reason: " + status);
            }
        });
    }

};

var parse_google_results = function(results, status)
{
    var city = '';
    var state = '';
    var zip = '';

    var get_value_from_geo_dict = function(geo_dict, key)
    {
        for (var i=0; i<geo_dict.length; i++)
        {
            var item = geo_dict[i];
            if (item['types'][0] == key)
            {
                if ( key == 'locality' )
                {
                    return item['long_name'];
                }
                else
                {
                    return item['short_name'];
                }
            }
        }
    };

    city = get_value_from_geo_dict(results[0]['address_components'], 'locality');
    state = get_value_from_geo_dict(results[0]['address_components'], 'administrative_area_level_1');
    zip = get_value_from_geo_dict(results[0]['address_components'], 'postal_code');


    if (status == google.maps.GeocoderStatus.OK)
    {
        var addressDict = {
            'city': city,
            'state': state,
            'zip': zip,
            'niceformat': results[0].formatted_address
        };
        // debug(addressDict);
        if (typeof(neutronFormUpdateGeo) === 'function')
        {
            neutronFormUpdateGeo(addressDict);
        }
        else
        {
            debug('neutronFormUpdateGeo method not implmented!');
        }
    }
    else
    {
        debug.log("Geocoding failed: " + status);
    }
};

// Geolocation based on zip
var neutronFormUpdateGeo = function(addressDict)
{
    $.support.cors = true;

    //Update the input field
    $('#city').val(addressDict['city']);
    $('#state').val(addressDict['state']);

};