(function(){
	//game display num
	var w = 800, h = 600;
	var requestId;
	var floor = 0;
	var hunt = 0;
	var dig = 0;

	//game static num
	var mROW = 100;//map mass size x
	var mCOL = 100;//map mass size y
	var mSIZE = 25;//mass size

	var dROW = mROW * mSIZE;//map dot size x
	var dCOL = mCOL * mSIZE;//map dot size y

	var mMap = [];
	var dMap = [];

	var map_chip = new Image();
	map_chip.src = 'img/map.png';

	var icon = new Image();
	icon.src = 'img/icon.png';

	var Effect = function (){
		this.exist = false;
		this.img = new Image();
		this.img.src = 'img/eff.png';
		this.mwait = 0;
	}
	var eff_num = 100;
	var eff = [];

	var Chara = function (){
		this.x = -1;
		this.y = -1;
		this.dir = 2;
		this.hp = 100;
		this.mn = 80;
		this.hung = 100;
		this.foot = 0;
		this.exist = true;
		this.img = new Image();
		this.img.src = 'img/1.png';
		this.mwait = 0;
	}

	var MainChara = new Chara();
	var e_num = 1;
	var Enemy = [];

	var emap = [];

	var message = [];

	var move_now = -1;


	var map = [];
	var imap = [];
	var on_key = [];
	var on_key_done = [];

	var canvas = document.getElementById('canvas');
	canvas.addEventListener("click", onClick, false);
	canvas.addEventListener('mousemove', onMove, false);
	var ctx = canvas.getContext('2d');

	init();
	//requestId = window.requestAnimationFrame(renderTitle); 

	function init(){
		setInitMap();
		setEnemy();
		setEff();
		setMes();
		requestId = window.requestAnimationFrame(renderTitle); 
	}

	//map,emapを初期化
	function setInitMap(){
		//var data = loadCSV();
		setMapEnemy();
		setMapRandom();
	}

	function setMapEnemy(){
		for(var i = 0; i < mROW; i++){
			emap[i] = [];
			for(var j = 0; j < mCOL; j++){
				emap[i][j] = -1;
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
			ssx[1] = Math.floor(Math.random()*mROW);
			if((ssx[1]>=sx && ssx[1]<gx) || (ssx[1]+r[1]>=sx && ssx[1]+r[1]<gx))
				break;
		}
		ssx[2] = gx;
		while(true){
			ssx[3] = Math.floor(Math.random()*mROW);
			if((ssx[3]>=sx && ssx[3]<gx) || (ssx[3]+r[3]>=sx && ssx[3]+r[3]<gx))
				break;
		}

		while(true){
			ssy[0] = Math.floor(Math.random()*mROW);
			if((ssy[0]>=sy && ssy[0]<gy) || (ssy[0]+c[0]>=sy && ssy[0]+c[0]<gy))
				break;
		}
		ssy[1] = sy - c[1];
		while(true){
			ssy[2] = Math.floor(Math.random()*mROW);
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
					if(-1<j && j<mROW && -1<k && k<mCOL && !map[j][k]){
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
		for(var i = 0; i < mROW; i++){
			map[i] = [];
			imap[i] = [];
		}

		var sx = Math.floor(Math.random()*10)+mROW/2;
		var sy = Math.floor(Math.random()*10)+mCOL/2;
		var gx = Math.floor(Math.random()*10)+1+sx;
		var gy = Math.floor(Math.random()*10)+1+sy;
		for(var i = sx; i < gx; i++){
			for(var j = sy; j < gy; j++){
				map[i][j] = true;
			}
		}
		genRoom(sx,sy,gx,gy,-1);
		for(var i = 0; i < mROW; i++){
			map[i][0] = false;
			map[0][i] = false;
			map[i][mCOL-1] = false;
			map[mROW-1][i] = false;
		}

		//chara set
		while(true){
			var x = Math.floor(Math.random()*mROW);
			var y = Math.floor(Math.random()*mCOL);
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

		for(var i = 0; i < mROW; i++){
			var s = "";
			for(var j = 0; j < mCOL; j++){
				if(map[i][j]){
					s += "O";
				}else{
					s += "■";
				}
			}
			console.log(s);
		}

		setItem();
	}

	function setItem(){
		for(var i = 0; i < mROW; i++){
			for(var j = 0; j < mCOL; j++){
				imap[i][j] = -1;
			}
		}

		var num = Math.floor(Math.random()*20)+10;
		while(num>0){
			var x = Math.floor(Math.random()*mROW);
			var y = Math.floor(Math.random()*mCOL);
			if(map[x][y] && emap[x][y]==-1)
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
		for(var i = 0; i < mROW; i++){
			map[i] = [];
			dmap[i] = data[i].split(',');
		}
		for(var i = 0; i < mROW; i++){
			for(var j = 0; j < mCOL; j++){
				if(dmap[j][i]==0)
					map[i][j]=true;
			}
		}
		requestId = window.requestAnimationFrame(renderTitle); 
	}

	//enemy初期化
	function setEnemy(){
		for(var i = 0; i < e_num; i++){
			Enemy[i] = new Chara();
			Enemy[i].img.src = 'img/2.png';
			while(true){
				var x = Math.floor(Math.random()*mROW);
				var y = Math.floor(Math.random()*mCOL);
				if(emap[x][y]==-1){
					Enemy[i].x = x;
					Enemy[i].y = y;
					Enemy[i].exist = true;
					emap[x][y] = i;
					break;
				}
			}
		}
		Enemy[0].img.src = 'img/3.png';
	}

	function resetEnemy(){
		for(var i = 0; i < mROW; i++){
			for(var j = 0; j < mCOL; j++){
				emap[i][j] = -1;
			}
		}
		for(var i = 0; i < e_num; i++){
			while(true){
				var x = Math.floor(Math.random()*mROW);
				var y = Math.floor(Math.random()*mCOL);
				if(emap[x][y]==-1){
					Enemy[i].x = x;
					Enemy[i].y = y;
					Enemy[i].exist = true;
					emap[x][y] = i;
					break;
				}
			}
		}
	}

	//effect初期化
	function setEff(){
		for(var i = 0; i < eff_num; i++){
			eff[i] = new Effect();
		}
	}

	function appEffect(){
		for(var i = 0; i < eff_num; i++){
			if(!eff[i].exist){
				eff[i].exist = true;
				eff[i].mwait = 0;
				motionEffect();
				break;
			}
		}
	}

	function motionEffect(){
		var v = false;
		for(var i = 0; i < eff_num; i++){
			if(eff[i].exist){
				eff[i].mwait += 5;
				var mot = Math.floor(eff[i].mwait/10);
				if(eff[i].mwait>100)eff[i].exist = false;
				ctx.drawImage(eff[i].img,0,mot*240,320,240,0,0,800,600);
				v = true;
			}
		}
		if(v){
			window.requestAnimationFrame(motionEffect);
		}
	}

	function setMes(){
		for(var i = 0; i < 8; i++)
			message[i] = "";
		message[0] = "ようこそ！";
	}

	function renderTitle(){
		//var str = "SampleText";
		//var margin = w - 20*str.length;
		ctx.fillStyle = '#aaa';
		ctx.fillRect(0,0,w,h);

		var a = 5;
		ctx.fillStyle = '#222';
		ctx.fillRect(a,a,w-2*a,h-2*a);

		ctx.font= 'bold 40px Meiryo';
		ctx.strokeStyle = '#333';
		ctx.lineWidth = 6;
		ctx.lineJoin = 'round';
		ctx.fillStyle = '#fff';
		//ctx.strokeText(str,margin/2,455,510);
		//ctx.fillText(str,margin/2,455);

		//frame count
		motionChar();

		onKeyCheck();
		drawMoveCalc();

		//drawCalc();
		/*
		if(move_now!=-1){
			drawMoveCalc();
			moveDoneCheck();
		}else{
			drawCalc();
		}
		*/
		drawMenu();

		if(MainChara.hp<1){
			ctx.fillStyle = '#fff';
			ctx.font= 'bold 120px Meiryo';
			ctx.fillText("死んだ！",180,300);
			ctx.font= 'bold 40px Meiryo';
			ctx.fillText("Enter : restart",230,380);
		}

		requestId = window.requestAnimationFrame(renderTitle); 
	}

	function motionChar(){
		MainChara.mwait+=3;
		if(MainChara.mwait>400)
			MainChara.mwait = 0;
	}


	function onKeyCheck(){
		//a
		if(on_key[65]){
			moveChar(-1,0);
			modCharDir(4);
		}
		//s
		if(on_key[83]){
			moveChar(0,1);
			modCharDir(2);
		}
		//d
		if(on_key[68]){
			moveChar(1,0);
			modCharDir(6);
		}
		//w
		if(on_key[87]){
			moveChar(0,-1);
			modCharDir(8);
		}
		//enter
		if(on_key[13]){
			attack();
			on_key[13] = false;
		}
	}

	function drawMoveCalc(){
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
		var pos = drawMoveMapLimitCheck(mx,my);
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
				drawMoveMap(xx,yy,sx+i*25-chip_x,sy+j*25-chip_y);
			}
		}

		//クリッピングマスクここまで
		//context の復帰
		ctx.restore();

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
		for(var i = 0; i < 20; i++){
			for(var j = 0; j < 18; j++){
				//xx,yy : chip座標
				var xx = pos.mx + i;
				var yy = pos.my + j;
				if(cx == xx && cy == yy){
					drawMoveChar(sx+i*25-2-chara_x,sy+j*25-15-chara_y);
				}
			}
		}
	}

	function drawMoveMapLimitCheck(mx,my){
		//lx,ly : 画面上に表示されるchip数
		var lx = 20;
		var ly = 18;
		//hit : マップ端にcharaが居るときを判定
		var xhit = 0, yhit = 0;
		if(mx < 0){
			mx = 0;
			xhit = -1;
		}
		if(mx + lx > mROW){
			mx = mROW - lx;
			xhit = 1;
		}
		if(my < 0){
			my = 0;
			yhit = -1;
		}
		if(my + ly > mCOL){
			my = mCOL - ly;
			yhit = 1;
		}
		return {mx,my,xhit,yhit};
	}

	function drawMoveMap(r,c,x,y){
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

	function drawMoveChar(x,y){
		var dir = MainChara.dir;
		var mot = Math.floor(MainChara.mwait / 100);
		if(mot>2)mot = 1;
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
	}

	function drawMoveEnemy(xx,yy,x,y){
		var mot = Math.floor(MainChara.mwait / 100);
		if(mot>2)mot = 1;
		ctx.drawImage(Enemy[emap[xx][yy]].img,20*mot,0,20,28,x,y,28,38);
	}

	function moveDoneCheck(){
		if(move_now>99){
			move_now =- 1;
			switch(MainChara.dir){
				case 2 : MainChara.y++; break;
				case 4 : MainChara.x--; break;
				case 6 : MainChara.x++; break;
				case 8 : MainChara.y--; break;
			}
			if(imap[MainChara.x][MainChara.y]==5){
				addMes("地下へ降りた！");
				floor++;
				setMapRandom();
				resetEnemy();
			}
		}
	}

	function moveChar(mx,my,dir){
		//引数はｄ移動方向に対応する
		//mx = {-1,0,1}
		//my = {-1,0,1}

		//移動速度
		var spd = 3;

		//壁に衝突しそうなら、衝突するまでの分だけ移動
		var act = canMove(mx*spd,my*spd);
		if(act.move){
			if(MainChara.mn<80)
				MainChara.mn++;
			/*
			MainChara.foot++;
			if(MainChara.foot%3==0){
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
			MainChara.x += act.qx;
			MainChara.y += act.qy;
			console.log("move "+act.qx+" "+act.qy);
		}
		moveEnemy();
		scanEnemyPos();
		console.log("now bit "+MainChara.x+" "+MainChara.y);
		console.log("now chip "+Math.floor(MainChara.x/25)+" "+Math.floor(MainChara.y/25));
	}
/*
	function moveChar(mx,my,dir){
		if(canMove(mx,my)){
			MainChara.foot++;
			if(MainChara.foot%3==0){
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
			move_now = 0;
			MainChara.x += mx;
			MainChara.y += my;
		}
		moveEnemy();
		scanEnemyPos();
		console.log("now "+MainChara.x+" "+MainChara.y);
	}
	*/

	function modCharDir(dir){
		MainChara.mwait += 10;
		MainChara.dir = dir;
	}

	function canMove(mx,my){
		//引数はｄ移動方向に対応する
		//mx = {-spd,0,spd}
		//my = {-spd,0,spd}

		//移動量を計算する
		//移動可能な分だけ移動させる
		var qx = mx;
		var qy = my;
		//移動後の dot 座標
		var nx = MainChara.x + qx;
		var ny = MainChara.y + qy;
		//マップ限界チェック
		//nx = [0, mROW - mSIZE]
		//ny = [0, mCOL - mSIZE]
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
			console.log("-> can't move due to map over");
			return {move:false,qx,qy};
		}
		//nxnyの更新
		nx = MainChara.x + qx;
		ny = MainChara.y + qy;

		var v = true;
		//chip座標に対応する
		//xx = [0, mROW]
		//yy = [0, mCOL]
		var xx = [Math.ceil(nx/25),Math.floor(nx/25)];
		var yy = [Math.ceil(ny/25),Math.floor(ny/25)];
		var tx = -1,ty = -1;
		//移動方向によって移動先のchip座標を変える
		if(qx>0){
			tx = Math.ceil(nx/25);
		}else if(qx<0){
			tx = Math.floor(nx/25);
		}
		if(qy>0){
			ty = Math.ceil(ny/25);
		}else if(qy<0){
			ty = Math.floor(ny/25);
		}
		//MainCharaの座標%25!=0の場合（マスとマスの間にいる場合）
		//移動先のマスを二つ判定する
		console.log("t "+tx+" "+ty);
		if(tx!=-1){
			var hit_down = collisionObject(tx,yy[0]);
			var hit_up = collisionObject(tx,yy[1]);
			if(hit_down || hit_up){
				if(qx>0){
					//移動量 = 移動先マスの左辺 - 1 - (主人公 x + 主人公の幅)
					//(主人公 x + 主人公の幅)　= 主人公画像の右辺 x
					//qx = tx*25 - 1 - (MainChara.x+25);
					qx = tx*25 - (MainChara.x+25);
				}
				if(qx<0){
					//移動量 = 移動先マスの右辺 - 主人公 x
					qx = tx*25 - MainChara.x;
				}
				qx %= 25;

				//T字路滑らか移動
				//if(hit_up && !hit_down && MainChara.y%25>12){
				if(hit_up && !hit_down){
					qy++;
				}
				//if(hit_down && !hit_up && MainChara.y%25!=0 && MainChara.y%25<12){
				if(hit_down && !hit_up){
					qy--;
				}

				//移動不可なら
				if(qx==0 && qy==0){
					console.log("-> can't move due to collision wall");
					return {move:false,qx,qy};
				}
				console.log("-> yes, but collision wall");
			}
		}
		if(ty!=-1){
			var hit_left = collisionObject(xx[0],ty);
			var hit_right = collisionObject(xx[1],ty);
			if(hit_left || hit_right){	

				if(qy>0)
					//qy = ty*25 - 1 - (MainChara.y+25);
					qy = ty*25 - (MainChara.y+25);
				if(qy<0)
					qy = ty*25 - MainChara.y;
				qy %= 25;

				//T字路滑らか移動
				if(hit_right && !hit_left){
					qx++;
				}
				if(hit_left && !hit_right){
					qx--;
				}

				//移動不可なら
				if(qx==0 && qy==0){
					console.log("-> can't move due to collision wall");
					return {move:false,qx,qy};
				}
				console.log("-> yes, but collision wall");
			}
		}
		console.log("[target bit]nxny "+nx+" "+ny);
		console.log("[target mass]xxyy "+xx+" "+yy);
		return {move:v,qx,qy};
	}

	/*
	function canMove(mx,my){
		//引数はｄ移動方向に対応する
		//mx = {-1,0,1}
		//my = {-1,0,1}
		var v = true;
		var xx = Math.floor(MainChara.x/25) + mx;
		var yy = Math.floor(MainChara.y/25) + my;
		console.log("move ("+xx+", "+yy+")");
		if(mx!=0 && (0>xx || xx>mROW-1)){
			console.log("map over");
			return false;
		}
		if(my!=0 && (0>yy || yy>mCOL-1)){
			console.log("map over");
			return false;
		}
		if(collisionEnemy(xx,yy)){
			console.log("collision enemy");
			v = false;
		}
		if(collisionObject(xx,yy)){
			console.log("collision wall");
			v = false;
		}
		return v;
	}
	*/

	function collisionEnemy(x,y){
		if(emap[x][y]!=-1)
			return true;
		return false;
	}


	function collisionObject(x,y){
		console.log("CO "+x+" "+y);
		if(!map[x][y])
			return true;
		return false;
	}
/*
	function collisionObject(x,y){
		if(!map[x][y])
			return true;
		return false;
	}
*/
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

	function drawCalc(){
		var ax = 155;
		var ay = 80;
		ctx.fillStyle = '#070';
		ctx.fillRect(ax,ay-55,w-2*ax+5,h-2*ay+5);

		var sx = 165;
		var sy = 35;
		var cx = MainChara.x | 0;
		var cy = MainChara.y | 0;
		var mx = cx - 9;
		var my = cy - 8;
		var pos = drawMapLimitCheck(mx,my);
		for(var i = 0; i < 19; i++){
			for(var j = 0; j < 17; j++){
				var xx = pos.mx + i;
				var yy = pos.my + j;
				//タイル描画
				drawMap(xx,yy,i*25+sx,j*25+sy);
			}
		}

		for(var i = 0; i < 19; i++){
			for(var j = 0; j < 17; j++){
				var xx = pos.mx + i;
				var yy = pos.my + j;

				//chara,enemy描画
				if(emap[xx][yy] != -1){
					drawEnemy(xx,yy,i*25+sx-2,j*25+sy-15);
				}
				if(cx == xx && cy == yy){
					drawChar(i*25+sx-2,j*25+sy-15);
				}
			}
		}
	}

	function drawMap(r,c,x,y){
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

	function drawMapLimitCheck(mx,my){
		if(mx < 0)
			mx = 0;
		if(mx + 19 > mROW)
			mx = mROW - 19;
		if(my < 0)
			my = 0;
		if(my + 17 > mCOL)
			my = mCOL - 17;
		return {mx,my};
	}

	//////////////////////////////////////////////////////////////////////////////////

	function drawMenu(){
		var ax = 15;
		var ay = 480;
		ctx.fillStyle = '#ddd';
		ctx.fillRect(ax,ay,635,105);
		ctx.fillRect(ax,25,130,445);
		ctx.fillRect(ax+645,25,125,560);

		ctx.fillStyle = '#333';
		ctx.font= 'bold 20px Meiryo';
		ctx.fillText("地下",30,70);
		ctx.fillText("階",115,70);
		ctx.drawImage(icon,0,0,64,64,30,98,30,30);
		ctx.drawImage(icon,64,0,64,64,30,148,30,30);
		ctx.drawImage(icon,128,0,64,64,30,198,30,30);
		ctx.fillText("Hunt",30,255);
		ctx.fillText("Dig",30,305);
		ctx.fillText(hunt,78,277);
		ctx.fillText(dig,78,327);
		ctx.font= 'bold 30px Meiryo';
		ctx.fillText(floor,78,72);
		ctx.fillText(MainChara.hp,70,125);
		ctx.fillText(MainChara.mn,70,175);
		ctx.fillText(MainChara.hung,70,225);


		ctx.font= 'bold 15px Meiryo';
		for(var i = 0; i < 5; i++){
			ctx.fillText(message[i],20,578-i*20);
		}

		var sx = 30, sy = 350;
		ctx.fillStyle = '#577';
		ctx.fillRect(sx,sy,mROW,1);
		ctx.fillRect(sx,sy,1,mCOL);
		ctx.fillRect(sx+mROW,sy,1,mCOL);
		ctx.fillRect(sx,sy+mCOL,mROW+1,1);
		ctx.fillStyle = '#999';
		for(var i = 0; i < mROW; i++){
			for(var j = 0; j < mCOL; j++){
				if(map[i][j]){
					ctx.fillRect(sx+i,sy+j,1,1);
				}else{
					//ctx.fillRect(sx+i*2,sy+j*2,2,2);
				}
			}
		}
		if(floor<2){
			ctx.fillStyle = '#a33';
			ctx.fillRect(sx+Math.floor(MainChara.x/25)-2,sy+Math.floor(MainChara.y/25)-2,4,4);
		}
		if(floor<4){
			ctx.fillStyle = '#3a3';
			ctx.globalAlpha = MainChara.mwait%100/100;
			ctx.fillRect(sx+Enemy[0].x-2,sy+Enemy[0].y-2,4,4);
			ctx.globalAlpha = 1.0;
		}
	}

	function drawChar(x,y){
		var dir = MainChara.dir;
		var mot = Math.floor(MainChara.mwait / 100);
		if(mot>2)mot = 1;
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
	}

	function drawEnemy(xx,yy,x,y){
		var mot = Math.floor(MainChara.mwait / 100);
		if(mot>2)mot = 1;
		ctx.drawImage(Enemy[emap[xx][yy]].img,20*mot,0,20,28,x,y,28,38);
	}

	//生存enemyの更新
	function scanEnemyPos(){
		for(var i = 0; i < mROW; i++){
			for(var j = 0; j < mCOL; j++){
				emap[i][j] = -1;
			}
		}
		for(var i = 0; i < e_num; i++){
			if(Enemy[i].exist)
				emap[Enemy[i].x][Enemy[i].y] = i;
		}
	}

	function attack(){
		//対象chip座標は四捨五入で選択
		var tx = Math.round(MainChara.x/25);
		var ty = Math.round(MainChara.y/25);
		var d = MainChara.dir;
		switch(d){
			case 2 : ty++; break;
			case 4 : tx--; break;
			case 6 : tx++; break;
			case 8 : ty--; break;
		}
		
		console.log("[act target mass] ("+tx+" ,"+ty+")");
		//exception対策
		if(-1<tx && tx<mROW && -1<ty && ty<mCOL){
			if(emap[tx][ty]!=-1 && MainChara.mn>4){
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

	function addMes(str){
		for(var i = 6; i > -1 ; i--){
			message[i+1] = message[i];
		}
		message[0] = str;
	}

	function reset(){
		MainChara.hp = 100;
		MainChara.mn = 80;
		MainChara.dir = 2;
		MainChara.hung = 100;
		MainChara.foot = 0;

		floor = 0;
		hunt = 0;
		dig = 0;
		
		setMapRandom();
		resetEnemy();
		addMes("ようこそ！");
	}

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
		//if(move_now!=-1)return 0;
		on_key[key] = true;
		
		if(on_key[65]){	//a
			moveChar(-1,0,4);
			modCharDir(4);
		}
		if(on_key[83]){	//s
			moveChar(0,1,2);
			modCharDir(2);
		}
		if(on_key[68]){	//d
			moveChar(1,0,6);
			modCharDir(6);
		}
		if(on_key[87]){	//w
			moveChar(0,-1,8);
			modCharDir(8);
		}
		if(on_key[13]){	//enter
			attack();
		}
	};

	document.onkeyup = function (e){
		var key = e.keyCode;
		on_key[key] = false;
		on_key_done[key] = false;
	};
	
})();