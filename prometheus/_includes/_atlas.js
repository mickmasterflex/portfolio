// set global vars
var atlas_base_url = 'http://atlas.neutronnetwork.com';
var atlas_offer_api = '/api/v1/offers/search_education/';
var atlas_form_api = '/api/v1/offers/offer_form_fields/';
var proton_base_url = 'http://proton.neutroninteractive.com';
var proton_content_api = '/api/v1/content/all/';
var sources = 'proton';
var exclusive = '';
var brand_name = '';
var offer_type = '';
var form_url = '';

// school search
var atlas_search = function(result_function)
{
    var prometheus_data = get_prometheus_data();
    var cip = prometheus_data['cip'];
    var zip = prometheus_data['zip_code'];
    var postal_code = prometheus_data['postal_code'];
    var adid = prometheus_data['adid'];
    var email = prometheus_data['email'];
    var submitted_offer_ids = prometheus_data['submitted_offer_ids'];
    var atlas_query = atlas_base_url + atlas_offer_api + '?';
    if ( cip != undefined && cip.length > 0 )
    {
        atlas_query +=  '&cip=' + cip;
    }
    if ( zip != undefined && zip.length > 0 )
    {
        atlas_query +=  '&postal=' + zip;
    }
    if ( postal_code != undefined && postal_code.length > 0 )
    {
        atlas_query +=  '&postal=' + postal_code;
    }
    if ( adid != undefined && adid.length > 0 )
    {
        atlas_query +=  '&adid=' + adid;
    }
    if ( email != undefined && email.length > 0 )
    {
        email = encodeURIComponent(email);
        atlas_query +=  '&email_address=' + email;
    }
    if ( sources != undefined && sources.length > 0 )
    {
        atlas_query +=  '&sources=' + sources;
    }
    if ( submitted_offer_ids != undefined && submitted_offer_ids.length > 0 )
    {
        atlas_query += '&exclude_sister_brands_by_offer_id=' + submitted_offer_ids
    }
    $.getJSON( atlas_query, result_function )
        .fail(function( jqxhr, textStatus, error )
        {
            var err = textStatus + ", " + error;
            debug("Request Failed: " + err);
        })
        .error(function()
        {
            debug('error');
        });

};
// form fields
var atlas_form_fields = function(offer_id)
{
    var controller = 'ProtonController';
    var form_api_url = atlas_base_url + atlas_form_api + '?' + controller + '=' + offer_id;
    // ajax atlas call
    $.getJSON( form_api_url, function( data )
    {
        for( var i = 0; i < data[offer_id].length; i++ )
        {
            var field = data[offer_id][i];
            _form_field_factory(field, $(form_id + ' #render_form_fields'));
        }

        // prepop fields
        prepop();

        get_offer_content(offer_id);

        $('#postal_code').mask('99999', {placeholder: 'e.g. 99999'});
        $('#phone').attr('placeholder', 'e.g. 999-999-9999');
        $('#phone_home').attr('placeholder', 'e.g. 999-999-9999');
        $('#alt_phone').attr('placeholder', 'e.g. 999-999-9999');
        $('#cell_phone').attr('placeholder', 'e.g. 999-999-9999');
        $('#cell').attr('placeholder', 'e.g. 999-999-9999');
        $('#mobile').attr('placeholder', 'e.g. 999-999-9999');
        $('#address').attr("placeholder", "e.g. 1024 Oak Street");
        $('#address1').attr("placeholder", "e.g. 1024 Oak Street");
        $('#email').attr("placeholder", "e.g. example@example.com");
    });
};
// content
var get_offer_content = function(offer_id)
{
    $('.content_block').empty();
    $('.tcpa').empty();
    var proton_query = proton_base_url + proton_content_api + '?offer_id=' + offer_id;
    var description = '';
    var tcpa = '';

    // inject leadid service if exists
    _leadid_service_inject();

    $.getJSON(proton_query, function(data)
    {
        var content = data.data.content;
        var short_description = content.brand.short_description;

        $('.offer_content .content_block').append( '<div class="content_title"></div><div class="content_text"></div>');
        var descriptions = undefined;
        descriptions = content.brand.descriptions;
        if ( descriptions == undefined )
        {
            descriptions = content.campus.descriptions;
        }
        $.each(descriptions, function(key, value){
            $('.content_text').append(value);
        });
        var is_leadid = $('#leadid_token');
        if ( is_leadid.length > 0 )
        {
            tcpa = '<input type="hidden" id="leadid_tcpa_disclosure" /><label for="leadid_tcpa_disclosure">' + content.offer.tcpa + '</label>';
        }
        else
        {
            tcpa = content.offer.tcpa;
        }
        brand_name = content.brand.brand_name;
        var campus_name = content.campus.name;
        var campus_street = content.campus.address1;
        var campus_city = content.campus.city;
        var campus_state = content.campus.subnational;
        var campus_address = campus_street + ' ' + campus_city + ', ' + campus_state;
        var campus_address_url = encodeURIComponent(campus_address);
        var offer_name = content.offer.display_name;
        var brand_logo = content.brand.logos.medium[0].url;
        var brand_name_banner = brand_name;
        if ( content.brand.banners )
        {
            brand_name_banner = '<img src="' + content.brand.banners.original[0].url + '" alt="' + brand_name + '" />';
        }

        $('.tcpa').append( tcpa );

        if ( typeof new_offer_layout != 'undefined' && new_offer_layout == 'true' )
        {
            $('.offer_title h1').html(offer_name);
            $('.offer_title h2').html(
                brand_name
                + ' &#8226; '
                + campus_city
                + ', '
                + campus_state
            );

            $('.offer_logo').html(
                '<img src="' + brand_logo + '" alt="' + brand_name + '" width="100" height="100" />'
            );

            $('.offer_short_desc').html(
                short_description + ' ... <a href="#MoreOfferContent">Read&nbsp;More&nbsp;&raquo</a>'
            );

            $('.offer_address').html(campus_address);
            $('.offer_google_map').html(
                '<iframe width="425" height="350" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?f=q&amp;source=s_q&amp;hl=en&amp;geocode=&amp;q=' + campus_address_url + '&amp;t=m&amp;z=14&amp;output=embed&zoom=&zoom=20"></iframe>'
            );

            $('.offer_full_desc_heading').html('About ' + brand_name);
        }

        $('.offer_content .title').html(
            '<h1>'
            + brand_name_banner
            + '</h1>'
        );
        $('.content_title').html(
            '<h3><span class="offer_em">Campus:</span> '
            + campus_name
            + '</h3>'
            + '<h4>'
            + offer_name
            + '</h4>'
        );
    })
        .fail(function() {
            window.location.href = next_no_offers_url;
        });
    $('.atlas_loader').fadeOut(0);
    $('#offer_wrap').fadeIn(300);
};

