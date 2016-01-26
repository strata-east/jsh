# Getting Started #

Download the **jsh.7z** or **jsh.zip** package and unpack, and you will see the following directory structure.
```
jsh
│ JSH.js
│ JSH.hta
│ index.htm
│ panel.htm
│ Blank_HTML.htm
│ Blank_HTML4.htm
├─bin
│   System.js
│   WebAutomation.js
├─cxx
│   main.cpp
│   main.exe
│   makefile
│   resource.js
│   resources.rc
└─lib
    AES.js
    Base64.js
    Intermezzo.js
    LZW.js
    Prelude.js
    Tartarus.js
    URI.js
    UTF16.js
    UTF8.js
```

Now you need to decide in which environment you would like to run _jsh_, the options are browser, console, HTA, as explained below.<br>
After you launch <b>jsh</b> interactively, you can start by playing with the shell.<br>
<pre><code>&gt;&gt;&gt; 1<br>
1<br>
&gt;&gt;&gt; _ + _<br>
2<br>
&gt;&gt;&gt; _ + _<br>
4<br>
&gt;&gt;&gt; Tartarus.print("Hello, JSH!")<br>
Hello, JSH!<br>
&gt;&gt;&gt; dir(Tartarus)<br>
['chainload', 'load', 'print']<br>
&gt;&gt;&gt; load('lib/URI.js')<br>
&gt;&gt;&gt; dir(URI)<br>
['GetCurrentURI', 'NormalizeURI', 'ParseURI']<br>
&gt;&gt;&gt; load('lib/LZW.js')<br>
&gt;&gt;&gt; LZW.Compress('aaaaaaaaaaaaaaaaaaaaaaaaaaa').length<br>
8<br>
&gt;&gt;&gt; add(1, 2, 3, 4, 5)<br>
15<br>
&gt;&gt;&gt; add.apply(null, range(101))<br>
5050<br>
&gt;&gt;&gt; comp(add)(range(101))<br>
5050<br>
&gt;&gt;&gt; inc = curry(add, 1)<br>
&lt;lambda/0&gt;<br>
&gt;&gt;&gt; inc(5)<br>
6<br>
&gt;&gt;&gt; range(10)<br>
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]<br>
&gt;&gt;&gt; map(inc, _)<br>
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]<br>
&gt;&gt;&gt; exit()<br>
</code></pre>
Once you are familiar with <i>jsh</i>, you can start by reading advanced topics such as script injection, alternatively you may dive into the <a href='Reference.md'>API Reference</a>.<br>
<br>
<h3>Run in browser</h3>
The simple way is to open <b>index.htm</b> locally in your favorite browser and play with it. However, in order to use script injection and many network related features, you may want to host the entire <b>jsh</b> folder on a web server.<br>
Once you are done, you will see something similar as illustrated below.<br>
Now there are three panels, click the <b>Runtime Library</b> link, which is the last item in the left panel, and you will see a prompt at the right panel as illustrated, now you can type in javascript expressions and statements and see the result.<br>
Three meta commands are supported, <b><code>.cls</code></b> would clear the output, <b><code>.history</code></b> would show the command history, and <b><code>.wrap</code></b> would toggle the line wrapping mode.<br>
You may also use the up and down arrow key to navigate through the command history.<br>
If you are using a high DPI monitor, you may change the font size of the output using <b><code>__builtins__.Environment.StdOut.style.fontSize = '18px'</code></b>, choose the appropriate typeface and size will make you happy and more effective :)<br>
<br>
<img src='http://jsh.googlecode.com/files/tutorial1.png' /><br>
<b>Needle (bookmark)</b> can be saved as a bookmark and used on other web pages, this is done by injecting javascript code to current web page. Note that when <i>index.htm</i> is opened locally, <i>Needle (bookmark)</i> may not work due to browser security policy.<br>
If you are running locally and using Internet Explorer, the browser may show an information bar asking if the active content should be executed depending on your browser security policy.<br>

<h3>Run in Windows HTA</h3>
If your operating system is Windows based, you may start directly by double clicking the <b>JSH.hta</b> file icon, this would bring you an HTA based shell.<br>
<img src='http://jsh.googlecode.com/files/jsh_hta.png' /><br>

<h3>Run in Windows console</h3>
If your operating system is Windows based, you can run <b>JSH.js</b> in console using <b><code>cscript.exe /nologo &lt;JSH.js file path&gt;</code></b>, for example:<br>
<pre><code>cscript.exe /nologo D:\WWW\JSH.js<br>
</code></pre>
In order to run <i>JSH.js</i> without having to type <i>cscript.exe /nologo</i> each time, you can change the default scripting host by the following command:<br>
<pre><code>wscript.exe //H:CScript<br>
</code></pre>
This would allow you to run <i>JSH.js</i> directly either by double clicking the JSH.js file icon, or by typing <code>JSH.js</code> directly as illustrated below.<br>
(if you are too lazy to type in the <b>.js</b>, you may add <i>.js</i> to the PATHEXT environment variable, then you just need to type the three letter <b>JSH</b>...)<br>
<img src='http://jsh.googlecode.com/files/jsh_win32console.png' /><br>

<h1>Advanced Topic</h1>

<h3>Script injection</h3>
Script injection can be achieved in two ways.<br>
The first way is to deploy <b>jsh</b> on a web server, bookmark the <b>Needle (bookmark)</b> and run it on targeted web pages.<br>
The second way is only available for Trident on Windows platform, by using the <b>main.exe</b> application (C++ source available), this would give you the ability to inject script to Trident engine based applications, such like Windows SDK Help, MSN Live Messenger, Outlook Express, etc.<br>

