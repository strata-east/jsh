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
