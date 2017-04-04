"use strict";

var fs = require('fs');
var exif = require('exif').ExifImage;
var yaml = require('js-yaml');
var thumb = require('node-thumbnail').thumb;

const outputPath = 'content/life/';

const generateMarkdown = (inputPath, file, outputPath)  => {
  fs.stat(outputPath, function(statError, stat) {
    if(statError) {

      try {
        console.log(`exif ${inputPath}...${file}`)
        new exif({image: `${inputPath}${file}`}, function(error, data) {
          try {
            const imageDate = data.exif.CreateDate.split(' ')[0].replace(/:/g, '-');
            const imageName = file.replace(/(\.jpg$|\.jpeg$|\.png$|\.gif$)/,'');
            const newInptutPath = inputPath.replace('static','');
            data.image.path = `${newInptutPath}${file}`;
            data.image.name = imageName;
            data.image.thumb_path = `${newInptutPath}thumb_${file}`;
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

const generateThumbnail = (inputPath, file, outputPath)  => {
  thumb({
    source: `${inputPath}${file}`,
    destination: outputPath,
    prefix: 'thumb_',
    suffix: ''
  }, function(err, stdout, stderr) {
    console.log('All done!');
  })
}

const processFiles = folder => {
  const inputPath = `static/${folder}/`;
  var candidates = fs.readdirSync(inputPath);
  var files = [];

  for(var i = 0; i < candidates.length; i++) {
    let candidate = candidates[i];

    if(candidate.startsWith('thumb_') == false && (candidate.endsWith('.jpg') || candidate.endsWith('.jpeg') || candidate.endsWith(".png"))) {
      files.push(candidate);
      console.log(candidate)
    }
  }

  files.forEach(file => {
    let mdOutputFile = `${outputPath}${file}.md`;
    let thumbPath = 'static/life/';
    generateMarkdown(inputPath, file, mdOutputFile);
    generateThumbnail(inputPath, file, thumbPath);

  });
}

processFiles('life');