<h3>Chain load (browser and Windows HTA)</h3>
Take <b>Firebug Lite</b> as an example, from the official site we can get the bookmark for firebug lite injection. However, this bookmark does not work for <i>FRAME</i> and <i>IFRAME</i>, neither does it support HTA and things like Windows Live Messenger.<br>
Once we have <i>jsh</i> injected, jsh will allow you to evaluate expressions and execute statements, and thus makes it possible to load libraries or any other third party scripts. For this case we will firstly check the bookmark for <i>Firebug Lite</i>, and extract the statement:<br>
<pre><code>&gt;&gt;&gt; /* copy &amp; paste the firebug lite bookmark into the double quote as follows */<br>
&gt;&gt;&gt; firebug_lite_bookmark = "javascript:(function(...){...})(...);";<br>
&gt;&gt;&gt; /* decode and evaluate */<br>
&gt;&gt;&gt; eval(decodeURIComponent(firebug_lite_bookmark.slice(11)));<br>
&gt;&gt;&gt; /* now wait a few seconds for firebug lite to load */<br>
&gt;&gt;&gt; /* enjoy :) */<br>
</code></pre>
Firebug is relatively large and have more features than <i>jsh</i>, <i>jsh</i> can be used as a boot loader for none browser applications such like Live Messenger and Windows Help. With <code>Prelude.infect</code>, it's even possible to support chain loading <i>Firebug Lite</i> into nested <i>FRAME</i> and <i>IFRAME</i>.<br>
<br>
<h3>Taking arguments (Windows HTA and console)</h3>
Create a file named <i><code>hello.js</code></i> as follows<br>
<pre><code>var print = Tartarus.print;<br>
<br>
print("Hello, world!");<br>
print(Prelude.format('Arguments: %r', __builtins__.Environment.Arguments));<br>
print(Prelude.format('LibraryPath: %s', __builtins__.Environment.LibraryPath));<br>
print(Prelude.format('StartupDirectory: %s', __builtins__.Environment.StartupDirectory));<br>
</code></pre>
Then run <b><code>JSH.js hello.js a b c</code></b> under command prompt to see the result.<br>
You may also run <b><code>JSH.hta hello.js a b c</code></b> to see the result in HTA window.<br>

<h3>Returning error code (Windows console)</h3>
Create a file named <i><code>exit.js</code></i> as follows, and run <b><code>JSH.js exit.js</code></b>.<br>
<pre><code>Prelude.infect();<br>
infect(globals(), Tartarus);<br>
<br>
print('check if exit code in %errorlevel% is 3');<br>
exit(3);<br>
print('unreachable code');<br>
</code></pre>

<h3>Windows console stdin/stdout redirection</h3>
If you are facing problems while trying to use JSH for stdin/stdout redirection, consult this link <a href='http://support.microsoft.com/kb/321788'>http://support.microsoft.com/kb/321788</a>.<br>
For example, if we want to create a script for automating HTTP request, we can create a script named <i><code>HttpClient.js</code></i>
<pre><code>Tartarus.load(<br>
	__builtins__.Runtime('lib/Intermezzo.js'),<br>
function(){<br>
	var method = 'GET', URL, xmlHttpReq = Intermezzo.XMLHttpRequest();<br>
	switch(__builtins__.Environment.Arguments.length){<br>
	case 2:<br>
		URL = __builtins__.Environment.Arguments[1];<br>
		break;<br>
	case 3:<br>
		method = __builtins__.Environment.Arguments[1];<br>
		URL = __builtins__.Environment.Arguments[2];<br>
		break;<br>
	default:<br>
		Tartarus.print(Prelude.format('Usage: %s [GET | POST] &lt;URL&gt;' , __builtins__.Environment.Arguments[0]));<br>
		exit();<br>
	}<br>
	xmlHttpReq.open(method, URL, false);<br>
	xmlHttpReq.send(method === 'POST' ? __builtins__.Environment.StdIn.ReadAll() : undefined);<br>
	Tartarus.print(xmlHttpReq.responseText);<br>
});<br>
</code></pre>
Then it is possible to use command like:<br>
<b><code>JSH.js HttpClient.js POST http://google.com &lt; postdata.txt</code></b><br>
<b><code>JSH.js HttpClient.js GET http://google.com &gt; result.txt</code></b><br>
<b><code>echo hello | JSH.js HttpClient.js POST http://google.com</code></b><br>

<h3>Internet Explorer Automation</h3>
You can create a script named <i><code>JshWeb.js</code></i> for automating Internet Explorer, and run <b><code>JSH.hta JshWeb.js</code></b> or <b><code>JSH.js JshWeb.js</code></b>.<br>
<pre><code>if(this.__builtins__ &amp;&amp; (__builtins__.Engine === 'CScript' || __builtins__.Engine === 'HTA')){<br>
	Tartarus.load(<br>
		__builtins__.Runtime('bin/WebAutomation.js'),<br>
		__builtins__.Runtime('lib/Intermezzo.js'),<br>
	function(){<br>
		var browser = WebAutomation.InternetExplorer('about:');<br>
		browser.navigate('about:blank');<br>
		WebAutomation.Wait(browser);<br>
		Prelude.map(function(module){<br>
			browser.Document.parentWindow.execScript(module.OpenAsTextStream().ReadAll());<br>
		}, [<br>
			System.GetFile(__builtins__.Runtime('lib/Tartarus.js')),<br>
			System.GetFile(__builtins__.Runtime('lib/Prelude.js')),<br>
			System.GetFile(__builtins__.Runtime('lib/Intermezzo.js')),<br>
			System.GetFile(__builtins__.Runtime('lib/URI.js')),<br>
			System.GetFile(__builtins__.Runtime('JSH.js'))<br>
		]);<br>
	});<br>
}<br>
</code></pre>