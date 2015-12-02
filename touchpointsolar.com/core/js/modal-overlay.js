$( document ).ready(function() {
    $( ".btn-show" ).click(function() {
        $( ".jobdesc" ).slideToggle( "easeInCirc");
        $( "#jobapp" ).slideToggle( "easeInCirc");
        $( ".btn-show" ).fadeOut( "easeInCirc" );
        $( ".btn-hide" ).fadeIn( "easeInCirc" );
    });

    $( ".btn-hide" ).click(function() {
        $( "#jobapp" ).slideToggle( "easeInCirc");
        $( ".jobdesc" ).slideToggle( "easeInCirc");
        $( ".btn-hide" ).fadeOut( "fast" );
        $( ".btn-show" ).fadeIn( "fast" );
    });
    $( ".btn-search-show" ).click(function() {
        $( ".sidebar" ).slideToggle( "easeInCirc");
        $( ".btn-search-show" ).slideToggle( "fast" )
        $( ".btn-search-hide" ).slideToggle( "fast" )
    });
    
    $( ".btn-search-hide" ).click(function() {
        $( ".sidebar" ).slideToggle( "easeInCirc");
        $( ".btn-search-show" ).slideToggle( "fast" )
        $( ".btn-search-hide" ).slideToggle( "fast" )
    });
    $( ".indev-btn" ).click(function() {
        $( ".indev-message" ).fadeIn( "easeInCirc" );
    });

    $( "#privacy__opener" ).click(function() {
        $( "#privacy__dialog" ).fadeIn( "easeInCirc" );
        $( "#privacy__modal-backdrop" ).fadeIn( "fast" );
    });

    $( "#partners__opener" ).click(function() {
        $( "#partners" ).fadeIn( "easeInCirc" );
        $( "#privacy__modal-backdrop" ).fadeIn( "fast" );
    });

    $( "#privacy__closer" ).click(function() {
        $( "#privacy__dialog" ).fadeOut( "fast" );
        $( "#privacy__modal-backdrop" ).fadeOut( "fast" );
    });

    $( "#partners__closer" ).click(function() {
        $( "#partners" ).fadeOut( "fast" );
        $( "#privacy__modal-backdrop" ).fadeOut( "fast" );
    });

    $( "#privacy__modal-backdrop" ).click(function() {
        $( "#privacy__dialog" ).fadeOut( "fast" );
        $( "#partners" ).fadeOut( "fast" );
        $( "#schooldesc" ).fadeOut( "fast" );
        $( "#privacy__modal-backdrop" ).fadeOut( "fast" );
    });

    $('#showRightPush').click(function() {
        $(document.body).toggleClass('cbp-spmenu-push-toleft');
        $('#cbp-spmenu-s2').toggleClass('cbp-spmenu-open');
    });
    
    $('#contact-button').click(function() {
        $('.contact-wrap').slideToggle();
        $(this).text(function(i, text){
            return text === "Contact Us" ? "Close" : "Contact Us";
        })
    });
    $('#menu-button').click(function() {
        $('.menu-wrap').slideToggle();
        $(this).text(function(i, text){
            return text === "Menu" ? "Close" : "Menu";
        })
    });

    $('#zip-submit').click(function() {
        if ( $('#zip_code').val().match(/[0-9]{5}(\-[0-9]{4})?/) ) {
            $(".step-two").delay(400).show("blind");
            $(".step-one").delay(0).hide("blind");
        } else {
            $('#zip_code').css('border-color', '#ef503b');
            $('.zip_validate').show();
        }
        return false;
    });

    $shortform = $('#shortform');
    $searchform = $('#searchform');
    $industry_select = $('.industry_select');
    $program_select = $('.program_select');
    $zip_input = $('.zip_input');
    $('.search_toggle').click(function(){
        $(this).html($(this).html() == 'Search Again <span class="caret"></span>' ? 'Close Search &times;' : 'Search Again <span class="caret"></span>');
        $('#searchform').slideToggle()
    });
    //when a course is selected, populate Program options
    $industry_select.change(function() {
        $industry = null;
        $program = null;
        $industry_select.val($(this).val());
        $('#industry_decoy').text($(this).find("option:selected").text()).append("<span>");
        $('#program_decoy').text("Choose a Program:").append('<span>');
        var industry = $(this).val();
        if ($(this).val()=="" || $(this).val()=="null"){
            // clear out old programs
            $program_select.empty();
            $program_select.attr('disabled','');
            $program_select.prev().removeClass('active');
            /* 			$('#' + $program_select.attr('id') + '_decoy').each().removeClass('active'); */
        } else {
            getPrograms(industry);
        }
    });
    // create decoy for <select> UI
    $('.searchform select').each(function() {
        var $selected = $(this).children(':selected');
        var decoy_id = $(this).attr('id') + '_decoy';
        var decoy = '<div id="'+decoy_id+'" class="decoy">';
        var arrow = '<span>';
        $(this).before(decoy);
        $('#' + decoy_id).text($selected.text()).append(arrow);
        $(this).change(function(){
            set_decoy_value($(this).attr('id'));
        });
        if ($(this).val()!="" || $(this).val()!="null"){
            set_decoy_value($(this).attr('id'));
        }
        $(this).hover(
            function(){
                $('#' + decoy_id).addClass('hover');
            },
            function(){
                $('#' + decoy_id).removeClass('hover');
            }
        );
    });
});

//decoy text change
function set_decoy_value(id){
    var selection = $('#' + id).children(':selected');
    $('#' + id + "_decoy").text(selection.text()).append("<span>");
    if(!selection.val()){
        $('#' + id + "_decoy").removeClass('active');
    } else {
        $('#' + id + "_decoy").addClass('active');
    }
    // not the best option, but the only thing that works for now
    if($('#program').children().length > 1){
        $('#program_decoy').addClass('active');
    }
}
// program sort function
function ProgramSort(a, b) {
    if( $(a).attr('disabled') )
        return -1;

    if( $(b).attr('disabled') )
        return 1;

    return (a.innerHTML > b.innerHTML) ? 1 : -1;
}
// get program list from specific interest id
function getPrograms(industry) {
    var _self = this,
        e = esc,
        industry = industry;
    $.ajax({
        url: 'http://collegeoverview.com/api/program_list/' + industry + '/',
        dataType: 'jsonp',
        success: function(data){
            var html = [],
                h = -1;
            for(var program, i = -1; program = data.programs[++i];)
            {
                html[++h] = '<option value="' + program[0] + '">' + e(program[1]) + '</option>';
            }
            $program_select.each(function(){
                $(this).empty()
                    .append( html.join('') )
                    .removeAttr('disabled');
                // sort array alphaebetically
                $('option',$(this)).sort(ProgramSort).appendTo($(this));
                $('#program_decoy').addClass('active');
                $(this).prepend('<option value="" selected="selected">Choose a Program:</option>');
                $program_select.children(':first').attr("selected", true);
            });
        },
        error: function(){ logError(data.error) }
    });

}
function esc(text) {
    return text.replace('&', '&amp;').replace('»', '&raquo;');
}
