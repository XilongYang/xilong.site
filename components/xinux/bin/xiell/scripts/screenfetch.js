function screenfetch() {
    function diffTime(now) {
        var diff=now - sessionStorage.getItem("bootTime");
    
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
    
    function getBrowserName() {
        var userAgent = navigator.userAgent;
    
        if (userAgent.indexOf("Firefox") > -1) {
            return "Firefox";
        } else if (userAgent.indexOf("Chrome") > -1) {
            return "Google Chrome";
        } else if (userAgent.indexOf("Safari") > -1) {
            return "Safari";
        } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident/") > -1) {
            return "Internet Explorer";
        } else {
            return "Other Browser";
        }
    }
    return "<div><div class='avatar'><pre>"
        + "                             .          "
        + "<br>                          '>f`          "
        + "<br>                       `?M$c.           "
        + "<br>                   .\"18$$$/.            "
        + "<br>                .;f$$$$$$~              "
        + "<br>               ;>$$$$$$@,.              "
        + "<br>              :$(,%$$$W`'               "
        + "<br>             .&$$c\"*$n.`                "
        + "<br>             ~$$$$8\"<.^                 "
        + "<br>            .B$$$$$!.\"`                 "
        + "<br>            [$$$$B\"^%}\"\"                "
        + "<br>           '$$$$M'I$$$r`,               "
        + "<br>           |$$$r.[$$$$$M^\"              "
        + "<br>          `$$${.x$$$$$$$B,^             "
        + "<br>          n$$;'#$$$$$$$$$$+`.           "
        + "<br>         \"$%^\"%$$$$$$$$$$$$|'.          "
        + "<br>         zz'>$$$$$$$$$$$$$$$c`.         "
        + "<br>        :f.)$$$$$$$$$$$$$$$$$%^.        "
        + "<br>        <.u$$$$$$$$$$$$$$$$$$$@;        "
        +"</pre></div>"
        + "<div class='fetchinfo'>guest@Xinux"
        + "<br>----------"
        + "<br>OS: Xinux"
        + "<br>Host:Web"
        + "<br>Kernel: 0.1.0"
        + "<br>Uptime: " + diffTime(Date.now())
        + "<br>Shell: Xiell"
        + "<br>Resolution: " + window.screen.width + "x" + window.screen.height 
        + "<br>Terminal: " + getBrowserName()
        + "<br></div></div>";
}
