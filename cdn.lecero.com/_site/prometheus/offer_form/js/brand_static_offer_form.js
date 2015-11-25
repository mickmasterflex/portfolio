// global vars
var content = '';
var offer_id = '';

// includes
// validation
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
/*! jQuery Validation Plugin - v1.13.1 - 10/14/2014
 * http://jqueryvalidation.org/
 * Copyright (c) 2014 Jörn Zaefferer; Licensed MIT */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a(jQuery)}(function(a){a.extend(a.fn,{validate:function(b){if(!this.length)return void(b&&b.debug&&window.console&&console.warn("Nothing selected, can't validate, returning nothing."));var c=a.data(this[0],"validator");return c?c:(this.attr("novalidate","novalidate"),c=new a.validator(b,this[0]),a.data(this[0],"validator",c),c.settings.onsubmit&&(this.validateDelegate(":submit","click",function(b){c.settings.submitHandler&&(c.submitButton=b.target),a(b.target).hasClass("cancel")&&(c.cancelSubmit=!0),void 0!==a(b.target).attr("formnovalidate")&&(c.cancelSubmit=!0)}),this.submit(function(b){function d(){var d,e;return c.settings.submitHandler?(c.submitButton&&(d=a("<input type='hidden'/>").attr("name",c.submitButton.name).val(a(c.submitButton).val()).appendTo(c.currentForm)),e=c.settings.submitHandler.call(c,c.currentForm,b),c.submitButton&&d.remove(),void 0!==e?e:!1):!0}return c.settings.debug&&b.preventDefault(),c.cancelSubmit?(c.cancelSubmit=!1,d()):c.form()?c.pendingRequest?(c.formSubmitted=!0,!1):d():(c.focusInvalid(),!1)})),c)},valid:function(){var b,c;return a(this[0]).is("form")?b=this.validate().form():(b=!0,c=a(this[0].form).validate(),this.each(function(){b=c.element(this)&&b})),b},removeAttrs:function(b){var c={},d=this;return a.each(b.split(/\s/),function(a,b){c[b]=d.attr(b),d.removeAttr(b)}),c},rules:function(b,c){var d,e,f,g,h,i,j=this[0];if(b)switch(d=a.data(j.form,"validator").settings,e=d.rules,f=a.validator.staticRules(j),b){case"add":a.extend(f,a.validator.normalizeRule(c)),delete f.messages,e[j.name]=f,c.messages&&(d.messages[j.name]=a.extend(d.messages[j.name],c.messages));break;case"remove":return c?(i={},a.each(c.split(/\s/),function(b,c){i[c]=f[c],delete f[c],"required"===c&&a(j).removeAttr("aria-required")}),i):(delete e[j.name],f)}return g=a.validator.normalizeRules(a.extend({},a.validator.classRules(j),a.validator.attributeRules(j),a.validator.dataRules(j),a.validator.staticRules(j)),j),g.required&&(h=g.required,delete g.required,g=a.extend({required:h},g),a(j).attr("aria-required","true")),g.remote&&(h=g.remote,delete g.remote,g=a.extend(g,{remote:h})),g}}),a.extend(a.expr[":"],{blank:function(b){return!a.trim(""+a(b).val())},filled:function(b){return!!a.trim(""+a(b).val())},unchecked:function(b){return!a(b).prop("checked")}}),a.validator=function(b,c){this.settings=a.extend(!0,{},a.validator.defaults,b),this.currentForm=c,this.init()},a.validator.format=function(b,c){return 1===arguments.length?function(){var c=a.makeArray(arguments);return c.unshift(b),a.validator.format.apply(this,c)}:(arguments.length>2&&c.constructor!==Array&&(c=a.makeArray(arguments).slice(1)),c.constructor!==Array&&(c=[c]),a.each(c,function(a,c){b=b.replace(new RegExp("\\{"+a+"\\}","g"),function(){return c})}),b)},a.extend(a.validator,{defaults:{messages:{},groups:{},rules:{},errorClass:"error",validClass:"valid",errorElement:"label",focusCleanup:!1,focusInvalid:!0,errorContainer:a([]),errorLabelContainer:a([]),onsubmit:!0,ignore:":hidden",ignoreTitle:!1,onfocusin:function(a){this.lastActive=a,this.settings.focusCleanup&&(this.settings.unhighlight&&this.settings.unhighlight.call(this,a,this.settings.errorClass,this.settings.validClass),this.hideThese(this.errorsFor(a)))},onfocusout:function(a){this.checkable(a)||!(a.name in this.submitted)&&this.optional(a)||this.element(a)},onkeyup:function(a,b){(9!==b.which||""!==this.elementValue(a))&&(a.name in this.submitted||a===this.lastElement)&&this.element(a)},onclick:function(a){a.name in this.submitted?this.element(a):a.parentNode.name in this.submitted&&this.element(a.parentNode)},highlight:function(b,c,d){"radio"===b.type?this.findByName(b.name).addClass(c).removeClass(d):a(b).addClass(c).removeClass(d)},unhighlight:function(b,c,d){"radio"===b.type?this.findByName(b.name).removeClass(c).addClass(d):a(b).removeClass(c).addClass(d)}},setDefaults:function(b){a.extend(a.validator.defaults,b)},messages:{required:"This field is required.",remote:"Please fix this field.",email:"Please enter a valid email address.",url:"Please enter a valid URL.",date:"Please enter a valid date.",dateISO:"Please enter a valid date ( ISO ).",number:"Please enter a valid number.",digits:"Please enter only digits.",creditcard:"Please enter a valid credit card number.",equalTo:"Please enter the same value again.",maxlength:a.validator.format("Please enter no more than {0} characters."),minlength:a.validator.format("Please enter at least {0} characters."),rangelength:a.validator.format("Please enter a value between {0} and {1} characters long."),range:a.validator.format("Please enter a value between {0} and {1}."),max:a.validator.format("Please enter a value less than or equal to {0}."),min:a.validator.format("Please enter a value greater than or equal to {0}.")},autoCreateRanges:!1,prototype:{init:function(){function b(b){var c=a.data(this[0].form,"validator"),d="on"+b.type.replace(/^validate/,""),e=c.settings;e[d]&&!this.is(e.ignore)&&e[d].call(c,this[0],b)}this.labelContainer=a(this.settings.errorLabelContainer),this.errorContext=this.labelContainer.length&&this.labelContainer||a(this.currentForm),this.containers=a(this.settings.errorContainer).add(this.settings.errorLabelContainer),this.submitted={},this.valueCache={},this.pendingRequest=0,this.pending={},this.invalid={},this.reset();var c,d=this.groups={};a.each(this.settings.groups,function(b,c){"string"==typeof c&&(c=c.split(/\s/)),a.each(c,function(a,c){d[c]=b})}),c=this.settings.rules,a.each(c,function(b,d){c[b]=a.validator.normalizeRule(d)}),a(this.currentForm).validateDelegate(":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'] ,[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox']","focusin focusout keyup",b).validateDelegate("select, option, [type='radio'], [type='checkbox']","click",b),this.settings.invalidHandler&&a(this.currentForm).bind("invalid-form.validate",this.settings.invalidHandler),a(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required","true")},form:function(){return this.checkForm(),a.extend(this.submitted,this.errorMap),this.invalid=a.extend({},this.errorMap),this.valid()||a(this.currentForm).triggerHandler("invalid-form",[this]),this.showErrors(),this.valid()},checkForm:function(){this.prepareForm();for(var a=0,b=this.currentElements=this.elements();b[a];a++)this.check(b[a]);return this.valid()},element:function(b){var c=this.clean(b),d=this.validationTargetFor(c),e=!0;return this.lastElement=d,void 0===d?delete this.invalid[c.name]:(this.prepareElement(d),this.currentElements=a(d),e=this.check(d)!==!1,e?delete this.invalid[d.name]:this.invalid[d.name]=!0),a(b).attr("aria-invalid",!e),this.numberOfInvalids()||(this.toHide=this.toHide.add(this.containers)),this.showErrors(),e},showErrors:function(b){if(b){a.extend(this.errorMap,b),this.errorList=[];for(var c in b)this.errorList.push({message:b[c],element:this.findByName(c)[0]});this.successList=a.grep(this.successList,function(a){return!(a.name in b)})}this.settings.showErrors?this.settings.showErrors.call(this,this.errorMap,this.errorList):this.defaultShowErrors()},resetForm:function(){a.fn.resetForm&&a(this.currentForm).resetForm(),this.submitted={},this.lastElement=null,this.prepareForm(),this.hideErrors(),this.elements().removeClass(this.settings.errorClass).removeData("previousValue").removeAttr("aria-invalid")},numberOfInvalids:function(){return this.objectLength(this.invalid)},objectLength:function(a){var b,c=0;for(b in a)c++;return c},hideErrors:function(){this.hideThese(this.toHide)},hideThese:function(a){a.not(this.containers).text(""),this.addWrapper(a).hide()},valid:function(){return 0===this.size()},size:function(){return this.errorList.length},focusInvalid:function(){if(this.settings.focusInvalid)try{a(this.findLastActive()||this.errorList.length&&this.errorList[0].element||[]).filter(":visible").focus().trigger("focusin")}catch(b){}},findLastActive:function(){var b=this.lastActive;return b&&1===a.grep(this.errorList,function(a){return a.element.name===b.name}).length&&b},elements:function(){var b=this,c={};return a(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled], [readonly]").not(this.settings.ignore).filter(function(){return!this.name&&b.settings.debug&&window.console&&console.error("%o has no name assigned",this),this.name in c||!b.objectLength(a(this).rules())?!1:(c[this.name]=!0,!0)})},clean:function(b){return a(b)[0]},errors:function(){var b=this.settings.errorClass.split(" ").join(".");return a(this.settings.errorElement+"."+b,this.errorContext)},reset:function(){this.successList=[],this.errorList=[],this.errorMap={},this.toShow=a([]),this.toHide=a([]),this.currentElements=a([])},prepareForm:function(){this.reset(),this.toHide=this.errors().add(this.containers)},prepareElement:function(a){this.reset(),this.toHide=this.errorsFor(a)},elementValue:function(b){var c,d=a(b),e=b.type;return"radio"===e||"checkbox"===e?a("input[name='"+b.name+"']:checked").val():"number"===e&&"undefined"!=typeof b.validity?b.validity.badInput?!1:d.val():(c=d.val(),"string"==typeof c?c.replace(/\r/g,""):c)},check:function(b){b=this.validationTargetFor(this.clean(b));var c,d,e,f=a(b).rules(),g=a.map(f,function(a,b){return b}).length,h=!1,i=this.elementValue(b);for(d in f){e={method:d,parameters:f[d]};try{if(c=a.validator.methods[d].call(this,i,b,e.parameters),"dependency-mismatch"===c&&1===g){h=!0;continue}if(h=!1,"pending"===c)return void(this.toHide=this.toHide.not(this.errorsFor(b)));if(!c)return this.formatAndAdd(b,e),!1}catch(j){throw this.settings.debug&&window.console&&console.log("Exception occurred when checking element "+b.id+", check the '"+e.method+"' method.",j),j}}if(!h)return this.objectLength(f)&&this.successList.push(b),!0},customDataMessage:function(b,c){return a(b).data("msg"+c.charAt(0).toUpperCase()+c.substring(1).toLowerCase())||a(b).data("msg")},customMessage:function(a,b){var c=this.settings.messages[a];return c&&(c.constructor===String?c:c[b])},findDefined:function(){for(var a=0;a<arguments.length;a++)if(void 0!==arguments[a])return arguments[a];return void 0},defaultMessage:function(b,c){return this.findDefined(this.customMessage(b.name,c),this.customDataMessage(b,c),!this.settings.ignoreTitle&&b.title||void 0,a.validator.messages[c],"<strong>Warning: No message defined for "+b.name+"</strong>")},formatAndAdd:function(b,c){var d=this.defaultMessage(b,c.method),e=/\$?\{(\d+)\}/g;"function"==typeof d?d=d.call(this,c.parameters,b):e.test(d)&&(d=a.validator.format(d.replace(e,"{$1}"),c.parameters)),this.errorList.push({message:d,element:b,method:c.method}),this.errorMap[b.name]=d,this.submitted[b.name]=d},addWrapper:function(a){return this.settings.wrapper&&(a=a.add(a.parent(this.settings.wrapper))),a},defaultShowErrors:function(){var a,b,c;for(a=0;this.errorList[a];a++)c=this.errorList[a],this.settings.highlight&&this.settings.highlight.call(this,c.element,this.settings.errorClass,this.settings.validClass),this.showLabel(c.element,c.message);if(this.errorList.length&&(this.toShow=this.toShow.add(this.containers)),this.settings.success)for(a=0;this.successList[a];a++)this.showLabel(this.successList[a]);if(this.settings.unhighlight)for(a=0,b=this.validElements();b[a];a++)this.settings.unhighlight.call(this,b[a],this.settings.errorClass,this.settings.validClass);this.toHide=this.toHide.not(this.toShow),this.hideErrors(),this.addWrapper(this.toShow).show()},validElements:function(){return this.currentElements.not(this.invalidElements())},invalidElements:function(){return a(this.errorList).map(function(){return this.element})},showLabel:function(b,c){var d,e,f,g=this.errorsFor(b),h=this.idOrName(b),i=a(b).attr("aria-describedby");g.length?(g.removeClass(this.settings.validClass).addClass(this.settings.errorClass),g.html(c)):(g=a("<"+this.settings.errorElement+">").attr("id",h+"-error").addClass(this.settings.errorClass).html(c||""),d=g,this.settings.wrapper&&(d=g.hide().show().wrap("<"+this.settings.wrapper+"/>").parent()),this.labelContainer.length?this.labelContainer.append(d):this.settings.errorPlacement?this.settings.errorPlacement(d,a(b)):d.insertAfter(b),g.is("label")?g.attr("for",h):0===g.parents("label[for='"+h+"']").length&&(f=g.attr("id").replace(/(:|\.|\[|\])/g,"\\$1"),i?i.match(new RegExp("\\b"+f+"\\b"))||(i+=" "+f):i=f,a(b).attr("aria-describedby",i),e=this.groups[b.name],e&&a.each(this.groups,function(b,c){c===e&&a("[name='"+b+"']",this.currentForm).attr("aria-describedby",g.attr("id"))}))),!c&&this.settings.success&&(g.text(""),"string"==typeof this.settings.success?g.addClass(this.settings.success):this.settings.success(g,b)),this.toShow=this.toShow.add(g)},errorsFor:function(b){var c=this.idOrName(b),d=a(b).attr("aria-describedby"),e="label[for='"+c+"'], label[for='"+c+"'] *";return d&&(e=e+", #"+d.replace(/\s+/g,", #")),this.errors().filter(e)},idOrName:function(a){return this.groups[a.name]||(this.checkable(a)?a.name:a.id||a.name)},validationTargetFor:function(b){return this.checkable(b)&&(b=this.findByName(b.name)),a(b).not(this.settings.ignore)[0]},checkable:function(a){return/radio|checkbox/i.test(a.type)},findByName:function(b){return a(this.currentForm).find("[name='"+b+"']")},getLength:function(b,c){switch(c.nodeName.toLowerCase()){case"select":return a("option:selected",c).length;case"input":if(this.checkable(c))return this.findByName(c.name).filter(":checked").length}return b.length},depend:function(a,b){return this.dependTypes[typeof a]?this.dependTypes[typeof a](a,b):!0},dependTypes:{"boolean":function(a){return a},string:function(b,c){return!!a(b,c.form).length},"function":function(a,b){return a(b)}},optional:function(b){var c=this.elementValue(b);return!a.validator.methods.required.call(this,c,b)&&"dependency-mismatch"},startRequest:function(a){this.pending[a.name]||(this.pendingRequest++,this.pending[a.name]=!0)},stopRequest:function(b,c){this.pendingRequest--,this.pendingRequest<0&&(this.pendingRequest=0),delete this.pending[b.name],c&&0===this.pendingRequest&&this.formSubmitted&&this.form()?(a(this.currentForm).submit(),this.formSubmitted=!1):!c&&0===this.pendingRequest&&this.formSubmitted&&(a(this.currentForm).triggerHandler("invalid-form",[this]),this.formSubmitted=!1)},previousValue:function(b){return a.data(b,"previousValue")||a.data(b,"previousValue",{old:null,valid:!0,message:this.defaultMessage(b,"remote")})}},classRuleSettings:{required:{required:!0},email:{email:!0},url:{url:!0},date:{date:!0},dateISO:{dateISO:!0},number:{number:!0},digits:{digits:!0},creditcard:{creditcard:!0}},addClassRules:function(b,c){b.constructor===String?this.classRuleSettings[b]=c:a.extend(this.classRuleSettings,b)},classRules:function(b){var c={},d=a(b).attr("class");return d&&a.each(d.split(" "),function(){this in a.validator.classRuleSettings&&a.extend(c,a.validator.classRuleSettings[this])}),c},attributeRules:function(b){var c,d,e={},f=a(b),g=b.getAttribute("type");for(c in a.validator.methods)"required"===c?(d=b.getAttribute(c),""===d&&(d=!0),d=!!d):d=f.attr(c),/min|max/.test(c)&&(null===g||/number|range|text/.test(g))&&(d=Number(d)),d||0===d?e[c]=d:g===c&&"range"!==g&&(e[c]=!0);return e.maxlength&&/-1|2147483647|524288/.test(e.maxlength)&&delete e.maxlength,e},dataRules:function(b){var c,d,e={},f=a(b);for(c in a.validator.methods)d=f.data("rule"+c.charAt(0).toUpperCase()+c.substring(1).toLowerCase()),void 0!==d&&(e[c]=d);return e},staticRules:function(b){var c={},d=a.data(b.form,"validator");return d.settings.rules&&(c=a.validator.normalizeRule(d.settings.rules[b.name])||{}),c},normalizeRules:function(b,c){return a.each(b,function(d,e){if(e===!1)return void delete b[d];if(e.param||e.depends){var f=!0;switch(typeof e.depends){case"string":f=!!a(e.depends,c.form).length;break;case"function":f=e.depends.call(c,c)}f?b[d]=void 0!==e.param?e.param:!0:delete b[d]}}),a.each(b,function(d,e){b[d]=a.isFunction(e)?e(c):e}),a.each(["minlength","maxlength"],function(){b[this]&&(b[this]=Number(b[this]))}),a.each(["rangelength","range"],function(){var c;b[this]&&(a.isArray(b[this])?b[this]=[Number(b[this][0]),Number(b[this][1])]:"string"==typeof b[this]&&(c=b[this].replace(/[\[\]]/g,"").split(/[\s,]+/),b[this]=[Number(c[0]),Number(c[1])]))}),a.validator.autoCreateRanges&&(null!=b.min&&null!=b.max&&(b.range=[b.min,b.max],delete b.min,delete b.max),null!=b.minlength&&null!=b.maxlength&&(b.rangelength=[b.minlength,b.maxlength],delete b.minlength,delete b.maxlength)),b},normalizeRule:function(b){if("string"==typeof b){var c={};a.each(b.split(/\s/),function(){c[this]=!0}),b=c}return b},addMethod:function(b,c,d){a.validator.methods[b]=c,a.validator.messages[b]=void 0!==d?d:a.validator.messages[b],c.length<3&&a.validator.addClassRules(b,a.validator.normalizeRule(b))},methods:{required:function(b,c,d){if(!this.depend(d,c))return"dependency-mismatch";if("select"===c.nodeName.toLowerCase()){var e=a(c).val();return e&&e.length>0}return this.checkable(c)?this.getLength(b,c)>0:a.trim(b).length>0},email:function(a,b){return this.optional(b)||/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(a)},url:function(a,b){return this.optional(b)||/^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(a)},date:function(a,b){return this.optional(b)||!/Invalid|NaN/.test(new Date(a).toString())},dateISO:function(a,b){return this.optional(b)||/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(a)},number:function(a,b){return this.optional(b)||/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(a)},digits:function(a,b){return this.optional(b)||/^\d+$/.test(a)},creditcard:function(a,b){if(this.optional(b))return"dependency-mismatch";if(/[^0-9 \-]+/.test(a))return!1;var c,d,e=0,f=0,g=!1;if(a=a.replace(/\D/g,""),a.length<13||a.length>19)return!1;for(c=a.length-1;c>=0;c--)d=a.charAt(c),f=parseInt(d,10),g&&(f*=2)>9&&(f-=9),e+=f,g=!g;return e%10===0},minlength:function(b,c,d){var e=a.isArray(b)?b.length:this.getLength(b,c);return this.optional(c)||e>=d},maxlength:function(b,c,d){var e=a.isArray(b)?b.length:this.getLength(b,c);return this.optional(c)||d>=e},rangelength:function(b,c,d){var e=a.isArray(b)?b.length:this.getLength(b,c);return this.optional(c)||e>=d[0]&&e<=d[1]},min:function(a,b,c){return this.optional(b)||a>=c},max:function(a,b,c){return this.optional(b)||c>=a},range:function(a,b,c){return this.optional(b)||a>=c[0]&&a<=c[1]},equalTo:function(b,c,d){var e=a(d);return this.settings.onfocusout&&e.unbind(".validate-equalTo").bind("blur.validate-equalTo",function(){a(c).valid()}),b===e.val()},remote:function(b,c,d){if(this.optional(c))return"dependency-mismatch";var e,f,g=this.previousValue(c);return this.settings.messages[c.name]||(this.settings.messages[c.name]={}),g.originalMessage=this.settings.messages[c.name].remote,this.settings.messages[c.name].remote=g.message,d="string"==typeof d&&{url:d}||d,g.old===b?g.valid:(g.old=b,e=this,this.startRequest(c),f={},f[c.name]=b,a.ajax(a.extend(!0,{url:d,mode:"abort",port:"validate"+c.name,dataType:"json",data:f,context:e.currentForm,success:function(d){var f,h,i,j=d===!0||"true"===d;e.settings.messages[c.name].remote=g.originalMessage,j?(i=e.formSubmitted,e.prepareElement(c),e.formSubmitted=i,e.successList.push(c),delete e.invalid[c.name],e.showErrors()):(f={},h=d||e.defaultMessage(c,"remote"),f[c.name]=g.message=a.isFunction(h)?h(b):h,e.invalid[c.name]=!0,e.showErrors(f)),g.valid=j,e.stopRequest(c,j)}},d)),"pending")}}}),a.format=function(){throw"$.format has been deprecated. Please use $.validator.format instead."};var b,c={};a.ajaxPrefilter?a.ajaxPrefilter(function(a,b,d){var e=a.port;"abort"===a.mode&&(c[e]&&c[e].abort(),c[e]=d)}):(b=a.ajax,a.ajax=function(d){var e=("mode"in d?d:a.ajaxSettings).mode,f=("port"in d?d:a.ajaxSettings).port;return"abort"===e?(c[f]&&c[f].abort(),c[f]=b.apply(this,arguments),c[f]):b.apply(this,arguments)}),a.extend(a.fn,{validateDelegate:function(b,c,d){return this.bind(c,function(c){var e=a(c.target);return e.is(b)?d.apply(e,arguments):void 0})}})});
