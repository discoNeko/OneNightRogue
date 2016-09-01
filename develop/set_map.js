	
	//mapを初期化
	function setInitMap(){
		//引数によって生成する map を変更する
		//ex.街、ダンジョン、……
		setMapRandom();
		genCross();
	}

	function genCross(){
		var rnd = Math.floor(Math.random()*6);
		for(var i = 0; i < cROW; i++){
			for(var j = 0; j < cCOL; j++){
				if(rnd==0){
					if(i%2==0 && j%2!=0)map[i][j] = true;
					if(i%2!=0 && j%2==0)map[i][j] = true;
				}
				if(rnd==1){
					if(i%2==0)map[i][j] = true;
				}
				if(rnd==2){
					if(i%2==0 && 2*j<i && i<cROW-2*j){
						map[i][j]=true;
						map[cROW-1-i][cCOL-1-j]=true;
					}
					if(j%2==0 && 2*i<j && j<cCOL-2*i){
						map[i][j]=true;
						map[cROW-1-i][cCOL-1-j]=true;
					}
				}
				if(rnd==3){
					var r = Math.floor(Math.random()*2);
					if(r==0)continue;
					if(i%2==0 && 2*j<i && i<cROW-2*j){
						map[i][j]=true;
						map[cROW-1-i][cCOL-1-j]=true;
					}
					if(j%2==0 && 2*i<j && j<cCOL-2*i){
						map[i][j]=true;
						map[cROW-1-i][cCOL-1-j]=true;
					}
				}
				if(rnd==4){
					if(i%2==0 && i==j){
						for(var k = j; k < cROW-j; k++){
							map[k][i]=true;
							map[i][k]=true;
							map[cROW-1-k][cCOL-1-i]=true;
							map[cROW-1-i][cCOL-1-k]=true;
						}
					}
				}
				if(rnd==5){
					var r = Math.floor(Math.random()*2);
					if(r==0)map[i][j]=true;
				}
			}
		}
	}

	function genRoom(sx,sy,gx,gy,skip){
		var v;
		var ssx = [], ssy = [];
		var r = [], c = [];
		for(var i = 0; i < 4; i++){
			r[i] = Math.floor(Math.random()*10)+1;
			c[i] = Math.floor(Math.random()*10)+1;
		}

		//set position
		ssx[0] = sx - r[0];
		while(true){
			ssx[1] = Math.floor(Math.random()*cROW);
			if((ssx[1]>=sx && ssx[1]<gx) || (ssx[1]+r[1]>=sx && ssx[1]+r[1]<gx))
				break;
		}
		ssx[2] = gx;
		while(true){
			ssx[3] = Math.floor(Math.random()*cROW);
			if((ssx[3]>=sx && ssx[3]<gx) || (ssx[3]+r[3]>=sx && ssx[3]+r[3]<gx))
				break;
		}

		while(true){
			ssy[0] = Math.floor(Math.random()*cROW);
			if((ssy[0]>=sy && ssy[0]<gy) || (ssy[0]+c[0]>=sy && ssy[0]+c[0]<gy))
				break;
		}
		ssy[1] = sy - c[1];
		while(true){
			ssy[2] = Math.floor(Math.random()*cROW);
			if((ssy[2]>=sy && ssy[2]<gy) || (ssy[2]+c[2]>=sy && ssy[2]+c[2]<gy))
				break;
		}
		ssy[3] = gy;

		for(var i = 0; i < 4; i++){
			if(skip==i)continue;
			v = true;
			var s1 = ssx[i], g1 = ssx[i] + r[i];
			var s2 = ssy[i], g2 = ssy[i] + c[i];
			for(var j = s1; j < g1; j++){
				for(var k = s2; k < g2; k++){
					if(-1<j && j<cROW && -1<k && k<cCOL && !map[j][k]){
						map[j][k] = true;
					}else{
						v = false;
						j=g1;
						break;
					}
				}
			}
			if(v)genRoom(s1,s2,g1,g2,i);
		}
	}

	//random map生成
	function setMapRandom(){
		for(var i = 0; i < cROW; i++){
			map[i] = [];
		}

		var sx = Math.floor(Math.random()*10)+cROW/2;
		var sy = Math.floor(Math.random()*10)+cCOL/2;
		var gx = Math.floor(Math.random()*10)+1+sx;
		var gy = Math.floor(Math.random()*10)+1+sy;
		for(var i = sx; i < gx; i++){
			for(var j = sy; j < gy; j++){
				map[i][j] = true;
			}
		}
		genRoom(sx,sy,gx,gy,-1);
		for(var i = 0; i < cROW; i++){
			map[i][0] = false;
			map[0][i] = false;
			map[i][cCOL-1] = false;
			map[cROW-1][i] = false;
		}

		//chara set
		while(true){
			var x = Math.floor(Math.random()*cROW);
			var y = Math.floor(Math.random()*cCOL);
			if(map[x][y]){
				MainChara.x = x*mSIZE;
				MainChara.y = y*mSIZE;
				break;
			}
		}
		//debug	
		/*
		map[80][0] = true;
		MainChara.x = 80*25;
		MainChara.y = 0;
		*/

		for(var i = 0; i < cROW; i++){
			var s = "";
			for(var j = 0; j < cCOL; j++){
				if(map[i][j]){
					s += "O";
				}else{
					s += "■";
				}
			}
			console.log(s);
		}
	}

	function setItem(){
		for(var i = 0; i < cROW; i++){
			imap[i] = [];
			for(var j = 0; j < cCOL; j++){
				imap[i][j] = -1;
			}
		}

		var num = Math.floor(Math.random()*20)+10;
		while(num>0){
			var x = Math.floor(Math.random()*cROW);
			var y = Math.floor(Math.random()*cCOL);
			if(map[x][y])
				imap[x][y] = Math.floor(Math.random()*5);
			num--;
		}
	}

	function loadCSV(){
		var data;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET","src/map.csv",true);
		xmlhttp.send(null);
		xmlhttp.onload = function(){
			var str = xmlhttp.responseText;
			data = str.split(/\r\n/);
			setMap(data);
		}
	}

	function setMap(data){
		var dmap = [];
		for(var i = 0; i < cROW; i++){
			map[i] = [];
			dmap[i] = data[i].split(',');
		}
		for(var i = 0; i < cROW; i++){
			for(var j = 0; j < cCOL; j++){
				if(dmap[j][i]==0)
					map[i][j] = true;
			}
		}
		requestId = window.requestAnimationFrame(renderTitle); 
	}

	function countMapVoid(){
		var cnt = 0;
		for(var i = 0; i < cROW; i++){
			for(var j = 0; j < cCOL; j++){
				if(map[i][j])
					cnt++;
			}
		}
		return cnt;
	}