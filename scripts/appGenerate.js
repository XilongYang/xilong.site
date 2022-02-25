function appGenerate() {
    new Application("gitalk", "Gitalk"
    , "<div id='gitalk'></div>"
    , "<i class='material-icons'>sticky_note_2</i>", "icons_tray_contact");
    var gitalk_generator = new Gitalk({
        clientID: 'fae12e78dff0504db954',
        clientSecret: 'ae4a8cdf7739c32d9aa86a08fb3278f52d261f7e',
        repo: 'xilongyang.github.io',
        owner: 'XilongYang',
        admin: ['XilongYang'],
        id: "xilong_site",      // Ensure uniqueness and length less than 50
        distractionFreeMode: false  // Facebook-like distraction free mode
    })
    gitalk_generator.render('gitalk')
    
    new Application("music", "Music Player"
    , '<iframe class="fake_window_contents" id="music-content" loading="lazy" src="/components/musicplayer/" frameborder="0"></iframe>'
    , "<i class='material-icons'>album</i>", "icons_tray_tools");
    
    new Application("onedrive", "OneDrive"
    , '<iframe class="fake_window_contents" id="onedrive-content" loading="lazy" src="https://onedrive.xilong.site" frameborder="0"></iframe>'
    , "<i class='material-icons'>cloud_sync</i>", "icons_tray_tools");
    
    new Application("terminal", "Terminal"
    , '<iframe class="fake_window_contents" id="terminal-content" loading="lazy" src="/components/Fe3OS/" frameborder="0"></iframe>'
    , "<i class='material-icons'>terminal</i>", "icons_tray_tools");
    
    new Application("blog_life", "Xilong's Blog"
    , '<iframe class="fake_window_contents" id="blog_life-content" loading="lazy" src="/zh/life/" frameborder="0"></iframe>'
    , "<i class='material-icons non_dark'>podcasts</i>", "icons_tray_tools");
    
    new Application("blog_en", "Xilong's Life"
    , '<iframe class="fake_window_contents" id="blog_en-content" loading="lazy" src="/blog/" frameborder="0"></iframe>'
    , "<i class='material-icons non_dark'>podcasts</i>", "icons_tray_tools");
    
    new Application("blog_zh", "在泥坑里跳来跳去"
    , '<iframe class="fake_window_contents" id="blog_zh-content" loading="lazy" src="/zh/blog/" frameborder="0"></iframe>'
    , "<i class='material-icons non_dark'>podcasts</i>", "icons_tray_tools");
}