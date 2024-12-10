---
date: 2006-03-20
published: true
slug: extracting-bitmaps-out-of-imagelist-c-
summary: 'This post provides a quick solution for developers looking to extract individual
  bitmap images from an ImageList in C#.  It demonstrates two approaches: direct saving
  to a file using the `Save` method with a specified file path and format, and saving
  to a `MemoryStream` for in-memory manipulation before further processing or storage.  The
  MemoryStream approach offers greater flexibility for image operations.'
tags:
- c#
- imagelist
- bitmap
- extract
- save
- memorystream
- image manipulation
title: Extracting bitmaps out of imagelist c#

---
A visitor to my site entered the search: "extract bitmaps out of imagelist c#"<p />There are a couple of ways to do this, a simple one is to simply call the Save method on the ImageList Item:<p />imageList1.Images[i].Save("c:\\test.jpg", ImageFormat.Bmp);<p />You could however save it to a Stream, and then manipulate the image as you see fit.<p />MemoryStream ms = new MemoryStream();imageList1.Images[i].Save(ms, ImageFormat.Bmp);byte[] imageBits = ms.ToArray();//Manipulate data<p />

