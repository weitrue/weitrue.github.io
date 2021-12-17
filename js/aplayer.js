<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/hint.css/2.4.1/hint.min.css">!(function() {
  var oldLoadAp = window.onload;
  window.onload = function () {
    oldLoadAp && oldLoadAp();

    new APlayer({
      container: document.getElementById('aplayer'),
      fixed: true,
      autoplay: false,
      loop: 'all',
      order: 'list',
      theme: '#b7daff',
      preload: 'none',
      audio: [
        {
          name: '收藏歌曲',
          artist: '王同学Able',
          url: 'https://music.163.com/song?id=1865902042&userid=382096025',
          cover: '/imaegs/img/music.png'
        }
      ]
    });
  }
})();
