define({  "name": "MosaiqoCMS-Frontend-server",  "version": "0.1.2",  "description": "Mosaiqo CMS Frontend dev/testing server",  "order": [    "ROOT",    "Auth",    "List",    "Get",    "Create",    "Update",    "Patch",    "Delete"  ],  "header": {    "content": "<h3>API responses structure</h3>\n<p>The API returns all the responses 'wrapped' inside a <code>data</code> node.<br>\nAll the responses also have a <code>meta</code> node with metadata, like the document/collection API endpoint URL, pagination or other information.</p>\n<p>Example:</p>\n<pre><code class=\"language-json\">{\n  &quot;meta&quot;: {\n    &quot;url&quot; : &quot;http://the-api-url/whatever&quot;\n  },\n  &quot;data&quot;: {\n    &quot;id&quot;: 3215465479452108\n  }\n}\n</code></pre>\n<p>When the API returns an error, there's no <code>data</code> node. Instead, there's an <code>error</code> node with a <code>code</code> attribute and a <code>message</code>. On validation errors, the API also returns an <code>errors</code> node (at the same level of <code>error</code>) with information about each validation errors.</p>\n<p>Example:</p>\n<pre><code class=\"language-json\">{\n  &quot;meta&quot;: {},\n  &quot;error&quot;: {\n    &quot;code&quot;: 404,\n    &quot;message&quot;: &quot;Not found&quot;\n  }\n}\n</code></pre>\n<p>Validation error example:</p>\n<pre><code class=\"language-json\">{\n  &quot;meta&quot;: {},\n  &quot;error&quot;: {\n    &quot;code&quot;: 422,\n    &quot;message&quot;: &quot;Validation Error&quot;\n  },\n  &quot;errors&quot;: {\n    &quot;title&quot;: [ &quot;`Title` is required.&quot; ],\n    &quot;date&quot;:  [ &quot;`Date` is required.&quot;, &quot;`Date` must be whatever.&quot; ],\n  }\n}\n</code></pre>\n<h3>Nested relations</h3>\n<p>Some documents can have 'nested' objects, or relations. The attribute that holds the relation can contain one value, multiple, or none. It depends on the attribute (for example, an <code>author</code> attribute should contain one nested object (or none), but a <code>tags</code>attribute could contain multiple).</p>\n<p>By default, those nested objects are not returned on the API responses. Instead, those appear 'collapsed', as an object with a <code>meta</code> attribute with the object/collection API endpoint, and the nested objects count. For example:</p>\n<p><code>GET http://the-api-url/whatever/3246783468467854</code></p>\n<pre><code class=\"language-json\">{\n  &quot;meta&quot; : {  },\n  &quot;data&quot;: {\n    &quot;id&quot;: 3246783468467854,\n    &quot;name&quot;: &quot;Some name&quot;,\n    &quot;someNestedObject&quot;: {\n      &quot;meta&quot;: {\n        &quot;url&quot;: &quot;http://the-api-url/3246783468467854/someNestedObject&quot;,\n        &quot;count&quot;: 1\n      }\n    }\n  }\n}\n</code></pre>\n<p>The nested objects can be 'expanded' adding a parameter <code>include</code> on the request. For example:</p>\n<p><code>GET http://the-api-url/whatever/3246783468467854?include=someNestedObject</code></p>\n<pre><code class=\"language-json\">{\n  &quot;meta&quot; : {  },\n  &quot;data&quot;: {\n    &quot;id&quot;: 3246783468467854,\n    &quot;name&quot;: &quot;Some name&quot;,\n    &quot;someNestedObject&quot;: {\n      &quot;meta&quot;: {\n        &quot;url&quot;: &quot;http://the-api-url/3246783468467854/someNestedObject&quot;,\n        &quot;paginator&quot;: {\n          &quot;total_entries&quot;: 1,\n          &quot;total_pages&quot;: 1,\n          &quot;page&quot;: 1,\n          &quot;per_page&quot;: 20\n        }\n      }\n    },\n    &quot;data&quot;: {\n      &quot;id&quot;:       644343213463534432434354,\n      &quot;someAttr&quot;: &quot;BlahBlahBlah&quot;\n    }\n  }\n}\n</code></pre>\n<p>Multiple expansions are allowed using a comma as separator (<code>...?include=foo,bar</code>) or passing it as an array(<code>...?include[]=foo&amp;include[]=bar</code>).</p>\n<p>When expanded, instead of a <code>count</code> attribute, a <code>paginator</code> object will be returned. All nested relations are always paginated when returned with the parent object using the <code>include</code> parameter. See the <strong>Pagination - Nested Pagination</strong> section.</p>\n<h3>Pagination</h3>\n<p>All the API calls that potentially return more than one object are paginated.</p>\n<p>The pagination can be controlled using the following querystring parameters:</p>\n<ul>\n<li><code>per_page</code>: Determines the maximum items returned. The API has a default value, and a hard limit that can not be overridden.</li>\n<li><code>page</code>.</li>\n</ul>\n<p>Additionally, there's the <code>sort</code> parameter. It accepts multiple values (using commas or as an array, see the <code>include</code> parameter). It also accepts optionally the sort direction using a pipe as a separator. If the direction is not provided, it defaults to 'asc'. The accepted values for the direction are: <code>1</code>, <code>asc</code>, <code>-1</code> and <code>desc</code>.</p>\n<p>Examples:</p>\n<ul>\n<li><code>...?sort=id</code></li>\n<li><code>...?sort=id|desc</code></li>\n<li><code>...?sort=id|desc,name|asc,date</code></li>\n<li><code>...?sort[]=id&amp;sort[]=name|desc</code></li>\n</ul>\n<p>The responses will include a <code>paginator</code> node inside the <code>meta</code>:</p>\n<pre><code class=\"language-json\">{\n  &quot;meta&quot; : {\n    &quot;paginator&quot;: {\n      &quot;total_entries&quot;: 1,\n      &quot;total_pages&quot;: 1,\n      &quot;page&quot;: 1,\n      &quot;per_page&quot;: 20\n    }\n  },\n  &quot;data&quot;: {  }\n}\n</code></pre>\n<p>With sorting applied:</p>\n<pre><code class=\"language-json\">{\n  &quot;meta&quot; : {\n    &quot;paginator&quot;: {\n      &quot;total_entries&quot;: 1,\n      &quot;total_pages&quot;: 1,\n      &quot;page&quot;: 1,\n      &quot;per_page&quot;: 20,\n      &quot;sort&quot;: {\n        &quot;title&quot;: &quot;desc&quot;,\n        &quot;publish_date&quot;: &quot;asc&quot;,\n        &quot;id&quot;: &quot;asc&quot;\n      }\n    }\n  },\n  &quot;data&quot;: {  }\n}\n</code></pre>\n<h4>Nested Pagination</h4>\n<p>The pagination options for the nested collections are the same, but the syntax is a little bit different:</p>\n<p><code>...?include=tags:page(1):per_page(4):sort(id,name|-1)</code></p>\n<p>Instead of ampersands it uses a colon <code>:</code> as separator, and the values go between parentheses.</p>\n"  },  "sampleUrl": false,  "apidoc": "0.2.0",  "generator": {    "name": "apidoc",    "time": "2015-07-14T16:11:21.888Z",    "url": "http://apidocjs.com",    "version": "0.13.1"  }});