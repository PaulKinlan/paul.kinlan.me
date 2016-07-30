"use strict";

var createTorrent = require('create-torrent')
var fs = require('fs')

const processFiles = function(folder) {
    var candidates = fs.readdirSync(`static/${folder}/`);
    var files = [];

    for(var i = 0; i < candidates.length; i++) {
        let candidate = candidates[i];

        if(candidate.endsWith('.mp4') || candidate.endsWith('.mp3') || candidate.endsWith(".webm")) {
            files.push(candidate);
        }
    }

    files.forEach(file => {
        createTorrent(`static/${folder}/${file}`, {
            urlList: [`https://paul.kinlan.me/${folder}/${file}`]
            }, function (err, torrent) {
                if (!err) {
                    // `torrent` is a Buffer with the contents of the new .torrent file 
                    let torrentPath = `static/${folder}/${file}.torrent`;
                    fs.stat(torrentPath, function(statError, stat) {
                        if(statError) {
                          fs.writeFile(torrentPath, torrent);
                        }
                    });
                    
                }
        })
    });
}

processFiles('podcasts');
processFiles('videos');