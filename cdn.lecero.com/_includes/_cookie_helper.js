// blacklist specific fields from
var data_blacklist = [
    'ckm_key', // should be provided on short form page
    'ckm_campaign_id', // should be provided on short form page
    'ckm_subid', // should be provided on short form page
    'ckm_subid_2', // should be provided on short form page
    'form_cap_type', // should be provided on short form page
    // 'program', // should be provided on short form page
    'source', // should be provided on short form page
    'next_url', // needs to be regenerated based on field input
    'tcpa', // must re-authorize on every offer form submit
    'double_opt', // must re-authorize on every offer form submit
    'controller', // we don't need to store this
    'leadid_token', // this needs to regenerate every time form loads
    'universal_leadid', // this needs to regenerate every time form loads
    'Desired_Start_Date' // needs to be regenerated on per offer basis
];

// get url parameters
function append_url_parameters_to_prometheus_data()
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    var data = {};
    for (var i = 0; i < sURLVariables.length; i++) {
        if ( sURLVariables != '' )
        {
            var sParameterName = sURLVariables[i].split('=');
            data[sParameterName[0]] = decodeURIComponent(sParameterName[1]);
        }
    }
    append_prometheus_data(data);
}

// append prometheus cookie
function append_prometheus_data( data )
{
    for(var key in data)
    {
        if($.inArray(key, data_blacklist) >= 0)
        {
            debug('deleted keys: ' + key);
            delete data[key];
        }
    }
    var prometheus_data = $.extend(get_prometheus_data(), data);

    // cookieize data
    $.cookie("prometheus-form-data", JSON.stringify(prometheus_data), { expires: 1, path: '/' });
}

// append prometheus cookie
function append_atlas_results( data )
{
    // create new dictionary for only information we need within data object
    // (stashing everything is not possible as it hits cookie size limit)
    var campus_offer_data = {};
    campus_offer_data['school_name'] = data[0].school_name;
    campus_offer_data['campus_list'] = [];
    for( var campus_index = 0; campus_index < data[0].campus_list.length; campus_index++ )
    {
        var campus = campus_offer_data['campus_list'][campus_index];
        var data_campus = data[0].campus_list[campus_index];
        campus = {};
        campus['brand_id'] = data_campus.brand_id;
        campus['campus_id'] = data_campus.id;
        campus['campus_name'] = data_campus.campus_content.name;
        campus['address'] = data_campus.campus_content.address1;
        campus['city'] = data_campus.campus_content.city;
        campus['state'] = data_campus.campus_content.subnational;
        campus['postal_code'] = data_campus.campus_content.postal_code;
        campus['offers'] = [];
        for( var offer_index = 0; offer_index < data[0].campus_list[campus_index].offers.length; offer_index++ )
        {
            var offer = campus['offers'][offer_index];
            var data_offer = data_campus.offers[offer_index];
            offer = {};
            offer['campus_name'] = data_offer.campus_name;
            offer['offer_name'] = data_offer.name;
            offer['offer_id'] = data_offer.id;
            offer['exclusive'] = data_offer.exclusive;
            campus['offers'].push(offer);
        }
        campus_offer_data['campus_list'].push(campus);
    }


    // cookieize data
    $.cookie("prometheus-query-results", JSON.stringify(campus_offer_data), { expires: 1, path: '/' });
}

// get prometheus data
function get_prometheus_data()
{
    return get_cookie_data('prometheus-form-data');
}

function get_cookie_data(key)
{
    var data = {};
    if ( $.cookie(key) != undefined )
    {
        data = JSON.parse($.cookie(key));
    }
    return data;
}

// map submitted offers to field
var map_submitted_offers = function()
{
    var data = get_prometheus_data();
    var submitted_offers = {'submitted_offer_ids': []};
    if ( data['submitted_offer_ids'] != undefined && data['submitted_offer_ids'].length > 0 )
    {
        submitted_offers['submitted_offer_ids'] = data['submitted_offer_ids'];
    }
    submitted_offers['submitted_offer_ids'].push(data['offer_id']);
    append_prometheus_data(submitted_offers);
};

// DELETE OFFER ID FROM COOKIE ON OFFER SUBMIT!!!!!!
var delete_offer_id_from_prometheus_data = function()
{
    var data = get_prometheus_data();
    delete data['offer_id'];
    $.cookie("prometheus-form-data", JSON.stringify(data), { path: '/' });
};