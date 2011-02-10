if(this.WScript && !this.WScript.FakeArguments)
	;
else{
	this.WScript = new(function(){
		var _ = this;
		var global = Prelude.globals();
		var Console = Prelude.proto(new(function(){
			var _ = this;
			_.style = {
				borderWidth: '0px',
				margin: '0px',
				padding: '0px',
				fontFamily: 'Consolas, "Andale Mono", "DejaVu Sans Mono", "Lucida Console", Monaco, monospace',
				fontSize: '12px'
			};
			_.ClearScreen = function(){
				while(_.node.childNodes.length)
					_.node.removeChild(_.node.firstChild);
			};
			Intermezzo.AppendNode(global.window.document.body,
				['DIV', function(self){
					Prelude.infect(self.style, _.style);
				}, function(self){
					_.node = self;
				}]);
			_.Write = function(text){
				var _ = this;
				var text = Prelude.split(text, /(\r?\n)|\r/);
				text = Prelude.comp(Prelude.concat)(Prelude.zip(Prelude.map(
				function(x){
					return x ? ['SPAN', function(self){
							if(_.style)
								Prelude.infect(self.style, _.style);
						}, x] : null;
				}, text), Prelude.map(function(){return ['BR'];}, Prelude.range(text.length - 1))));
				text.pop();
				Prelude.map(function(x){x && Intermezzo.AppendNode(_.node, x);}, text);
			};
		}))(function(style){
			if(style)
				this.style = Prelude.infect(style, this.style);
		});
		if(global.HTA){
			_.FakeArguments = System.CommandLineToArgv(global.HTA.commandLine);
			_.FullName = 'mshta.exe';
		}
		else{
			_.FakeArguments = [];
			_.FullName = global.navigator.appName;
		}
		_.Arguments = new Function(Prelude.map(Prelude.curry(Prelude.format, '_%r'), Prelude.range(1, _.FakeArguments.length)).join(','), 'return this.FakeArguments[++_1]');
		_.Echo = function(){
			_.StdOut.Write(Prelude.map(global.String, arguments).join(' '));
			_.StdOut.Write('\n');
		};
		_.Quit = function(c){global.window.close();};
		_.ScriptFullName = _.FakeArguments[0];
		_.Sleep = function(ms){
			var start = (new Date).valueOf();
			while((new Date).valueOf() - start < ms)
				;
		};
		_.StdErr = new Console({color: 'red'});
		_.StdLog = new Console({color: 'blue'});
		_.StdOut = new Console();
		_.StdOut.node.style.whiteSpace = 'pre';
	});
}

