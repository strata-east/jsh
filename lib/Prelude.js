var Prelude=new(function(){
	var _=this;
	var undefined=function(_){return _;}();
	_.reflect=arguments.callee;
	_.assert=function(e,s){e||_.exception(0,arguments.length<=2?s:_.format.apply(null,_.map(_.idn,arguments).slice(1)));};
	_.proto=function(){
		var A=arguments,L=A.length,R=function(){
			A[0].apply(this,arguments);
			this.constructor=arguments.callee;
		};
		_.assert(2<=L&&L<=3,'proto() expected 2 to 3 arguments, got %d',L);
		if(L==3)
			A[1].prototype=A[2].prototype;
		R.prototype=new A[1];
		return R;
	};

	_.Exception=_.proto(function(n,s){
		this.name='Exception';
		this.number=n||0;
		this.description=this.message=s||'';
	},Error);
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
	var Set=_.proto(function(v){
		this.__trait__=[];
		this.length=0;
		var L=v.length;
		for(var i=0;i<L;i++)
			this.add(v[i]);
	},function(){
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
	_.format=function(s){
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
	};
	_.format.prototype=new function(){
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
	};
});
