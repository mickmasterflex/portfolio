//Zipcode field has changed. Do something about the change
zipcode = $('#zip_code').val();
if ( zipcode != undefined )
{
    if ( zipcode.length > 0 )
    {
        getPositionJsonZip(zipcode);
    }
    else
    {
        $('#zip_code').blur(function()
        {
            zipcode = $('#zip_code').val();
            if (zipcode.length > 0) {
                getPositionJsonZip(zipcode);
            }
        });
    };
};