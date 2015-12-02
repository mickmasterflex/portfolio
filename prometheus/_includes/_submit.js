//====== Submit. ===============================================================
var prometheus_submit = function( form_id ) {

    // add form data to cookie
    append_prometheus_data(get_form_json(form_id));

    if ( typeof exclusive != 'undefined' && exclusive == true )
    {
        append_prometheus_data({'exclusive_complete':'true'});
    }

    // post form if post_url is specified
    if ( post_url.length > 0 )
    {
        _post_form($(form_id).serializeAll());
        if ( form_id == '#offer_form' || form_id == '#offer_form_static' )
        {
            map_submitted_offers();
        }
        delete_offer_id_from_prometheus_data();
    }

    // fire event tracking
    if ( get_prometheus_data().first_name != 'ckmtest' ) {
        if ( form_id  == '#offer_form' )
        {
            ga('send', 'event', 'Prometheus-' + page_type, 'Submit', 'Prometheus-' + form_id + '-Submit-' + ((brand_name.length > 0) ? brand_name : ''));
        }
        else if ( form_id  == '#offer_form_static' ) {
            ga('send', 'event', 'Prometheus-' + page_type, 'Submit', 'Prometheus-' + form_id + '-Static_Submit-' + ((brand_name.length > 0) ? brand_name : ''));
        }
        else {
            if ( typeof insurance_type != 'undefined' && insurance_type.length > 0 )
            {
                ga('send', 'event', 'Prometheus-' + page_type, 'Submit', 'Prometheus-' + form_id + '-Submit-' + insurance_type);
            }
            else
            {
                if ( $('#experience:checked').length > 0 )
                {
                    ga('send', 'event', 'Prometheus-' + page_type, 'Submit', 'Prometheus-' + form_id + '-Submit-' + $('#experience:checked').val());
                }
                else
                {
                    if ( typeof page_type != 'undefined' && page_type == 'jobdash-reg' )
                    {
                        ga('send', 'event', 'Prometheus-' + page_type, 'Submit', 'Prometheus-' + form_id + '-Submit-' + location.pathname.replace('/', ''));
                    }
                    else
                    {
                        ga('send', 'event', 'Prometheus-' + page_type, 'Submit', 'Prometheus-' + form_id + '-Submit');
                    }
                }
            }
        }
    }

    // fade out buttons and disable them from allowing impatient clickers.
    $('form button[type=submit]').attr('disabled', 'disabled');

    // fire next_url function
    handle_next_url();

    return false;
};

//====== Get form fields as JSON ===============================================
var get_form_json = function(form_id)
{
    return $(form_id).serializeObject();
};

//====== SerializeAll ==========================================================
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
};

//====== SerializeObject =======================================================
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};