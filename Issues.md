### Known Issues ###
There are found during the development, most of them are caused by bugs in browser, script engine or the limitation of language design, and do not have a tidy workaround.<br>
<ul><li><code>TAB character may not display correctly in Internet Explorer and HTA. (Trident implementation behavior)</code><br>
<pre><code>&gt;&gt;&gt; Tartarus.print('a\tb'); /* not work correctly in IE */<br>
ab<br>
</code></pre>
</li><li><code>Variable definition does not work when running interactively in browser and HTA. (ECMAScript eval behavior)</code><br>
<pre><code>&gt;&gt;&gt; var x = 1;<br>
&gt;&gt;&gt; Tartarus.print(x);<br>
TypeError: 'x' is undefined<br>
<br>
/* workaround */<br>
&gt;&gt;&gt; x = 1;<br>
&gt;&gt;&gt; Tartarus.print(x);<br>
1<br>
</code></pre>
</li><li><code>String assignments may not look correctly in Internet Explorer, if the source string contains NUL character. (Trident behavior)</code><br>
<pre><code>&gt;&gt;&gt; x = 'a\0b'<br>
'a'<br>
<br>
/* workaround */<br>
&gt;&gt;&gt; Tartarus.print(Prelude.repr(x));<br>
'a\0b'<br>
</code></pre>