var cmd_his = [];
var cmd_indx = 0;
var complete = new Map();
var cmd_set = ["ls", "cd", "cat", "screenfetch"
    , "uname", "clear", "help", "exit"];

function read_cmd(event){
    var welcome = document.getElementById("welcome");
    var msg = document.getElementById("hismsg");
    var cur_msg = document.getElementById("curmsg");
    var cur_cmd = document.getElementById("cmd");

    var tips = document.getElementById("tipsmsg");
    tips.innerHTML = "";
    // prev_cmd
    if (event.keyCode == 38 && cmd_indx != 0) {
        cmd_indx--;
        cur_cmd.value = cmd_his[cmd_indx];
    } 
    // next_cmd
    if (event.keyCode == 40 && cmd_indx < cmd_his.length) {
        cmd_indx++;
        if (cmd_indx >= cmd_his.length) {
            cur_cmd.value = ""
            return;
        }
        cur_cmd.value = cmd_his[cmd_indx];
    } 

    // complete_cmd
    if (event.keyCode == 9) {
        if (event.preventDefault) { event.preventDefault(); }
            else { event.returnValue = false; }

        var parsed_cmds = [];
        cmd_set.forEach(c => {
            if (c.startsWith(cur_cmd.value)) {
                parsed_cmds.push(c);
            }
        });
        if (parsed_cmds.length == 1) {
            cur_cmd.value = parsed_cmds[0] += " ";
        } else {
            parsed_cmds.forEach(c => {
                tips.innerHTML += c;
                tips.innerHTML += ' ';
            });
        }
    }

    var width = cur_cmd.value.length * 10 + 32;
    cur_cmd.style.width= width + "px";

    if (event.keyCode != 13) return;

    var identinfo = document.getElementById("pwd").innerText;
    msg.innerHTML += "[" + identinfo + "]$ " + cur_cmd.value + "<br>";

    cmd_his.push(cur_cmd.value);
    cmd_indx = cmd_his.length;

    result = parse_cmd(cur_cmd.value);
    if (result == "--clr__clr") {
        msg.innerHTML = "";
    } else if (result == "exit") {
        parse_cmd("cd /");
        welcome.style.display = "none";
        cur_msg.style.display = "none";

        msg.innerHTML = "Good bye!";

        setTimeout(() => {
            msg.innerHTML = "";
            msg.innerHTML = "Restarting...";
        }, 1000);

        setTimeout(() => {
            welcome.style.display = "block";
            cur_msg.style.display = "block";
            msg.innerHTML = "";
        }, 2000);
        
    } else {
        msg.innerHTML += result;
        if (result != "") {
            msg.innerHTML += "<br>"
        }
    }

    cur_cmd.value = "";
}

function parse_cmd(value) {
    var rex = /\s+/g;
    var args = value.replace(rex, ' ').trim().split(' ');
    switch (args[0]) {
        case "clear":
            return clear(args);
        case "help":
            return get_help();
        case "exit":
            return "exit";
        case "uname":
            if (args.length > 1) {
                return "uname: invalid option: " + args[1];
            }
            return "Fe3OS";
        case "screenfetch":
            // screenfetch.js: screenfetch
            return screenfetch();
        // fakefs.js
        case "ls":
            return ls(args);
        case "cd":
            return cd(args);
        case "cat":
            return cat(args);
        case "":
            return "";
    }
    return "Command not found: "+args[0]+ "<br>Type 'help' to get help messages."
}

function clear(args) {
    if (args.length > 1) {
        if (args[1] != "-V")
            return "Usage: clear [options]<br><br>Options:<br>-V :print terminal-version";
        else
            return "FeTerminal V0.1";
    }
    return "--clr__clr";
}

function get_help() {
    return "Support commands:<br><pre>ls    cd    cat    screenfetch</pre>"
    + "<pre>uname    clear    help    exit</pre>";
}
