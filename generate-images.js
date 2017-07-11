"use strict";

var fs = require('fs');
var exif = require('exif').ExifImage;
var yaml = require('js-yaml');
var thumb = require('node-thumbnail').thumb;

const outputPath = 'content/life/';

const parseImageDate = (file, exifData) => {
  if(exifData.exif.CreateDate) {
    return exifData.exif.CreateDate.split(' ')[0].replace(/:/g, '-');
  }
  else {
    const imageDateRegex = /IMG_(\d{4})(\d{2})(\d{2})/;
    const results = imageDateRegex.exec(file);
    if(results == null) {
      throw new Error(`Unable to parse date ${file}`);
    }
    if(results.length == 4) {
      return `${results[1]}-${results[2]}-${results[3]}`;
    }
    else {
      throw new Error('Unable to parse date');
    }
  }
};

const generateMarkdown = (inputPath, file, outputPath)  => {
  fs.stat(outputPath, function(statError, stat) {
    if(statError) {

      try {
        console.log(`exif ${inputPath}...${file}`)
        new exif({image: `${inputPath}${file}`}, function(error, data) {
          if(error) {
            console.log(`Error with exif ${inputPath}${file} `);
            return;
          }
          try {
            const imageDate = parseImageDate(`${inputPath}${file}`, data);
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
            fs.writeFile(outputPath, template, function(err, data) { 
              if(err) console.error(`Error writing markdown after exif ${file}: ${err}`);
            });
          }
          catch(err) {
            console.error(`Error parsing image after exif ${file}: ${err.message}`);
            console.error(data);
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
  }, function(files, err, stdout, stderr) {
    console.log('All done!', err);
  });
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
    let thumbPath = `static/${folder}/`;
    generateMarkdown(inputPath, file, mdOutputFile);
    generateThumbnail(inputPath, file, thumbPath);
  });
}

processFiles('life');