function createCookie(cookieName,value,days)
{
    if (days)
    {
        var date = new Date();
        date.setTime(date.getTime()+(days*60*1000));
        var expires = '; expires='+date.toGMTString();
    }
    else var expires = '';
    document.cookie = cookieName+'='+value+expires+'; path=/';
}

function getCookie(name)
{
    var result = "";
    var myCookie = " " + document.cookie + ";";
    var searchName = " " + name + "=";
    var startOfCookie = myCookie.indexOf(searchName);
    var endOfCookie;
    if (startOfCookie != -1)
    {
        startOfCookie += searchName.length;
        endOfCookie = myCookie.indexOf(";", startOfCookie);
        result = unescape(myCookie.substring(startOfCookie, endOfCookie));
    }
    return result;
}
//get multi value cookie value e.g. Person=name=amit&age=25;School=10th
function getCookieMultiValue(cookiename,cookiekey)
{
    var cookievalue=getCookie(cookiename);
    if ( cookievalue == "")
        return "";
    cookievaluesep=cookievalue.split("&");
    for (c=0;c<cookievaluesep.length;c++)
    {
        cookienamevalue=cookievaluesep[c].split("=");
        if (cookienamevalue.length > 1)
        {
            if ( cookienamevalue[0] == cookiekey )
                return cookienamevalue[1].toString();
        }
        else
            return "";
    }

    return "";
}