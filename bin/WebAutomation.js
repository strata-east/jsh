var WebAutomation = new(function(){
	var _ = this;
	var global = (function(){return this;}).call(null);
	_.Wait = function(ie, timeout){
		var accumulated = 0, granularity = 500;
		timeout = timeout || Number.POSITIVE_INFINITY;
		while(ie.Busy){
			if(accumulated >= timeout)
				break;
			global.WScript.Sleep(granularity);
			accumulated += granularity;
		}
		global.WScript.Sleep(granularity);
		accumulated += granularity;
		while(ie.Busy){
			if(accumulated >= timeout)
				break;
			global.WScript.Sleep(granularity);
			accumulated += granularity;
		}
	};
	_.InternetExplorer = function(url, timeout){
		var retval = new global.ActiveXObject('InternetExplorer.Application');
		retval.visible = true;
		if(url)
			retval.navigate(url);
		_.Wait(retval, timeout);
		return retval;
	};
	_.GetTextContent = function(node){
		var retval = '';
		var childNodes = node.childNodes;
		for(var i = 0; i < childNodes.length; ++i){
			var child = childNodes[i];
			switch(child.nodeType){
			case 1: /* ELEMENT_NODE */
				if({
					SCRIPT: 0,
					STYLE: 0
				}.hasOwnProperty(child.tagName.toUpperCase()))
					break;
			case 5: /* ENTITY_REFERENCE_NODE */
				retval += _.GetTextContent(child);
				break;
			case 2: /* ATTRIBUTE_NODE */
			case 3: /* TEXT_NODE */
			case 4: /* CDATA_SECTION_NODE */
				retval += node.tagName && node.tagName.toUpperCase() == 'PRE' ? child.nodeValue : child.nodeValue.replace(/(\r?\n)|\r/g, ' ');
				break;
			};
		}
		if(node.nodeType === 1 /* ELEMENT_NODE */)
			if(node.tagName.toUpperCase() === 'BR')
				retval = '\n';
			else if(retval.charAt(retval.length - 1) !== '\n' && ({
				DIV: 0,
				H1: 0,
				H2: 0,
				H3: 0,
				H4: 0,
				H5: 0,
				LI: 0,
				P: 0,
				TR: 0
			}).hasOwnProperty(node.tagName.toUpperCase()))
				retval += '\n';
		return retval;
	};
})();
