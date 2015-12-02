// set global vars
var atlas_base_url = 'http://atlas.neutronnetwork.com';
var atlas_brand_api = '/api/v1/offers/search_education_by_brand/';
var atlas_form_api = '/api/v1/offers/offer_form_fields/';
var sources = 'proton';
var brands = '';
var exclusive = '';
var brand_name = '';

// brand search
var atlas_brand_search = function(result_function)
{
    var prometheus_data = get_prometheus_data();
    var cip = prometheus_data['cip'];
    var zip = prometheus_data['zip_code'];
    var postal_code = prometheus_data['postal_code'];
    var adid = 'organic';
    var brand_id = prometheus_data['brand_id'];
    var email = prometheus_data['email'];
    var submitted_offer_ids = prometheus_data['submitted_offer_ids'];
    var atlas_query = atlas_base_url + atlas_brand_api + '?limit_per_brand=none';
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
    if ( brand_id != undefined && brand_id.length > 0 )
    {
        atlas_query +=  '&brand_id=' + brand_id;
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
// atlas brand generate
var atlas_brand_generate = function()
{
    // run form generation
    generate_form(form_fields);

    // run leadid service injection
    _leadid_service_inject();

    // define brand_index
    var brand_index = 0;

    // run campus change function
    campus_change(campuses, brand_index);

    // run program change function
    program_change(brand_index);

    var tcpa = '';
    var is_leadid = $('#leadid_token');
    if ( is_leadid.length > 0 )
    {
        tcpa = '<input type="hidden" id="leadid_tcpa_disclosure" /><label for="leadid_tcpa_disclosure">' + offer_tcpa + '</label>';
    }
    else
    {
        tcpa = offer_tcpa;
    }
    $('.tcpa').append( tcpa );
}
// generate form
var generate_form = function(data)
{
    for( var i = 0; i < data.length; i++ )
    {
        var field = data[i];
        _form_field_factory(field, $(form_id + ' #render_form_fields'));
    }

    // prepop fields
    prepop();

    // masking for various fields
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
}
// form fields
var atlas_form_fields = function(offer_id)
{
    var controller = 'ProtonController';
    var form_api_url = atlas_base_url + atlas_form_api + '?' + controller + '=' + offer_id;
    // ajax atlas call
    $.getJSON( form_api_url, function( data )
    {
        generate_form(data[offer_id]);
    });
};
// content
var get_brand_content = function()
{
    $('.content_block').empty();
    $('.tcpa').empty();
    var description = '';
    var tcpa = '';

    // inject leadid service if exists
    _leadid_service_inject();

    var short_description = content.brand.short_description;
    description = content.brand.descriptions[0];
    if ( description == undefined )
    {
        description = content.campus.descriptions[0];
    }
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

    $('.offer_content .content_block').append( '<div class="content_title"></div>' + description );
    $('.tcpa').append( tcpa );

    if ( typeof new_offer_layout != 'undefined' && new_offer_layout == 'true' )
    {
        $('.offer_title h1').html(brand_name);

        $('.offer_logo').html(
            '<img src="' + brand_logo + '" alt="' + brand_name + '" width="100" height="100" />'
        );

        $('.offer_short_desc').html(
            short_description + ' ... <a href="#MoreOfferContent">Read&nbsp;More&nbsp;&raquo</a>'
        );

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
    if ( $('.brand_logo') != undefined )
    {
        $('.brand_logo').html(
            '<h1>'
            + brand_name_banner
            + '</h1>'
        );
    }

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

// populate list of campuses for form
var list_campuses = function (campus_list, brand_index)
{
    // append campus list to campus-select based on atlas results
    for( var campus_index = 0; campus_index < campus_list.length; campus_index++ )
    {
        var campus = campus_list[campus_index];
        var campus_content = campus.campus_content;
        $('.campus-select:eq(' + brand_index + ')').append(
            '<option value="' + campus_content.id + '">' + campus_content.name + '</option>'
        );

        // run logic to change campus/program on campus-select change
        campus_change(campus_list, brand_index);
    }
};

// logic to change campus/program on campus-select change
var campus_change = function(campus_list, brand_index)
{
    $('.campus-select:eq(' + brand_index + ')').change(function()
    {
        var campus_id = $('.campus-select:eq(' + brand_index + ')').val();
        for( var campus_index = 0; campus_index < campus_list.length; campus_index++ ) {
            var test_campus = campus_list[campus_index];
            var test_campus_content = test_campus.campus_content;
            if (campus_id == test_campus_content.id) {
                var campus_street = test_campus_content.address1;
                var campus_city = test_campus_content.city;
                var campus_state = test_campus_content.subnational;
                var campus_address = campus_street + ', ' + campus_city + ', ' + campus_state;
                if ( (campus_street.length == 0 && campus_city.length == 0 && campus_state.length == 0) || (test_campus.location.indexOf('online') > -1) )
                {
                    campus_address = '';
                }
                var campus_address_url = encodeURIComponent(campus_address);
                // change campus specific address and google map
                $('.offer_title h2').html(
                    'Campus: '
                    + test_campus_content.name
                );
                if ( campus_address.length > 0 )
                {
                    $('.content_title').html(
                        '<h3>'
                        + '<span class="offer_em">Campus: </span>'
                        + test_campus_content.name
                        + '</h3>'
                        + '<div class="offer_address"></div>'
                    );
                }
                else
                {
                    $('.content_title').html(
                        '<h3>'
                        + '<span class="offer_em">Campus: </span>'
                        + test_campus_content.name
                        + '</h3>'
                    );
                }
                $('.offer_address').html(campus_address);
                $('.offer_google_map').html(
                    '<iframe width="425" height="350" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?f=q&amp;source=s_q&amp;hl=en&amp;geocode=&amp;q=' + campus_address_url + '&amp;t=m&amp;z=14&amp;output=embed&zoom=&zoom=20"></iframe>'
                );

                // empty program options
                $('.program-select:eq(' + brand_index + ')').empty();
                $('.program-select:eq(' + brand_index + ')').append(
                    '<option value>Select a Program</option>'
                );

                var certificate = [];
                var diploma = [];
                var associates = [];
                var bachelors = [];
                var masters = [];
                var doctorate = [];
                var unknown = [];
                // append program options to program-select based on selected campus
                for( var offer_index = 0; offer_index < test_campus.offers.length; offer_index++ )
                {
                    var offer = test_campus.offers[offer_index];
                    if (offer.level_id == 'Certificate')
                    {
                        certificate.push(offer);
                    }
                    else if (offer.level_id == 'Diploma')
                    {
                        diploma.push(offer);
                    }
                    else if (offer.level_id == 'Associates')
                    {
                        associates.push(offer);
                    }
                    else if (offer.level_id == 'Bachelors')
                    {
                        bachelors.push(offer);
                    }
                    else if (offer.level_id == 'Masters')
                    {
                        masters.push(offer);
                    }
                    else if (offer.level_id == 'Doctorate')
                    {
                        doctorate.push(offer);
                    }
                    else if (offer.level_id == 'Unknown')
                    {
                        unknown.push(offer);
                    }
                    exclusive = offer.exclusive;
                }
                if (certificate.length > 0)
                {
                    $('.program-select:eq(' + brand_index + ')').append(
                        '<optgroup label="Certificate"></optgroup>'
                    );
                    for( var offer_index = 0; offer_index < certificate.length; offer_index++ )
                    {
                        var offer = certificate[offer_index];
                        $('.program-select:eq(' + brand_index + ') optgroup[label=Certificate]').append(
                            '<option value="' + offer.id + '">' + offer.name + '</option>'
                        );
                    }
                }
                if (diploma.length > 0)
                {
                    $('.program-select:eq(' + brand_index + ')').append(
                        '<optgroup label="Diploma"></optgroup>'
                    );
                    for( var offer_index = 0; offer_index < diploma.length; offer_index++ )
                    {
                        var offer = diploma[offer_index];
                        $('.program-select:eq(' + brand_index + ') optgroup[label=Diploma]').append(
                            '<option value="' + offer.id + '">' + offer.name + '</option>'
                        );
                    }
                }
                if (associates.length > 0)
                {
                    $('.program-select:eq(' + brand_index + ')').append(
                        '<optgroup label="Associates"></optgroup>'
                    );
                    for( var offer_index = 0; offer_index < associates.length; offer_index++ )
                    {
                        var offer = associates[offer_index];
                        $('.program-select:eq(' + brand_index + ') optgroup[label=Associates]').append(
                            '<option value="' + offer.id + '">' + offer.name + '</option>'
                        );
                    }
                }
                if (bachelors.length > 0)
                {
                    $('.program-select:eq(' + brand_index + ')').append(
                        '<optgroup label="Bachelors"></optgroup>'
                    );
                    for( var offer_index = 0; offer_index < bachelors.length; offer_index++ )
                    {
                        var offer = bachelors[offer_index];
                        $('.program-select:eq(' + brand_index + ') optgroup[label=Bachelors]').append(
                            '<option value="' + offer.id + '">' + offer.name + '</option>'
                        );
                    }
                }
                if (masters.length > 0)
                {
                    $('.program-select:eq(' + brand_index + ')').append(
                        '<optgroup label="Masters"></optgroup>'
                    );
                    for( var offer_index = 0; offer_index < masters.length; offer_index++ )
                    {
                        var offer = masters[offer_index];
                        $('.program-select:eq(' + brand_index + ') optgroup[label=Masters]').append(
                            '<option value="' + offer.id + '">' + offer.name + '</option>'
                        );
                    }
                }
                if (doctorate.length > 0)
                {
                    $('.program-select:eq(' + brand_index + ')').append(
                        '<optgroup label="Doctorate"></optgroup>'
                    );
                    for( var offer_index = 0; offer_index < doctorate.length; offer_index++ )
                    {
                        var offer = doctorate[offer_index];
                        $('.program-select:eq(' + brand_index + ') optgroup[label=Doctorate]').append(
                            '<option value="' + offer.id + '">' + offer.name + '</option>'
                        );
                    }
                }
                if (unknown.length > 0)
                {
                    $('.program-select:eq(' + brand_index + ')').append(
                        '<optgroup label="Other"></optgroup>'
                    );
                    for( var offer_index = 0; offer_index < unknown.length; offer_index++ )
                    {
                        var offer = unknown[offer_index];
                        $('.program-select:eq(' + brand_index + ') optgroup[label=Other]').append(
                            '<option value="' + offer.id + '">' + offer.name + '</option>'
                        );
                    }
                }
            }
        }
    });
};

// program content on program-select change
var program_change = function(brand_index)
{
    // change offer_id hidden fields to program-select value
    $('.program-select:eq(' + brand_index + ')').change(function()
    {
        $('.offer_title h2 span').empty();
        $('.content_title h4').empty();
        $('[name=offer_id]').val($('.program-select:eq(' + brand_index + ')').val());
        $('.offer_title h2').append(
            '<span><br/>Program: '
            + $('.program-select:eq(' + brand_index + ') option:selected').text()
            + '</span>'
        );
        $('.content_title').append(
            '<h4>Program: '
            + $('.program-select:eq(' + brand_index + ') option:selected').text()
            + '</h4>'
        );
    });
};

// atlas search result function
var offer_function = function(brands)
{
    if ( brands.brands.length > 0 )
    {

        // set brand_name
        brand_name = brands.brands[0].school_name;

        // set offer_id to first brand/first/campus/first offer (to be used to get brand form fields)
        offer_id = brands.brands[0].campus_list[0].offers[0].id;

        // set content to first brand/first campus/first offer/metadata/content (brand content within
        // metadata is the same across all offers)
        content = brands.brands[0].campus_list[0].offers[0].metadata.content.data.content;

        // run content function based on content var set above
        get_brand_content();

        // empty form fields
        $('#render_form_fields').empty();

        // create list of campuses for brand
        $('#render_form_fields').append(
            '<span class="form-element">'
            + '<label for="campus-select">Select a Campus <em class="form-req-mark">*</em></label>'
            + '<select id="campus-select" name="campus-select" class="validate_select campus-select" required>'
            + '<option value>Select a Campus</option>'
            + '</select>'
            + '</span>'
        );
        // create list of offers for selected campus
        $('#render_form_fields').append(
            '<span class="form-element">'
            + '<label for="program-select">Select a Program <em class="form-req-mark">*</em></label>'
            + '<select id="program-select" name="program-select" class="validate_select program-select" required>'
            + '<option value>Select a Program</option>'
            + '</select>'
            + '</span>'
        );

        // get cookie data from atlas query
        var campus_list = brands.brands[0].campus_list;
        campus_list.sort(function(a,b)
        {
            if(a.location < b.location)
            {
                return -1;
            };
            if(a.location > b.location)
            {
                return 1;
            };
            return 0;
        });

        // populate list of campuses for form and run change campus logic
        var brand_index = 0;
        list_campuses(campus_list, brand_index);

        // change content for program on program-select change
        program_change(brand_index);

        // run form field generator based on offer_id set above
        atlas_form_fields(offer_id);

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

// dispatch
var result_function = function(brands)
{
    var brand_list = brands.brands;
    var atlas_results = $('#atlas_results');
    atlas_results.empty();
    if ( brand_list.length > 0 )
    {
        for ( var brand_index = 0; brand_index < brand_list.length; brand_index++ )
        {
            var brand_url = brand_list[brand_index].school_name;
            brand_url = brand_url.replace(/ /g, '-');
            brand_url = brand_url.replace(/'/g, '');
            brand_url = brand_url.replace(/:/g, '');
            brand_url = brand_url.toLowerCase();
            atlas_results.append(
                '<div class="brand">'
                + '<div class="school_info row">'
                + '<div class="school_logo medium-2 columns">'
                + '<img src="' + brand_list[brand_index].logo + '" alt="' + brand_list[brand_index].school_name + ' Logo" />'
                + '</div>'
                + '<div class="school_name_wrap medium-10 columns">'
                + '<h2 class="school_name">' + brand_list[brand_index].school_name + '</h2>'
                //+ '<p class="school_desc">' + brand_list[brand_index].campus_list[0].offers[0].metadata.content.data.content.brand.short_description + '</p>'
                + '</div>'
                + '<div class="program_list medium-10 columns">'
                + '<form class="cmxform result_form" action="/brand/' + brand_url + '.html">'
                + '<span class="form-element">'
                + '<label for="campus-select">Available Campuses <span>(Select One)</span><em class="form-req-mark">*</em></label>'
                + '<select id="campus-select" name="campus-select" class="validate_select campus-select">'
                + '<option value>Select a Campus:</option>'
                + '</select>'
                + '</span>'
                + '<span class="form-element">'
                + '<label for="offer_id">Available Programs <span>(Select One)</span><em class="form-req-mark">*</em></label>'
                + '<select id="offer_id" name="offer_id" class="validate_select program-select">'
                + '<option value>Select a Program:</option>'
                + '</select>'
                + '</span>'
                + '<button>Visit School Site</button>'
                + '</form>'
                + '</div>'
                + '</div>'
                + '</div>'
            );
            // populate list of campuses for form and run change campus logic
            var campus_list = brand_list[brand_index].campus_list;
            campus_list.sort(function(a,b)
            {
                if(a.location < b.location)
                {
                    return -1;
                };
                if(a.location > b.location)
                {
                    return 1;
                };
                return 0;
            });
            list_campuses(campus_list, brand_index);

            // change content for program on program-select change
            program_change(brand_index);

            // hide atlas_loader and show atlas_results
            $('.atlas_loader').fadeOut(0);
            atlas_results.fadeIn(300);
        }
    }
}

// helper methods
// default text field structure
var _text_field = function( field )
{
    var label = '<label for="' + field.name + '">' + field.label + ' <em class="form-req-mark">*</em></label>';
    var input = '';
    if ( field.name == 'email' )
    {
        input = '<input type="email" class="validate_text" id="' + field.name + '" name="' + field.name + '" ' + ((field.required != undefined && field.required == true) ? 'required' : '') + ' />';
    }
    else
    {
        input = '<input type="text" class="validate_text" id="' + field.name + '" name="' + field.name + '" ' + ((field.required != undefined && field.required == true) ? 'required' : '') + ' />';
    }
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