var startX;
var startY;
function dragStart(e) {
    startX = e.screenX;
    startY = e.screenY;
}
function dragEnd(e) {
    var target = document.getElementById(e.path[0].id);
    var endX = e.screenX;
    var endY = e.screenY;
    var originX = parseInt(target.getBoundingClientRect().left);
    var originY = parseInt(target.getBoundingClientRect().top);
    target.style.left = originX + endX - startX + "px";
    target.style.top = originY + endY - startY + "px";
}