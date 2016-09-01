
	// action system
	//////////////////////////////////////////////////////////////////////////

	//i
	function flash(){
		MainChara.attack_interval = MainChara.delay;
		var d = MainChara.dir;
		if(d==4){
			moveMainChar(-1,0,76);
			moveMainChar(-1,0,26);
			moveMainChar(-1,0,26);
		}else if(d==2){
			moveMainChar(0,1,76);
			moveMainChar(0,1,26);
			moveMainChar(0,1,26);
		}else if(d==6){
			moveMainChar(1,0,76);
			moveMainChar(1,0,26);
			moveMainChar(1,0,26);
		}else{
			moveMainChar(0,-1,76);
			moveMainChar(0,-1,26);
			moveMainChar(0,-1,26);
		}
		//現在地点でeffectを描画したいので、reservedせずに即時移動させている
		addMainCharaEffect(6);
		var range1 = calcRangeAoE(20,20,8);
		var range2 = calcRangeAoE(20,20,2);
		calcEnemyHitAoE(range1.sx,range1.gy,range2.gx,range2.gy,170);
	}

	//o
	function rotate(){
		MainChara.attack_interval = MainChara.delay;
		var range1 = calcRangeAoE(40,40,8);
		var range2 = calcRangeAoE(40,40,2);
		calcEnemyHitAoE(range1.sx,range1.gy,range2.gx,range2.gy,170);

		addReservedAttack(range1.sx,range1.gy+35,range2.gx,range2.gy+35,70,15);
		addReservedAttack(range1.sx-35,range1.gy-20,range2.gx-35,range2.gy-20,70,15);
		addReservedAttack(range1.sx+35,range1.gy-20,range2.gx+35,range2.gy-20,70,15);

		addReservedAttack(range1.sx,range1.gy-35-35,range2.gx,range2.gy-35-35,30,40);
		addReservedAttack(range1.sx-35-35,range1.gy+20+20,range2.gx-35-35,range2.gy+20+20,30,40);
		addReservedAttack(range1.sx+35+35,range1.gy+20+20,range2.gx+35+35,range2.gy+20+20,30,40);
		addMainCharaEffect(4);

	}

	//p
	function slash(){
		//set attack interval
		MainChara.attack_interval = MainChara.delay;
		//console.log("MAIN "+MainChara.x+" "+MainChara.y+" "+MainChara.dir);

		var d = MainChara.dir;
		var range = calcRangeAoE(60,20,d);
		calcEnemyHitAoE(range.sx,range.sy,range.gx,range.gy,10);
		if(d==4){
			//calcEnemyHitAoE(MainChara.x-MainChara.width-5,MainChara.y-5,MainChara.x-MainChara.width-5+60,MainChara.y+MainChara.height+5,100);	
			addReservedMove(-1,0,26,1);
			addReservedMove(-1,0,8,5);
			addReservedMove(-1,0,4,5);
			addReservedMove(-1,0,2,5);
			addReservedMove(-1,0,1,5);
		}else if(d==2){
			//calcEnemyHitAoE(MainChara.x-10,MainChara.y-10,MainChara.x+20,MainChara.y+60,100);
			addReservedMove(0,1,26,1);
			addReservedMove(0,1,8,5);
			addReservedMove(0,1,4,5);
			addReservedMove(0,1,2,5);
			addReservedMove(0,1,1,5);
		}else if(d==6){
			//calcEnemyHitAoE(MainChara.x-25,MainChara.y-10,MainChara.x+60,MainChara.y+20,100);
			addReservedMove(1,0,26,1);
			addReservedMove(1,0,8,5);
			addReservedMove(1,0,4,5);
			addReservedMove(1,0,2,5);
			addReservedMove(1,0,1,5);
		}else{
			//calcEnemyHitAoE(MainChara.x-10,MainChara.y-10,MainChara.x+20,MainChara.y+60,100);
			addReservedMove(0,-1,26,1);
			addReservedMove(0,-1,8,5);
			addReservedMove(0,-1,4,5);
			addReservedMove(0,-1,2,5);
			addReservedMove(0,-1,1,5);
		}
		addMainCharaEffect(0);
	}

	function calcRangeAoE(range,width,dir){
		//dir　方向に向かって MainChara から(range,width)領域に攻撃するときの範囲を計算
		var sx,sy,gx,gy;
		var bufx = 5;
		var bufy = 5;
		if(dir==2){
			bufx += Math.floor(width/2);
			sx = MainChara.x - bufx;
			sy = MainChara.y - bufy;
			gx = sx + MainChara.width + bufx*2;
			gy = sy + range + bufy*2;
		}else if(dir==4){
			bufy += Math.floor(width/2);
			sx = MainChara.x + MainChara.width + bufx;
			sy = MainChara.y - bufy;
			gx = sx - range - bufx*2;
			gy = sy + bufy*2;
		}else if(dir==6){
			bufy += Math.floor(width/2);
			sx = MainChara.x - bufx;
			sy = MainChara.y - bufy;
			gx = sx + range + bufx*2;
			gy = sy + MainChara.height + bufy*2;
		}else{
			bufx += Math.floor(width/2);
			sx = MainChara.x - bufx;
			sy = MainChara.y + MainChara.height + bufy;
			gx = sx + bufx*2;
			gy = sy - range - bufy*2;
		}
		//中心座標をenemyのwidth/2だけずらす
		sx += 9;
		gx += 9;
		return {sx,sy,gx,gy};
	}

	function calcEnemyHitAoE(sx,sy,gx,gy,dmg){
		//sx,sy,gx,gy : dot 座標の攻撃 hit 領域
		//sy += 20;
		//gy += 20;		

		//常に sx < gx　の関係を保つ
		if(sx>gx){
			var tmp = sx;
			sx = gx;
			gx = tmp;
		}
		//常に sy < gy　の関係を保つ
		if(sy>gy){
			var tmp = sy;
			sy = gy;
			gy = tmp;
		}
		console.log("range "+sx+" "+sy+" "+gx+" "+gy);
		//判定するマスは指定領域より一回り大きく取る
		var csx = Math.floor(sx/mSIZE)-1;
		var csy = Math.floor(sy/mSIZE)-1;
		var cgx = Math.ceil(gx/mSIZE)+1;
		var cgy = Math.ceil(gy/mSIZE)+1;
		//console.log(csx+" "+csy+" "+cgx+" "+cgy);
		var target = [];
		var damage = [];

		for(var i = csx; i < cgx; i++){
			for(var j = csy; j < cgy; j++){
				//マップからはみ出していたら continue
				if(i<0 || i>cROW-1 || j<0 || j>cCOL-1)
					continue;
				//console.log("len "+emap[i][j].length);
				for(var num in emap[i][j]){
					var n = emap[i][j][num];
					var esx = Enemy[n].x | 0;
					var esy = Enemy[n].y | 0;
					var egx = esx + Enemy[n].width;
					var egy = esy + Enemy[n].height;
					console.log("enemy "+esx+" "+esy+" "+egx+" "+egy);
					//non hit なら continue
					if(egx<sx || gx<esx || egy<sy || gy<esy)
						continue;
					target.push(n);
					damage.push(dmg);
					//calcEnemyDamaged(n,dmg);
				}
			}
		}
		calcEnemyDamaged(target,damage);
	}

	function calcEnemyDamaged(num,dmg){
		var death = [];
		for(var i in num){
			addEnemyDamagedEffect(num[i]);
			Enemy[num[i]].damaged = 100;
			insertMes(Enemy[num[i]].name+"に "+dmg[i]+" ダメージ！");
			Enemy[num[i]].hp -= dmg[i];
			if(Enemy[num[i]].hp<=0)
				death.push(num[i]);
		}
		disappearEnemy(death);
	}

	function disappearEnemy(num){
		for(var n in num){
			var i = Math.floor(Enemy[num[n]].x/mSIZE);
			var j = Math.floor(Enemy[num[n]].y/mSIZE);
			var pos = emap[i][j].indexOf(num[n]);
			emap[i][j].splice(pos,1);
			Enemy[num[n]].exist = false;
			hunt++;
			addMes(Enemy[num[n]].name+"を倒した！");
		}
	}
