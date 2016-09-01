
	// move method
	//////////////////////////////////////////////////////////////////////////////////

	function modMainCharDir(dir){
		MainChara.mwait += 10;
		MainChara.dir = dir;
	}

	function moveMainChar(mx,my,s){
		//引数は移動方向に対応する
		//mx = {-1,0,1}
		//my = {-1,0,1}

		//移動速度
		var spd = s;
		//この辺に速度の補正値とか

		//壁に衝突しそうなら、衝突するまでの分だけ移動
		var act = calcMovable(mx*spd,my*spd);
		if(act.move){
			//移動毎の処理
			runPerMove();

			//MainChara 移動処理
			MainChara.x += act.qx;
			MainChara.y += act.qy;
		}
		//moveEnemy();
		scanEnemyPos();
	}

	//移動毎の処理 
	function runPerMove(){
		if(MainChara.mn<80)
			MainChara.mn+=1;
		/*
		MainChara.steps++;
		if(MainChara.steps%3==0){
			if(MainChara.hung>0){
				MainChara.hung--;
				if(MainChara.hp<100)
					MainChara.hp++;
				if(MainChara.mn<80)
					MainChara.mn++;
			}else{
				MainChara.hp--;
			}
		}
		*/
		//move_now = 0;
	}

	function calcMovable(mx,my){
		//引数は移動方向に対応する
		//mx = {-spd,0,spd}
		//my = {-spd,0,spd}

		//quantity x : 移動量を計算する
		//移動可能な分だけ移動させる
		var qx = mx;
		var qy = my;
		//next x : 移動後の dot 座標
		var nx = MainChara.x + qx;
		var ny = MainChara.y + qy;
		//マップ限界チェック
		//nx = [0, cROW - mSIZE]
		//ny = [0, cCOL - mSIZE]
		//の範囲に収める
		if(nx<0)
			qx -= nx;
		if(ny<0)
			qy -= ny;
		if(nx>=dROW-mSIZE)
			qx = (dROW-mSIZE) - MainChara.x;
		if(ny>=dCOL-mSIZE)
			qy = (dCOL-mSIZE) - MainChara.y;
		//移動不可なら
		if(qx==0 && qy==0){
			//console.log("-> can't move due to map over");
			return {move:false,qx,qy};
		}
		//nxnyの更新
		nx = MainChara.x + qx;
		ny = MainChara.y + qy;
		//console.log(nx+" "+ny);

		var v = true;
		//chip座標に対応する
		//xx = [0, cROW]
		//yy = [0, cCOL]
		var xx = [Math.ceil(nx/mSIZE),Math.floor(nx/mSIZE)];
		var yy = [Math.ceil(ny/mSIZE),Math.floor(ny/mSIZE)];
		//target x : 
		var tx = -1,ty = -1;
		//移動方向によって移動先のchip座標を変える
		if(qx>0){
			tx = Math.ceil(nx/mSIZE);
		}else if(qx<0){
			tx = Math.floor(nx/mSIZE);
		}
		if(qy>0){
			ty = Math.ceil(ny/mSIZE);
		}else if(qy<0){
			ty = Math.floor(ny/mSIZE);
		}
		//MainCharaの座標　%　mSIZE!=0の場合（マスとマスの間にいる場合）
		//移動先のマスを二つ判定する
		if(tx!=-1){
			//enemyとの当たり判定をチェック
			var ehit = false;//当たり判定
			var dist = qx;//移動量
			for(var i = -1; i < 2; i++){
				for(var j = -1; j < 2; j++){
					//自身を中心に周囲9マスをチェック
					if(tx+i<0 || tx+i>cROW-1 || yy[1]+j<0 || yy[1]+j>cCOL-1)
						continue;
					var cE = collisionEnemy(tx+i,yy[1]+j,nx,ny);
					ehit = ehit || cE.hit;
					//衝突時に移動量を下方修正
					if(qx>0){
						dist = Math.min(dist,cE.dx);
					}
					if(qx<0){
						dist = Math.max(dist,-cE.dx);
					}
				}
			}
			if(ehit){
				//enemyと衝突しているなら移動量を修正
				qx = dist;
			}

			//壁との当たり判定をチェック
			var hit_down = collisionObject(tx,yy[0]);
			var hit_up = collisionObject(tx,yy[1]);
			if(hit_down || hit_up){

				//移動量 : 壁に衝突するまでに調整
				//移動量 = 移動先マスの左辺  - (主人公画像の右辺 x)
				//主人公画像の右辺 x = (主人公 x + 主人公の幅)
				if(qx>0)
					qx = tx*mSIZE - (MainChara.x+mSIZE);

				//移動量 = 移動先マスの右辺 - (主人公画像の左辺 x)
				if(qx<0)
					qx = tx*mSIZE - (MainChara.x-mSIZE);
				
				//壁めりこみ防止措置
				//移動量再計算後、移動後マスが壁の場合は移動不可
				//ex.移動量>25で 1マスの壁を飛び超える場合など
				if(Math.abs(qx)>mSIZE-1){
					var vx = Math.floor((MainChara.x+qx)/mSIZE);
					if(collisionObject(vx,yy[0]) || collisionObject(vx,yy[1]))
						qx = 0;
				}

				//T字路滑らか移動
				if(hit_up && !hit_down)
					qy++;
				if(hit_down && !hit_up)
					qy--;

				//移動不可なら
				if(qx==0 && qy==0){
					//console.log("-> can't move due to collision wall");
					return {move:false,qx,qy};
				}
				//console.log("-> yes, but collision wall");
			}
		}
		if(ty!=-1){
			//enemyとの当たり判定をチェック
			var ehit = false;
			var dist = qy;
			for(var i = -1; i < 2; i++){
				for(var j = -1; j < 2; j++){
					if(ty+j<0 || ty+j>cCOL-1 || xx[1]+i<0 || xx[1]+i>cROW-1)
						continue;
					cE = collisionEnemy(xx[1]+i,ty+j,nx,ny);
					ehit = ehit || cE.hit;
					if(qy>0)
						dist = Math.min(dist,cE.dy);
					if(qy<0)
						dist = Math.max(dist,-cE.dy);
				}
			}
			if(ehit){
				qy = dist;
			}

			//壁との当たり判定をチェック
			var hit_left = collisionObject(xx[0],ty);
			var hit_right = collisionObject(xx[1],ty);
			if(hit_left || hit_right){

				//移動量 : 壁に衝突するまでに調整
				if(qy>0){
					qy = ty*mSIZE - (MainChara.y+mSIZE);
				}
				if(qy<0)
					qy = ty*mSIZE - (MainChara.y-mSIZE);

				//壁めりこみ防止措置
				if(Math.abs(qy) > mSIZE-1){
					var vy = Math.floor((MainChara.y+qy)/mSIZE);
					if(collisionObject(xx[0],vy) || collisionObject(xx[1],vy))
						qy = 0;
				}

				//T字路滑らか移動
				if(hit_right && !hit_left)
					qx++;
				if(hit_left && !hit_right)
					qx--;

				//移動不可なら
				if(qx==0 && qy==0){
					//console.log("-> can't move due to collision wall");
					return {move:false,qx,qy};
				}
				//console.log("-> yes, but collision wall");
			}
		}
		return {move:v,qx,qy};
	}

	function collisionEnemy(x,y,mcx,mcy){
		var hit = false;
		var dx = Number.MAX_VALUE;
		var dy = Number.MAX_VALUE;
		for(var n in emap[x][y]){
			var num = emap[x][y][n] | 0;
			var ebx = Enemy[num].x  | 0;
			var eby = Enemy[num].y  | 0;
			var sx = ebx;
			var gx = sx + Enemy[num].width;
			var sy = eby;
			var gy = sy + Enemy[num].height;
	
			//non hit なら continue
			if(mcx+MainChara.width<sx || gx<mcx || mcy+MainChara.height<sy || gy<mcy)
				continue;
			hit = true;
			//衝突時に移動距離を下方修正
			dx = Math.min(dx, Math.abs(MainChara.x - gx), Math.abs(MainChara.x + MainChara.width - sx));
			dy = Math.min(dy, Math.abs(MainChara.y - gy), Math.abs(MainChara.y + MainChara.height - sy));
		}
		return {hit,dx,dy};
	}

	function collisionObject(x,y){
		//true : wall
		//false : void
		if(!map[x][y])
			return true;
		return false;
	}

	//未実装
	function moveEnemy(){
		var xx = MainChara.x, yy = MainChara.y;
		for(var i = 0; i < e_num; i++){
			if(!Enemy[i].exist)continue;
			var x = Enemy[i].x, y = Enemy[i].y;
			if(x-5<xx && xx<x+5 && y-5<yy && yy<y+5){
				if(Math.abs(x-xx)+Math.abs(y-yy)==1){
					var rnd = Math.floor(Math.random()*(floor+2));
					if(rnd>0){
						addMes("敵の攻撃！ -> "+rnd+"ダメージを受けた！");
						MainChara.hp-=rnd;
					}else{
						addMes("敵の攻撃！ -> 回避した！");
					}
				}
				var r = Math.floor(Math.random()*10);
				if(r<6)continue;
				if(x-xx>0 && map[x-1][y] && emap[x-1][y]==-1 && imap[x-1][y]==-1 && (x-1!=xx||y!=yy)){
					Enemy[i].x--;
					scanEnemyPos();
				}else if(x-xx<0 && map[x+1][y] && emap[x+1][y]==-1 && imap[x+1][y]==-1 && (x+1!=xx||y!=yy)){
					Enemy[i].x++;
					scanEnemyPos();
				}else if(y-yy>0 && map[x][y-1] && emap[x][y-1]==-1 && imap[x][y-1]==-1 && (y-1!=yy||x!=xx)){
					Enemy[i].y--;
					scanEnemyPos();
				}else if(y-yy<0 && map[x][y+1] && emap[x][y+1]==-1 && imap[x][y+1]==-1 && (y+1!=yy||x!=xx)){
					Enemy[i].y++;
					scanEnemyPos();
				}
			}
		}
	}
	
	//未実装
	function scanEnemyPos(){
		return 0;
		for(var i = 0; i < cROW; i++){
			for(var j = 0; j < cCOL; j++){
				emap[i][j] = -1;
			}
		}
		for(var i = 0; i < e_num; i++){
			if(Enemy[i].exist)
				emap[Enemy[i].x][Enemy[i].y] = i;
		}
	}
