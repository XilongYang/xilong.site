function screenfetch() {
    return "<div><div class='avatar'><pre>"
        + "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII    "
        + "<br>IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII    "
        + "<br>IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII    "
        + "<br>IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII    "
        + "<br>IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII    "
        + "<br>IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII    "
        + "<br>IIIIIIIIII...IIIIIIIIIIIIII...IIIIIIIIII    "
        + "<br>IIIIIIIIII...IIIIIIIIIIIIII...IIIIIIIIII    "
        + "<br>IIIIIIIIII...IIIIIIIIIIIIII...IIIIIIIIII    "
        + "<br>IIIIIIIIII...IIIIIIIIIIIIII...IIIIIIIIII    "
        + "<br>IIIIIIIIII...IIIIIIIIIIIIII...IIIIIIIIII    "
        + "<br>IIIIIIIIII...IIIIIIIIIIIIII...IIIIIIIIII    "
        + "<br>IIIIIIIIII...IIIIIIIIIIIIII...IIIIIIIIII    "
        + "<br>IIIIIIIIII...IIIIIIIIIIIIII...IIIIIIIIII    "
        + "<br>IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII    "
        + "<br>IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII    "
        + "<br>IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII    "
        + "<br>IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII    "
        + "<br>IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII    "
        + "<br>IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII    "
        + "<br>IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII    "
        + "<br>IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII    "
        + "<br>IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII    "
        + "<br>IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII    "
        + "<br>IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII    "
        +"</pre></div>"
        + "<div class='fetchinfo'>user@Fe3OS<br>----------<br>OS: Fe3OS x86_64<br>Host:Web<br>"
        + "Kernel: 0.1.2<br>Uptime: " + diffTime(new Date(2021, 6, 14), new Date())
        + "<br>Shell: Fe3OShell<br>Resolution: " + window.screen.width
        + "x" + window.screen.height + "<br></div></div>";
}

function diffTime(startDate,endDate) {
    var diff=endDate.getTime() - startDate;//.getTime();//时间差的毫秒数

    //计算出相差天数
    var days=Math.floor(diff/(24*3600*1000));

    //计算出小时数
    var leave1=diff%(24*3600*1000);    //计算天数后剩余的毫秒数
    var hours=Math.floor(leave1/(3600*1000));
    //计算相差分钟数
    var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
    var minutes=Math.floor(leave2/(60*1000));

    //计算相差秒数
    var leave3=leave2%(60*1000);      //计算分钟数后剩余的毫秒数
    var seconds=Math.round(leave3/1000);

    var returnStr = ""
    if(days>0) {
        returnStr += days + "days, " ;//+ returnStr;
    }
    if(hours>0) {
        returnStr += hours + "hours, ";// + returnStr;
    }
    if(minutes>0) {
        returnStr += minutes + "mins, ";//+ returnStr;
    }
    returnStr += seconds + "s";
    return returnStr;
}
