
$(document).ready(function()
{
    if($(window).width() <= 640){
        var $lp_header_bg = $('#wrap > .lp-page-content > .lp-header-bg');
        var $lp_form = $('#wrap > .lp-page-content > .wrapper > .aside');
        $lp_form.after($lp_header_bg);
    }
});