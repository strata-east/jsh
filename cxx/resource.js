var Tartarus=new(function(){
	var _=this;
	var global=(function(){return this;}).call(null);
	var load=global.load,print=global.print;
	_.chainload=function(){
		var A=[],L=arguments.length,C=arguments.callee;
		if(!L)
			return;
		for(var i=0;i<L;i++)
			A.push(arguments[i]);
		if(A[0] instanceof global.Function)
			A[0](),C.apply(null,A.slice(1));
		else
			_.load(A[0],function(){C.apply(null,A.slice(1));});
	};
	_.load=function(){
		var i=0,A=arguments,L=A.length,C;
		if(A[L-1] instanceof global.Function)
			C=A[--L];
		if(global.window){
			var d=global.document,h=d.getElementsByTagName('HEAD')[0];
			var cnt=L;
			for(var i=0;i<L;i++)
				(function(){
					var R={complete:0},s=d.createElement('SCRIPT');
					s.type='text/javascript';
					s.src=A[i];
					s.onload=function(){
						s.onload=s.onreadystatechange=null;
						s.parentNode.removeChild(s);
						if(!--cnt)
							if(C)C();
					};
					s.onreadystatechange=function(){
						if(R.hasOwnProperty(s.readyState))
							s.onload();
						else if(s.readyState==='loading')
							R['loaded']=0;
					};
					h.appendChild(s);
				})();
			return;
		}
		else if(global.WScript){
			var fso=new ActiveXObject('Scripting.FileSystemObject');
			for(var i=0;i<L;i++){
				var f=fso.OpenTextFile(A[i],1);
				var s=f.ReadAll();
				f.Close();
				global[A[i].slice(global.Math.max(A[i].lastIndexOf('/'),A[i].lastIndexOf('\\'))+1,A[i].lastIndexOf('.'))]=global.eval(s.slice(s.indexOf('=')+1,s.lastIndexOf(';')));
			}
			if(C)C();
		}
		else if(load){
			if(load.length==_.load.length)
				load.apply(null,A);
			else{
				for(var i=0;i<L;i++)load(A[i]);
				if(C)C();
			}
		}
	};
	_.print=function(){
		var x=[];
		if(global.Prelude)
			x=global.Prelude.map(global.Prelude.str,arguments);
		else
			for(var i=0;i<arguments.length;i++)
				x.push(arguments[i]);
		x=x.join(' ');
		if(global.window)global.alert(x);
		else if(global.WScript)global.WScript.Echo(x);
		else if(print)print(x);
	};
});
var Prelude=new(function(){
	var _=this;
	var undefined=function(_){return _;}();
	_.reflect=arguments.callee;
	_.proto=function(p){
		if(p===undefined)
			p=_;
		return function(f){
			f.prototype=p;
			f.prototype.constructor=f;
			return f;
		};
	};

	_.Exception=_.proto(new Error)(function(n,s){
		this.name='Exception';
		this.number=n||0;
		this.description=this.message=s||'';
	});
	_.assert=function(e,s){e||_.exception(0,arguments.length<=2?s:_.format.apply(null,_.map(_.idn,arguments).slice(1)));};
	_.aggr=function(f,z){
		var A=_.map(_.idn,arguments).slice(2);
		return function(){
			return arguments.length?_.reduce(f,_.map(_.idn,arguments)):z.apply(null,A);
		};
	};
	_.alist=function(m){var r=[];for(var n in m)r.push([n,m[n]]);return r;};
	_.chr=function(){return _.globals().String.fromCharCode.apply(null,arguments);};
	_.comp=function(f,e){return function(v){return f.apply(e,v);};};
	_.curry=function(f){
		var A=_.map(_.idn,arguments).slice(1);
		return function(){
			return f.apply(null,A.concat(_.map(_.idn,arguments)));
		};
	};
	_.dcomp=function(f,e){return function(){return f.call(e,_.map(_.idn,arguments));};};
	_.dict=function(v){
		_.assert(arguments.length<=1,'dict() expected 0 or 1 argument, got %d',arguments.length);
		var L=arguments.length?v.length:0,r={};
		for(var i=0;i<L;i++)
			r[v[i][0]]=v[i][1];
		return r;
	};
	_.props=function(o){
		var g=_.globals();
		o=arguments.length?o:g;
		if(o===null||o===undefined)
			return[];
		var r=_.set();
		if(o===g)
			r=_.concat(r,[
				'NaN','Infinity','undefined',
				'eval','parseInt','parseFloat','isNaN','isFinite','decodeURI','decodeURIComponent','encodeURI','encodeURIComponent',
				'Object','Function','Array','String','Boolean','Number','Date','RegExp',
				'Error','EvalError','RangeError','ReferenceError','SyntaxError','TypeError','URIError',
				'Math']);
		else if(o===g.Math)
			r=_.concat(r,[
				'E','LN10','LN2','LOG2E','LOG10E','PI','SQRT1_2','SQRT2',
				'abs','acos','asin','atan','atan2','ceil','cos','exp','floor','log','max','min','pow','random','round','sin','sqrt','tan']);
		else if(o instanceof g.Array)
			r=_.concat(r,['length']);
		else if(o instanceof g.Function)
			r=_.concat(r,['length','prototype']);
		else if(o instanceof g.RegExp)
			r=_.concat(r,['source','global','ignoreCase','multiline','lastIndex']);
		else if(typeof o==='string')
			r=_.concat(r,['length']);
		else switch(o){
		case g.Object.prototype:
			r=_.concat(r,['constructor','toString','toLocaleString','valueOf','hasOwnProperty','isPrototypeOf','propertyIsEnumerable']);
			break;
		case g.Array.prototype:
			r=_.concat(r,['constructor','toString','toLocaleString','concat','join','pop','push','reverse','shift','slice','sort','splice','unshift']);
			break;
		case g.Boolean.prototype:
			r=_.concat(r,['constructor','toString','valueOf']);
			break;
		case g.Date.prototype:
			r=_.concat(r,['constructor','toString','toDateString','toTimeString','toLocaleString','toLocaleDateString','toLocaleTimeString','valueOf',
				'getTime','getFullYear','getUTCFullYear','getMonth','getUTCMonth','getDate','getUTCDate','getDay','getUTCDay','getHours','getUTCHours','getMinutes','getUTCMinutes','getSeconds','getUTCSeconds','getMilliseconds','getUTCMilliseconds','getTimezoneOffset',
				'setTime','setMilliseconds','setUTCMilliseconds','setSeconds','setUTCSeconds','setMinutes','setUTCMinutes','setHours','setUTCHours','setDate','setUTCDate','setMonth','setUTCMonth','setFullYear','setUTCFullYear',
				'toUTCString']);
			break;
		case g.Error.prototype:
			r=_.concat(r,['constructor','name','message','toString']);
			break;
		case g.Function.prototype:
			r=_.concat(r,['constructor','toString','apply','call']);
			break;
		case g.Number.prototype:
			r=_.concat(r,['constructor','toString','toLocaleString','valueOf','toFixed','toExponential','toPrecision']);
			break;
		case g.RegExp.prototype:
			r=_.concat(r,['constructor','exec','test','toString']);
			break;
		case g.String.prototype:
			r=_.concat(r,['constructor','toString','valueOf','charAt','charCodeAt','concat','indexOf','lastIndexOf','localeCompare','match','replace','search','slice','split','substring','toLowerCase','toLocaleLowerCase','toUpperCase','toLocaleUpperCase']);
			break;
		}
		for(var m in o)
			if(g.Object.prototype.hasOwnProperty.call(o,m))
				r.add(m);
		return _.list(r).sort();
	};
	_.dir=function(o){
		var g=_.globals(),r=[];
		o=arguments.length?o:g;
		if(o===null||o===undefined)
			return r;
		while(true){
			r=r.concat(_.props(g.Object(o)));
			if('constructor' in o&&o.constructor!==null&&'prototype' in o.constructor&&o!==o.constructor.prototype)
				o=o.constructor.prototype;
			else
				break;
		}
		return _.list(_.set(r)).sort();
	};
	_.filter=function(f,v){
		_.assert(arguments.length===2,'filter() expected 2 arguments, got %d',arguments.length);
		var L=v.length,r=[];
		for(var i=0;i<L;i++)
			if(f===null||f===undefined?v[i]:f(v[i]))
				r.push(v[i]);
		return r;
	};
	_.globals=function(){return(function(){return this;}).call(null);};
	_.infect=function(o,m){
		o=o===undefined?_.globals():o;
		m=m===undefined?_:m;
		_.map(function(x){o[x]=m[x];},_.props(m));
		return o;
	};
	_.list=function(o){
		var r=[];
		if(o instanceof _.globals().Array)
			r=o.slice(0);
		else if(o instanceof Set)
			r=o.__trait__.slice(0);
		else if(o.constructor===_.globals().String){
			var L=o.length;
			for(var i=0;i<L;i++)
				r.push(o.charAt(i));
		}
		else for(var i in o)
			r.push(i);
		return r;
	};
	_.map=function(f,v){
		_.assert(arguments.length===2,'map() expected 2 arguments, got %d',arguments.length);
		var L=v.length,r=[];
		for(var i=0;i<L;i++)
			r.push(f(v[i]));
		return r;
	};
	_.mfilter=function(f,m){return _.dict(_.filter(f,_.alist(m)));};
	_.mmap=function(f,m){return _.dict(_.map(f,_.alist(m)));};
	_.ord=function(c){return c.charCodeAt(0);};
	_.plain=function(v){
		var r=[],d=0,g=_.globals();
		(function(v){
			var L=v.length;
			for(var i=0;i<L;i++){
				var o=v[i];
				if(o instanceof g.Array)
					d++,arguments.callee(o),d--;
				else
					r.push([d,o]);
			}
		})(v);
		return r;
	};
	_.reduce=function(f,v){
		_.assert(arguments.length===2,'reduce() expected 2 arguments, got %d',arguments.length);
		var L=v.length,r=v[0];
		for(var i=1;i<L;i++)
			r=f(r,v[i]);
		return r;
	};
	_.range=function(){
		var L=arguments.length,r=[],start=0,stop=0,step=1;
		_.assert(1<=L&&L<=3,'range() expected 1 to 3 arguments, got %d',L);
		switch(L){
		case 3:
			step=arguments[2];
		case 2:
			start=arguments[0];
			stop=arguments[1];
			break;
		case 1:
			stop=arguments[0];
			break;
		}
		_.assert(step, 'range() arg 3 must not be zero');
		for(var i=start;step>0?i<stop:i>stop;i+=step)
			r.push(i);
		return r;
	};
	var Set=_.proto(new(function(){
		this.add=function(element){
			for(var i=0;i<this.length;i++)
				if(element===this.__trait__[i])
					return;
			this.__trait__.push(element);
			this.length++;
		};
		this.concat=function(o){
			if(o instanceof Set)
				o=o.__trait__;
			return _.set(this.__trait__.concat(o));
		};
		this.contains=function(element){
			for(var i=0;i<this.length;i++)
				if(element===this.__trait__[i])
					return true;
			return false;
		};
		this.discard=function(element){
			for(var i=0;i<this.length;i++)
				if(element===this.__trait__[i]){
					this.__trait__.splice(i,1);
					this.length--;
				}
		};
	}))(function(v){
		this.__trait__=[];
		this.length=0;
		var L=v.length;
		for(var i=0;i<L;i++)
			this.add(v[i]);
	});
	_.set=function(v){return new Set(v===undefined?[]:v);};
	_.uniq=function(v){
		_.assert(arguments.length===1,'uniq() expected 1 argument, got %d',arguments.length);
		var L=v.length,r=[];
		if(L){
			r.push(v[0]);
			for(var i=1;i<L;i++)
				if(v[i]!=v[i-1])
					r.push(v[i]);
		}
		return r;
	};
	_.zip=function(x,y){
		_.assert(arguments.length===2,'zip() expected 2 arguments, got %d',arguments.length);
		var r=_.list(x),L=r.length;
		for(var i=0;i<L;i++)
			r[i]=[r[i],y[i]];
		return r;
	};

	_.zero=function(){return 0;};
	_.one=function(){return 1;};
	_.zlist=function(){return [];};
	_.exception=function(n,s){throw new _.Exception(n,s);};
	_.idn=function(x){return x;};
	_.any=_.aggr(function(x,y){return x||y;},function(){return false;});
	_.all=_.aggr(function(x,y){return x&&y;},function(){return true;});
	_.cmp=function(x,y){return x==y?0:x>y?1:-1;};
	_.max=function(f){f=f||_.cmp;return _.aggr(function(x,y){return f(x,y)>=0?x:y;},_.exception,0,'max() expected at least 1 argument, got 0');};
	_.min=function(f){f=f||_.cmp;return _.aggr(function(x,y){return f(x,y)<=0?x:y;},_.exception,0,'min() expected at least 1 argument, got 0');};
	_.add=_.aggr(function(x,y){return x+y;},_.zero);
	_.sub=_.aggr(function(x,y){return x-y;},_.exception,0,'sub() expected at least 1 argument, got 0');
	_.mul=_.aggr(function(x,y){return x*y;},_.one);
	_.div=_.aggr(function(x,y){return x/y;},_.exception,0,'div() expected at least 1 argument, got 0');
	_.concat=_.aggr(function(x,y){return x.concat(y);},_.zlist);

	_.quote=function(s){
		var r=['"'],L=s.length,g=_.globals();
		for(var i=0;i<L;i++){
			var c=s.charCodeAt(i);
			switch(c){
				case 0:r.push('\\0');break;
				case 7:r.push('\\a');break;
				case 8:r.push('\\b');break;
				case 9:r.push('\\t');break;
				case 10:r.push('\\n');break;
				case 13:r.push('\\r');break;
				case 34:r.push('\\"');break;
				case 92:r.push('\\\\');break;
				default:r.push(c<32?'\\x'+("0"+c.toString(16)).slice(-2):c<127?g.String.fromCharCode(c):c<256?'\\x'+("0"+c.toString(16)).slice(-2):'\\u'+("000"+c.toString(16)).slice(-4));}}
		r.push('"');
		return r.join('');
	};
	_.squote=function(s){
		var r=["'"],L=s.length,g=_.globals();
		for(var i=0;i<L;i++){
			var c=s.charCodeAt(i);
			switch(c){
				case 0:r.push('\\0');break;
				case 7:r.push('\\a');break;
				case 8:r.push('\\b');break;
				case 9:r.push('\\t');break;
				case 10:r.push('\\n');break;
				case 13:r.push('\\r');break;
				case 39:r.push("\\'");break;
				case 92:r.push('\\\\');break;
				default:r.push(c<32?'\\x'+("0"+c.toString(16)).slice(-2):c<127?g.String.fromCharCode(c):c<256?'\\x'+("0"+c.toString(16)).slice(-2):'\\u'+("000"+c.toString(16)).slice(-4));}}
		r.push("'");
		return r.join('');
	};
	_.repr=function(o,d,e){
		var g=_.globals();
		if(!arguments.length)
			return '';
		if(o instanceof g.Object||o===g||o===g.Object.prototype){
			if(e===undefined){
				e=_.set([o]);
				if(d===undefined)
					d=g.Infinity;
			}
			else if(e.contains(o))
				return o instanceof g.Array?'[...]':'{...}';
			else
				e.add(o);
			switch(o){
			case g.Object.prototype:
				return '(Object.prototype)';
			case g.Array.prototype:
				return '(Array.prototype)';
			case g.Boolean.prototype:
				return '(Boolean.prototype)';
			case g.Date.prototype:
				return '(Date.prototype)';
			case g.Error.prototype:
				return '(Error.prototype)';
			case g.Function.prototype:
				return '(Function.prototype)';
			case g.Number.prototype:
				return '(Number.prototype)';
			case g.RegExp.prototype:
				return '(RegExp.prototype)';
			case g.String.prototype:
				return '(String.prototype)';
			}
			if(o===g.Math)
				return '(Math)';
			if(o instanceof g.Boolean)
				return '('+g.String(o)+')';
			if(o instanceof g.Date)
				return 'date('+_.repr(g.String(o))+')';
			if(o instanceof g.Function)
				return '<lambda/'+g.String(o.length)+'>';
			if(o instanceof g.Number)
				return '('+g.String(o)+')';
			if(o instanceof g.RegExp)
				return 'RegExp('+g.String(o)+')';
			if(o instanceof g.String)
				return '('+(o.indexOf("'")>=0&&o.indexOf('"')<0?_.quote(o):_.squote(o))+')';
			if(o instanceof g.Array)
				return d?'['+_.map(function(x){return _.repr(x,d-1,e);},o).join(', ')+']':'[...]';
			if(o instanceof Set)
				return d?'set('+_.repr(o.__trait__,d-1,e)+')':'set(...)';
			return d?((function(){
				var r=[];
				for(var n in o){
					try{
						r.push(_.repr(n)+': '+_.repr(o[n],d-1,e));
					}catch(e){
						r.push(_.repr(n)+': {...}');
					}
				}
				return '{'+r.join(', ')+'}';
			})()):'{...}';
		}
		if(typeof o==='boolean'||typeof o==='number'||o===null||o===undefined)
			return g.String(o);
		if(typeof o==='string')
			return o.indexOf("'")>=0&&o.indexOf('"')<0?_.quote(o):_.squote(o);
		if(typeof o==='function')
			return '<lambda/'+g.String(o.length)+'>';
		try{
			return '('+g.String(o)+')';
		}catch(e){
			return '{...}';
		}
	};
	_.split=function(s,p){
		var g=_.globals(),i,j=0,m,r=[];
		p=p instanceof g.RegExp?g.RegExp(p.source,'g'+(p.ignoreCase?'i':'')+(p.multiline?'m':'')+(p.sticky?'y':'')):g.RegExp(p,'g');
		while(m=p.exec(s)){
			i=m.index+m[0].length;
			if(i>j){
				r.push(s.slice(j,m.index));
				j=i;
			}
			if(p.lastIndex===m.index)
				p.lastIndex++;
		}
		if(j<s.length)
			r.push(s.slice(j));
		else if(!p.test(''))
			r.push('');
		return r;
	};
	_.str=function(o,d){
		switch(typeof o){
		case 'string':
			return o;
		case 'function':
			return o.toString();
		}
		return _.repr(o,d);
	};
	_.format=_.proto(new(function(){
		this.H={
		'b': function(o){
				return _.globals().parseInt(o).toString(2);
			},
		'd': function(o){
				return _.globals().parseInt(o).toString();
			},
		'f': function(o){
				return _.globals().parseFloat(o).toString();
			},
		'F': function(o){
				return _.globals().parseFloat(o).toString().toUpperCase();
			},
		'x': function(o){
				return _.globals().parseInt(o).toString(16);
			},
		'X': function(o){
				return _.globals().parseInt(o).toString(16).toUpperCase();
			},
		'c': _.chr,
		'r': _.repr,
		's': _.str,
		'S': function(o){
				return _.globals().String(o);
			}
		};
	}))(function(s){
		var L=arguments.length,m=s.search('%'),n=1,P=arguments.callee.prototype,R=new _.globals().RegExp('^[%'+_.list(P.H).sort().join('')+']'),r='';
		while(m>=0){
			r+=s.slice(0,m);
			s=s.slice(m+1);
			m=R.exec(s)
			_.assert(m,'format() unsupported format character %r',s);
			m=m[0];
			if(m==='%')
				r+='%';
			else{
				_.assert(n<L,'format() not enough arguments for format string');
				r+=P.H[m.slice(-1)](arguments[n++]);
			}
			s=s.slice(m.length);
			m=s.search('%');
		}
		r+=s;
		_.assert(n===L,'format() not all arguments converted during string formatting');
		return r;
	});
});
var Intermezzo=new(function(){
	var _=this;
	var undefined=function(_){return _;}();
	var global=(function(){return this;}).call(null);
	_.XMLHttpRequest=global.XMLHttpRequest||function(){return new global.ActiveXObject('Microsoft.XMLHTTP');};
	_.GetComputedStyle=function(e){return global.getComputedStyle?global.getComputedStyle(e,null):e.currentStyle;};
	_.ParseXML=function(content){
		if(global.DOMParser)
			return (new global.DOMParser()).parseFromString(content,'text/xml');
		else
			return (function(doc){
				doc.async="false";
				doc.loadXML(content);
				return doc;
			})(new global.ActiveXObject('Microsoft.XMLDOM'));
	};
	if(!global.addEventListener){
		var event=function(){
			var r={};
			var e=global.event;
			var doc=e.srcElement.ownerDocument||e.srcElement.document;
			r.target=e.srcElement;
			r.clientX=e.clientX;
			r.clientY=e.clientY;
			r.screenX=e.screenX;
			r.screenY=e.screenY;

			r.altKey=e.altKey;
			r.ctrlKey=e.ctrlKey;
			r.shiftKey=e.shiftKey;

			r.keyCode=e.keyCode;

			r.pageX=e.clientX+Math.max(doc.documentElement.scrollLeft,doc.body.scrollLeft);
			r.pageY=e.clientY+Math.max(doc.documentElement.scrollTop,doc.body.scrollTop);
			return r;
		};
		_.AddEventListener=function(target,type,callback,capture){
			var atom=function(){callback.call(target,event());};
			target.attachEvent('on'+type,atom);
			return atom;
		};
		_.RemoveEventListener=function(target,type,atom,capture){
			target.detachEvent('on'+type,atom);
		};
	}
	else{
		_.AddEventListener=function(target,type,callback,capture){
			var atom=function(event){callback.call(this,event);};
			target.addEventListener(type,atom,capture);
			return atom;
		};
		_.RemoveEventListener=function(target,type,atom,capture){
			target.removeEventListener(type,atom,capture);
		};
	}
	_.AppendNode=function(r){
		var doc=r.ownerDocument||r.document;
		var T=function(r,m){
			if(m instanceof Array){
				var n,tag=m[0].toUpperCase();
				switch(tag){
				case 'CAPTION':n=r.createCaption();break;
				case 'THEAD':n=r.createTHead();break;
				case 'TFOOT':n=r.createTFoot();break;
				case 'TR':n=r.insertRow(-1);break;
				case 'TD':n=r.insertCell(-1);break;
				default:n=doc.createElement(tag);tag='';
				}
				var props=m[1];
				if(props instanceof global.Function)
					props(n);
				else if(props)
					for(var name in props)
						n[name]=props[name];
				if(!tag)
					r.appendChild(n);
				for(var i=2;i<m.length;i++)
					arguments.callee(n,m[i]);
			}
			else if(m instanceof global.Function){
				m(r);
			}
			else
				r.appendChild(typeof m==='string'?doc.createTextNode(m):m);
		};
		for(var i=1;i<arguments.length;i++)
			T(r,arguments[i]);
		return r;
	};
	_.DomTraveler=function(o,f,n){
		n=n||0;
		f(o,n);
		for(var i=0;i<o.childNodes.length;i++)
			arguments.callee(o.childNodes[i],f,n+1);
	};
	if(global.getSelection){
		_.GetSelectedText=function(){
			return global.getSelection().toString();
		};
	}
	else{
		_.GetSelectedText=function(){
			return document.selection.createRange().text;
		};
	}
	_.Hypertext=function(s){
		var r=[],L=s.length;
		for(var i=0;i<L;i++){
			var c=s.charAt(i);
			switch(c){
				case ' ':r.push('&nbsp;');break;
				case '"':r.push('&quot;');break;
				case '&':r.push('&amp;');break;
				case '<':r.push('&lt;');break;
				case '>':r.push('&gt;');break;
				default:r.push(c);}}
		return r.join('');
	};
	_.Navigate=function(url){
		var retval=global.document.location.href;
		if(url!==undefined)
			global.document.location.href=url;
		return retval;
	};
	_.RegisterGlobalExceptionHandler=function(f){
		var retval=global.onerror;
		global.onerror=f;
		return retval;
	};
	_.RemoveNode=function(node){
		return (node&&node.parentNode)?node.parentNode.removeChild(node):node;
	};
});
var URI=new(function(){
	var _=this;
	var undefined=function(_){return _;}();
	var globals=function(){return(function(){return this;}).call(null);};
	var _URI=function(){
		this.scheme='';
		this.user='';
		this.password='';
		this.host=undefined;
		this.port='';
		this.path=[];
		this.query='';
		this.fragment='';
	};
	_URI.prototype=new(function(){
		this.toString=function(){
			var r='';
			if(this.scheme)
				r+=this.scheme+':';
			if(this.host!==undefined){
				r+='//';
				if(this.user||this.password){
					if(this.user)
						r+=this.user;
					if(this.password)
						r+=':'+this.password;
					r+='@';
				}
				r+=this.host;
				if(this.port)
					r+=':'+this.port;
				if(this.host&&this.path.length&&this.path[0]!=='/')
					r+='/';
			}
			r+=this.path.join('');
			r+=this.query;
			r+=this.fragment;
			return r;
		};
		this.Normalize=function(B){
			var r=new _URI,P=this.path;
			r.scheme=this.scheme.toLowerCase();
			r.user=this.user;
			r.password=this.password;
			r.host=this.host;
			r.port=this.port;
			while(r.port.charAt(0)==='0')
				r.port=r.port.slice(1);
			if(r.port==={
				ftp:'23',
				http:'80',
				https:'443'
			}[r.scheme])
				r.port='';
			r.query=this.query;
			r.fragment=this.fragment;
			if(!r.scheme&&B){
				r.scheme=B.scheme;
				r.user=B.user;
				r.password=B.password;
				r.host=B.host;
				r.port=B.port;
				if(P.length===0)
					P=B.path.slice(0);
				else if(P[0]!=='/'){
					P=B.path.slice(0);
					if(P.length){
						if(!'..'.indexOf(P[P.length-1]))
							P[P.length-1]+='/';
						if(P[P.length-1].indexOf('/')<0)
							P.pop();
					}
					P=P.concat(this.path);
				}
			}
			if(P.length&&!'..'.indexOf(P[P.length-1]))
				P[P.length-1]+='/';
			for(var i=0;i<P.length;i++){
				var t=P[i];
				if(t==='/'){
					if(i===0)
						r.path.push(t);
				}
				else if(t==='../'){
					if(r.path.length===0)
						r.path.push(t);
					else if(r.path[r.path.length-1]===t)
						r.path.push(t);
					else if(r.path[r.path.length-1]!=='/')
						r.path.pop();
				}
				else if(t!=='./')
					r.path.push(t);
			}
			if(r.host!==undefined&&!r.path.length)
				r.path.push('/');
			return r;
		};
	});
	_.GetCurrentURI=function(){return globals().location.href;};
	_.NormalizeURI=function(s,b){
		return _.ParseURI(s).Normalize(b===undefined?b:_.ParseURI(b)).toString();
	};
	_.ParseURI=function(s){
		var i=s.indexOf(':'),r=new _URI;
		if(i>=0&&s.slice(0,i).match(/^[a-z][-+.0-9a-z]*$/i)){
			r.scheme=s.slice(0,i);
			s=s.slice(i+1);
		}
		if((i=s.indexOf('#'))>=0){
			r.fragment=s.slice(i);
			s=s.slice(0,i);
		}
		if((i=s.indexOf('?'))>=0){
			r.query=s.slice(i);
			s=s.slice(0,i);
		}
		if(r.scheme&&s.slice(0,2)==='//'){
			s=s.slice(2);
			if((i=s.indexOf('/'))<0)
				i=s.length;
			r.path=s.slice(i);
			s=s.slice(0,i);
			if((i=s.lastIndexOf('@'))>=0){
				r.host=s.slice(i+1);
				s=s.slice(0,i);
				if((i=s.indexOf(':'))>=0){
					r.password=s.slice(i+1);
					s=s.slice(0,i);
				}
				r.user=s;
			}
			else
				r.host=s;
			s=r.host;
			if((i=s.lastIndexOf(':'))>=0){
				r.host=s.slice(0,i);
				r.port=s.slice(i+1);
			}
			else
				r.host=s;
		}
		else
			r.path=s;
		r.path=r.path.split('/');
		for(i=0;i<r.path.length-1;i++)
			r.path[i]+='/';
		if(!r.path[i])
			r.path.pop();
		return r;
	};
});
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