var __builtins__ = new(function(){
	var __builtins__ = this;
	var global = (function(){return this;}).call(null);
	var WScript = global.WScript;
	if(WScript.FullName.match(/cscript\.exe$/i))
		__builtins__.Engine = 'CScript';
	else if(WScript.FullName.match(/wscript\.exe$/i))
		__builtins__.Engine = 'WScript';
	else if(WScript.FullName.match(/mshta\.exe$/i))
		__builtins__.Engine = 'HTA';
	else
		__builtins__.Engine = '?';
	if(__builtins__.Engine === 'CScript' || __builtins__.Engine === 'WScript')
		global.eval((new ActiveXObject('Scripting.FileSystemObject')).GetFile(
			WScript.ScriptFullName.split('\\').slice(0, -1).concat(['bin', 'System.js']).join('\\')
		).OpenAsTextStream().ReadAll());
	__builtins__.Environment = {ContinuePrompt: '... ', Prompt: '>>> '};
	if(__builtins__.Engine === 'CScript' || __builtins__.Engine === 'WScript' || __builtins__.Engine === 'HTA'){
		__builtins__.Environment.StartupDirectory = System.GetCurrentDirectory();
		__builtins__.Environment.LibraryPath = System.GetFile(WScript.ScriptFullName).ParentFolder.Path;
	}
	else{
	}
	if(__builtins__.Engine === 'CScript' || __builtins__.Engine === 'WScript'){
		__builtins__.Terminate = function(c){WScript.Quit(c);};
		System.SetCurrentDirectory(__builtins__.Environment.LibraryPath);
		global.eval(System.GetFile('lib/Tartarus.js').OpenAsTextStream().ReadAll());
		Tartarus.load('lib/Prelude.js');
	}
	else
		__builtins__.Terminate = function(c){
			global.window.close();
		};
	__builtins__.Environment.Arguments = Prelude.map(
		function(i){return WScript.Arguments(i);},
		Prelude.range(WScript.Arguments.length));
	__builtins__.Runtime = function(path){return __builtins__.System.BuildPath(__builtins__.Environment.LibraryPath, path);};
	try{
		global.exit();
	}catch($error){
		if($error.name === 'SystemExit')
			__builtins__.SystemExit = $error.constructor;
		else
			__builtins__.SystemExit = Prelude.proto(new Error)(function(n){
				this.name = 'SystemExit';
				this.number = n || 0;
			});
	}
	if(__builtins__.Engine === 'CScript' || __builtins__.Engine === 'WScript' || __builtins__.Engine === 'HTA')
		__builtins__.System = System;
	if(__builtins__.Engine === 'WScript'){
		Tartarus.print([
			'Please use "cscript.exe" instead of "wscript.exe" as the scripting host',
			'You may consider the following actions:',
			Prelude.format(' 1) Use command line: %s', System.ArgvToCommandLine(Prelude.concat(
				['cscript.exe', '/nologo', WScript.ScriptFullName],
				__builtins__.Environment.Arguments))),
			Prelude.format(' 2) Set cscript as the default scripting host by using %r, and retry', 'wscript.exe //H:CScript'),
			' 3) Refer to MSDN KB321788 if stdin/stdout redirection is intended to be used',
			'terminate.'
		].join('\n'));
		__builtins__.Terminate();
	}
	Tartarus.print = function(){
		__builtins__.Environment.StdOut.Write(Prelude.map(Prelude.str, arguments).join(' '));
		__builtins__.Environment.StdOut.Write('\n');
	};
	if(__builtins__.Engine === 'CScript'){
		Prelude.infect(__builtins__.Environment, {
			StdErr: WScript.StdErr,
			StdIn: WScript.StdIn,
			StdLog: WScript.StdOut,
			StdOut: WScript.StdOut
		});
		System.SetCurrentDirectory(__builtins__.Environment.StartupDirectory);
		global.System = System;
		global.Tartarus = Tartarus;
	}
	if(__builtins__.Engine === 'HTA' || __builtins__.Engine === '?')
		Prelude.infect(__builtins__.Environment, {
			StdErr: WScript.StdErr,
			StdLog: WScript.StdLog,
			StdOut: WScript.StdOut
		});
});

var exit = function(n){throw new __builtins__.SystemExit(n);};

if(__builtins__.Environment.Arguments.length){
	try{
		Prelude.globals().eval((function(){
			var retval = __builtins__.System.GetFile(__builtins__.Environment.Arguments[0]).OpenAsTextStream().ReadAll();
			return retval;
		})());
	}catch($error){
		if($error instanceof __builtins__.SystemExit)
			__builtins__.Terminate($error.number);
		else
			__builtins__.Environment.StdErr.Write(Prelude.format('%s: %s', $error.name, $error.message));
	}
	if(__builtins__.Engine === 'CScript')
		__builtins__.Terminate(0);
}

Prelude.infect();
Prelude.infect(Prelude.globals(), Tartarus);
Prelude.globals()._ = function(_){return _;}();

