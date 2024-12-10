---
date: 2006-05-26
published: true
slug: some-things-about-xlinq
summary: I've been experimenting with XLinq in C# 3.0, but I'm not impressed with
  its querying capabilities. It seems to require loading the entire XML document into
  memory, which caused problems when I tried to process a 900MB file.  A simple XML
  reader was much more efficient for this task.  I'd like to see an XLinq implementation
  that can process XML data in a streaming fashion, similar to SAX or XmlReader, to
  avoid memory issues. This would make it more practical for large documents.  Perhaps
  XLinq already supports this, but I haven't found how. For now, it seems best suited
  for smaller files.
tags:
- XLinq
- C# 3.0
- XML
- Querying
- Performance
- Memory
- SAX
- XmlReader
- Streaming
- DOM
title: Some things about XLinq

---
I have been playing around with XLinq in C# 3.0, and I must say I am not that fulfilled by the querying aspects of the API.<p />I must say this right now, I have not explored its potential fully, and I am definatly not an expert on the subject but I was hoping for something more.  For instance, my biggest gripe at the moment is that it has an "in-memory" query language (unless I am mistaken) which means that the XML document has to be fully loaded into memory.<p />I don't have the code I was using in hand at the moment, but I wanted to load a 900MB XML file to do some simple processing on it.  I had the code ready to itterate accross the XML document and do a simple select on the data fields that I wanted and it would return a List&lt;&gt; of the correct objects (this part seemed cool).  I ran out of memory though :(  I did the same thing with a normal XML Reader in just the same time it took me to create the SELECT statement (admitadly I had to learn about XLinq) and it was soooooo much quicker and the memory footprint was a lot smaller.  It just struck me that using XLinq was an overkill, it didn't offer me anything extra for this simple task and it had to load the whole document into memory.  I would like to see an XLinq that didn't have to load the whole document but could SAX push or XmlReader pull the data as it scanned through the document.  I am pretty sure (after I thought about it) that this would be achieve able quite easily on Microsofts part, because I presume (and I am only presuming) that the XLinq has to forward scan and depth traverse through the DOM that it would be like scanning through the document with an XMLReader, after all the way the .Select arguments are ordered is pretty intuative to that sort of scanning.  Other operations such as grouping could be done one the array of filtered objects has been brought back.  This way he document would not have to be completly loaded into memory first and only a subset of the data would be loaded.<p />Maybe XLinq can do this already.  I am definatly not seeing how, but I know I can miss things.  It just seems that it will be okay at the small things, but after a certain size document it loses its appeal.<p />