// if leadid is required, set hidden field and tcpa accordingly
var _leadid_service_inject = function()
{
    var leadid_script = $('[id = LeadiDscript]');
    if (leadid_script.length > 0)
    {
        leadid_script.remove();
    }

    var is_leadid = $('#leadid_token');
    if (is_leadid.length > 0)
    {
        $('body').append(
            '<script id="LeadiDscript" type="text/javascript">(function() { var s = document.createElement(\'script\'); s.id = \'LeadiDscript_campaign\'; s.type = \'text/javascript\'; s.async = true; s.src = (document.location.protocol + \'//d1tprjo2w7krrh.cloudfront.net/campaign/ee034284-86cf-7941-c130-4454dcd50975.js\'); var LeadiDscript = document.getElementById(\'LeadiDscript\'); LeadiDscript.parentNode.insertBefore(s, LeadiDscript);})();</script><noscript><img src=\'//create.leadid.com/noscript.png?lac=5ac0a3c3-cecd-47d1-f83e-aea19e30bec7&lck=ee034284-86cf-7941-c130-4454dcd50975\' /></noscript>'
        );
    }
};

// reset leadid after each lead submit
var _leadid_service_reset = function()
{
    var leadid_script = $('#LeadiDscript');
    if (leadid_script.length > 0)
    {
        $('body').append(
            '<script id="LeadiDscript" type="text/javascript">(function() { var s = document.createElement(\'script\'); s.id = \'LeadiDscript_campaign\'; s.type = \'text/javascript\'; s.async = true; s.src = (document.location.protocol + \'//d1tprjo2w7krrh.cloudfront.net/campaign/ee034284-86cf-7941-c130-4454dcd50975.js?f=reset\'); var LeadiDscript = document.getElementById(\'LeadiDscript\'); LeadiDscript.parentNode.insertBefore(s, LeadiDscript);})();</script><noscript><img src=\'//create.leadid.com/noscript.png?lac=5ac0a3c3-cecd-47d1-f83e-aea19e30bec7&lck=ee034284-86cf-7941-c130-4454dcd50975\' /></noscript>'
        );
    }
};

// dispatch

// helper methods
// default text field structure
var _text_field = function( field )
{
    var label = '<label for="' + field.name + '">' + field.label + ' <em class="form-req-mark">*</em></label>';
    var input = '<input type="text" class="validate_text" id="' + field.name + '" name="' + field.name + '" ' + ((field.required != undefined && field.required == true) ? 'required' : '') + ' />';
    var html = '<span class="form-element">' + label + input + '</span>';
    return html;
};
// default select field structure
var _select_field = function( field )
{
    var option_list = '';

    $.each(field.options, function(i, option){
        option_list = option_list + '<option value="' + option.value + '">' + option.option + '</option>';
    });

    var label = '<label for="' + field.name + '">' + field.label + ' <em class="form-req-mark">*</em></label>';
    var options = '<option value="">Choose One:</option>' + option_list;
    var select = '<select id="' + field.name + '" name="' + field.name + '" class="validate_select" ' + ((field.required != undefined && field.required == true) ? 'required' : '') + '>' + options + '</select>';
    var html = '<span class="form-element">' + label + select + '</span>';
    return html;
};
// default checkbox field structure
var _checkbox_field = function( field )
{
    var label = '<label for="' + field.name + '">' + field.label + ' <em class="form-req-mark">*</em></label>';
    var input = '<span class="custom"><input checked="checked" type="checkbox" class="required" id="' + field.name + '" name="' + field.name + '" ' + ((field.required != undefined && field.required == true) ? 'required' : '') + ' /></span>';
    var html = '<span class="form-element checkbox">' + label + input + '</span>';
    return html;
};
// default hidden field structure
var _hidden_field = function( field )
{
    var html = '<input type="hidden" class="required" id="' + field.id + '" name="' + field.name + '" value="' + field.default + '" />';
    return html;
};
// renders out default field type structures into offer form
var _form_field_factory = function( field, location )
{
    // remove form element if field exists
    var found_element = location.find('#' + field.name);
    if (found_element.length > 0)
    {
        if (field.type == 'hidden')
        {
            found_element.remove();
        }
        else
        {
            found_element.parent().remove();
        }
    }

    if (field.type == 'text')
    {
        location.append(
            _text_field(field)
        );
    }
    else if (field.type == 'select')
    {
        location.append(
            _select_field(field)
        );
    }
    else if (field.type == 'checkbox')
    {
        location.append(
            _checkbox_field(field)
        );
    }
    else if (field.type == 'hidden')
    {
        location.append(
            _hidden_field(field)
        );
    }
};