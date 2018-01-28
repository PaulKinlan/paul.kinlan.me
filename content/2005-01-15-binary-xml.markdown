---
slug: binary-xml
date: 2005-01-15
 
title: Binary XML
published: true
---
I have just been reading a bit about Binary XML.  Am I missing something?
<p />
There are lots of arguments against XML which I will try and summarise:
<br /><ul>
<li>Text Processing is Slow;</li>
<li>The Verbosity can cause storage problems;</li>
<li>You can't store binary data,</li>
</ul><p>Basically, most of the arguments against using XML for data storage and transmission revolve around the time it takes to process the text, storing strings of data rather than there binary representation (such as "12" instead of 00001100 [binary byte]).</p><p>I have been working with XML based data for a while now and I don't really see many problems with data storage as text.  It doesn't seem to be that slow for what I use.  Processing speed and datasizes can be made up by slightyly reducing the verbosity of the tags and attributes.  In the end you can always gzip.  As for binary data, couldn't you just store the data in a CDATA, and also include the endian?</p><p>With Binary XML's I just don't see the point.  How much space would you save if you had a well defined XML.  How are you supposed to know the data you are looking at in Binary XML with the added loss of verbosity (I suppose a schema would come in to play, but would that also be binary?)  why not just lose the XML and just have a binary data store which you define and process how you want?  How would you throw a nice little XPath query together?  Would you have to perform a translation BINARY TOKEN  TEXTUAL TOKEN?</p><p>Would a Binary XML parser be better for memory constrained devices?  </p><p>Some good links I have found </p><ul>
<li>
<a href="http://www.xml.com/pub/a/2003/08/13/deviant.html">http://www.xml.com/pub/a/2003/08/13/deviant.html</a> [Binary XML, Again], A nice level article about some of the pros and cons.</li>
<li>
<a href="http://www.www2004.org/proceedings/docs/1p345.pdf">http://www.www2004.org/proceedings/docs/1p345.pdf</a>  [An Evaluation of Binary XML Encoding Optimizations for Fast Stream Based XML Processing], A paper comparing Binary XML based technologies.  I haven't seen most of the technologies but it is a good read anyway.</li>
<li>
<a href="http://lists.xml.org/archives/xml-dev/200104/msg00207.html">http://lists.xml.org/archives/xml-dev/200104/msg00207.html</a> [RE: "Binary XML" proposals], A thread about storing Binary Data in an XML file that seemed to gravitate towards BinaryXML :)</li>
</ul>
<br />

