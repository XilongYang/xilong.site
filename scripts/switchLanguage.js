function switchLanguage() {
    var lang = document.getElementById("language").value;
    if (lang == "en") {
        document.getElementById("name").innerHTML = "Xilong Yang";
        document.getElementById("occupation").innerHTML = "Programer";
        document.getElementById("language_label").innerHTML = "Language:";
        document.getElementById("stamp_intro").innerHTML = "Simple Two-Way Active Measure Protocol(IETF RFC8762).";
        document.getElementById("Fe3OS_intro").innerHTML = "A simple web page which simulates a UNIX Shell.";
        document.getElementById("misc").innerHTML = "misc.";
        document.getElementById("about_label").innerHTML = "About";
        document.getElementById("intro").innerHTML = "I'm a programer with 3 years of experience about C++ and Linux.";
        document.getElementById("intro_site").innerHTML = 'I maintain a <a href="https://github.com/XilongYang">github account</a> and <a href="/blog">blog</a>.';
        document.getElementById("intro_email").innerHTML = 'You can contact me though email <a href="mailto:xilong.yang@foxmail.com">xilong.yang@foxmail.com</a>';
        document.getElementById("nomore").innerHTML = '* no more info.';
    } else if (lang == "zh") {
        document.getElementById("name").innerHTML = "杨熙龙";
        document.getElementById("occupation").innerHTML = "程序员";
        document.getElementById("language_label").innerHTML = "语言:";
        document.getElementById("stamp_intro").innerHTML = "简单的双向主动测量协议 (IETF RFC8762)。";
        document.getElementById("Fe3OS_intro").innerHTML = "一个模拟 UNIX Shell 的简单网页。";
        document.getElementById("misc").innerHTML = "更多";
        document.getElementById("about_label").innerHTML = "关于我";
        document.getElementById("intro").innerHTML = "我是一个有3年 C++ 和 Linux 经验的程序员。";
        document.getElementById("intro_site").innerHTML = '我有一个<a href="https://github.com/XilongYang">github帐号</a>和一个<a href="/blog">博客</a>。';
        document.getElementById("intro_email").innerHTML = '你可以通过邮件<a href="mailto:xilong.yang@foxmail.com">xilong.yang@foxmail.com</a>联系我。';
        document.getElementById("nomore").innerHTML = '* 没有更多信息了。';
    } else if (lang == "jp") {
        document.getElementById("name").innerHTML = "楊(ヤン) 熙龍(シロ)";
        document.getElementById("occupation").innerHTML = "プログラマー";
        document.getElementById("language_label").innerHTML = "言語:";
        document.getElementById("stamp_intro").innerHTML = "シンプルな双方向アクティブ測定プロトコル(IETF RFC8762)。";
        document.getElementById("Fe3OS_intro").innerHTML = "UNIXシェルをシミュレートする単純なWebページ。。";
        document.getElementById("misc").innerHTML = "もっと";
        document.getElementById("about_label").innerHTML = "紹介";
        document.getElementById("intro").innerHTML = "私はC++とLinuxについて3年の経験を持つプログラマーです。";
        document.getElementById("intro_site").innerHTML = '<a href="https://github.com/XilongYang">githubアカウント</a>と<a href="/blog">ブログ</a>を持っています。';
        document.getElementById("intro_email").innerHTML = 'メール<a href="mailto:xilong.yang@foxmail.com">xilong.yang@foxmail.com</a>で私に連絡することができます。';
        document.getElementById("nomore").innerHTML = '* これ以上の情報はありません。';
    }
}