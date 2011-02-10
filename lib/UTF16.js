var UTF16=new(function(){
	var P={
		'BE':function(r,c){r.push(c>>8&0xff,c&0xff);},
		'LE':function(r,c){r.push(c&0xff,c>>8&0xff);}
	};
	var Q={
		'BE':function(x,y){return x<<8|y;},
		'LE':function(x,y){return y<<8|x;}
	};
	this.Encode=function(s,pack,bom){
		var L=s.length,r=!bom?[]:pack==='BE'?[0xfe,0xff]:[0xff,0xfe];
		pack=P[pack];
		for(var i=0;i<L;i++){
			var c=s.charCodeAt(i);
			if(c<65536)pack(r,c);
			else{
				c-=65536;
				pack(r,c>>10&0x3f|0xd800);
				pack(r,c&0x3f|0xdc00);}}
		return String.fromCharCode.apply(null,r);
	};
	this.Decode=function(s,pack){
		var i=0;L=s.length,r=[];
		if(pack==='BOM'||pack===undefined){
			i=2;
			if(s.charCodeAt(0)===0xfe&&s.charCodeAt(1)===0xff)
				pack='BE';
			else if(s.charCodeAt(0)===0xff&&s.charCodeAt(1)===0xfe)
				pack='LE';}
		pack=Q[pack];
		while(i<L){
			var w=pack(s.charCodeAt(i++),s.charCodeAt(i++));
			if(w>=0xd800&&w<0xe000)
				w=w<<16|pack(s.charCodeAt(i++),s.charCodeAt(i++));
			r.push(w);}
		return String.fromCharCode.apply(null,r);
	};
});
