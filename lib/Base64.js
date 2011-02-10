var Base64=new(function(){
	var D=[];
	for(var i=65;i<91;i++)D.push(i);
	for(var i=97;i<123;i++)D.push(i);
	for(var i=48;i<58;i++)D.push(i);
	D.push(43,47,61);
	var L=D.length-1,R=[];
	for(var i=0;i<L;i++)R[D[i]]=i;
	this.Encode=function(s){
		var r=[],c1,c2,c3,e1,e2,e3,e4,L=s.length;
		for(var i=0;i<L;i++){
			c1=s.charCodeAt(i);e1=c1>>2;
			if(!isNaN(c2=s.charCodeAt(++i))){
				e2=c1<<4&0x30|c2>>4;
				if(!isNaN(c3=s.charCodeAt(++i))){e3=c2<<2&0x3c|c3>>6;e4=c3&0x3f;}
				else{e3=c2<<2&0x3c;e4=64;}}
			else{e2=c1<<4&0x30;e3=e4=64;}
			r.push(D[e1],D[e2],D[e3],D[e4]);}
		return String.fromCharCode.apply(null,r);
	};
	this.Decode=function(s){
		var r=[],n=0,x=0,e1,e2,e3,e4,L=s.length;
		for(var i=0;i<L;i++){
			e1=R[s.charCodeAt(i)];
			if(!isNaN(e2=R[s.charCodeAt(++i)])){
				r.push(e1<<2|e2>>4);
				if(!isNaN(e3=R[s.charCodeAt(++i)])){
					r.push(e2<<4&0xf0|e3>>2);
					if(!isNaN(e4=R[s.charCodeAt(++i)]))
						r.push(e3<<6&0xc0|e4);}}}
		return String.fromCharCode.apply(null,r);
	};
});
