var pwd = "/";
var fs = new Map();
fs.set("/", ["<div class='dir'>blog</div>"
           , "<div class='dir'>works</div>"
           , "<div class='file'>README.md</div>"]);
fs.set("/blog/",["<div class='file'>posts.txt</div>"]);
fs.set("/works/", ["<div class='file'>README.md</div>"]);

var files = new Map();
files.set("/README.md", "Hello! Xilong's Here.<br>"
    +"You can learn more about me at <a target='_blank' href='https://xilong.site'>xilong.site</a>.");

files.set("/blog/posts.txt"
, "<a target='_blank' href='/blog/2022/01/08/0033-Haskell:operator_and_lazy/'>Haskell：理解惰性求值与运算符优先级</a><br>"
+ "<a target='_blank' href='/blog/2021/09/23/0028-RB_Tree_C++/'>红黑树概念解析与C++实现</a><br>"
+ "<a target='_blank' href='/blog/2021/07/19/0019-C++:Variable_initialization/'>C++变量初始化</a><br>"
+ "<a target='_blank' href='/blog'>Find more in my blog!</a><br>"
);

files.set("/works/README.md"
, "<a target='_blank' href='https://github.com/XilongYang/littledb'>LittleDB</a>: A simple C++ library provides an embedded K-V database and some encrypt/decrypt concerned functions.<br>"
);

function path(dir, type = "file") {
    if (dir[0] != '/') {
        dir = pwd + dir;
    }
    if (type == "dir") {
        if (dir[dir.length - 1] != '/') {
            dir += "/";
        }
    }
    var rex = /\/+/g;
    dir = dir.replace(rex, '/');
    return dir;
}

function show(dir) {
    dir = path(dir, "dir");
    var result = fs.get(dir);
    if (result == undefined) {
        return "ls: " + dir + " no such file or directory.";
    }
    var result_str = "";
    result.forEach(name => {
        result_str += name + " ";
    });
    return result_str;
}

function ls(args) {
    if (args.length == 1) {
        return show(pwd);
    }else if(args.length == 2){
        return show(args[1]);
    } else {
        var return_str = "";
        for (var i = 1; i < args.length; ++i) {
            if (return_str !== "") {
                return_str += "<br>"
            }
            return_str += args[i] + ":<br>";
            return_str += show(args[i]);
        }
        return return_str;
    }
}

function cd(args) {
    if (args.length > 2) return "Usage:<br>cd dir_name";
    if (args.length <= 1 || args[1] == ".") return "";
    var pwd_span = document.getElementById("pwd");
    if (args[1] == '..') {
        if (pwd == "/") {
            return "cd: Permession denied."
        }
        var pos = pwd.substr(0, pwd.length - 1).lastIndexOf('/');
        pwd = pwd.slice(0, pos + 1);
        pwd_span.innerHTML = pwd;
        return "";
    }
    var dir = path(args[1], "dir");
    var result = fs.get(dir);
    if (result == undefined) {
        return "cd: " + dir + " not a dirctory.";
    }
    pwd = dir;
    pwd_span.innerHTML = pwd;
    return "";
}

function cat(args) {
    if (args.length < 2) {
        return "Usage: cat file1[ file2 file3...]";
    }
    var result_str = ""
    for (var i = 1; i < args.length; ++i) {
        var file = path(args[i]);
        if (files.get(file) == undefined) {
            result_str += "cat: " + args[i] + ": not found.<br>";
        } else {
            result_str += files.get(file) + "<br>";
        }
    }
    return result_str;
}
