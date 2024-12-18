---
date: 2006-06-09
published: true
slug: re-some-things-about-xlinq
summary: This post responds to Mike Champion's comment on my previous XLinq blog post.
  I clarify the XML file used (Wikipedia XML Abstract) and explain why I chose an
  XMLReader for its speed, especially when combined with custom data structures for
  a cyclic graph representation.  XLinq's syntax and lambda expressions felt less
  intuitive for my task of converting XML into SQL statements. The project involves
  relating \"title\" elements with \"sublink\" entities, resulting in a complex graph
  structure not easily handled by XLinq without excessive data duplication and memory
  consumption.  While XStreamingElement offers some improvement by avoiding redundant
  data scans, I desire deferred data loading for processing only necessary slices
  of the XML.  This approach could handle selects, wheres, and counts efficiently
  in a single pass, and even joins with clever indexing. Defining a schema during
  XML iteration seems redundant when XLinq expressions already specify data requirements.  Pre-loading
  entire XML documents into memory feels inefficient when only a small portion is
  used. I propose deferring data loading until needed, despite potential issues with
  repeated XDocument inspections. Ideally, XLinq should scale without forcing users
  to revert to less efficient methods due to data size limitations. I inquire about
  potential hard limits and scaling formulas related to XML document size in XLinq.
tags:
- XLinq
- XML
- C#
- .NET
- LINQ
- XMLReader
- Performance
- Scalability
- Memory Management
- Data Processing
- Streaming
- Deferred Execution
- SQL
- Wikipedia
- Graph Data Structures
title: 'RE: Some things about XLinq'

---
This is a response to the comment on my blog (<a href="http://www.kinlan.co.uk/2006/05/some-things-about-xlinq.html">http://www.kinlan.co.uk/2006/05/some-things-about-xlinq.html</a>) by Mike Champion<p />Firstly, I can point to the XML file for you easily.  It is the Wikipedia XML Abstract file (<a href="http://download.wikimedia.org/enwiki/20060518/enwiki-20060518-abstract.xml" target="_blank">http://download.wikimedia.org/enwiki/20060518/enwiki-20060518-abstract.xml </a>).  The format of it is pretty rigid, I am not too sure if there is a schema available but you can see that it is pretty self explanitory, there is no header information (from what I can remember) and it is one large document.<p />In my example that I was playing with, I ended up using an XMLReader and it was blazingly quick.   Additionally I had to do a bit of logic (inserts in to a hash table) based on the content of each node and I couldn't work out how to do it in XLinq, I still find the syntax a little bit odd and the lambda syntax don't always come accross as easy to read for me at least.<p />The project I was working on would take the XML and convert it into a series of SQL statements, from the XML I would take the "title" element and relate the child "sublink" entities with its parent (in a custom data structure), now although the XML data is in a tree structure, the resulting data is in a cyclic graph structure because the child sublink entities may have more than one parent and also may also be a parent element itself linking (its children being one of its parents).  This was very simple to do when itterating accross the data because I could ignore the bits of the data that I didn't need and only construct custom data strcutures out of the bits I did.  I would then itterate across the final data strcuture and convert it into SQL statements.<p />I wouldn't have minded doing the work in several XLinq expressions if that was the only way of doing it, but that would have been even less feasible because the data would get copied several times and would also exist several times too (as well as scanning over all the data several times) and I would quickly run out of memory.<p />I think I understand the concept of the XStreamingElement, but the only benefit I can see at the moment is that it stops the internals having to do two scans of the data, one to construct the data and one to then output the data.  This concept makes sense though (I think).<p />The feature I would like to see is the simillar as this (conceptually), but the loading/parsing of the data is deferred until I start to generate the output or do my itterations. I personally cannot think of situations where a single read over the XML data at query execution time cannot be used (thus avoiding loading all the data and then itterating over the data) and thus not having to load all the data into memory.  Simple Selects, Wheres and Counts could all be constructed in a single pass.  Joins would be harder but file index posistions could be kept to ensure that quick access to the joining key would be kept so that the whole document still does not need to be loaded.<p />I can't see the need to define a schema (suggestion a in the original comment )in the XML sense when itterating accross the data, the developer is already defining a schema when they do the XLinq expressions but they are only defining what they want to consume, if I was to say select all titles from an xml document (like the wikimedia abstract document) where the value in the title has 24 characters and return the string value then I don't really care about the sibling nodes so why do they need to get loaded in to memory. If I were to return XElements for each of the elements in a document where the title node has 24 charatcers then I would have really thought that you can load the elements in as and when the approriate title node has been found.  If any execution is needed on these elements because they have been constructed then they could easily be parsed and used because they are needed.<p />I really do dislike having to load all the data in to memory at once when I am only using a small slice of it. <p />I really would like to be able to defer the loading of the data until the time it is needed (this I think would be awkward if you inspected the same XDocument twice - I can see why two disc scans of the data might be bad).<p />I don't like the idea of saying to a customer you have reached an upper limit revert back to the old way of doing things.  I expect you would see a lot of complaints from people saying that XLinq won't scale and that they had to re-design their app completly because of this.  Do you know of any hard and fast limit to the amount of data that can be processed? Is their a formula? Use XLinq when XML Document size Thats about it for now I think :)<p />I hope this helps,if you have any questions or this email doesn't make sense I will gladly expand on the points.<p />

