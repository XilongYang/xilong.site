function screenfetch() {
    return "<div><div class='fox'><pre>"
        +" O                                .. ~   <br>"
        +" $OOZ                          ....O~~   <br>"
        +" $?~~OOOOOOOOOOOOOOOOOOOOOOOOOOO~~~~~~   <br>"
        +"  ??IOOOOOOOOOOOOOOOOOOOOOOOOOO~~~~?~..  <br>"
        +"  $??~OOOOOOOOOOOOOOOOOOOOOOOOO~~~~?~    <br>"
        +"  $??~~OOOOOOOOOOOOOOOOOOOOOOOO~~???~    <br>"
        +"  $~~~~$OOOOOOOOOOOOOOOOOOOOOOO$~~~~~    <br>"
        +"   $$~$$$$$MMMMMOOOOOOOMMMMM$$$$$~~$.    <br>"
        +"   $$~$$$$$$$MM$OOOOOOO$MM$$$$$$$~~$     <br>"
        +"     ???$$$$$$$$OOOOOOO$$$$$$$$I?$$      <br>"
        +"     $?????$$$$$OOOOOOO$$$$$$$???$$      <br>"
        +"   ?????????$$$$OOOOOOO$$$$????????$     <br>"
        +"  .?????????????ONNNDDO????????????$     <br>"
        +"  ??????????????O~NND~O?????????????$    <br>"
        +"  ????? ........~~~~~~~.........????$    <br>"
        +"  ????          ~NNNDD~..........???$    <br>"
        +"   $$           OOOOOOO............$     <br>"
        +"   $$O          OOOOOOO..........OOO     <br>"
        +"    .OOO      .  OOOOO.........OO??OO    <br>"
        +"    .OOOOOOOOO8.    .....OOOOOOO????O    <br>"
        +"    .??????OOO8?.   ...??OO??????????    <br>"
        +"    .???????OO8?    ..???O???????????    <br>"
        +"    .???????OO8?    ..?OOO???????????    <br>"
        +"    .???????OO8?    ..OOO?????????IO?    <br></pre></div>"
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
