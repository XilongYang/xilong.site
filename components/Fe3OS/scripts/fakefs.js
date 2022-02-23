var pwd = "/";
var fs = new Map();
fs.set("/", ["<div class='dir'>blog</div>"
           , "<div class='dir'>works</div>"
           , "<div class='file'>README.md</div>"]);
fs.set("/blog/",["<div class='file'>posts.txt</div>"]);
fs.set("/works/", ["<div class='file'>README.md</div>"]);

var files = new Map();
files.set("/README.md", "Hello! Xilong's Here.<br>"
    +"You can learn more about me at <a href='https://xilong.site'>xilong.site</a>.");

files.set("/blog/posts.txt"
, "<a href='https://blog.xilong.site/2021/07/21/0020-STL%E5%AE%B9%E5%99%A8%E6%80%BB%E7%BB%93/'>STL容器备忘总结</a><br>"
+ "<a href='https://blog.xilong.site/2021/07/19/0019-C++%E5%8F%98%E9%87%8F%E5%88%9D%E5%A7%8B%E5%8C%96/'>C++变量初始化</a><br>"
+ "<a href='https://blog.xilong.site/2021/07/18/0018-C++%E4%B8%89%E4%BA%94%E6%B3%95%E5%88%99/'>C++三/五法则</a><br>"
+ "<a href='https://blog.xilong.site/2021/07/17/0016-%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%E7%9A%84Haskell(%E4%BA%8C)/'>从零开始的Haskell（二）——ADT</a><br>"
+ "<a href='https://blog.xilong.site/2021/06/10/0013-%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%E7%9A%84Haskell(%E4%B8%80)/'>从零开始的Haskell（一）——Haskell基础</a><br>"
+ "<a href='https://blog.xilong.site'>Find more in my blog!</a><br>"
);

files.set("/works/README.md"
, "<a href='https://github.com/XilongYang/Fe3OS'>Fe3OS</a>: The project of this site.<br>"
+ "<a href='https://github.com/XilongYang/STAMP'>STAMP-C++</a>: An implement for the STAMP using C++.<br>"
+ "<a href='https://github.com/XilongYang/Connect6'>Connect6</a>: A Connect6 game with a simple AI, making with QT5/C++.<br>"
+ "<a href='https://github.com/XilongYang/VrchPE'>VrchPE</a>: A PE image file for Arch Linux.<br>"
+ "<a href='https://github.com/XilongYang/RunningDango'>RunningDango</a>: A simple game making with Java.<br>"
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
