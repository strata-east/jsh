var System=new(function(){
	var _=this;
	var global=(function(){return this;}).call(null);
	var FileSystemObject=new global.ActiveXObject('Scripting.FileSystemObject');
	var WshShell=new global.ActiveXObject('WScript.Shell');

	_.ArgvToCommandLine=function(argv)
	{
		var retval=[];
		for(var i=0;i<argv.length;i++)
			retval.push(_.EscapeArgument(argv[i]));
		return retval.join(' ');
	};
	_.BuildPath=function(path,name){
		return FileSystemObject.BuildPath(path,name);
	};
	_.CommandLineToArgv=function(cmd){
		var i=0,c=cmd.charAt(i++),retval=[];
		while(true)
		{
			while(c===' '||c==='\t')
				c=cmd.charAt(i++);
			var quote=false;
			var escape=false;
			var arg=c?'':null;
			while(true)
			{
				if(c==='')
				{
					if(arg!==null)
					{
						if(escape)
							arg+='\\';
						retval.push(arg);
					}
					return retval;
				}
				if(escape)
				{
					escape=false;
					if(c!=='"'&&c!=='\\')
						arg+='\\';
					arg+=c;
				}
				else if(quote)
				{
					if(c==='"')
						quote=false;
					else if(c==='\\')
						escape=true;
					else
						arg+=c;
				}
				else
				{
					if(c===' '||c==='\t')
					{
						retval.push(arg);
						break;
					}
					if(c==='"')
						quote=true;
					else
						arg+=c;
				}
				c=cmd.charAt(i++);
			}
		}
	};
	_.EscapeArgument=function(arg){
		var retval=[],doublequote=false,quote=false;
		for(var i=arg.length;i--;)
		{
			var c=arg.charAt(i);
			switch(c)
			{
			case '\\':
				retval.push(doublequote?'\\\\':'\\');
				break;
			case '"':
				retval.push('\\"');
				doublequote=true;
				break;
			default:
				retval.push(c);
				doublequote=false;
				if(c==' '||c=='\t'||c=='|')
					quote=true;
			}
		}
		if(quote)
			retval=global.Array.prototype.concat(['"'],retval,['"']);
		return retval.reverse().join('');
	};
	_.FolderTraveler=function(path,callback){
		(function(path,level){
			var f=FileSystemObject.GetFolder(path),s=[],iter;
			for(iter=new global.Enumerator(f.Files);!iter.atEnd();iter.moveNext())
				s.push(iter.item());
			callback(FileSystemObject.GetAbsolutePathName(path),s,level);
			for(iter=new global.Enumerator(f.SubFolders);!iter.atEnd();iter.moveNext())
				arguments.callee(iter.item(),level+1);
		})(path,0);
	};
	_.GetCurrentDirectory=function(){
		return WshShell.CurrentDirectory;
	};
	_.GetDrive=function(path){
		return FileSystemObject.GetDrive(path);
	};
	_.GetFile=function(path){
		return FileSystemObject.GetFile(path);
	};
	_.GetFolder=function(path){
		return FileSystemObject.GetFolder(path);
	};
	_.SetCurrentDirectory=function(path){
		WshShell.CurrentDirectory=path;
	};
	_.SubProcess=function(cmd){
		return WshShell.Exec(typeof cmd==='string'?cmd:_.ArgvToCommandLine(cmd));
	};
});
