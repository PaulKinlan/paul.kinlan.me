"use strict";

var fs = require('fs');
var exif = require('exif').ExifImage;
var yaml = require('js-yaml');
const outputPath = 'content/life/';

const processFiles = function(folder) {
  const inputPath = `static/${folder}/`;
  var candidates = fs.readdirSync(inputPath);
  var files = [];

  for(var i = 0; i < candidates.length; i++) {
    let candidate = candidates[i];

    if(candidate.endsWith('.jpg') || candidate.endsWith('.jpeg') || candidate.endsWith(".png")) {
      files.push(candidate);
    }
  }

  files.forEach(file => {
    let mdPath = `${outputPath}/${file}.md`;
    fs.stat(mdPath, function(statError, stat) {
      if(statError) {

        try {
          new exif({image: `${inputPath}${file}`}, function(error, data) {
            try {
              const imageDate = data.exif.CreateDate.split(' ')[0].replace(/:/g, '-');
              const imageName = file.replace(/(\.jpg$|\.jpeg$)/,'');
              
              data.image.path = `/${folder}/${file}`;
              data.image.name = imageName;
              const imageYaml = yaml.safeDump(data, {});
              const template = `---
date: ${imageDate}
slug: ${imageName}
title: ${imageName}
${imageYaml}
---`;
              fs.writeFile(mdPath, template);
            } catch(err) {
              console.log(`Error parsing image after exif ${file}: ${err.message}`);
            }
          });

        } catch (error) {
          console.log(`Error parsing image ${file}: ${error.message}`);
        }
      }
    });

  });
}

processFiles('life');