if(__builtins__.Engine === 'CScript'){
	__builtins__.InputCancled = Prelude.proto(new Error)(function(){});
	__builtins__.Environment.StdLog.Write(__builtins__.Environment.Prompt);
	while(!__builtins__.Environment.StdIn.AtEndOfStream){
		try{
			if((Prelude.globals()._ = Prelude.globals().eval((function(){
					var L, R = '';
					while(true){
						if(__builtins__.Environment.StdIn.AtEndOfStream)
							throw new __builtins__.InputCancled;
						R += __builtins__.Environment.StdIn.ReadLine();
						if(!(L = R.length) || R.charAt(--L) !== '\\')
							break;
						R = R.slice(0, L);
						__builtins__.Environment.StdLog.Write(__builtins__.Environment.ContinuePrompt);
					}
					return R;
				})())) !== function(_){return _;}())
				Tartarus.print(Prelude.repr(Prelude.globals()._, 1));
		}catch($error){
			if($error instanceof __builtins__.InputCancled)
				;
			else if($error instanceof __builtins__.SystemExit)
				__builtins__.Terminate($error.number);
			else
				__builtins__.Environment.StdErr.Write(Prelude.format('%s: %s\n', $error.name, $error.message));
		}
		__builtins__.Environment.StdLog.Write(__builtins__.Environment.Prompt);
	}
}
else if(__builtins__.Environment.Arguments.length === 0){
	Intermezzo.AppendNode(document.body, ['NOBR', function(self){
			__builtins__.Environment.StdIn = {
				history: [],
				idxHistory: 0,
				node: self,
				style: Prelude.infect({
					overflow: 'hidden'
				}, __builtins__.Environment.StdOut.style)
			};
		}, ['SPAN', null, __builtins__.Environment.Prompt, function(self){
			Prelude.infect(self.style, __builtins__.Environment.StdIn.style);
			__builtins__.Environment.StdIn.prompt = self;
		}],
		['INPUT', {type: 'text'}, function(self){
			var __builtins__ = Prelude.globals().__builtins__;
			Prelude.infect(self.style, __builtins__.Environment.StdIn.style);
			Intermezzo.AddEventListener(self, 'keydown', function(evt){
				this.focus();
				if(evt.keyCode === 13){
					this.value = this.value.replace(/^[ \t\r\n]+/, '');
					if(this.value === '')
						;
					else if(this.value === '.cls'){
						__builtins__.Environment.StdOut.ClearScreen();
						this.value = '';
					}
					else if(this.value === '.history'){
						Prelude.map(function(i){
							__builtins__.Environment.StdLog.Write(Prelude.format('history[%d] %s', i, __builtins__.Environment.StdIn.history[i]));
							__builtins__.Environment.StdLog.Write('\n');
						}, Prelude.range(__builtins__.Environment.StdIn.history.length));
						this.value = '';
					}
					else if(this.value === '.wrap'){
						if(__builtins__.Environment.StdOut.node.style.whiteSpace === 'pre'){
							__builtins__.Environment.StdOut.node.style.whiteSpace = 'pre-wrap';
							__builtins__.Environment.StdLog.Write('.wrap on\n');
						}
						else{
							__builtins__.Environment.StdOut.node.style.whiteSpace = 'pre';
							__builtins__.Environment.StdLog.Write('.wrap off\n');
						}
						this.value = '';
					}
					else{
						if(__builtins__.Environment.StdIn.history.length === 0 ||
							__builtins__.Environment.StdIn.history[__builtins__.Environment.StdIn.history.length - 1] !== this.value
						){
							__builtins__.Environment.StdIn.history.push(this.value);
						}
						__builtins__.Environment.StdLog.Write(this.value);
						__builtins__.Environment.StdLog.Write('\n');
						try{
							Prelude.globals()._ = (function(){return Prelude.globals().eval(arguments[0]);}).call(Prelude.globals(), this.value);
							if(Prelude.globals()._ !== undefined){
								__builtins__.Environment.StdOut.Write(Prelude.repr(Prelude.globals()._, 1));
								__builtins__.Environment.StdOut.Write('\n');
							}
						}catch($error){
							if($error instanceof __builtins__.SystemExit){
								Intermezzo.RemoveNode(self.parentNode);
								__builtins__.Terminate();
								return;
							}
							else{
								__builtins__.Environment.StdErr.Write(Prelude.format('%s: %s', $error.name, $error.message));
								__builtins__.Environment.StdErr.Write('\n');
							}
						}
					}
					__builtins__.Environment.StdIn.idxHistory = __builtins__.Environment.StdIn.history.length;
					__builtins__.Environment.StdIn.prompt.firstChild.nodeValue = __builtins__.Environment.Prompt;
					this.select();
					this.focus();
					this.size = this.value.length > 1 ? this.value.length : 1;
				}
				else switch(evt.keyCode){
				case 8:
					this.size = this.value.length - 1 > 1 ? this.value.length - 1 : 1;
					break;
				case 38:
					if(__builtins__.Environment.StdIn.idxHistory)
						this.value = __builtins__.Environment.StdIn.history[--__builtins__.Environment.StdIn.idxHistory];
					this.size = this.value.length || 1;
					break;
				case 40:
					if(__builtins__.Environment.StdIn.idxHistory + 1 < __builtins__.Environment.StdIn.history.length)
						this.value = __builtins__.Environment.StdIn.history[++__builtins__.Environment.StdIn.idxHistory];
					this.size = this.value.length || 1;
					break;
				default:
					this.size = this.value.length + 1;
				}
			});
		}],
		['BR']
	]);
	__builtins__.Environment.StdIn.node.getElementsByTagName('INPUT')[0].focus();
}
