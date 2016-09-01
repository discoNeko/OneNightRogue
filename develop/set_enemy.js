
	// enemy
	//////////////////////////////////////////////////////////////////////////////

	function genDamagedImages(){

	}

	//enemy初期化
	function setEnemy(){
		//emap初期化 chip座標
		for(var i = 0; i < cROW; i++){
			emap[i] = [];
			for(var j = 0; j < cCOL; j++){
				emap[i][j] = [];
			}
		}

		//debug map対応enemy数調整
		e_num = Math.floor(countMapVoid()/30);
		console.log("map void "+countMapVoid()+" enemy "+e_num);

		//enemy 配置
		for(var i = 0; i < e_num; i++){
			Enemy[i] = new Chara();
			Enemy[i].img_num = 2;
			Enemy[i].img.src = 'img/2.png';
			while(true){
				var x = Math.floor(Math.random()*(dROW - mSIZE));
				var y = Math.floor(Math.random()*(dCOL - mSIZE));
				if(i==1){
					x = 0;
					y = 0;
				}
				if(i==2){
					x = dROW - mSIZE;
					y = dCOL - mSIZE;
				}
				var cx = Math.floor(x/mSIZE);
				var cy = Math.floor(y/mSIZE);
				var nx = Math.ceil(x/mSIZE);
				var ny = Math.ceil(y/mSIZE);
				//if(emap[cx][cy].length==0 && map[cx][cy]){
				if(i==1){
					Enemy[i].x = x;
					Enemy[i].y = y;
					Enemy[i].exist = true;
					emap[cx][cy].push(i);
					break;
				}
				if(i==2){
					Enemy[i].x = x;
					Enemy[i].y = y;
					Enemy[i].exist = true;
					emap[cx][cy].push(i);
					break;
				}
				if(map[cx][cy] && map[nx][ny] && map[nx][cy] && map[cx][ny]){
					Enemy[i].name = "Enemy"+i;
					Enemy[i].x = x;
					Enemy[i].y = y;
					Enemy[i].exist = true;
					emap[cx][cy].push(i);
					break;
				}
			}
		}
		Enemy[0].img_num = 3;
		Enemy[0].img.src = 'img/3.png';
		genDamagedImages();
	}

	function resetEnemy(){
		for(var i = 0; i < cROW; i++){
			for(var j = 0; j < cCOL; j++){
				emap[i][j] = -1;
			}
		}
		for(var i = 0; i < e_num; i++){
			while(true){
				var x = Math.floor(Math.random()*dROW);
				var y = Math.floor(Math.random()*dCOL);
				if(emap[x][y]==-1){
					Enemy[i].x = x;
					Enemy[i].y = y;
					Enemy[i].exist = true;
					x = Math.floor(x/mSIZE);
					y = Math.floor(y/mSIZE);
					emap[x][y].push(i);
					break;
				}
			}
		}
	}
