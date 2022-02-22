var startX;
var startY;
function dragStart(e) {
    startX = e.pageX;
    startY = e.pageY;
}
function dragEnd(e) {
    var target = document.getElementById(e.path[0].id);
    var endX = e.pageX;
    var endY = e.pageY;
    var originX = parseInt(target.getBoundingClientRect().left);
    var originY = parseInt(target.getBoundingClientRect().top);
    target.style.left = originX + endX - startX + "px";
    target.style.top = originY + endY - startY + "px";
}