/*
	function calcEnemyDamaged(num,dmg){
		insertMes(Enemy[num].name+"に "+dmg+" ダメージ！");
		Enemy[num].hp -= dmg;
		if(Enemy[num].hp<=0)
			disappearEnemy(num);
	}

	function disappearEnemy(num){
		var i = Math.floor(Enemy[num].x/mSIZE);
		var j = Math.floor(Enemy[num].y/mSIZE);
		var pos = emap[i][j].indexOf(num);
		emap[i][j].splice(pos,1);
		Enemy[num].exist = false;
		hunt++;
		addMes(Enemy[num].name+"を倒した！");
	}
*/
	//enter
	function attack(){
		//対象chip座標は四捨五入で選択
		var tx = Math.round(MainChara.x/mSIZE);
		var ty = Math.round(MainChara.y/mSIZE);
		var d = MainChara.dir;
		switch(d){
			case 2 : ty++; break;
			case 4 : tx--; break;
			case 6 : tx++; break;
			case 8 : ty--; break;
		}
		
		//exception対策
		if(-1<tx && tx<cROW && -1<ty && ty<cCOL){
			if(false && emap[tx][ty]!=-1 && MainChara.mn>4){
				//attack
				//appEffect();
				Enemy[emap[tx][ty]].exist = false;
				MainChara.mn -= 5;
				hunt++;
				if(emap[tx][ty]==0){
					addMes("攻撃！ -> 敵を倒した！");
					addMes("地下への道を見つけた！");
					map[tx][ty] = true;
					imap[tx][ty] = 5;
				}else{
					addMes("攻撃！ -> 敵を倒した！");
				}
			}else if(0<imap[tx][ty] && imap[tx][ty]!=5){
				//heal
				//appEffect();
				switch(imap[tx][ty]){
					case 1 : 
						MainChara.hp += Math.floor(Math.random()*40);
						MainChara.mn += Math.floor(Math.random()*40);
						MainChara.hung += Math.floor(Math.random()*40);
						addMes("ウッヒョー！");
						break;
					case 2 : 
						MainChara.hp += 20;
						addMes("体力が回復した！");
						break;
					case 3 : 
						MainChara.mn += 30;
						addMes("メンタルリセット！");
						break;
					case 4 : 
						MainChara.hung += 50;
						addMes("満腹になった！");
						break;
				}
				imap[tx][ty] = 0;
			}else if((imap[tx][ty]==0 || !map[tx][ty]) && MainChara.mn>2){
				//dig
				//appEffect();
				map[tx][ty] = true;
				if(imap[tx][ty]==0)
					imap[tx][ty]=-1;
				MainChara.mn -= 3;
				dig++;
				addMes("壁を壊した！("+tx+", "+ty+")");
			}
		}
		scanEnemyPos();
	}
