/*
    API call for Odin Job Listing Results
 */

// Get Odin Results
var odin_results = function( search_query, zip_code, source )
{
    // Odin API Url
    var api_url = 'http://' + window.location.host + '/odin/api/v1/jobs/?search_query=' + search_query + '&zipcode=' + zip_code + '&source=' + source;

    // Make Odin ajax call
    $.getJSON(api_url, function(data)
    {
        var jobs = data[0].jobs;
        if(jobs.length > 0)
        {
            $('.search_results > ul').empty();

            // iterate through jobs
            for( var i = 0; i < jobs.length; i++ )
            {
                var job = jobs[i];
                if(get_prometheus_data()['reg_submit'] != undefined && get_prometheus_data()['reg_submit'] == 'submitted')
                {
                    $('.search_results > ul').append(
                        '<li class="job">'
                        + '<div class="job_title">'
                        + job.name
                        + '</div>'
                        + '<div class="job_desc details">'
                        + job.company + ' - ' + job.city + ', ' + job.state
                        + '</div>'
                        + '<div class="job_desc">'
                        + job.shortdescription
                        + '</div>'
                        + '<a href="' + job.url + '" class="job_hover" onmousedown="l5_trk(this)"></a>'
                        + '</li>'
                    );
                }
                else
                {
                    $('.search_results > ul').append(
                        '<li class="job">'
                        + '<div class="job_title">'
                        + job.name
                        + '</div>'
                        + '<div class="job_desc details">'
                        + job.company + ' - ' + job.city + ', ' + job.state
                        + '</div>'
                        + '<div class="job_desc">'
                        + job.shortdescription
                        + '</div>'
                        + '<a href="' + job.url + '" class="job_hover"></a>'
                        + '</li>'
                    );
                }
            };

            // add ad tag every 4 job listings
            var ad_count = 1;
            $('li.job:nth-child(5n)').after(function()
            {
                var ad_tags = [];
                var ad_size = 'width:728px; height:90px;';
                if ( $(window).width() <= 728 )
                {
                    ad_tags = [];
                    ad_size = 'width:100%; height:90px;'
                }
                var ad = '';
                if ( ad_count >= ad_tags.length )
                {
                    // do nothing
                }
                else
                {
                    ad = '<!-- BiggerStyle.com Search Results Slot ' + ad_count + ' -->'
                        + '<div id=\'div-gpt-ad-' + ad_tags[ad_count].adid + '\' style="' + ad_size + '">'
                        + '<script type=\'text/javascript\'>'
                        + 'googletag.cmd.push(function() { googletag.display(\'div-gpt-ad-' + ad_tags[ad_count].adid + '\'); });'
                        + '</script>'
                        + '</div>';
                }
                ++ad_count;
                return ad;
            });
        }
    });
}