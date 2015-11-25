var $ = jQuery.noConflict();

// Set Posting, Atlas Offer API, and Atlas Form API URLs
var post_short_form_url = 'http://valkyrie.neutronnetwork.com/api/post_lead/';
var post_offer_form_url = 'http://valkyrie.neutronnetwork.com/api/post_school_lead/';
var atlas_base_url = 'http://atlas.neutronnetwork.com';
var atlas_offer_api = '/api/v1/offers/search_education_by_brand/';
var atlas_form_api = '/api/v1/offers/form_fields/';

// Define vars
var data = {};
var atlasQuery = '';
var submitted_offers = [];
var max_submitted_offers = 3;

// data mapper
var cake_to_proton_mapper = {
    // cake:proton
    'email_address': 'email',
    'phone_home': 'phone',
    'zip_code': 'postal_code',
    'level_education': 'education_level'
};
var postal_field = $('#zip_code');

// Check whether multistep already exists. If so, use existing multistep, else create empty object
var multistep = multistep || {};

$( document).ready(function(){

    multistep.init();
    $('#thankyou_1').hide(0);
    $('#thankyou_2').hide(0);
    $('#thankyou_3').hide(0);
    $('#step_5 .header-title.thankyou_2').hide(0);
    $('#step_5 .header-title.thankyou_3').hide(0);
    $( ".school-submit").hide(0);
    $( ".school-submit-end").hide(0);
    $('[class=field_error]').hide(0);

});

