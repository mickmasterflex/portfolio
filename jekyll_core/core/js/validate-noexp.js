var $ = jQuery.noConflict();

// Set Posting URL
var post_url = 'http://valkyrie.neutronnetwork.com/api/post_lead/';

// Set Cookie Expiry Time (in minutes)
var expire = 10;

$(function() {

    validate.init();

});

var validate = {

    // Debug.
    debug: function( message ) {
        if ( typeof( console ) !== 'undefined' && console != null ) console.log( message );
    },

    // Init.
    init: function() {
        // Get URL Parameters
        var adid = GetURLParameter('adid');
        var ptid = GetURLParameter('ptid');
        var sub_campaign = GetURLParameter('sub_campaign');
        // console.log(ptid + ':first');
        var utm_source = GetURLParameter('utm_source');
        var source_lp_domain = window.location.hostname;
        $('#adid').val(adid);
        $('#ptid').val(ptid);
        // console.log(ptid + ':second');
        $('#source').val(utm_source);
        $('#source_lp_domain').val(source_lp_domain);

        // Form Submit.
        $('#application-form').submit( validate.submit );
    },

    // Validate.
    validate: function( $field, type, no_ignore ) {

        // the validation status
        var $status = $field.siblings('.validation_status');

        // if no status yet
        if (!$status.length) {
            // write it in
            /* $field.parent().append('<span class="validation_status"></span>'); */
            var $status = $field.siblings('.validation_status');
        }

        // validation type
        switch(type) {

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
                    var type = validate.get_file_extension( value );
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
        if (valid == 'ignore') {
            // and stop here
            return valid;
        }

        // if valid
        if (valid) {
            // remove label and input classes
            $field.removeClass('input_error').siblings('label').removeClass('label_error');
        }

        // invalid
        else {
            // add error highlighting
            $field.addClass('input_error').siblings('label').addClass('label_error');
        }

        // Null.
        if ( valid == null ) {
            // add error highlighting
            $field.addClass('input_error').siblings('label').addClass('label_error');
            // Set valid to false.
            valid = false;
        }

        // return valid state
        return valid;
    },

    // Get File Ext.
    get_file_extension: function( filename ) {
        var ext = /^.+\.([^.]+)$/.exec( filename );
        return ext == null ? "" : ext[1];
    },

    // Submit.
    submit: function() {

        // final validation
        field_count = 0;
        valid_count = 0;
        var error_labels = [];

        // Loop through form elements to validate.
        $(this).find('.form-element').each(function() {
            $(this).children('label').next().each(function() {
                var className = $(this).attr('class');
                switch ( className ) {

                    // Validate Text
                    case 'validate_text': case 'validate_text input_error':
                    field_count++;
                    var valid = validate.validate($(this), 'text');
                    if (valid) {
                        valid_count++;
                    } else {
                        var label = $(this).siblings('label').text().split(' *');
                        error_labels.push( label[0] );
                    }
                    break;

                    // Validate Textarea
                    case 'validate_textarea': case 'validate_textarea input_error':
                    field_count++;
                    var valid = validate.validate($(this), 'textarea');
                    if (valid) {
                        valid_count++;
                    } else {
                        var label = $(this).siblings('label').text().split(' *');
                        error_labels.push( label[0] );
                    }
                    break;

                    // Validate Email
                    case 'validate_email': case 'validate_email input_error':
                    field_count++;
                    var valid = validate.validate($(this), 'email');
                    if (valid) {
                        valid_count++;
                    } else {
                        var label = $(this).siblings('label').text().split(' *');
                        error_labels.push( label[0] );
                    }
                    break;

                    // Validate Phone
                    case 'validate_phone': case 'validate_phone input_error':
                    field_count++;
                    var valid = validate.validate($(this), 'phone', true);
                    if (valid) {
                        valid_count++;
                    } else {
                        var label = $(this).siblings('label').text().split(' *');
                        error_labels.push( label[0] );
                    }
                    break;

                    // Validate Zip
                    case 'validate_zip': case 'validate_zip input_error':
                    field_count++;
                    var valid = validate.validate($(this), 'zip');
                    if (valid) {
                        valid_count++;
                    } else {
                        var label = $(this).siblings('label').text().split(' *');
                        error_labels.push( label[0] );
                    }
                    break;

                    // Validate Select
                    case 'validate_select': case 'validate_select input_error':
                    field_count++;
                    var valid = validate.validate($(this), 'select');
                    if (valid) {
                        valid_count++;
                    } else {
                        var label = $(this).siblings('label').text().split(' *');
                        error_labels.push( label[0] );
                    }
                    break;

                    // Validate Checkbox
                    case 'validate_checkbox': case 'validate_checkbox input_error':
                    field_count++;
                    var valid = validate.validate($(this), 'checkbox');
                    if (valid) {
                        valid_count++;
                    } else {
                        var label = $(this).siblings('label').text().split(' *');
                        error_labels.push( label[0] );
                    }
                    break;

                    // Validate Radio Buttons
                    case 'validate_radio': case 'validate_radio input_error':
                    field_count++;
                    var valid = validate.validate($(this), 'radio');
                    if (valid) {
                        valid_count++;
                    } else {
                        var label = $('.well').find('.label').text();
                        error_labels.push( label[0] );
                    }
                    break;

                    // Validate file input
                    case 'validate_file': case 'validate_file input_error':
                    field_count++;
                    var valid = validate.validate($(this), 'file');
                    if (valid) {
                        valid_count++;
                    } else {
                        var label = $(this).siblings('label').text().split(' *');
                        error_labels.push( label[0] );
                    }
                    break;
                }
            });
        });

        // Error msg.
        if ( valid_count != field_count ) {
            // notify
            $('#form_errors').html('<strong>Please correct the following form errors:</strong><br/>');
            for ( var $i = 0; $i < error_labels.length; $i++ ) {
                if ( $i == error_labels.length - 1 )
                    $('#form_errors').append( error_labels[$i] );
                else
                    $('#form_errors').append( error_labels[$i] + ', ' );
            }
            $('#form_errors').fadeIn(300);

            // and stop form submit
            return false;
        }

        var data = $('#application-form').serializeAll();

        if($('form[name="flgxfrm_196"]')){
            submit_fraud_logix();
        }

        validate.post_form(data);

        // fade out buttons and disable them from allowing impatient clickers.
        $('form button#application-submit').attr('disabled', 'disabled');
        $('form input[type=image], form input[type=submit]').animate({ opacity: .5 }, 500);

        var _gaq = _gaq || [];

        return false;
    },

    // Post form data to Proton, Yodel, and Cake.
    post_form: function( data ) {
        console.log(ptid);
        validate.debug( 'Data: ' + data );
        $.ajax({
            url: post_url,
            type: 'POST',
            data: data,
            dataType: 'json',
            async: false,
            success: function( response ) {
                validate.debug( 'Response: ' + response );
                if ($('#application-form').attr('action') == '/thanks-atlas.html')
                {
                    window.location = $('#application-form').attr('action') + '?zipCode=' + $('#zip_code').val();
                }
                else
                {
                    window.location = $('#application-form').attr('action') + '&ptid=' + $('#ptid').val() + '&adid=' + $('#adid').val();
                }
                window._gaq.push([ '_trackEvent', 'JobRegLPA', 'EduRegConversion' ]);
                createCookie('jandingForm', data, expire);
            },
            timeout: 30000 // sets timeout to 30 seconds
        });
    }

}

$.fn.serializeAll = function() {
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

function createCookie(cookieName,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*60*1000));
        var expires = '; expires='+date.toGMTString();
    }
    else var expires = '';
    document.cookie = cookieName+'='+value+expires+'; path=/';
}

function getCookie(name) {
    var result = "";
    var myCookie = " " + document.cookie + ";";
    var searchName = " " + name + "=";
    var startOfCookie = myCookie.indexOf(searchName);
    var endOfCookie;
    if (startOfCookie != -1) {
        startOfCookie += searchName.length;
        endOfCookie = myCookie.indexOf(";", startOfCookie);
        result = unescape(myCookie.substring(startOfCookie, endOfCookie));
    }
    return result;
}
//get multi value cookie value e.g. Person=name=amit&age=25;School=10th
function getCookieMultiValue(cookiename,cookiekey) {
    var cookievalue=getCookie(cookiename);
    if ( cookievalue == "")
        return "";
    cookievaluesep=cookievalue.split("&");
    for (c=0;c<cookievaluesep.length;c++) {
        cookienamevalue=cookievaluesep[c].split("=");
        if (cookienamevalue.length > 1) {
            if ( cookienamevalue[0] == cookiekey )
                return cookienamevalue[1].toString();
        }
        else
            return "";
    }

    return "";
}