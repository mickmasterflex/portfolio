//====== Necessary vars for serializeArray =====================================
var r20 = /%20/g,
    rbracket = /\[\]$/,
    rCRLF = /\r?\n/g,
    rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
    rsubmittable = /^(?:input|select|textarea|keygen)/i;

//====== Override default jQuery serializeArray function =======================
$.fn.serializeRequiredArray = function() {
    return this.map(function() {
        // Can add propHook for "elements" to filter or add form elements
        var elements = jQuery.prop( this, "elements" );
        return elements ? jQuery.makeArray( elements ) : this;
    })
        .filter(function() {
            var type = this.type;

            // Use .is( ":disabled" ) so that fieldset[disabled] works
            return this.name && rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type );
        })
        .map(function() {

            if ( this.required ) {
                var required_dict = {};
                required_dict['name'] = this.name;
                required_dict['type'] = this.type;
                required_dict['required'] = this.required;
                required_dict['id'] = this.id;
                return required_dict;
            }

        }).get();
};