// multistep namespace
multistep = {

    campus_offers: {}, // define for use in listing campus offer ids
    offers: {}, // this is the atlas result
    campus_forms: {},
    campus_common_form_fields: '', // define form fields to populate from common_form_fields method
    adid: GetURLParameter('adid'), // define adid

    text_field: function( field )
    {
        return '<span class="form-element">'
        + '<label for="' + field.name + '">' + field.label + ' <em class="form-req-mark">*</em></label>'
        + '<input type="text" class="validate_text" id="' + field.name + '" name="' + field.name + '" />'
        + '<span class="field_error" style="display:none">Please Review this Field</span>'
        + '</span>';
    },

    select_field: function( field )
    {
        var option_list = '';

        $.each(field.options, function(i, option){
            option_list = option_list + '<option value="' + option.value + '">' + option.option + '</option>';
        });

        return '<span class="form-element">'
            + '<label for="' + field.name + '">' + field.label + ' <em class="form-req-mark">*</em></label>'
            + '<select id="' + field.name + '" name="' + field.name + '" class="validate_select">'
            + '<option value="">Choose One:</option>'
            + option_list
            + '</select>'
            + '<span class="field_error" style="display:none">Please Select an Option</span>'
            + '</span>';
    },

    checkbox_field: function( field )
    {
        return '<span class="form-element checkbox">'
            + '<label for="' + field.name + '">' + field.label + ' <em class="form-req-mark">*</em></label>'
            + '<span class="custom"><input type="checkbox" class="required" id="' + field.name + '" name="' + field.name + '" /></span>'
            + '<span class="field_error" style="display:none">This Checkbox is Required</span>'
            + '</span>';
    },

    hidden_field: function( field )
    {
        return '<input type="hidden" class="required" id="' + field.id + '" name="' + field.name + '" value="' + field.default + '" />';
    },

    form_field_factory: function( field, location )
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
                multistep.text_field(field)
            );
        }
        else if (field.type == 'select')
        {
            location.append(
                multistep.select_field(field)
            );
        }
        else if (field.type == 'checkbox')
        {
            location.append(
                multistep.checkbox_field(field)
            );
        }
        else if (field.type == 'hidden')
        {
            location.append(
                multistep.hidden_field(field)
            );
        }
    },

    debug: function( message )
    {
        if ( typeof( console ) !== 'undefined' && console != null ) console.log( message );
    },

    init: function()
    {

        // Multistep functionality (different for each step)
        $('#multistep_form').find('.step').each(function( i )
        {
            var id = '#step_' + (i + 1);
            var next_id = '#step_' + (i + 2);

        });

    },

    getPositionJson: function(position) {
        location.latitude = position.coords.latitude;
        location.longitude = position.coords.longitude;

        var geocoder = new google.maps.Geocoder();
        var latLng = new google.maps.LatLng(location.latitude, location.longitude);
        if (geocoder) {
            geocoder.geocode({ 'latLng': latLng}, function (results, status) {

                // do something with results
                multistep.parse_google_results(results, status);
            });
        }

    },

    getPositionJsonZip: function(zipcode, status) {

        //make google call
        var geocoder = new google.maps.Geocoder();
        if (geocoder) {
            geocoder.geocode( { 'address': zipcode}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    multistep.parse_google_results(results, status);
                } else {
                    multistep.debug("Geocode was not successful for the following reason: " + status);
                }
            });
        }

    },

    parse_google_results: function(results, status) {
        var city = '';
        var state = '';
        var zip = '';

        var get_value_from_geo_dict = function(geo_dict, key) {
            for (var i=0; i<geo_dict.length; i++) {
                var item = geo_dict[i];
                if (item['types'][0] == key) {
                    return item['short_name'];
                }
            }
        };

        city = get_value_from_geo_dict(results[0]['address_components'], 'locality');
        state = get_value_from_geo_dict(results[0]['address_components'], 'administrative_area_level_1');
        zip = get_value_from_geo_dict(results[0]['address_components'], 'postal_code');


        if (status == google.maps.GeocoderStatus.OK) {
            var addressDict = {
                'city': city,
                'state': state,
                'zip': zip,
                'niceformat': results[0].formatted_address
            };
            // multistep.debug(addressDict);
            if (typeof(neutronFormUpdateGeo) === 'function') {
                neutronFormUpdateGeo(addressDict);
            } else {
                multistep.debug('neutronFormUpdateGeo method not implmented!');
            }
        }
        else {
            multistep.debug.log("Geocoding failed: " + status);
        }
    },

    // Validate.
    validate: function( $field, type, no_ignore )
    {

        // the validation status
        var $status = $field.siblings('.validation_status');

        // if no status yet
        if (!$status.length)
        {
            // write it in
            /* $field.parent().append('<span class="validation_status"></span>'); */
            var $status = $field.siblings('.validation_status');
        }

        // validation type
        switch(type)
        {

            // email
            case 'email':
                // the value
                var value = $field.attr('value');
                // match it
                var valid = value.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
                // done and done
                break;

            // phone
            case 'phone':
                // combine-a-nator!
                var field_count = 0;
                var touched_count = 0;
                var value = '';
                $field.parent().find('.validate_phone').each(function() {
                    value += $(this).attr('value');
                    field_count++;
                    if ($(this).hasClass('touched')) touched_count++;
                });
                /*
                 Accepted Phone Types:
                 +13 (555) 123-4567x2345
                 (444)123-4567
                 (444) 123-4567
                 444-123-4567
                 444-123-4567x1231
                 (800)344-4444
                */
                // if they've touched each of the fields or no ignore's allowed (for final validation)
                if (field_count == touched_count || no_ignore) var valid = value.match(/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/);
                // else ignore it
                else var valid = 'ignore';
                // done and done
                break;

            // text
            case 'text':
                // the value
                var value = $field.attr('value');
                // trimmed has length?
                var valid = value && value.length;
                // done and done
                break;

            // textarea
            case 'textarea':
                // the value
                var value = $field.attr('value');
                // trimmed has length?
                var valid = value && value.length;
                // done and done
                break;

            // select
            case 'select':
                // the value
                var value = $field.attr('value');
                // trimmed has length?
                var valid = value && value.length;
                // done and done
                break;

            // zip code
            case 'zip':
                // the value
                var value = $field.attr('value');
                // match it
                var valid = value.match(/[0-9]{5}(\-[0-9]{4})?/);
                // done and done
                break;

            // checkbox
            case 'checkbox':
                // the value
                var value = $field.attr('checked');
                // trimmed has length?
                var valid = ( value ) ? true : false;
                // done and done
                break;

            // radio
            case 'radio':
                // the value
                var value = $field.attr('checked');
                // trimmed has length?
                var valid = ( value ) ? true : false;
                // done and done
                break;

            // file
            case 'file':
                // the value
                var value = $field.attr('value');
                // trimmed has length?
                var valid = value && value.length;
                // Check file type
                if ( valid ) {
                    var type = multistep.get_file_extension( value );
                    if ( type === 'pdf' || type === 'doc' || type === 'docx' || type === 'txt' ) {
                        valid = true;
                    } else {
                        valid = false;
                    }
                }
                // done and done
                break;
        }

        // if ignore
        if (valid == 'ignore')
        {
            // and stop here
            return valid;
        }

        // if valid
        if (valid)
        {
            // remove label and input classes
            $field.removeClass('input_error').siblings('label').removeClass('label_error');
            $field.siblings('.field_error').fadeOut(0);
        }
        // invalid
        else
        {
            // add error highlighting
            $field.addClass('input_error').siblings('label').addClass('label_error');
            $field.siblings('.field_error').fadeIn(300);
        }

        // Null.
        if ( valid == null )
        {
            // add error highlighting
            $field.addClass('input_error').siblings('label').addClass('label_error');
            // Set valid to false.
            valid = false;
            $field.siblings('.field_error').fadeIn(300);
        }

        // return valid state
        return valid;
    },

    // Validate Step.
    validate_step: function( step )
    {
        var id = '#step_' + step;
        var next_id = '#step_' + (step + 1);
        multistep.debug( id );

        $(id).find('.field_error').hide(0);

        // final validation
        field_count = 0;
        valid_count = 0;
        var error_labels = [];

        // Loop through form elements to validate.
        $(id).find('.form-element').each(function() {

            $(this).children('label').next().each(function() {

                var className = $(this).attr('class');

                switch ( className ) {

                    // Validate Text
                    case 'validate_text': case 'validate_text input_error':

                    field_count++;
                    var valid = multistep.validate($(this), 'text');
                    if (valid) {
                        valid_count++;
                    } else {
                        var label = $(this).prev('label').text().split(' *');
                        error_labels.push( 'Please Review this Field' );
                    }

                    break;

                    // Validate Textarea
                    case 'validate_textarea': case 'validate_textarea input_error':

                    field_count++;
                    var valid = multistep.validate($(this), 'textarea');
                    if (valid) {
                        valid_count++;
                    } else {
                        var label = $(this).prev('label').text().split(' *');
                        error_labels.push( 'Please Review this Field' );
                    }

                    break;

                    // Validate Email
                    case 'validate_email': case 'validate_email input_error':

                    field_count++;
                    var valid = multistep.validate($(this), 'email');
                    if (valid) {
                        valid_count++;
                    } else {
                        var label = $(this).prev('label').text().split(' *');
                        error_labels.push( 'Please Enter a Valid Email' );
                    }

                    break;

                    // Validate Phone
                    case 'validate_phone': case 'validate_phone input_error':

                    field_count++;
                    var valid = multistep.validate($(this), 'phone', true);
                    if (valid) {
                        valid_count++;
                    } else {
                        var label = $(this).prev('label').text().split(' *');
                        error_labels.push( 'Please Enter a Valid Phone Number' );
                    }

                    break;

                    // Validate Zip
                    case 'validate_zip': case 'validate_zip input_error':

                    field_count++;
                    var valid = multistep.validate($(this), 'zip');
                    if (valid) {
                        valid_count++;
                    } else {
                        var label = $(this).prev('label').text().split(' *');
                        error_labels.push( 'Please Enter a Valid Zip Code' );
                    }
                    break;

                    // Validate Select
                    case 'validate_select': case 'validate_select input_error':
                    field_count++;
                    var valid = multistep.validate($(this), 'select');
                    if (valid) {
                        valid_count++;
                    } else {
                        var label = $(this).prev('label').text().split(' *');
                        error_labels.push( 'Please Select an Option' );
                    }

                    break;

                    // Validate Checkbox
                    case 'validate_checkbox': case 'validate_checkbox input_error':
                    field_count++;
                    var valid = multistep.validate($(this), 'checkbox');
                    if (valid) {
                        valid_count++;
                    } else {
                        var label = $(this).prev('label').text().split(' *');
                        error_labels.push( 'Please Check an Option' );
                    }
                    break;

                }

            });

        });

        // Error msg.
        if ( valid_count != field_count ) {
            // and stop form submit
            return false;
        } else {
            return true;
        }
    },

    // Get File Ext.
    get_file_extension: function( filename ) {
        var ext = /^.+\.([^.]+)$/.exec( filename );
        return ext == null ? "" : ext[1];
    },

    addFieldsToData: function(form_data)
    {
        var sfData = form_data?JSON.parse('{"' + form_data.replace(/&/g, '","').replace(/=/g,'":"') + '"}',
            function(key, value) { return key===""?value:decodeURIComponent(value) }):{};
        for(key in sfData)
        {
            data[key] = decodeURIComponent(sfData[key]).replace(/\+/g, ' ');
        }
    },

    getFieldNames: function(field_list)
    {
        var field_names = [];
        for(index in field_list)
        {
            field_names = field_names.concat(field_list[index].name);
        }
        return field_names;
    },

    // submit Atlas query
    submitAtlas: function()
    {

        // validate step
        if( multistep.validate_step('1') )
        {
            // Define vars
            data['adid'] = multistep.adid;
            var sub_campaign = $('#sub_campaign').val();
            data['area_of_interest'] = $('#area_of_interest').val();
            data['level_education_school'] = $('#level_education_school').val();

            $('#step_1').fadeOut(0);
            $('html, body').animate({ scrollTop: 0 }, 0);

            // Call school_search
            if( data['level_education_school'] == 'No HS Diploma/GED' )
            {
                $('#step_2').fadeIn(300);
            }
            else
            {
                $('#step_2').fadeIn(300);
                multistep.school_search(data['area_of_interest'], data['zip_code'], 'proton', data['adid']);
            }

            // fire event for Atlas submit
            ga('send', 'event', 'Multistep', 'Submit', 'Step1ZipProgram');
        }

    },

    // submit shortform
    submitShortform: function()
    {

        // validate step
        if( multistep.validate_step('2') )
        {
            $('#step_2').fadeOut(0);
            $('html, body').animate({ scrollTop: 0 }, 0);
            if( $.isEmptyObject(multistep.campus_offers) )
            {
                if( data['level_education_school'] == 'No HS Diploma/GED' )
                {
                    $('#step_5').fadeIn(300);
                    $('#thankyou_3').show();
                    $('#step_5 .header-title.thankyou_3').show();
                    //move header outside
                    $('.wrap').before($('.header-title'));

                    // fire event for no HS diploma/GED
                    ga('send', 'event', 'Multistep', 'Visit', 'NoGEDCloseScreen');
                }
                else
                {
                    $('#step_5').fadeIn(300);
                    $('#thankyou_2').show();
                    $('#step_5 .header-title.thankyou_2').show();
                    //move header outside
                    $('.wrap').before($('.header-title'));

                    $('.other-offers-wrap .row').html(
                        '<script type="text/javascript">vm_load({"displayId": "13338", "publisherId": "35635", "campaign": "24874", "md": "1", "location": data["zip_code"], "degreeLevel": "3", "targetElement": document.getElementsByClassName("other_offer_results")[1]})</script>'
                    );

                    // fire event for no offers found
                    ga('send', 'event', 'Multistep', 'Visit', 'NoOffersCloseScreen');
                }
            }
            else
            {
                $('#step_3').fadeIn(300);
            }

            var shortform_data = $('#shortform').serializeAll();
            shortform_data += '&' + serialize(data, {});
            multistep.debug( 'Shortform Data: ' + shortform_data );

            $.ajax({
                url: post_short_form_url,
                type: 'POST',
                data: shortform_data,
                dataType: 'json',
                async: false,
                success: function( response ) {
                    multistep.debug( 'Response: ' + response );
                    multistep.addFieldsToData(shortform_data);
                    multistep.common_form_fields();
                    $('#offer #render_school_form').empty();
                    multistep.school_search(data['area_of_interest'], data['zip_code'], 'proton', data['adid']);

                    // fire event for shortform submit
                    ga('send', 'event', 'Multistep', 'Submit', 'Step2ShortForm');
                }
            });

        }

    },

    // submit common fields
    submitCommon: function()
    {

        // validate step
        if( multistep.validate_step('3') )
        {
            $('#step_3').fadeOut(0);
            $('html, body').animate({ scrollTop: 0 }, 0);
            $('#step_4').fadeIn(300);

            var common_data = $('#common').serializeAll();
            multistep.addFieldsToData(common_data);

            // fire event for Common Form Fields
            ga('send', 'event', 'Multistep', 'Submit', 'Step3AddInfo');

        }

    },

    // submit offer
    submitOffer: function()
    {

        // validate step
        if( multistep.validate_step('4') )
        {
            // create data object for offer specific data
            var field_names = [];

            // get an offer
            var offer_id = Object.keys(multistep.campus_forms['ProtonController']['offer_specific_fields'])[0];
            var offer_specific_fields = multistep.campus_forms['ProtonController']['offer_specific_fields'][offer_id];
            var offer_common_fields = multistep.campus_forms['ProtonController'].generic_fields;
            // get common fields
            field_names = field_names.concat(multistep.getFieldNames(offer_common_fields));
            // get specific fields
            field_names = field_names.concat(multistep.getFieldNames(offer_specific_fields));
            // get offer specific data
            var offer_data = {};
            for (index in Object.keys(data))
            {
                key = Object.keys(data)[index];
                proton_key = key;
                // check if in mapper
                if(key in cake_to_proton_mapper)
                {
                    proton_key = cake_to_proton_mapper[key];
                }
                // check if in data
                if(field_names.indexOf(proton_key) >= 0)
                {
                    offer_data[proton_key] = data[key];
                }
            };
            offer_data['adid'] = multistep.adid;
            // build string with specific fields
            var specific_fields = $('#offer').serializeAll();
            // concat post strings
            var form_data = specific_fields + '&' + serialize(offer_data, cake_to_proton_mapper);
            multistep.debug( 'Data: ' + form_data );

            $.ajax({
                url: post_offer_form_url,
                type: 'POST',
                data: form_data,
                dataType: 'json',
                async: false,
                success: function( response ) {
                    multistep.debug( 'Response: ' + response );

                    $('#offer #render_school_form').append(
                        // Lead Impact conversion script
                        '<script type="text/javascript" src="//cts.adssend.net/conversion?cpid=21724"></script>'
                        + '<script type="text/javascript" src="https://tracking.trafficvance.com/?id=1G2B12G5E84G72471485&fetch=0&value=0"></script>'
                        // Traffic Vance conversion pixel
                        + '<noscript>'
                        + '<div style="display: inline;">'
                        + '<img height="1" width="1" style="border-style: none;" alt="" src="https://tracking.trafficvance.com/?id=1G2B12G5E84G72471485&fetch=1&value=0" />'
                        + '</div>'
                        + '</noscript>'
                    );

                    var submitted_offer = {};

                    for (var $brand_index = 0; $brand_index < multistep.offers.length; $brand_index++)
                    {
                        var school = multistep.offers[$brand_index];
                        var campuses = school.campus_list;

                        for (var $campus_index = 0; $campus_index < campuses.length; $campus_index++)
                        {
                            var campus = campuses[$campus_index];
                            var offers = campus.offers;

                            for (var $offer_index = 0; $offer_index < offers.length; $offer_index++)
                            {
                                var offer = offers[$offer_index];
                                if ( offer.id == $('#campus_offer').val() )
                                {
                                    submitted_offer['school_name'] = school.school_name;
                                    submitted_offer['campus_name'] = campus.location;
                                    submitted_offer['offer_name'] = offer.name;
                                    submitted_offer['logo'] = offer.logo;
                                    submitted_offer['offer_id'] = offer.id;
                                    submitted_offer['brand_id'] = offer.brand_id;

                                    submitted_offers.push(submitted_offer);

                                    // fire event for each offer submit
                                    ga('send', 'event', 'Multistep', 'Submit', 'Step4SchoolSubmit' + submitted_offers.length);
                                }

                            }
                        }
                    }

                    multistep.submitted_offer_content();

                    // fire event for number of offers (brand level)
                    ga('send', 'event', 'Multistep', 'SchoolOfferCount', "'" + multistep.offers.length + "'");

                    // get next offer
                    $('#step_4').fadeOut(0);
                    $('html, body').animate({ scrollTop: 0 }, 0);
                    $('#loaderImage').fadeIn(300);
                    $('#offer #render_school_form').empty();
                    $('#offer #render_school_form_specific').empty();
                    multistep.school_search_requery(data['area_of_interest'], data['zip_code'], 'proton', multistep.adid);

                }
            });
        }

    },

    // Search LMS
    school_search: function( area_of_interest, postal_code, sources, adid )
    {
        // need to reset between each school query
        multistep.campus_offers = {};
        multistep.offers = null;

        // set atlas offer query url
        atlasQuery = atlas_base_url + atlas_offer_api + '?cip=' + area_of_interest + '&postal=' + postal_code + '&sources=' + sources + '&adid=' + adid;

        if ('email' in Object.keys(data))
        {
            atlasQuery += '&email=' + data['email'];
        }

        $.getJSON( atlasQuery, multistep.school_search_process)
            .fail(function( jqxhr, textStatus, error )
            {
                var err = textStatus + ", " + error;
                multistep.debug("Request Failed: " + err);
            })
            .error(function()
            {
                multistep.debug('error');
            });

    },

    // School Search Requery -> we recursively call this until no more offers exist
    school_search_requery: function( area_of_interest, postal_code, sources, adid )
    {
        // need to reset between each school query
        multistep.campus_offers = {};
        multistep.offers = null;

        // set atlas offer query url
        atlasQuery = atlas_base_url + atlas_offer_api + '?cip=' + area_of_interest + '&postal=' + postal_code + '&sources=' + sources + '&adid=' + adid;

        if ('email' in Object.keys(data))
        {
            atlasQuery += '&email=' + data['email'];
        }

        $.getJSON( atlasQuery, function(data)
            {

                multistep.school_search_process(data);

                if (isEmpty($('#render_school_form')))
                {
                    // fade in #step_5 (thank you) if no more offers exist
                    $('#loaderImage').fadeOut(0);
                    $('#step_5').fadeIn(300);
                    $('#thankyou_1').show();
                    //move header-title outside
                    $('.wrap').before($('.school-submit-end'));
                    $( ".school-submit" ).fadeOut(0);
                    $( ".school-submit-end" ).fadeIn( "easeInCirc" );
                    $('.other-offers-wrap .row').html(
                        '<script type="text/javascript">vm_load({"displayId": "13338", "publisherId": "35635", "campaign": "24874", "md": "1", "location": data["zip_code"], "degreeLevel": "3", "targetElement": document.getElementsByClassName("other_offer_results")[0]})</script>'
                    );
                }
                else
                {
                    // fade #step_4 (next offer) back in
                    $('#loaderImage').fadeOut(0);
                    $('#step_4').fadeIn(300);
                    //move header-title outside
                    $('.wrap').before($('.school-submit'));
                    $( ".school-submit" ).fadeIn( "easeInCirc" );
                }
            })
            .fail(function( jqxhr, textStatus, error )
            {
                var err = textStatus + ", " + error;
                multistep.debug("Request Failed: " + err);
            })
            .error(function()
            {
                multistep.debug('error');
            });

    },

    school_search_process: function(data)
    {
        multistep.offers = data;
        // multistep.debug(data);

        // grab first brand
        if ( data.length > 0 )
        {

            multistep.set_campus_offers(data);

            multistep.add_school_fields(data);

        };

        multistep.debug(multistep.campus_offers['ProtonController']);

        for(controller in multistep.campus_offers)
        {
            var form_api_url = atlas_base_url + atlas_form_api + '?' + controller + '=' + multistep.campus_offers[controller];
            $.getJSON( form_api_url, function( data )
            {
                multistep.campus_forms[controller] = data;
            });
        }
    },

    set_campus_offers: function(data)
    {
        for ( var $brand_index = 0; $brand_index < data.length; $brand_index++ )
        {
            var campuses = data[$brand_index].campus_list;
            for ( var $campus_index = 0; $campus_index < campuses.length; $campus_index++ )
            {
                var campus = campuses[$campus_index];
                for ( var $offer_index = 0; $offer_index < campus.offers.length; $offer_index++ )
                {
                    var offer = campus.offers[$offer_index];

                    if(offer.lms_source in multistep.campus_offers)
                    {
                        multistep.campus_offers[offer.lms_source] += ',' + offer.id;
                    }
                    else
                    {
                        multistep.campus_offers[offer.lms_source] = offer.id;
                    }

                };
            }
        }
    },

    add_school_fields: function(data)
    {
        if ( (submitted_offers.length < max_submitted_offers) && (submitted_offers.length != data.length) )
        {
            var school = null;

            for ( var $i = 0; $i < data.length; $i++ )
            {
                school = data[$i];
                var is_submitted = false;

                if ( submitted_offers.length > 0 )
                {
                    for ( var $submit_index = 0; $submit_index < submitted_offers.length; $submit_index++ )
                    {
                        var submitted_offer = submitted_offers[$submit_index];
                        if ( school.id == submitted_offer['brand_id'] )
                        {
                            is_submitted = true;
                        }
                        if ( is_submitted )
                        {
                            break;
                        }
                    }
                }

                if ( is_submitted == false )
                {
                    break;
                }
            }

            // if brand id is in list of submitted offers. if so, remove from multistep.offers and skip adding to object
            if (school)
            {
                // empty school description modal on offer requery
                $('#schooldesc').empty();

                // add offer content to top of school offer submission step
                $('.offer_content').html(
                        '<div class="school-heading small-12 small-centered columns"><div class="school-logo"><span class="helper"></span><img class="" src="'
                        + school.logo
                        + '"/></div><h4 class="section-title">'
                        + school.school_name
                        + '</h4>'
                        + '</div>'
                );

                // add brand description to proper location
                $('.school-content-left .section-desc').html(
                    '<div class="brand_description"></div>'
                    + '<a id="schooldesc__opener" class="btn show-for-small-only"><h5>See School Description</h5></a>'
                );

                // generate school form fields to offer submit step
                var campuses = school.campus_list;
                if ( campuses.length > 0 )
                {
                    $('#offer #render_school_form').append(
                            '<label for="school_campus">Choose a Campus <em class="form-req-mark">*</em></label>'
                            + '<select id="school_campus" name="school_campus" class="validate_select"><option value="">Select Your Campus:</option></select>'
                            + '<label for="campus_offer">Choose a Program <em class="form-req-mark">*</em></label>'
                            + '<select id="campus_offer" name="campus_offer" class="validate_select"><option value="">Select a Program:</option></select>'
                    );

                    var brand_description = campuses[0].offers[0].description;
                    $('.brand_description').append(brand_description.substr(0, brand_description.indexOf('</p>') + 4) + '<a id="schooldesc__opener">Read More &raquo;</a>');
                    $('#schooldesc').append('<div class="title row"><h1>' + school.school_name + ' Description</h1><button id="schooldesc__closer">X</button></div><div class="content-area">' + brand_description + '</div>');

                    $('[id=schooldesc__opener]').click(function() {
                        $('#schooldesc').fadeIn('easeInCirc');
                        $('#privacy__modal-backdrop').fadeIn('fast');
                    });
                    $("[id=schooldesc__closer]").click(function() {
                        $('#schooldesc').fadeOut('fast');
                        $('#privacy__modal-backdrop').fadeOut('fast');
                    });

                    for ( var $campus_index = 0; $campus_index < campuses.length; $campus_index++ )
                    {
                        var campus = campuses[$campus_index];

                        var offers = campus.offers;

                        $('#school_campus').change(offers, function()
                        {
                            $('#campus_offer').empty();
                            $('#render_school_form_specific').empty();
                            $('.form-submit').empty();
                            $('.tcpa').empty();
                            $('#campus_offer').append(
                                '<option value="">Select a Program:</option>'
                            );
                            // need to get index of campus to then get offers
                            for ( var $i = 0; $i < multistep.offers.length; $i++ )
                            {
                                var brand_campuses = multistep.offers[$i].campus_list;
                                for ( var $brand_index = 0; $brand_index < brand_campuses.length; $brand_index++ )
                                {
                                    if ( brand_campuses[$brand_index].id == $('#school_campus').val() )
                                    {
                                        for ( var $offer_index = 0; $offer_index < brand_campuses[$brand_index].offers.length; $offer_index++ )
                                        {
                                            $('#campus_offer').append(
                                                    '<option value="'
                                                    + brand_campuses[$brand_index].offers[$offer_index].id
                                                    + '">'
                                                    + brand_campuses[$brand_index].offers[$offer_index].name
                                                    + ' - '
                                                    + brand_campuses[$brand_index].offers[$offer_index].level_id
                                                    + '</option>'
                                            );
                                        }
                                        var is_leadid = $('#leadid_token');
                                        if (is_leadid.length > 0)
                                        {
                                            $('.tcpa').html('<input  type="hidden" id="leadid_tcpa_disclosure" /><label for="leadid_tcpa_disclosure">' + brand_campuses[$brand_index].offers[0].tcpa + '</label>');
                                        }
                                        else
                                        {
                                            $('.tcpa').html(brand_campuses[$brand_index].offers[0].tcpa);
                                        }
                                        break;
                                    }
                                }
                            }
                        });
                        $('#campus_offer').change(function()
                        {
                            // removing offer_id (#9998), leadid_tcpa_disclosure (#9999), and leadid_token hidden fields when someone changes program (resolve issue with multiple instances of each hidden field)
                            $('#9998').remove();
                            $('#9999').remove();
                            $('#leadid_token').remove();
                            $('#multi_next_4').remove();

                            multistep.specific_form_fields('ProtonController', $('#campus_offer').val());

                            for ( var $i = 0; $i < multistep.offers.length; $i++ )
                            {
                                var brand_campuses = multistep.offers[$i].campus_list;
                                for ( var $brand_index = 0; $brand_index < brand_campuses.length; $brand_index++ )
                                {
                                    if ( brand_campuses[$brand_index].id == $('#school_campus').val() )
                                    {
                                        var is_leadid = $('#leadid_token');
                                        if (is_leadid.length > 0)
                                        {
                                            $('.tcpa').html('<input type="hidden" id="leadid_tcpa_disclosure" /><label for="leadid_tcpa_disclosure">' + brand_campuses[$brand_index].offers[0].tcpa + '</label>');
                                        }
                                        else
                                        {
                                            $('.tcpa').html(brand_campuses[$brand_index].offers[0].tcpa);
                                        }
                                        break;
                                    }
                                }
                            }

                            // show submit button only on campus offer change
                            $('.form-submit').append(
                                '<input class="multi_next green show-success" id="multi_next_4" type="button" onclick="multistep.submitOffer()" value="Submit" />'
                                + '<span class="sub-required">(Fields marked with <em class="form-req-mark">*</em> are required)</span>'
                            );
                            $('.show-success').show();

                            // inject leadid service if exists
                            multistep.leadid_service_inject();
                        });

                        $('#school_campus').append(
                                '<option value="'
                                + campus.id
                                + '">'
                                + campus.location
                                + '</option>'
                        );

                        if ( $('#school_campus option').length == 2 )
                        {
                            $('#school_campus :nth-child(2)').prop( 'selected', true );

                            if ( $('#school_campus option:selected').val() )
                            {
                                $('#campus_offer').empty();
                                $('#campus_offer').append(
                                    '<option value="">Select a Program:</option>'
                                );
                                // need to get index of campus to then get offers
                                for ( var $i = 0; $i < multistep.offers.length; $i++ )
                                {
                                    var brand_campuses = multistep.offers[$i].campus_list;
                                    for ( var $brand_index = 0; $brand_index < brand_campuses.length; $brand_index++ )
                                    {
                                        if ( brand_campuses[$brand_index].id == $('#school_campus').val() )
                                        {
                                            for ( var $offer_index = 0; $offer_index < brand_campuses[$brand_index].offers.length; $offer_index++ )
                                            {
                                                $('#campus_offer').append(
                                                        '<option value="'
                                                        + brand_campuses[$brand_index].offers[$offer_index].id
                                                        + '">'
                                                        + brand_campuses[$brand_index].offers[$offer_index].name
                                                        + ' - '
                                                        + brand_campuses[$brand_index].offers[$offer_index].level_id
                                                        + '</option>'
                                                );
                                            }
                                        }
                                    }
                                }
                            };
                        };

                    };
                };
            }
        }
    },

    // get host/post form
    common_form_fields: function()
    {
        var first_controller = 'ProtonController';
        var common_fields = [];
        $.each(multistep.campus_forms[first_controller].generic_fields, function(i, field)
        {
            common_fields.push(field);
        });

        if ( common_fields.length > 0 )
        {

            var controller_data = dataMap(data, cake_to_proton_mapper);

            for ( var $i = 0; $i < common_fields.length; $i++ )
            {
                var common_field = common_fields[$i];
                if ( common_field.name in controller_data ) {
                    // Do nothing with it
                }
                else
                {
                    multistep.form_field_factory(common_field, $('#common #render_form_here'));
                }
            }

        };

    },

    specific_form_fields: function( controller, offer_id )
    {
        var specific_fields = [];
        $.each(multistep.campus_forms[controller]['offer_specific_fields'][offer_id], function(i, field)
        {
            specific_fields.push(field);
        });

        if ( specific_fields.length > 0 )
        {

            for ( var $i = 0; $i < specific_fields.length; $i++ )
            {
                var specific_field = specific_fields[$i];
                multistep.form_field_factory(specific_field, $('#offer #render_school_form_specific'));
            }

        };

    },

    leadid_service_inject: function()
    {
        var leadid_script = $('#LeadiDscript');
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
    },

    submitted_offer_content: function()
    {
        var submitted_offer = submitted_offers[submitted_offers.length - 1];
        $('.school-wrap').append(
                '<div class="school columns">'
                + '<div class="logo ">'
                + '<img src="'
                + submitted_offer['logo']
                + '" name="'
                + submitted_offer['school_name']
                + '" />'
                + '</div>'
                + '<div class="details">'
                + '<div class="inner">'
                + '<h6>'
                + submitted_offer['school_name']
                + ' - '
                + submitted_offer['campus_name']
                + '</h6>'
                + '<p>'
                + submitted_offer['offer_name']
                + '</p>'
                + '</div>'
                + '</div>'
                + '</div>'
        );
    }
}

