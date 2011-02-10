var LZW=new(function(){
	this.Compress=function(s){
		var L=s.length,z=256,bits=8,slot=0,w='',r=[],R=0,Rbits=0,D={};
		if(!L)return '';
		for(var i=0;i<z;i++)
			D[String.fromCharCode(i)]=i;
		for(var i=0;i<L;i++){
			var c=s.charAt(i);
			var wc=w+c;
			if(D.hasOwnProperty(wc))
				w=wc;
			else{
				R=R<<bits|D[w];
				Rbits+=bits;
				while(Rbits>=8)
					r.push((R>>(Rbits-=8))&0xff);
				R&=(1<<Rbits)-1;
				if(!slot--)
					slot=(1<<bits++)-1;
				D[wc]=z++;
				w=c;
			}
		}
		R=R<<bits|D[w];
		Rbits+=bits;
		while(Rbits>=8)
			r.push((R>>(Rbits-=8))&0xff);
		R&=(1<<Rbits)-1;
		if(Rbits)
			r.push(R<<(8-Rbits));
		return String.fromCharCode.apply(null,r);
	};
	this.Decompress=function(s){
		var L=s.length,z=256,bits=8,slot=0,R=0,Rbits=0,D={},r,entry;
		if(!L)return '';
		for(var i=0;i<z;i++)
			D[i]=String.fromCharCode(i);
		var k=s.charCodeAt(0),w=s.charAt(0);
		r=[w],i=1;
		while(true){
			if(!slot--)
				slot=(1<<bits++)-1;
			while(Rbits<bits){
				R<<=8;
				if(i>=L)
					return r.join('');
				R+=s.charCodeAt(i++);
				Rbits+=8;
			}
			k=R>>(Rbits-=bits);
			R&=(1<<Rbits)-1;
			entry=D.hasOwnProperty(k)?D[k]:w+w.charAt(0);
			r.push(entry);
			D[z++]=w+entry.charAt(0);
			w=entry;
		}
		return r.join('');
	};
});
