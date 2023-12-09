const IconTemplate = {
    IMG: '<img class="menuentry-logo" id="logo-entry" src="${content}">',
    MATERIAL_ICON: '<i class="material-icons menuentry-logo">${content}</i>'
}

function GenerateIconHtml(template, content) {
    return template.replace("${content}", content);
}

const EntryTemplate = {
    NORMAL: '<div class="menuentry">${icon}${content}</div>',
    SELECTED: '<div class="menuentry selected-menuentry">${icon}${content}</div>'
}

function GenerateEntryHtml(template, iconHtml, content) {
    return template.replace("${icon}", iconHtml).replace("${content}", content);
}

class Icon {
    constructor(template, content) {
        this.template = template;
        this.content = content;
    }
}

class Entry{
    constructor(icon, template, content, comment, operation) {
        this.icon = icon;
        this.template = template;
        this.content = content;
        this.comment = comment;
        this.operation = operation;
    }
}

function RunXinux() {
    var menu = document.getElementById("menu");
    menu.style.display = 'none';
    var loader = document.getElementById("loader");
    loader.style.display = 'inline';
    loader.addEventListener('animationend', function(){
        window.location.replace("/components/xinux/bin/xiell");
    });
}

function AboutMe() {

}

var selectedMenuEntry = 0;
var menuEntrys = [ 
    new Entry(new Icon(IconTemplate.IMG, "/res/xinux.svg"), EntryTemplate.SELECTED, "Run Xinux"
      , "Xinux: a Unix-like operating system simulation."
      , RunXinux)
    , new Entry(new Icon(IconTemplate.MATERIAL_ICON, "person"), EntryTemplate.NORMAL, "About Author"
      , "More info about me."
      , AboutMe)
];

function UpdateMenuEntry() {
    var entrys = document.getElementById("menuentrys");
    entrys.innerHTML = '';
    for (var i = 0; i < menuEntrys.length; ++i) {
        var e = menuEntrys[i];
        var entry = document.createElement("div");
        entry.innerHTML = GenerateEntryHtml(e.template, GenerateIconHtml(e.icon.template, e.icon.content), e.content);
        entry.addEventListener('click', SetSelectEntry);
        entrys.appendChild(entry);
        if (e.template == EntryTemplate.SELECTED) {
            var comment = document.getElementById("selected-entry-info");
            comment.innerText = e.comment;
        }
    }
}

function MoveSelectEntry(offset) {
    menuEntrys[selectedMenuEntry].template = EntryTemplate.NORMAL;
    selectedMenuEntry += offset + menuEntrys.length;
    selectedMenuEntry %= menuEntrys.length;
    menuEntrys[selectedMenuEntry].template = EntryTemplate.SELECTED;
}

function SetSelectEntry(e) {
    var targetData = e.target.lastChild.data;
    var offset = 0;
    for (var i = 0; i < menuEntrys.length; ++i) {
        var e = menuEntrys[i];
        if (targetData == e.content) {
            offset = i - selectedMenuEntry; 
            break;
        }
    }
    if (offset == 0) {
        menuEntrys[selectedMenuEntry].operation();
    } else {
        MoveSelectEntry(offset);
        UpdateMenuEntry();
    }
}

function InitBootloader() { 
    UpdateMenuEntry();
    var body = document.getElementsByTagName("body")[0];
    body.addEventListener('keydown', DealKey); 
    sessionStorage.setItem("bootTime", Date.now());
}

function DealKey(e) {
    if (e.code == "ArrowUp") {
        MoveSelectEntry(-1);
        UpdateMenuEntry();
    }
    if (e.code == "ArrowDown") {
        MoveSelectEntry(1);
        UpdateMenuEntry();
    }
    if (e.code == "Enter") {
        menuEntrys[selectedMenuEntry].operation();
    }
}

