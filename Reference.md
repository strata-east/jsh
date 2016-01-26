# Folder Organization #
```
jsh             (base folder)
├─bin           (libraries for specific platform)
├─cxx           (used by script injection)
└─lib           (folder for platform independent libraries, each library can be used alone)
```

# Library Organization #
```
Tartarus.js     (load other libraries, print messages)
Prelude.js      (fundamental algorithm, data structure and exception)
Intermezzo.js   (utility for web browser and DOM)
URI.js          (URI parsing and normalization)
AES.js          (AES encryption and decryption)
Base64.js       (Base64 encoding and decoding)
LZW.js          (LZW compression and decompression)
UTF8.js         (UTF8 encoding and decoding)
UTF16.js        (UTF16 encoding and decoding, with BOM BE/LE support)
```

# JSH Runtime #
### `__builtins__` ###
All JSH related data are kept in the **`__builtins__`** global variable.<br>
<b><code>__builtins__.Engine</code></b> <i>string</i><br>
<b><code>__builtins__.Environment</code></b> <i>object</i><br>
<b><code>__builtins__.Terminate()</code></b> <i>function</i><br>

<h3><code>_</code> (underscore)</h3>
When running in interactive mode, an additional global variable named <b><code>_</code></b> <i>(a single underscore)</i> is maintained, which always holds the last successful evaluation result.<br>
<br>
<h3><code>.</code> commands</h3>
These are also known as meta commands, available when running interactively in browser and HTA.<br>
<pre><code>.cls            (clear output)<br>
.history        (show command history)<br>
.wrap           (toggle output wrapping)<br>
</code></pre>

<h1>Library API</h1>
<h3>Tartarus</h3>
<b><code>chainload(...)</code></b><br>
load scripts one by one in the given order, if the argument is a Function instead of script name String, execute the function instead.<br>
<pre><code>Tartarus.chainload('http://localhost/script1.js', 'script2.js', '../script3.js');<br>
<br>
Tartarus.chainload(<br>
	function(){Tartarus.print('Load the first script...');},<br>
	'http://localhost/sample.js',<br>
	function(){Tartarus.print('Load the second script...');},<br>
	'./script.js',<br>
	function(){Tartarus.print('Done');});<br>
</code></pre>
<b><code>load(...)</code></b><br>
similar to <i><code>Tartarus.chainload</code></i>, but load the scripts concurrently.<br>
if the last argument is a Function, this function will be executed only when all the scripts are loaded.<br>
<pre><code>Tartarus.load(<br>
	'../lib/Prelude.js',<br>
	'../lib/Intermezzo.js',<br>
	'../lib/URI.js',<br>
function(){<br>
	Tartarus.print(Prelude.dir(URI));,<br>
});<br>
</code></pre>
<b><code>print(...)</code></b><br>
output in a proper manner.<br>
<pre><code>Tartarus.print('Hello, world!');<br>
Tartarus.print(1, 2, 3, [4, 5, 6], undefined, null);<br>
Tartarus.print(Tartarus);<br>
</code></pre>

