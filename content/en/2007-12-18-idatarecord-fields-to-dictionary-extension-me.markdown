---
slug: idatarecord-fields-to-dictionary-extension-me
date: 2007-12-18
 
title: IDataRecord Fields to Dictionary Extension Method
published: true
---
<p>I have never been a fan of directly passing IDataRecords, or IDataReaders for that matter, about the place to get simple field values out.</p> <p>Therefore, with the introduction of C# 3.0 and Extension Methods, I thought it would be cool to write (and share) a simple implementation of some code that I use to convert the IDataRecord Field data to an Dictionary&lt;string, object&gt; object.</p><div class="CodeRay">
  <div class="code"><pre>namespace Kinlan.Data.Extensions{    public static class DataExtensions    {        public static Dictionary&lt;string, object&gt; FieldsToDictionary(this IDataRecord dataRecord)        {            Dictionary&lt;string, object&gt; fieldBag = new Dictionary&lt;string, object&gt;(dataRecord.FieldCount);            if (dataRecord != null)            {                               for (int fieldIdx = 0; fieldIdx &lt; dataRecord.FieldCount; fieldIdx++)                {                    string name = dataRecord.GetName(fieldIdx);                    object value = dataRecord[fieldIdx];                    fieldBag.Add(name, value);                }            }            return fieldBag;        }    }}</pre></div>
</div>
<br /><p>It is quite simple really and nothing too complex.</p><br /><p>A place where it can be used it Windows Workflow.  If you are injecting parameters into your Workflow instance you need to pass a Dictionary&lt;string, object&gt; in, well now you can (if you desired) simply convert a IDataReader/IDataRecord object into with the following simple piece of code:</p><div class="CodeRay">
  <div class="code"><pre>WorkflowInstance instance = runtime.CreateWorkflow(typeof(_WorkflowClass_), dataReaderInstance.FieldsToDictionary());</pre></div>
</div>
<br /><p>This code should be used sparingly, for instance if you wanted a very high performance access to the field data, you might as well stay on the IDataRecord.</p><br /><div class="wlWriterSmartContent" style="padding-right: 0px; display: inline; padding-left: 0px; padding-bottom: 0px; margin: 0px; padding-top: 0px;">Topicala Tags: <a href="http://www.topicala.com/tag/Extension%20Method" rel="tag">Extension Method</a>, <a href="http://www.topicala.com/tag/ExtensionMethod" rel="tag">ExtensionMethod</a>, <a href="http://www.topicala.com/tag/C#" rel="tag">C#</a>, <a href="http://www.topicala.com/tag/C#3.0" rel="tag">C#3.0</a>, <a href="http://www.topicala.com/tag/IDataReader" rel="tag">IDataReader</a>, <a href="http://www.topicala.com/tag/IDataRecord" rel="tag">IDataRecord</a>
</div>  

