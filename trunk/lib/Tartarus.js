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
