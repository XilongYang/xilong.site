class Application {
    constructor(name, title, content, icon, trayID) {
        this.name = name;
        this.title = title;
        this.content = content;
        this.generateApp(icon, trayID);
    }
    generateApp(icon, trayID) {
        var tray = document.getElementById(trayID);
        tray.innerHTML += "<div class='app'><div class='icon' id='"+this.name+"-icon' "
                        + "onclick='lightIcon(event);"
                        + "callWindow(event)'>"
                        + "<abbr title=\"" +this.title+ "\">"
                        + icon
                        + "</abbr>"
                        + "</div>"
                        + this.app()
                        + "</div>";
    }
    app() {
        return "<div class='fake_window' draggable='true' "
               + "ondragstart='dragStart(event)' ondragend='dragEnd(event)'"
               + "id='"+this.name+"-div'" 
               + "onclick='updateOrderEvent(event)'>"
               + this.buttons()
               + "<div class='fake_title'>"+this.title+"</div>"
               + this.content+"</div>\n";
    }
    buttons() {
        return "<div class='fake_close non_dark' onclick='closeButtonEvent(event)'></div>"
               +"<div class='fake_full non_dark' onclick='switchFull(event)'></div>"
               +"<div class='fake_min non_dark' onclick='hideButtonEvent(event)'></div>\n"
    }
}