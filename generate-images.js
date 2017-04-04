"use strict";

var fs = require('fs');
var exif = require('exif').ExifImage;
var yaml = require('js-yaml');
const outputPath = 'content/life/';


const generateMarkdown = (inputPath, file, outputPath)  => {
  fs.stat(outputPath, function(statError, stat) {
    if(statError) {

      try {
        new exif({image: `${inputPath}${file}`}, function(error, data) {
          try {
            const imageDate = data.exif.CreateDate.split(' ')[0].replace(/:/g, '-');
            const imageName = file.replace(/(\.jpg$|\.jpeg$|\.png$|\.gif$)/,'');
            
            data.image.path = `/${folder.replace('static')}${file}`;
            data.image.name = imageName;
            const imageYaml = yaml.safeDump(data, {});
            const template = `---
date: ${imageDate}
slug: ${imageName}
title: ${imageName}
${imageYaml}
---`;
            fs.writeFile(outputPath, template);
          } catch(err) {
            console.log(`Error parsing image after exif ${file}: ${err.message}`);
          }
        });

      } catch (error) {
        console.log(`Error parsing image ${file}: ${error.message}`);
      }
    }
  });
};


const processFiles = folder => {
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
    let thumbnail = `thubmnail-${file}`;
    generateMarkdown(inputPath, file, mdPath)
    

  });
}

processFiles('life');