/*! jQuery Validation Plugin - v1.13.1 - 10/14/2014
 * http://jqueryvalidation.org/
 * Copyright (c) 2014 Jörn Zaefferer; Licensed MIT */
!function(a){"function"==typeof define&&define.amd?define(["jquery","./jquery.validate.min"],a):a(jQuery)}(function(a){!function(){function b(a){return a.replace(/<.[^<>]*?>/g," ").replace(/&nbsp;|&#160;/gi," ").replace(/[.(),;:!?%#$'\"_+=\/\-“”’]*/g,"")}a.validator.addMethod("maxWords",function(a,c,d){return this.optional(c)||b(a).match(/\b\w+\b/g).length<=d},a.validator.format("Please enter {0} words or less.")),a.validator.addMethod("minWords",function(a,c,d){return this.optional(c)||b(a).match(/\b\w+\b/g).length>=d},a.validator.format("Please enter at least {0} words.")),a.validator.addMethod("rangeWords",function(a,c,d){var e=b(a),f=/\b\w+\b/g;return this.optional(c)||e.match(f).length>=d[0]&&e.match(f).length<=d[1]},a.validator.format("Please enter between {0} and {1} words."))}(),a.validator.addMethod("accept",function(b,c,d){var e,f,g="string"==typeof d?d.replace(/\s/g,"").replace(/,/g,"|"):"image/*",h=this.optional(c);if(h)return h;if("file"===a(c).attr("type")&&(g=g.replace(/\*/g,".*"),c.files&&c.files.length))for(e=0;e<c.files.length;e++)if(f=c.files[e],!f.type.match(new RegExp(".?("+g+")$","i")))return!1;return!0},a.validator.format("Please enter a value with a valid mimetype.")),a.validator.addMethod("alphanumeric",function(a,b){return this.optional(b)||/^\w+$/i.test(a)},"Letters, numbers, and underscores only please"),a.validator.addMethod("bankaccountNL",function(a,b){if(this.optional(b))return!0;if(!/^[0-9]{9}|([0-9]{2} ){3}[0-9]{3}$/.test(a))return!1;var c,d,e,f=a.replace(/ /g,""),g=0,h=f.length;for(c=0;h>c;c++)d=h-c,e=f.substring(c,c+1),g+=d*e;return g%11===0},"Please specify a valid bank account number"),a.validator.addMethod("bankorgiroaccountNL",function(b,c){return this.optional(c)||a.validator.methods.bankaccountNL.call(this,b,c)||a.validator.methods.giroaccountNL.call(this,b,c)},"Please specify a valid bank or giro account number"),a.validator.addMethod("bic",function(a,b){return this.optional(b)||/^([A-Z]{6}[A-Z2-9][A-NP-Z1-2])(X{3}|[A-WY-Z0-9][A-Z0-9]{2})?$/.test(a)},"Please specify a valid BIC code"),a.validator.addMethod("cifES",function(a){"use strict";var b,c,d,e,f,g,h=[];if(a=a.toUpperCase(),!a.match("((^[A-Z]{1}[0-9]{7}[A-Z0-9]{1}$|^[T]{1}[A-Z0-9]{8}$)|^[0-9]{8}[A-Z]{1}$)"))return!1;for(d=0;9>d;d++)h[d]=parseInt(a.charAt(d),10);for(c=h[2]+h[4]+h[6],e=1;8>e;e+=2)f=(2*h[e]).toString(),g=f.charAt(1),c+=parseInt(f.charAt(0),10)+(""===g?0:parseInt(g,10));return/^[ABCDEFGHJNPQRSUVW]{1}/.test(a)?(c+="",b=10-parseInt(c.charAt(c.length-1),10),a+=b,h[8].toString()===String.fromCharCode(64+b)||h[8].toString()===a.charAt(a.length-1)):!1},"Please specify a valid CIF number."),a.validator.addMethod("creditcardtypes",function(a,b,c){if(/[^0-9\-]+/.test(a))return!1;a=a.replace(/\D/g,"");var d=0;return c.mastercard&&(d|=1),c.visa&&(d|=2),c.amex&&(d|=4),c.dinersclub&&(d|=8),c.enroute&&(d|=16),c.discover&&(d|=32),c.jcb&&(d|=64),c.unknown&&(d|=128),c.all&&(d=255),1&d&&/^(5[12345])/.test(a)?16===a.length:2&d&&/^(4)/.test(a)?16===a.length:4&d&&/^(3[47])/.test(a)?15===a.length:8&d&&/^(3(0[012345]|[68]))/.test(a)?14===a.length:16&d&&/^(2(014|149))/.test(a)?15===a.length:32&d&&/^(6011)/.test(a)?16===a.length:64&d&&/^(3)/.test(a)?16===a.length:64&d&&/^(2131|1800)/.test(a)?15===a.length:128&d?!0:!1},"Please enter a valid credit card number."),a.validator.addMethod("currency",function(a,b,c){var d,e="string"==typeof c,f=e?c:c[0],g=e?!0:c[1];return f=f.replace(/,/g,""),f=g?f+"]":f+"]?",d="^["+f+"([1-9]{1}[0-9]{0,2}(\\,[0-9]{3})*(\\.[0-9]{0,2})?|[1-9]{1}[0-9]{0,}(\\.[0-9]{0,2})?|0(\\.[0-9]{0,2})?|(\\.[0-9]{1,2})?)$",d=new RegExp(d),this.optional(b)||d.test(a)},"Please specify a valid currency"),a.validator.addMethod("dateFA",function(a,b){return this.optional(b)||/^[1-4]\d{3}\/((0?[1-6]\/((3[0-1])|([1-2][0-9])|(0?[1-9])))|((1[0-2]|(0?[7-9]))\/(30|([1-2][0-9])|(0?[1-9]))))$/.test(a)},"Please enter a correct date"),a.validator.addMethod("dateITA",function(a,b){var c,d,e,f,g,h=!1,i=/^\d{1,2}\/\d{1,2}\/\d{4}$/;return i.test(a)?(c=a.split("/"),d=parseInt(c[0],10),e=parseInt(c[1],10),f=parseInt(c[2],10),g=new Date(f,e-1,d,12,0,0,0),h=g.getUTCFullYear()===f&&g.getUTCMonth()===e-1&&g.getUTCDate()===d?!0:!1):h=!1,this.optional(b)||h},"Please enter a correct date"),a.validator.addMethod("dateNL",function(a,b){return this.optional(b)||/^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test(a)},"Please enter a correct date"),a.validator.addMethod("extension",function(a,b,c){return c="string"==typeof c?c.replace(/,/g,"|"):"png|jpe?g|gif",this.optional(b)||a.match(new RegExp(".("+c+")$","i"))},a.validator.format("Please enter a value with a valid extension.")),a.validator.addMethod("giroaccountNL",function(a,b){return this.optional(b)||/^[0-9]{1,7}$/.test(a)},"Please specify a valid giro account number"),a.validator.addMethod("iban",function(a,b){if(this.optional(b))return!0;var c,d,e,f,g,h,i,j,k,l=a.replace(/ /g,"").toUpperCase(),m="",n=!0,o="",p="";if(!/^([a-zA-Z0-9]{4} ){2,8}[a-zA-Z0-9]{1,4}|[a-zA-Z0-9]{12,34}$/.test(l))return!1;if(c=l.substring(0,2),h={AL:"\\d{8}[\\dA-Z]{16}",AD:"\\d{8}[\\dA-Z]{12}",AT:"\\d{16}",AZ:"[\\dA-Z]{4}\\d{20}",BE:"\\d{12}",BH:"[A-Z]{4}[\\dA-Z]{14}",BA:"\\d{16}",BR:"\\d{23}[A-Z][\\dA-Z]",BG:"[A-Z]{4}\\d{6}[\\dA-Z]{8}",CR:"\\d{17}",HR:"\\d{17}",CY:"\\d{8}[\\dA-Z]{16}",CZ:"\\d{20}",DK:"\\d{14}",DO:"[A-Z]{4}\\d{20}",EE:"\\d{16}",FO:"\\d{14}",FI:"\\d{14}",FR:"\\d{10}[\\dA-Z]{11}\\d{2}",GE:"[\\dA-Z]{2}\\d{16}",DE:"\\d{18}",GI:"[A-Z]{4}[\\dA-Z]{15}",GR:"\\d{7}[\\dA-Z]{16}",GL:"\\d{14}",GT:"[\\dA-Z]{4}[\\dA-Z]{20}",HU:"\\d{24}",IS:"\\d{22}",IE:"[\\dA-Z]{4}\\d{14}",IL:"\\d{19}",IT:"[A-Z]\\d{10}[\\dA-Z]{12}",KZ:"\\d{3}[\\dA-Z]{13}",KW:"[A-Z]{4}[\\dA-Z]{22}",LV:"[A-Z]{4}[\\dA-Z]{13}",LB:"\\d{4}[\\dA-Z]{20}",LI:"\\d{5}[\\dA-Z]{12}",LT:"\\d{16}",LU:"\\d{3}[\\dA-Z]{13}",MK:"\\d{3}[\\dA-Z]{10}\\d{2}",MT:"[A-Z]{4}\\d{5}[\\dA-Z]{18}",MR:"\\d{23}",MU:"[A-Z]{4}\\d{19}[A-Z]{3}",MC:"\\d{10}[\\dA-Z]{11}\\d{2}",MD:"[\\dA-Z]{2}\\d{18}",ME:"\\d{18}",NL:"[A-Z]{4}\\d{10}",NO:"\\d{11}",PK:"[\\dA-Z]{4}\\d{16}",PS:"[\\dA-Z]{4}\\d{21}",PL:"\\d{24}",PT:"\\d{21}",RO:"[A-Z]{4}[\\dA-Z]{16}",SM:"[A-Z]\\d{10}[\\dA-Z]{12}",SA:"\\d{2}[\\dA-Z]{18}",RS:"\\d{18}",SK:"\\d{20}",SI:"\\d{15}",ES:"\\d{20}",SE:"\\d{20}",CH:"\\d{5}[\\dA-Z]{12}",TN:"\\d{20}",TR:"\\d{5}[\\dA-Z]{17}",AE:"\\d{3}\\d{16}",GB:"[A-Z]{4}\\d{14}",VG:"[\\dA-Z]{4}\\d{16}"},g=h[c],"undefined"!=typeof g&&(i=new RegExp("^[A-Z]{2}\\d{2}"+g+"$",""),!i.test(l)))return!1;for(d=l.substring(4,l.length)+l.substring(0,4),j=0;j<d.length;j++)e=d.charAt(j),"0"!==e&&(n=!1),n||(m+="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(e));for(k=0;k<m.length;k++)f=m.charAt(k),p=""+o+f,o=p%97;return 1===o},"Please specify a valid IBAN"),a.validator.addMethod("integer",function(a,b){return this.optional(b)||/^-?\d+$/.test(a)},"A positive or negative non-decimal number please"),a.validator.addMethod("ipv4",function(a,b){return this.optional(b)||/^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(a)},"Please enter a valid IP v4 address."),a.validator.addMethod("ipv6",function(a,b){return this.optional(b)||/^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i.test(a)},"Please enter a valid IP v6 address."),a.validator.addMethod("lettersonly",function(a,b){return this.optional(b)||/^[a-z]+$/i.test(a)},"Letters only please"),a.validator.addMethod("letterswithbasicpunc",function(a,b){return this.optional(b)||/^[a-z\-.,()'"\s]+$/i.test(a)},"Letters or punctuation only please"),a.validator.addMethod("mobileNL",function(a,b){return this.optional(b)||/^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)6((\s|\s?\-\s?)?[0-9]){8}$/.test(a)},"Please specify a valid mobile number"),a.validator.addMethod("mobileUK",function(a,b){return a=a.replace(/\(|\)|\s+|-/g,""),this.optional(b)||a.length>9&&a.match(/^(?:(?:(?:00\s?|\+)44\s?|0)7(?:[1345789]\d{2}|624)\s?\d{3}\s?\d{3})$/)},"Please specify a valid mobile number"),a.validator.addMethod("nieES",function(a){"use strict";return a=a.toUpperCase(),a.match("((^[A-Z]{1}[0-9]{7}[A-Z0-9]{1}$|^[T]{1}[A-Z0-9]{8}$)|^[0-9]{8}[A-Z]{1}$)")?/^[T]{1}/.test(a)?a[8]===/^[T]{1}[A-Z0-9]{8}$/.test(a):/^[XYZ]{1}/.test(a)?a[8]==="TRWAGMYFPDXBNJZSQVHLCKE".charAt(a.replace("X","0").replace("Y","1").replace("Z","2").substring(0,8)%23):!1:!1},"Please specify a valid NIE number."),a.validator.addMethod("nifES",function(a){"use strict";return a=a.toUpperCase(),a.match("((^[A-Z]{1}[0-9]{7}[A-Z0-9]{1}$|^[T]{1}[A-Z0-9]{8}$)|^[0-9]{8}[A-Z]{1}$)")?/^[0-9]{8}[A-Z]{1}$/.test(a)?"TRWAGMYFPDXBNJZSQVHLCKE".charAt(a.substring(8,0)%23)===a.charAt(8):/^[KLM]{1}/.test(a)?a[8]===String.fromCharCode(64):!1:!1},"Please specify a valid NIF number."),a.validator.addMethod("nowhitespace",function(a,b){return this.optional(b)||/^\S+$/i.test(a)},"No white space please"),a.validator.addMethod("pattern",function(a,b,c){return this.optional(b)?!0:("string"==typeof c&&(c=new RegExp("^(?:"+c+")$")),c.test(a))},"Invalid format."),a.validator.addMethod("phoneNL",function(a,b){return this.optional(b)||/^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)[1-9]((\s|\s?\-\s?)?[0-9]){8}$/.test(a)},"Please specify a valid phone number."),a.validator.addMethod("phoneUK",function(a,b){return a=a.replace(/\(|\)|\s+|-/g,""),this.optional(b)||a.length>9&&a.match(/^(?:(?:(?:00\s?|\+)44\s?)|(?:\(?0))(?:\d{2}\)?\s?\d{4}\s?\d{4}|\d{3}\)?\s?\d{3}\s?\d{3,4}|\d{4}\)?\s?(?:\d{5}|\d{3}\s?\d{3})|\d{5}\)?\s?\d{4,5})$/)},"Please specify a valid phone number"),a.validator.addMethod("phoneUS",function(a,b){return a=a.replace(/\s+/g,""),this.optional(b)||a.length>9&&a.match(/^(\+?1-?)?(\([2-9]([02-9]\d|1[02-9])\)|[2-9]([02-9]\d|1[02-9]))-?[2-9]([02-9]\d|1[02-9])-?\d{4}$/)},"Please specify a valid phone number"),a.validator.addMethod("phonesUK",function(a,b){return a=a.replace(/\(|\)|\s+|-/g,""),this.optional(b)||a.length>9&&a.match(/^(?:(?:(?:00\s?|\+)44\s?|0)(?:1\d{8,9}|[23]\d{9}|7(?:[1345789]\d{8}|624\d{6})))$/)},"Please specify a valid uk phone number"),a.validator.addMethod("postalCodeCA",function(a,b){return this.optional(b)||/^[ABCEGHJKLMNPRSTVXY]\d[A-Z] \d[A-Z]\d$/.test(a)},"Please specify a valid postal code"),a.validator.addMethod("postalcodeBR",function(a,b){return this.optional(b)||/^\d{2}.\d{3}-\d{3}?$|^\d{5}-?\d{3}?$/.test(a)},"Informe um CEP válido."),a.validator.addMethod("postalcodeIT",function(a,b){return this.optional(b)||/^\d{5}$/.test(a)},"Please specify a valid postal code"),a.validator.addMethod("postalcodeNL",function(a,b){return this.optional(b)||/^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/.test(a)},"Please specify a valid postal code"),a.validator.addMethod("postcodeUK",function(a,b){return this.optional(b)||/^((([A-PR-UWYZ][0-9])|([A-PR-UWYZ][0-9][0-9])|([A-PR-UWYZ][A-HK-Y][0-9])|([A-PR-UWYZ][A-HK-Y][0-9][0-9])|([A-PR-UWYZ][0-9][A-HJKSTUW])|([A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRVWXY]))\s?([0-9][ABD-HJLNP-UW-Z]{2})|(GIR)\s?(0AA))$/i.test(a)},"Please specify a valid UK postcode"),a.validator.addMethod("require_from_group",function(b,c,d){var e=a(d[1],c.form),f=e.eq(0),g=f.data("valid_req_grp")?f.data("valid_req_grp"):a.extend({},this),h=e.filter(function(){return g.elementValue(this)}).length>=d[0];return f.data("valid_req_grp",g),a(c).data("being_validated")||(e.data("being_validated",!0),e.each(function(){g.element(this)}),e.data("being_validated",!1)),h},a.validator.format("Please fill at least {0} of these fields.")),a.validator.addMethod("skip_or_fill_minimum",function(b,c,d){var e=a(d[1],c.form),f=e.eq(0),g=f.data("valid_skip")?f.data("valid_skip"):a.extend({},this),h=e.filter(function(){return g.elementValue(this)}).length,i=0===h||h>=d[0];return f.data("valid_skip",g),a(c).data("being_validated")||(e.data("being_validated",!0),e.each(function(){g.element(this)}),e.data("being_validated",!1)),i},a.validator.format("Please either skip these fields or fill at least {0} of them.")),jQuery.validator.addMethod("stateUS",function(a,b,c){var d,e="undefined"==typeof c,f=e||"undefined"==typeof c.caseSensitive?!1:c.caseSensitive,g=e||"undefined"==typeof c.includeTerritories?!1:c.includeTerritories,h=e||"undefined"==typeof c.includeMilitary?!1:c.includeMilitary;return d=g||h?g&&h?"^(A[AEKLPRSZ]|C[AOT]|D[CE]|FL|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEINOPST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])$":g?"^(A[KLRSZ]|C[AOT]|D[CE]|FL|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEINOPST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])$":"^(A[AEKLPRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])$":"^(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])$",d=f?new RegExp(d):new RegExp(d,"i"),this.optional(b)||d.test(a)},"Please specify a valid state"),a.validator.addMethod("strippedminlength",function(b,c,d){return a(b).text().length>=d},a.validator.format("Please enter at least {0} characters")),a.validator.addMethod("time",function(a,b){return this.optional(b)||/^([01]\d|2[0-3])(:[0-5]\d){1,2}$/.test(a)},"Please enter a valid time, between 00:00 and 23:59"),a.validator.addMethod("time12h",function(a,b){return this.optional(b)||/^((0?[1-9]|1[012])(:[0-5]\d){1,2}(\ ?[AP]M))$/i.test(a)},"Please enter a valid time in 12-hour am/pm format"),a.validator.addMethod("url2",function(a,b){return this.optional(b)||/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(a)},a.validator.messages.url),a.validator.addMethod("vinUS",function(a){if(17!==a.length)return!1;var b,c,d,e,f,g,h=["A","B","C","D","E","F","G","H","J","K","L","M","N","P","R","S","T","U","V","W","X","Y","Z"],i=[1,2,3,4,5,6,7,8,1,2,3,4,5,7,9,2,3,4,5,6,7,8,9],j=[8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2],k=0;for(b=0;17>b;b++){if(e=j[b],d=a.slice(b,b+1),8===b&&(g=d),isNaN(d)){for(c=0;c<h.length;c++)if(d.toUpperCase()===h[c]){d=i[c],d*=e,isNaN(g)&&8===c&&(g=h[c]);break}}else d*=e;k+=d}return f=k%11,10===f&&(f="X"),f===g?!0:!1},"The specified vehicle identification number (VIN) is invalid."),a.validator.addMethod("zipcodeUS",function(a,b){return this.optional(b)||/^\d{5}(-\d{4})?$/.test(a)},"The specified US ZIP Code is invalid"),a.validator.addMethod("ziprange",function(a,b){return this.optional(b)||/^90[2-5]\d\{2\}-\d{4}$/.test(a)},"Your ZIP-code must be in the range 902xx-xxxx to 905xx-xxxx")});
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
// masked input
// jQuery Mask Plugin v1.11.2
// github.com/igorescobar/jQuery-Mask-Plugin
(function(a){"function"===typeof define&&define.amd?define(["jquery"],a):a(window.jQuery||window.Zepto)})(function(a){var y=function(b,d,e){b=a(b);var g=this,l=b.val(),m;d="function"===typeof d?d(b.val(),void 0,b,e):d;var c={invalid:[],getCaret:function(){try{var k,r=0,a=b.get(0),f=document.selection,c=a.selectionStart;if(f&&-1===navigator.appVersion.indexOf("MSIE 10"))k=f.createRange(),k.moveStart("character",b.is("input")?-b.val().length:-b.text().length),r=k.text.length;else if(c||"0"===c)r=c;
return r}catch(d){}},setCaret:function(k){try{if(b.is(":focus")){var r,a=b.get(0);a.setSelectionRange?a.setSelectionRange(k,k):a.createTextRange&&(r=a.createTextRange(),r.collapse(!0),r.moveEnd("character",k),r.moveStart("character",k),r.select())}}catch(c){}},events:function(){b.on("keyup.mask",c.behaviour).on("paste.mask drop.mask",function(){setTimeout(function(){b.keydown().keyup()},100)}).on("change.mask",function(){b.data("changed",!0)}).on("blur.mask",function(){l===b.val()||b.data("changed")||
b.trigger("change");b.data("changed",!1)}).on("keydown.mask, blur.mask",function(){l=b.val()}).on("focus.mask",function(k){!0===e.selectOnFocus&&a(k.target).select()}).on("focusout.mask",function(){e.clearIfNotMatch&&!m.test(c.val())&&c.val("")})},getRegexMask:function(){for(var k=[],b,a,c,e,h=0;h<d.length;h++)(b=g.translation[d[h]])?(a=b.pattern.toString().replace(/.{1}$|^.{1}/g,""),c=b.optional,(b=b.recursive)?(k.push(d[h]),e={digit:d[h],pattern:a}):k.push(c||b?a+"?":a)):k.push(d[h].replace(/[-\/\\^$*+?.()|[\]{}]/g,
"\\$&"));k=k.join("");e&&(k=k.replace(RegExp("("+e.digit+"(.*"+e.digit+")?)"),"($1)?").replace(RegExp(e.digit,"g"),e.pattern));return RegExp(k)},destroyEvents:function(){b.off("keydown keyup paste drop blur focusout ".split(" ").join(".mask "))},val:function(k){var a=b.is("input")?"val":"text";if(0<arguments.length){if(b[a]()!==k)b[a](k);a=b}else a=b[a]();return a},getMCharsBeforeCount:function(a,b){for(var c=0,f=0,e=d.length;f<e&&f<a;f++)g.translation[d.charAt(f)]||(a=b?a+1:a,c++);return c},caretPos:function(a,
b,e,f){return g.translation[d.charAt(Math.min(a-1,d.length-1))]?Math.min(a+e-b-f,e):c.caretPos(a+1,b,e,f)},behaviour:function(b){b=b||window.event;c.invalid=[];var e=b.keyCode||b.which;if(-1===a.inArray(e,g.byPassKeys)){var d=c.getCaret(),f=c.val().length,p=d<f,h=c.getMasked(),l=h.length,n=c.getMCharsBeforeCount(l-1)-c.getMCharsBeforeCount(f-1);c.val(h);!p||65===e&&b.ctrlKey||(8!==e&&46!==e&&(d=c.caretPos(d,f,l,n)),c.setCaret(d));return c.callbacks(b)}},getMasked:function(b){var a=[],l=c.val(),f=
0,p=d.length,h=0,m=l.length,n=1,q="push",u=-1,t,w;e.reverse?(q="unshift",n=-1,t=0,f=p-1,h=m-1,w=function(){return-1<f&&-1<h}):(t=p-1,w=function(){return f<p&&h<m});for(;w();){var x=d.charAt(f),v=l.charAt(h),s=g.translation[x];if(s)v.match(s.pattern)?(a[q](v),s.recursive&&(-1===u?u=f:f===t&&(f=u-n),t===u&&(f-=n)),f+=n):s.optional?(f+=n,h-=n):s.fallback?(a[q](s.fallback),f+=n,h-=n):c.invalid.push({p:h,v:v,e:s.pattern}),h+=n;else{if(!b)a[q](x);v===x&&(h+=n);f+=n}}b=d.charAt(t);p!==m+1||g.translation[b]||
a.push(b);return a.join("")},callbacks:function(a){var g=c.val(),m=g!==l,f=[g,a,b,e],p=function(a,b,c){"function"===typeof e[a]&&b&&e[a].apply(this,c)};p("onChange",!0===m,f);p("onKeyPress",!0===m,f);p("onComplete",g.length===d.length,f);p("onInvalid",0<c.invalid.length,[g,a,b,c.invalid,e])}};g.mask=d;g.options=e;g.remove=function(){var a=c.getCaret();c.destroyEvents();c.val(g.getCleanVal());c.setCaret(a-c.getMCharsBeforeCount(a));return b};g.getCleanVal=function(){return c.getMasked(!0)};g.init=
function(d){d=d||!1;e=e||{};g.byPassKeys=a.jMaskGlobals.byPassKeys;g.translation=a.jMaskGlobals.translation;g.translation=a.extend({},g.translation,e.translation);g=a.extend(!0,{},g,e);m=c.getRegexMask();!1===d?(e.placeholder&&b.attr("placeholder",e.placeholder),b.attr("autocomplete","off"),c.destroyEvents(),c.events(),d=c.getCaret(),c.val(c.getMasked()),c.setCaret(d+c.getMCharsBeforeCount(d,!0))):(c.events(),c.val(c.getMasked()))};g.init(!b.is("input"))};a.maskWatchers={};var A=function(){var b=
a(this),d={},e=b.attr("data-mask");b.attr("data-mask-reverse")&&(d.reverse=!0);b.attr("data-mask-clearifnotmatch")&&(d.clearIfNotMatch=!0);"true"===b.attr("data-mask-selectonfocus")&&(d.selectOnFocus=!0);if(z(b,e,d))return b.data("mask",new y(this,e,d))},z=function(b,d,e){e=e||{};var g=a(b).data("mask"),l=JSON.stringify;b=a(b).val()||a(b).text();try{return"function"===typeof d&&(d=d(b)),"object"!==typeof g||l(g.options)!==l(e)||g.mask!==d}catch(m){}};a.fn.mask=function(b,d){d=d||{};var e=this.selector,
g=a.jMaskGlobals,l=a.jMaskGlobals.watchInterval,m=function(){if(z(this,b,d))return a(this).data("mask",new y(this,b,d))};a(this).each(m);e&&""!==e&&g.watchInputs&&(clearInterval(a.maskWatchers[e]),a.maskWatchers[e]=setInterval(function(){a(document).find(e).each(m)},l));return this};a.fn.unmask=function(){clearInterval(a.maskWatchers[this.selector]);delete a.maskWatchers[this.selector];return this.each(function(){var b=a(this).data("mask");b&&b.remove().removeData("mask")})};a.fn.cleanVal=function(){return this.data("mask").getCleanVal()};
a.applyDataMask=function(){a(document).find(a.jMaskGlobals.maskElements).filter(q.dataMaskAttr).each(A)};var q={maskElements:"input,td,span,div",dataMaskAttr:"*[data-mask]",dataMask:!0,watchInterval:300,watchInputs:!0,watchDataMask:!1,byPassKeys:[9,16,17,18,36,37,38,39,40,91],translation:{0:{pattern:/\d/},9:{pattern:/\d/,optional:!0},"#":{pattern:/\d/,recursive:!0},A:{pattern:/[a-zA-Z0-9]/},S:{pattern:/[a-zA-Z]/}}};a.jMaskGlobals=a.jMaskGlobals||{};q=a.jMaskGlobals=a.extend(!0,{},q,a.jMaskGlobals);
q.dataMask&&a.applyDataMask();setInterval(function(){a.jMaskGlobals.watchDataMask&&a.applyDataMask()},q.watchInterval)});

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
// atlas brands query
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
// debug
// Debug.
var debug = function( message ) {
    if ( typeof( console ) !== 'undefined' && console != null ) console.log( message );
};
// form post handler
// Post form data to Proton, Yodel, and Cake.
var _post_form = function( data ) {
    debug( 'Data: ' + data );
    $.ajax({
        url: post_url,
        type: 'POST',
        data: data,
        async: false,
        success: function( response ) {
            debug( 'Response: ' + response );

            return false;
        },
        error: function(event, response, ajaxSettings, thrownError) {
            // alert(thrownError);
        },
        timeout: 30000 // sets timeout to 30 seconds
    });
}
// submit handler
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
// form preopop
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
// next url handler
// next url stuff here
var handle_next_url = function()
{
    // check if next)url variable has been set for the prometheus page
    if ( next_url.length > 0 )
    {
        // adding usecase to next url handler so we can pass form fields as url params if needed
        var next_location = next_url;

        if ( get_prometheus_data()['exclusive_complete'] != undefined && get_prometheus_data()['exclusive_complete'] == 'true' )
        {
            next_location = next_no_offers_url;
            if ( brand_name == 'Ross Medical Education Center' || brand_name == 'Westwood College' || brand_name == 'Penn Commercial Business and Technology School' || brand_name == 'Redstone College' )
            {
                var brand_name_url = brand_name.replace( /\s+/g, '-').toLowerCase();
                next_location = '/thanks/' + brand_name_url + '.html';
            }
        }
        else
        {
            if ( typeof edu_next_url != 'undefined' && edu_next_url == 'true' )
            {
                next_location = edu_url;

                if ( typeof append_form_fields != 'undefined' && append_form_fields == 'true' )
                {
                    next_location = next_location + '&' + $.param(get_prometheus_data());
                }
            }
            else if ( typeof edu_next_url != 'undefined' && edu_next_url == 'false' )
            {
                next_location = next_location + $('#zip_code').val() + '&adid=' + $('#adid').val();
            }
            else
            {
                if ( typeof append_form_fields != 'undefined' && append_form_fields == 'true' )
                {
                    next_location = next_location + $(form_id).serializeAll();
                }
                if ( typeof follow_next != 'undefined' && follow_next == 'next' )
                {
                    if ( get_prometheus_data()['next'] != undefined )
                    {
                        next_location = decodeURIComponent(get_prometheus_data()['next']);
                    }
                }
            }
        }
        window.location.href = next_location;
    }
    else if ( use_form_action.length > 0 )
    {
        window.location.href = $(form_id).attr('action') + $(form_id).serializeAll();
    }

    if ( $('#next_url:checked').val() != undefined && $('#next_url:checked').val().length > 0 )
    {
        var next_location = $('#next_url:checked').val();
        window.location.href = next_location;
    }
};

$(document).ready(function()
{
    // append url params
    append_url_parameters_to_prometheus_data();

    // run atlas brand search on offer_function
    atlas_brand_generate();

});