// Geolocation based on zip
var neutronFormUpdateGeo = function(addressDict)
{
    $.support.cors = true;

    //Update the input field
    data['city'] = addressDict['city'];
    data['state'] = addressDict['state'];
    data['zip_code'] = addressDict['zip'];

};

//Zipcode field has changed. Do something about the change
postal_field.blur(function()
{
    zipcode = postal_field.val();
    if (zipcode.length > 0) {
        multistep.getPositionJsonZip(zipcode);
    }
});

// Data Serializer
$.fn.serializeAll = function()
{
    var rselectTextarea = /^(?:select|textarea)/i;
    var rinput = /^(?:color|date|datetime|datetime-local|email|file|hidden|month|number|password|range|search|tel|text|time|url|week)$/i;
    var rCRLF = /\r?\n/g;

    var arr = this.map(function(){
        return this.elements ? jQuery.makeArray( this.elements ) : this;
    })
        .filter(function(){
            return this.name && !this.disabled &&
                ( this.checked || rselectTextarea.test( this.nodeName ) ||
                    rinput.test( this.type ) );
        })
        .map(function( i, elem ){
            var val = jQuery( this ).val();

            return val == null ?
                null :
                jQuery.isArray( val ) ?
                    jQuery.map( val, function( val, i ){
                        return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
                    }) :
                { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
        }).get();

    return $.param(arr);
}

function serialize(obj, mapper)
{
    var str = [];
    for(var p in obj)
    {
        key = p;
        value = obj[p];
        if(key in mapper)
        {
            key = mapper[key];
        }
        str.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    }

    return str.join("&");
}

function dataMap(object, mapper)
{
    var data = {};
    for(var item_key in object)
    {
        key = item_key;
        value = decodeURIComponent(object[item_key]).replace(/\+/g, ' ');
        if(key in mapper)
        {
            key = mapper[key];
        }
        data[key] = value;
    }
    return data;
}

function isEmpty( el ){
    return !$.trim(el.html())
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}