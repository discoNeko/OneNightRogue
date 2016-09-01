
	function drawCalc(){
		//MainChara の向き
		var d = Math.floor(MainChara.dir/2) - 1;
		var dx = [0,1,-1,0];
		var dy = [-1,0,0,1];

		//main frame の背景色描画
		var ax = 155;
		var ay = 80;
		ctx.fillStyle = '#070';
		ctx.fillRect(ax,ay-55,w-2*ax+5,h-2*ay+5);

		//タイル描画開始位置
		var sx = 165;
		var sy = 35;
		//MainChara の位置
		var cx = Math.floor(MainChara.x / 25);
		var cy = Math.floor(MainChara.y / 25);
		var bx = Math.floor(MainChara.x % 25);
		var by = Math.floor(MainChara.y % 25);
		//console.log(bx+" "+by);
		//表示限界　mass
		var mx = cx - 10;
		var my = cy - 9;
		//以下の関数で描画
		
		//context の保存
		ctx.save();
		//描画範囲はクリッピングマスクで領域内に抑えられている
		ctx.beginPath();
		ctx.rect(sx,sy,19*mSIZE,17*mSIZE);
		ctx.clip();

		//マップ端補正値の判定
		var pos = calcMapLimitCheck(mx,my);
		//chip表示位置の補正値
		var chip_x = bx;
		var chip_y = by;
		//画面端なら　chip　の表示位置を固定する
		//pos.xhit = -1 : 左端
		//pos.xhit =  0 : 中央
		//pos.xhit =  1 : 右端
		if(pos.xhit==-1){
			chip_x = 0;
		}else if(pos.xhit==1){
			chip_x = 25;
		}
		if(pos.yhit==-1){
			chip_y = 0;
		}else if(pos.yhit==1){
			chip_y = 25;
		}
		for(var i = 0; i < 20; i++){
			for(var j = 0; j < 18; j++){
				//xx,yy : chip座標
				var xx = pos.mx + i;
				var yy = pos.my + j;
				drawMapChip(xx,yy,sx+i*25-chip_x,sy+j*25-chip_y);
			}
		}

		//effect
		if(eff_on)
			drawEffect();

		//表示の補正値
		var chara_x = 0;
		var chara_y = 0;
		//画面端なら主人公の表示位置をずらす
		//pos.xhit = -1 : 左端
		//pos.xhit =  0 : 中央
		//pos.xhit =  1 : 右端
		if(pos.xhit==-1){
			chara_x = - bx;
		}else if(pos.xhit==1){
			chara_x = 25 - bx;
		}
		if(pos.yhit==-1){
			chara_y = - by;
		}else if(pos.yhit==1){
			chara_y = 25 - by;
		}
		//キャラの前後関係をチェックするため、y座標上をスキャンする 
		for(var j = 0; j < 18; j++){
			for(var i = 0; i < 20; i++){
				//xx,yy : chip座標
				var xx = pos.mx + i;
				var yy = pos.my + j;

				if(cy==yy && cx==xx){
					//y座標が同一の場合、dot座標でキャラの前後を判定する
					//MainCharaより手前にいるEnemyはあとで描画
					for(var k = -1; k < 2; k++){
						if(xx+k<0 || xx+k>cROW-1)
							continue;
						for(var n in emap[xx+k][yy]){
							var num = emap[xx+k][yy][n] | 0;
							var ebx = Enemy[num].x % mSIZE | 0;
							var eby = Enemy[num].y % mSIZE | 0;
							if(eby>=by)continue;
							//ctx.globalAlpha = 0.5;
							//ctx.fillStyle = '#fff';
							//ctx.fillRect(sx+(i+k)*25-chip_x,sy+j*25-chip_y,mSIZE,mSIZE);
							//ctx.globalAlpha = 1;
							drawEnemy(sx+(i+k)*25-2+ebx-chip_x,sy+j*25-15+eby-chip_y,num);
						}
					}

					//MainChara
					//ctx.globalAlpha = 0.5;
					//ctx.fillStyle = '#fdd';
					//ctx.fillRect(sx+i*25-chip_x,sy+j*25-chip_y,mSIZE,mSIZE);
					//ctx.globalAlpha = 1;
					drawMainChar(sx+i*25-2-chara_x,sy+j*25-15-chara_y);

					//MainCharaより手前にいるEnemy(MainCharaと被る可能性のあるマス)を描画
					for(var k = -1; k < 2; k++){
						if(xx+k<0 || xx+k>cROW-1)
							continue;
						for(var n in emap[xx+k][yy]){
							var num = emap[xx+k][yy][n] | 0;
							var ebx = Enemy[num].x % mSIZE | 0;
							var eby = Enemy[num].y % mSIZE | 0;
							if(eby<by)continue;
							//ctx.globalAlpha = 0.5;
							//ctx.fillStyle = '#0ff';
							//ctx.fillRect(sx+(i+k)*25-chip_x,sy+j*25-chip_y,mSIZE,mSIZE);
							//ctx.globalAlpha = 1;
							drawEnemy(sx+(i+k)*25-2+ebx-chip_x,sy+j*25-15+eby-chip_y,num);
						}
					}
					i++;
				}else{
					for(var n in emap[xx][yy]){
						var num = emap[xx][yy][n] | 0;
						var ebx = Enemy[num].x % mSIZE | 0;
						var eby = Enemy[num].y % mSIZE | 0;
						//ctx.globalAlpha = 0.5;
						//ctx.fillStyle = '#0f0';
						//ctx.fillRect(sx+i*25-chip_x,sy+j*25-chip_y,mSIZE,mSIZE);
						//ctx.globalAlpha = 1;
						drawEnemy(sx+i*25-2+ebx-chip_x,sy+j*25-15+eby-chip_y,num);
					}
				}
			}
		}
		//クリッピングマスクここまで
		//context の復帰
		ctx.restore();
	}

	function calcMapVisibleRange(){
		var cx = Math.floor(MainChara.x / 25) - 10;
		var cy = Math.floor(MainChara.y / 25) - 9;
		var bx = Math.floor(MainChara.x % 25);
		var by = Math.floor(MainChara.y % 25);

		//マップ端補正値の判定
		var pos = calcMapLimitCheck(cx,cy);
		//chip map 座標の更新
		cx = pos.mx;
		cy = pos.my;
		//chip　表示位置の補正値
		if(pos.xhit==-1){
			bx = 0;
		}else if(pos.xhit==1){
			bx = 25;
		}
		if(pos.yhit==-1){
			by = 0;
		}else if(pos.yhit==1){
			by = 25;
		}
		return {cx,cy,bx,by};
	}

	function calcMapLimitCheck(mx,my){
		//lx,ly : 画面上に表示されるchip数
		var lx = 20;
		var ly = 18;
		//hit : マップ端にcharaが居るときを判定
		var xhit = 0, yhit = 0;
		if(mx < 0){
			mx = 0;
			xhit = -1;
		}
		if(mx + lx > cROW){
			mx = cROW - lx;
			xhit = 1;
		}
		if(my < 0){
			my = 0;
			yhit = -1;
		}
		if(my + ly > cCOL){
			my = cCOL - ly;
			yhit = 1;
		}
		return {mx,my,xhit,yhit};
	}

	function drawMapChip(r,c,x,y){
		if(map[r][c]){
			ctx.fillStyle = '#a0a';
			ctx.drawImage(map_chip,0,0,32,32,x,y,24,24);
		}else{
			ctx.fillStyle = '#aa0';
			ctx.drawImage(map_chip,0,0,32,32,x,y,24,24);
			ctx.drawImage(map_chip,224,0,32,32,x,y,24,24);
		}
		if(imap[r][c]!=-1){
			ctx.drawImage(map_chip,32+32*imap[r][c],0,32,32,x,y,24,24);
		}
	}

	function drawMainChar(x,y){
		var dir = MainChara.dir;
		var mot = Math.floor(MainChara.mwait / 100);
		var mcw = MainChara.width;
		var mch = MainChara.height;

		if(mot>2)mot = 1;
		//ctx.fillRect(x+5,y+25,18,15);
		ctx.lineWidth="1";
		ctx.strokeStyle="red";
		ctx.rect(x,y+15,10+mcw,10+mch);
		ctx.rect(x-15,y,30+10+mcw,30+10+mch);//indicator o
		if(dir==2){
			ctx.rect(x,y+15+130,10+mcw,10+mch);//indicator i
			ctx.rect(x-10,y+15-10,20+10+mcw,20+10+mch+60);//indicator p
		}else if(dir==4){
			ctx.rect(x-130,y+15,10+mcw,10+mch);//indicator i
			ctx.rect(x-10-60,y+15-10,20+10+mcw+60,20+10+mch);//indicator p
		}else if(dir==6){
			ctx.rect(x+130,y+15,10+mcw,10+mch);//indicator i
			ctx.rect(x-10,y+15-10,20+10+mcw+60,20+10+mch);//indicator p
		}else if(dir==8){
			ctx.rect(x,y+15-130,10+mcw,10+mch);//indicator i
			ctx.rect(x-10,y+15-10-60,20+10+mcw,20+10+mch+60);//indicator p
		}
		ctx.stroke();
		switch(dir){
			case 2 : //down
				ctx.drawImage(MainChara.img,20*mot,0,20,28,x,y,28,38);
				break;
			case 4 : //left
				ctx.drawImage(MainChara.img,20*mot,28,20,28,x,y,28,38);
				break;
			case 6 : //right
				ctx.drawImage(MainChara.img,20*mot,56,20,28,x,y,28,38);
				break;
			case 8 : //up
				ctx.drawImage(MainChara.img,20*mot,84,20,28,x,y,28,38);
				break;
		}
		//ctx.fillRect(x,y,5,5);
	}

	function drawEnemy(x,y,num){
		var mot = Math.floor(MainChara.mwait / 100);
		if(mot>2)mot = 1;
		//ctx.fillStyle = '#ccc';
		//当たり判定
		//ctx.fillRect(x+5,y+25,18,15);
		ctx.drawImage(Enemy[num].img,20*mot,0,20,28,x,y,28,38);

		if(Enemy[num].damaged>0){
			console.log("aaaaaaa");
			if(Enemy[num].damaged%20==0)
			ctx.globalCompositeOperation = "color-dodge";
			ctx.drawImage(Enemy[num].img,20*mot,0,20,28,x,y,28,38);
			ctx.drawImage(Enemy[num].img,20*mot,0,20,28,x,y,28,38);
			ctx.globalCompositeOperation = "source-over";
		}
	}
