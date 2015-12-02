// using jQuery Validation plugin (http://jqueryvalidation.org/)
//====== Generate Validation Rules =============================================
$.fn.generateObjectValidationRules = function()
{
    var rules = {};
    var form = this.serializeRequiredArray();
    $.each(form, function() {
        if (this.required == true )
        {
            if ( this.name.indexOf('email') >= 0 )
            {
                rules[this.id] = {
                    required: true,
                    email: true
                };
            }
            else
            {
                rules[this.id] = "required";
            }
        }
    });
    return rules;
};

//====== Generate Validation Messages =============================================
$.fn.generateObjectValidationMessages = function()
{
    var messages = {};
    var form = this.serializeRequiredArray();
    $.each(form, function() {
        if (this.required == true )
        {
            if ( this.name.indexOf('email') >= 0 )
            {
                messages[this.id] = {
                    required: "Please enter a valid email address",
                    minlength: "Please enter a valid email address"
                };
            }
            else if ( this.type == 'radio' )
            {
                messages[this.id] = "Please select an option";
            }
            else
            {
                messages[this.id] = "Please fill out this field";
            }
        }
    });
    return messages;
};

//====== default methods for form validation ===================================
if (validationErrorPlacement == undefined )
{
    // the errorPlacement has to take the table layout into account
    var validationErrorPlacement = function(error, element) {
        if (element.is(":radio"))
            error.appendTo(element.parent().parent());
        else if (element.is(":checkbox"))
            error.appendTo(element.next());
        else
            error.appendTo(element.parent());
            element.addClass('input_error');
            $('label.error').addClass('field_error');
    };
}
if (validationSubmitHandler == undefined)
{
    // specifying a submitHandler prevents the default submit, good for the demo
    var validationSubmitHandler = function() {
        $(form_id).submit(prometheus_submit(form_id));
    };
}
if (validationSuccess == undefined)
{
    // set this class to error-labels to indicate valid fields
    var validationSuccess = function(label) {
        // add checked class to label on validation success
        label.addClass("checked");
    };
}
if (validationHighlight == undefined)
{
    var validationHighlight = function(element, errorClass, validClass) {
        if (element.type === "radio") {
            this.findByName(element.name).addClass(errorClass).removeClass(validClass);
        } else {
            $(element).addClass(errorClass).removeClass(validClass);
        }
    };
}
if (validationUnHighlight == undefined)
{
    var validationUnHighlight = function(element, errorClass, validClass) {
        if (element.type === "radio") {
            this.findByName(element.name).removeClass(errorClass).addClass(validClass);
        } else if (element.type === "checkbox") {
            $(element).removeClass(errorClass).addClass(validClass);
            $(element).removeClass('input_error');
        } else {
            $(element).removeClass(errorClass).addClass(validClass);
            $(element).removeClass('input_error');
            $(element).siblings(':last').remove();
        }
    };
}

//====== validation rule & message dicts =======================================
if (validation_rule_dict == undefined)
{
    var validation_rule_dict = $(form_id).generateObjectValidationRules();
}
if (validation_message_dict == undefined)
{
    var validation_message_dict = $(form_id).generateObjectValidationMessages();
}

//====== validate the comment form when it is submitted ========================
$(form_id).validate({
    rules: validation_rule_dict,
    messages: validation_message_dict,
    errorPlacement: validationErrorPlacement,
    submitHandler: validationSubmitHandler,
    success: validationSuccess,
    highlight: validationHighlight,
    unhighlight: validationUnHighlight,
    ignore: '.ignore'
});