<h3>Prelude</h3>
<b><code>Exception</code></b><br>
<b><code>add</code></b><br>
<b><code>aggr</code></b><br>
<b><code>alist</code></b><br>
<b><code>all</code></b><br>
<b><code>any</code></b><br>
<b><code>assert</code></b><br>
<b><code>chr</code></b><br>
<b><code>cmp</code></b><br>
<b><code>comp</code></b><br>
<b><code>concat</code></b><br>
<b><code>curry</code></b><br>
<b><code>dcomp</code></b><br>
<b><code>dict</code></b><br>
<b><code>dir</code></b><br>
<b><code>div</code></b><br>
<b><code>exception</code></b><br>
<b><code>filter</code></b><br>
<b><code>format</code></b><br>
<b><code>globals</code></b><br>
<b><code>idn</code></b><br>
<b><code>infect</code></b><br>
<b><code>list</code></b><br>
<b><code>map</code></b><br>
<b><code>max</code></b><br>
<b><code>mfilter</code></b><br>
<b><code>min</code></b><br>
<b><code>mmap</code></b><br>
<b><code>mul</code></b><br>
<b><code>one</code></b><br>
<b><code>ord</code></b><br>
<b><code>plain</code></b><br>
<b><code>props</code></b><br>
<b><code>proto</code></b><br>
<b><code>quote</code></b><br>
<b><code>range</code></b><br>
<b><code>reduce</code></b><br>
<b><code>reflect</code></b><br>
<b><code>repr</code></b><br>
<b><code>set</code></b><br>
<b><code>split</code></b><br>
<b><code>squote</code></b><br>
<b><code>str</code></b><br>
<b><code>sub</code></b><br>
<b><code>uniq</code></b><br>
<b><code>zero</code></b><br>
<b><code>zip</code></b><br>
<b><code>zlist</code></b><br>

<h3>Intermezzo</h3>
<b><code>AddEventListener</code></b><br>
<pre><code>Intermezzo.AddEventListener(document.body, 'click', function(elem){<br>
	Tartarus.print(elem);<br>
});<br>
</code></pre>
<b><code>AppendNode</code></b><br>
<pre><code>Intermezzo.AppendNode(document.body,<br>
	['A', {href: 'http://code.google.com/p/jsh/'}, 'JavaScript Shell']);<br>
<br>
Intermezzo.AppendNode(document.body,<br>
	['DIV', function(elem){<br>
		elem.style.fontWeight = 'bold';<br>
	}, 'Hello, world!']);<br>
<br>
Intermezzo.AppendNode(document.body,<br>
	['H3', null, 'Unordered lists (UL), ordered lists (OL), and list items (LI)'],<br>
	['UL', null,<br>
		['LI', null, 'Level 1, number 1'],<br>
		['LI', null, 'Level 1, number 2'],<br>
		['LI', null, 'Level 1, number 3']],<br>
	['OL', null,<br>
		['LI', null, 'Level 1, number 1'],<br>
		['LI', null, 'Level 1, number 2'],<br>
		['LI', null, 'Level 1, number 3']],<br>
	['H3', null, 'Definition lists: DL, DT and DD'],<br>
	['DL', null,<br>
		['DT', null, 'Dweeb'],<br>
		['DD', null,<br>
			'young excitable person who may mature into a ',<br>
			['EM', null, 'Nerd'],<br>
			' or ',<br>
			['EM', null, 'Geek']],<br>
		['DT', null, 'Hacker'],<br>
		['DD', null, 'a clever programmer'],<br>
		['DT', null, 'Nerd'],<br>
		['DD', null, 'technically bright but socially inept person'],<br>
		['DT', null, 'Center'],<br>
		['DT', null, 'Centre'],<br>
		['DD', null, 'A point equidistant from all points on the surface of a sphere.']]<br>
);<br>
</code></pre>
<b><code>DomTraveler</code></b><br>
<pre><code>Intermezzo.DomTraveler(document, function(elem, level){<br>
	if(level &amp;&amp; level &lt; 4)<br>
		Tartarus.print(Prelude.format('%r %s', level, elem.tagName));<br>
});<br>
</code></pre>
<b><code>GetComputedStyle</code></b><br>
<pre><code>Intermezzo.GetComputedStyle(document.body).backgroundColor;<br>
</code></pre>
<b><code>GetSelectedText</code></b><br>
<b><code>Hypertext</code></b><br>
<pre><code>Intermezzo.Hypertext('&lt;Hello, world!&gt;');<br>
</code></pre>
<b><code>Navigate</code></b><br>
<pre><code>Intermezzo.Navigate('about:blank');<br>
</code></pre>
<b><code>ParseXML</code></b><br>
<pre><code>Intermezzo.ParseXML('&lt;test&gt;Hello, world!&lt;/test&gt;').getElementsByTagName('test');<br>
</code></pre>
<b><code>RegisterGlobalExceptionHandler</code></b><br>
<b><code>RemoveEventListener</code></b><br>
<b><code>RemoveNode</code></b><br>
<pre><code>Prelude.map(Intermezzo.RemoveNode, document.getElementsByTagName('SPAN'));<br>
</code></pre>
<b><code>XMLHttpRequest</code></b><br>

