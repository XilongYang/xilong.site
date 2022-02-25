class Application {
    constructor(name, title, content, icon, trayID) {
        this.name = name;
        this.title = title;
        this.content = content;
        this.#generateApp();
        this.#generateIcon(icon, trayID);
    }
    #generateIcon(icon, trayID) {
        var tray = document.getElementById(trayID);
        tray.innerHTML += "<div class='icons' id='"+this.name+"-icon' "
                        + "onclick='lightIcon(\""+this.name+"-icon\");"
                        + "callWindow(\""+this.name+"-div\", \"fadein 0.5s\")'>"
                        + "<abbr title=\"" +this.title+ "\">"
                        + icon
                        + "</abbr>"
                        + "</div>";
    }
    #generateApp() {
        var windows = document.getElementById("windows");
        windows.innerHTML += "<div class='fake_window' draggable='true' "
                           + "ondragstart='dragStart(event)' ondragend='dragEnd(event)'"
                           + "id='"+this.name+"-div'>"
                           + this.#buttons()
                           + this.#title()
                           + this.content+"</div>\n";
    }
    #buttons() {
        return "<div class='fake_close non_dark' onclick='closeWindow(\""+this.name
               +"-div\", \"fadeout 0.5s\", true, \""+this.name+"-icon\",\""+this.name
               +"-content\")'></div>\n"
               +"<div class='fake_full non_dark' onclick='switchFull(\""+this.name
               +"-div\")'></div>\n"
               +"<div class='fake_min non_dark' onclick='closeWindow(\""+this.name
               +"-div\", \"fadeout 0.5s\")'></div>\n";
    }
    #title() {
        return "<div class='fake_title'>"+this.title+"</div>";
    }
}