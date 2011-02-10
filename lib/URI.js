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