<h3>URI</h3>
<b><code>GetCurrentURI()</code></b><br>
<pre><code>Tartarus.print(URI.GetCurrentURI());<br>
</code></pre>
<b><code>NormalizeURI(String uri, [String base])</code></b><br>
<pre><code>URI.NormalizeURI('HTTP://User:Password@WWW.TEST.ORG:00080#a');<br>
URI.NormalizeURI('http://www.test.org/a/../b/../c');<br>
URI.NormalizeURI('http://www.test.org/a/../b/../c');<br>
URI.NormalizeURI('a.js', 'http://localhost');<br>
URI.NormalizeURI('/a.htm', 'http://localhost/hello/world/');<br>
URI.NormalizeURI('../a.htm', 'http://localhost/hello/world/');<br>
URI.NormalizeURI('mailto:guy@gmail.com', 'http://localhost');<br>
URI.NormalizeURI('a/b', 'file:///c/d');<br>
</code></pre>
<b><code>ParseURI(string)</code></b><br>
<pre><code>URI.ParseURI(URI.GetCurrentURI())['scheme'];<br>
</code></pre>

<h3>AES</h3>
<b><code>Encrypt(string, string password, [int bits])</code></b><br>
<pre><code>AES.Encrypt('Hello, world!', 'qwerty');<br>
</code></pre>
<b><code>Decrypt(string, string password)</code></b><br>
<pre><code>AES.Decrypt('j\xac\xf3\xb06\x01!0!!0!-,\x8e\xc5\xbc\x8eZ/&gt;\xc0\x18\xb4X\xe5', 'qwerty');<br>
</code></pre>

<h3>Base64</h3>
<b><code>Encode(string)</code></b><br>
<pre><code>Base64.Encode('Hello, world!');<br>
Base64.Encode("abc");<br>
</code></pre>
<b><code>Decode(string)</code></b><br>
<pre><code>Base64.Decode('SGVsbG8sIHdvcmxkIQ==');<br>
</code></pre>

<h3>LZW</h3>
<b><code>Compress(string)</code></b><br>
<pre><code>LZW.Compress('Hello, woooooooooooooooooooooooooooooooooooooorld!');<br>
</code></pre>
<b><code>Decompress(string)</code></b><br>
<pre><code>LZW.Decompress('H2\x9b\r\x86\xf1`\x80\xeeo\x84BaP\xb8d6\x1d\b9\x1b\x0c\x82\x10');<br>
</code></pre>

<h3>UTF8</h3>
<b><code>Encode(string)</code></b><br>
<pre><code>UTF8.Encode('Frédéric Chopin');<br>
</code></pre>
<b><code>Decode(string)</code></b><br>
<pre><code>UTF8.Decode('Fr\xc3\xa9d\xc3\xa9ric Chopin');<br>
</code></pre>

<h3>UTF16</h3>
<b><code>Encode(string, String pack, [Boolean bom])</code></b><br>
pack can be "BE" (big endian) or "LE" (little endian)<br>
bom can be true of false, if set to true, a BOM header will be included.<br>
<pre><code>Prelude.list(UTF16.Encode('Frédéric Chopin', 'LE', true));<br>
</code></pre>
<b><code>Decode(string, pack)</code></b><br>
<pre><code>UTF16.Decode(UTF16.Encode('Hello, world!', 'BE'), 'BE');<br>
</code></pre>