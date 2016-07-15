"use strict";

var createTorrent = require('create-torrent')
var fs = require('fs')

var podcastCandidates = fs.readdirSync('static/podcasts/');
var podcasts = [];

for(var i = 0; i < podcastCandidates.length; i++) {
    
    let podcast = podcastCandidates[i];

    if(podcast.endsWith('.mp3') || podcast.endsWith("webm")) {
      podcasts.push(podcast);
    }
}

podcasts.forEach(podcast => {
    createTorrent(`static/podcasts/${podcast}`, {
        urlList: [`https://paul.kinlan.me/podcasts/${podcast}`]
        }, function (err, torrent) {
            if (!err) {
                // `torrent` is a Buffer with the contents of the new .torrent file 
                fs.writeFile('static/podcasts/' + podcast + '.torrent', torrent)
            }
    })
});


var videoCandidates = fs.readdirSync('static/videos/');
var videos = [];

for(var i = 0; i < videoCandidates.length; i++) {
    
    let video = videoCandidates[i];

    if(video.endsWith('.mp4') || video.endsWith("webm")) {
      videos.push(video);
    }
}

videos.forEach(video => {
    createTorrent(`static/videos/${video}`, {
        urlList: [`https://paul.kinlan.me/videos/${video}`]
        }, function (err, torrent) {
            if (!err) {
                // `torrent` is a Buffer with the contents of the new .torrent file 
                fs.writeFile('static/videos/' + video + '.torrent', torrent)
            }
    })
})