var UTF8=new(function(){
	this.Encode=function(s){
		var r=[];
		for(var i=0;i<s.length;i++){
			var c=s.charCodeAt(i);
			if(c<128)r.push(c);
			else if(c<2048)r.push(c>>6|0xc0,c&0x3f|0x80);
			else if(c<65536)r.push(c>>12|0xe0,c>>6&0x3f|0x80,c&0x3f|0x80);
			else r.push(c>>18|0xf0,c>>12&0x3f|0x80,c>>6&0x3f|0x80,c&0x3f|0x80);}
		return String.fromCharCode.apply(null,r);
	};
	this.Decode=function(s){
		var r=[],n=0,x=0;
		for(var i=0;i<s.length;++i){
			var c=s.charCodeAt(i);
			if(!n)
				if(c<128)r.push(c);
				else if(c<192);
				else if(c<224){x=c&0x1f;n=1;}
				else if(c<240){x=c&0x0f;n=2;}
				else if(c<248){x=c&0x07;n=3;}
				else;
			else if((c&0xc0)==0x80){x<<=6;x+=c&0x3f;if(!--n)r.push(x);}
			else n=0;}
		return String.fromCharCode.apply(null,r);
	};
});
