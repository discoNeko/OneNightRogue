

	//message 初期化
	function setMes(){
		for(var i = 0; i < mes_num; i++)
			message[i] = "";
		message[0] = "ようこそ！";
	}
	
	//メッセージ追加
	function addMes(str){
		for(var i = mes_num - 2; i > -1 ; i--){
			message[i+1] = message[i];
		}
		message[0] = str;
	}

	//改行せずにメッセージ挿入
	function insertMes(str){
		//addMes(str)；
		//return 0;
		var pos = 42;
		message[0] += str;
		var len = message[0].length;
		if(len > pos){
			var tmp = message[0];
			message[0] = tmp.substring(0,pos);
			addMes(tmp.substring(pos,len));
		}
	}
