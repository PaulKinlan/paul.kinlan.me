---
slug: extracting-bitmaps-out-of-imagelist-c-
date: 2006-03-20
 
title: Extracting bitmaps out of imagelist c#
published: true
---
A visitor to my site entered the search: "extract bitmaps out of imagelist c#"<p />There are a couple of ways to do this, a simple one is to simply call the Save method on the ImageList Item:<p />imageList1.Images[i].Save("c:\\test.jpg", ImageFormat.Bmp);<p />You could however save it to a Stream, and then manipulate the image as you see fit.<p />MemoryStream ms = new MemoryStream();imageList1.Images[i].Save(ms, ImageFormat.Bmp);byte[] imageBits = ms.ToArray();//Manipulate data<p />

