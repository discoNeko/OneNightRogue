

	function onClick(e){
		var rect = e.target.getBoundingClientRect();
		var x =  Math.round(e.clientX - rect.left);
		var y =  Math.round(e.clientY - rect.top);
		console.log("click "+x+" "+y);
	}

	function onMove(e){
		var rect = e.target.getBoundingClientRect();
		var x =  Math.round(e.clientX - rect.left);
		var y =  Math.round(e.clientY - rect.top);
		//console.log(x+" "+y);
	}

	document.onkeydown = function (e){
		var key = e.keyCode;
		console.log(key);
		if(MainChara.hp<1){
			if(key==13){
				reset();
			}else{
				return 0;
			}
		}
		on_key[key] = true;
	};

	document.onkeyup = function (e){
		var key = e.keyCode;
		on_key[key] = false;
	};
	