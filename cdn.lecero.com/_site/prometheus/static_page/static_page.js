// includes
// data storage
/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch(e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

        // Write

        if (arguments.length > 1 && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) === undefined) {
            return false;
        }

        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, { expires: -1 }));
        return !$.cookie(key);
    };

}));

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
// debug
// Debug.
var debug = function( message ) {
    if ( typeof( console ) !== 'undefined' && console != null ) console.log( message );
};

$(document).ready(function()
{

});