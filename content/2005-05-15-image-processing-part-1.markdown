---
date: 2005-05-15
published: true
slug: image-processing-part-1
summary: In this first part of my image processing series, I'm sharing how I used
  the Yahoo Search API to find images and load them into a C# application.  I was
  excited to discover how straightforward it is to query for images and then seamlessly
  integrate the results into my project. The process involves constructing a REST
  query with search parameters, sending the request to Yahoo, receiving the XML response,
  and deserializing it into a custom data type. Then, I iterate through each image
  result in the response, create another query to download the image, and finally,
  convert the downloaded stream into a Bitmap and load it into an ImageList.  Stay
  tuned for more in this series!
tags:
- image processing
- C#
- Yahoo Search API
- REST
- XML
- serialization
- Bitmap
- ImageList
title: 'Image Processing: Part 1'

---
I get so many things running through my head that I want to do.  I was looking at the Yahoo search API and I found that you can search forimages.  So I decided to do some tests to see what I can do with the results and how easy it would be in C# to load the images (it isreally easy, I was well chuffed when it all clicked into place)<p /><p style="COLOR: #000000;">  <span style="COLOR: #0000ff;">string</span> <span style="">query = <a href="http://api.search.yahoo.com/ImageSearchService/V1/imageSearch?">http://api.search.yahoo.com/ImageSearchService/V1/imageSearch?</a>;</span>  query += "appid=[SOMEIDSHOULDGOHERE]&amp;";      query += "query=" + txtQuery.Text +"&amp;";      query += "results=5&amp;";      query += "start=1&amp;";  query += "format=any";  imageList = <span style="COLOR: #0000ff;">new</span><span style="COLOR: #000080;">ImageList</span>();      <span style="COLOR: #000080;">WebRequest</span><span style="">wr =</span><span style="COLOR: #000080;">WebRequest</span>.Create(query);  <span style="COLOR: #0000ff;">using</span><span style="">(</span><span style="COLOR: #000080;">WebResponse</span> wResp = wr.GetResponse())    {</p><blockquote style="MARGIN-RIGHT: 0px;">ImageSearchResponse.<span style="COLOR: #000080;">ResultSet</span> <span style="">imgResp =</span> <span style="COLOR: #0000ff;">new</span><span style="">ImageSearchResponse.</span><span style="COLOR: #000080;">ResultSet</span>();  <span style="COLOR: #0000ff;">using</span><span style="">(</span><span style="COLOR: #000080;">Stream</span> responseStream = wResp.GetResponseStream())  {<blockquote style="MARGIN-RIGHT: 0px;">
<span style="COLOR: #000080;">XmlSerializer</span> <span style="">serializer =</span>  <span style="COLOR: #0000ff;">new</span><span style="COLOR: #000080;">XmlSerializer</span><span style="">(</span><span style="COLOR: #0000ff;">typeof</span><span style="">(ImageSearchResponse.</span><span style="COLOR: #000080;">ResultSet</span>));  imgResp = (ImageSearchResponse.<span style="COLOR: #000080;">ResultSet</span>)serializer.Deserialize(responseStream);  </blockquote>}  //Add the images into   <span style="COLOR: #0000ff;">int</span> imageIdx = 0;  <span style="COLOR: #0000ff;">foreach</span><span style="">(ImageSearchResponse.</span><span style="COLOR: #000080;">ResultType</span><span style="">rt</span> <span style="COLOR: #0000ff;">in</span> imgResp.Result)    { <blockquote style="MARGIN-RIGHT: 0px;">
<span style="COLOR: #000080;">WebRequest</span><span style="">wrImage =</span><span style="COLOR: #000080;">WebRequest</span>.Create(rt.Url);  <span style="COLOR: #0000ff;">using</span><span style="">(</span><span style="COLOR: #000080;">WebResponse</span> wRespImage = wrImage.GetResponse())    {<blockquote style="MARGIN-RIGHT: 0px;">
<span style="COLOR: #000080;">Stream</span> sr = wRespImage.GetResponseStream();  System.Drawing.<span style="COLOR: #000080;">Image</span><span style="">insertImage =</span> <span style="COLOR: #000080;">Bitmap</span>.FromStream(sr);  imageList.Images.Add(insertImage);</blockquote>} </blockquote> }    lstImages.Items.Add(rt.Title, imageIdx++);</blockquote><span style="">}</span>  lstImages.LargeImageList = imageList;<p />Basically the above code construct a REST Query to send to Yahoo, inside the REST Query are the parameters for the search and its results. The WebRequest is created and the WebResonse is recieved.  The Xml feed is then serialized into a custom datatype that is created fromYahoo's schema via the xsd.exe tool.<p />        The custom data type is then iterated across, because each item in the ImageSearchResponse.Result is an image that matches our searcgcriteria. <p />A new query is then created to download this image from the site that Yahoo is pointing to.  The response stream is returned and an imagecreated directly off this via <em>Bitmap.FromStream();</em> The Bitmap is then loaded into an ImageList.

