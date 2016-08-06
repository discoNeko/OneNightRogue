(function(){
	//game display num
	var w = 800, h = 600;
	var requestId;
	var floor = 0;
	var hunt = 0;
	var dig = 0;

	//game static num
	var cROW = 150;//chip map size : x
	var cCOL = 150;//chip map size : y
	var mSIZE = 25;//mass size

	var dROW = cROW * mSIZE;//dot map size : x
	var dCOL = cCOL * mSIZE;//dot map size : y

	var mMap = [];
	var dMap = [];

	//set chip
	var map_chip = new Image();
	map_chip.src = 'img/map.png';

	var icon = new Image();
	icon.src = 'img/icon.png';

	//set animation effect
	var Effect = function (){
		this.exist = false;
		this.x = -1;//dot pos
		this.y = -1;//dot pos
		this.img = new Image();
		this.img.src = 'eff/eff.png';
		this.mwait = 0;
	}
	//effect最大同時描画数
	var eff_num = 100;
	var eff = [];
	var eff_on = false;

	var Chara = function (){
		this.x = -1;//dot pos
		this.y = -1;//dot pos
		this.dir = 2;//charactor direction
		this.width = 18;//charactor hitbox width
		this.height = 15;//charactor hitbox height

		this.hp = 100;
		this.mn = 80;
		this.hung = 100;
		this.steps = 0;
		
		this.exist = true;
		this.img = new Image();
		this.img.src = 'img/1.png';
		this.mwait = 0;//motion wait

		//charactor status
		this.equip = [-1,-1,-1,-1];

		this.atk = 10;//attack
		this.def = 0;//defence
		this.int = 10;//intelligence
		this.mnd = 0;//mind
		this.acc = 80;//accuracy
		this.eva = 0;//evasion
		this.luck = 0;

		this.spd = 3;//movement speed
		this.delay = 240;//attack delay
		this.attack_interval = 0;//attack interval

		this.interval = 0;//all action interval
	}

	var MainChara = new Chara();
	//enemy最大生存数
	var e_num = 150;
	var Enemy = [];

	var emap = [];

	//message最大保存数
	var mes_num = 28;
	var mes_wait = 0;
	var message = [];

	//reserved move
	var rMove = function (){
		this.x = 0;
		this.y = 0;
		this.spd = 0;
		this.done = false;
	}
	var rm_stacks = 0;
	var rm_exist = false;
	var rm_num = 500;
	var rm = [];
	for(var i = 0; i < rm_num; i++)
		rm[i] = new rMove();

	var move_now = -1;

	var map = [];
	var imap = [];
	var on_key = [];
	//var on_key_done = [];

	var canvas = document.getElementById('canvas');
	canvas.addEventListener("click", onClick, false);
	canvas.addEventListener('mousemove', onMove, false);
	var ctx = canvas.getContext('2d');

	init();

	function init(){
		setInitMap();

		setItem();
		setEnemy();
		setEffect();
		setMes();
		requestId = window.requestAnimationFrame(renderTitle); 
	}

	//mapを初期化
	function setInitMap(){
		//引数によって生成する map を変更する
		//ex.街、ダンジョン、……
		setMapRandom();
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

	// enemy
	//////////////////////////////////////////////////////////////////////////////

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
					Enemy[i].x = x;
					Enemy[i].y = y;
					Enemy[i].exist = true;
					emap[cx][cy].push(i);
					break;
				}
			}
		}
		Enemy[0].img.src = 'img/3.png';
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

	// effect method
	//////////////////////////////////////////////////////////////////////////////

	//effect 初期化
	function setEffect(){
		for(var i = 0; i < eff_num; i++){
			eff[i] = new Effect();
		}
	}

	function addMainCharaEffect(n){
		//n : effect　番号
		var x = MainChara.x;
		var y = MainChara.y;
		var d = MainChara.dir;

		//向きによって位置に補正をかける
		if(d==2){
			//down
			y = y + 25;
		}else if(d==4){
			//left
			x = x - 25;
		}else if(d==6){
			//right
			x = x + 25;
		}else if(d==8){
			//up
			y = y - 25;
		}
		addEffect(x,y,n);
	}

	//effect 追加
	function addEffect(x,y,n){
		//x,y : dot 座標
		//n : effect　番号
		for(var i = 0; i < eff_num; i++){
			if(!eff[i].exist){
				eff[i].exist = true;
				eff[i].x = x;
				eff[i].y = y;
				eff[i].img.src = 'eff/eff'+n+'.png';
				eff[i].mwait = 0;
				eff_on = true;
				break;
			}
		}
	}

	//effect 描画
	function drawEffect(){
		//x,y : dot 座標
		var v = false;

		//タイル描画開始位置
		var sx = 165;
		var sy = 35;
		//context の保存
		ctx.save();
		//描画範囲はクリッピングマスクで領域内に抑えられている
		ctx.beginPath();
		ctx.rect(sx,sy,19*mSIZE,17*mSIZE);
		ctx.clip();

		var pos = calcMapVisibleRange();
		var xx = pos.cx*mSIZE + pos.bx;
		var yy = pos.cy*mSIZE + pos.by;

		var eff_size_x = 30;
		var eff_size_y = 30;
		for(var i = 0; i < eff_num; i++){
			if(eff[i].exist){
				eff[i].mwait += 5;
				var mot = Math.floor(eff[i].mwait/10);
				var dx = sx + eff[i].x - xx;
				var dy = sy + eff[i].y - yy;
				ctx.drawImage(eff[i].img,0,mot*240,320,240,dx,dy,eff_size_x,eff_size_y);

				if(eff[i].mwait>100)
					eff[i].exist = false;
				v = true;
			}
		}
		if(!v){
			eff_on = false;
		}

		//クリッピングマスクここまで
		//context の復帰
		ctx.restore();
	}

	//message 初期化
	function setMes(){
		for(var i = 0; i < mes_num; i++)
			message[i] = "";
		message[0] = "ようこそ！";
	}

	//////////////////////////////////////////////////////////////////////////////

	function renderTitle(){
		//set display
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

		//毎フレーム実行する
		runPerFrame();

		//描画関連
		onKeyCheck();
		drawCalc();
		//moveDoneCheck();
		drawMenu();

		if(eff_on)
			drawEffect();

		if(MainChara.hp<1){
			ctx.fillStyle = '#fff';
			ctx.font= 'bold 120px Meiryo';
			ctx.fillText("死んだ！",180,300);
			ctx.font= 'bold 40px Meiryo';
			ctx.fillText("Enter : restart",230,380);
		}

		requestId = window.requestAnimationFrame(renderTitle); 
	}

	//毎フレーム実行する
	function runPerFrame(){
		updateAttackInterval();//update attack interval
		motionChar();//update charactor motion
		runReservedMove();
	}

	function runReservedMove(){
		var done = true;
		for(var i = 0; i < rm_stacks; i++){
			if(!rm[i].done){
				done = false;
				moveMainChar(rm[i].x,rm[i].y,rm[i].s);
				rm[i].done = true;
				break;
			}
		}
		if(done){
			rm_stacks = 0;
		}
	}

	function updateAttackInterval(){
		if(MainChara.attack_interval>0)
			MainChara.attack_interval -= 15;
		if(MainChara.attack_interval<0)
			MainChara.attack_interval = 0;
	}

	function motionChar(){
		MainChara.mwait+=3;
		if(MainChara.mwait>400)
			MainChara.mwait = 0;
	}


	function onKeyCheck(){
		//a
		if(on_key[65]){
			moveMainChar(-1,0,3);
			modMainCharDir(4);
		}
		//s
		if(on_key[83]){
			moveMainChar(0,1,3);
			modMainCharDir(2);
		}
		//d
		if(on_key[68]){
			moveMainChar(1,0,3);
			modMainCharDir(6);
		}
		//w
		if(on_key[87]){
			moveMainChar(0,-1,3);
			modMainCharDir(8);
		}
		//enter
		if(on_key[13]){
			attack();
			on_key[13] = false;
		}
		//o
		if(on_key[79]){
			rotate();
			insertMes("回転！　");
		}
		//p
		if(on_key[80]){
			if(MainChara.attack_interval==0 && rm_stacks==0){
				slash();
				if(message[0].indexOf('ダッシュ！') != -1){
					insertMes("ダッシュ！　");
				}else{
					addMes("ダッシュ！　");
				}
			}
		}
	}

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
							ctx.globalAlpha = 0.5;
							ctx.fillStyle = '#fff';
							ctx.fillRect(sx+(i+k)*25-chip_x,sy+j*25-chip_y,mSIZE,mSIZE);
							ctx.globalAlpha = 1;
							drawEnemy(sx+(i+k)*25-2+ebx-chip_x,sy+j*25-15+eby-chip_y,num);
						}
					}

					//MainChara
					ctx.globalAlpha = 0.5;
					ctx.fillStyle = '#fdd';
					ctx.fillRect(sx+i*25-chip_x,sy+j*25-chip_y,mSIZE,mSIZE);
					ctx.globalAlpha = 1;
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
							ctx.globalAlpha = 0.5;
							ctx.fillStyle = '#0ff';
							ctx.fillRect(sx+(i+k)*25-chip_x,sy+j*25-chip_y,mSIZE,mSIZE);
							ctx.globalAlpha = 1;
							drawEnemy(sx+(i+k)*25-2+ebx-chip_x,sy+j*25-15+eby-chip_y,num);
						}
					}
					i++;
				}else{
					for(var n in emap[xx][yy]){
						var num = emap[xx][yy][n] | 0;
						var ebx = Enemy[num].x % mSIZE | 0;
						var eby = Enemy[num].y % mSIZE | 0;
						ctx.globalAlpha = 0.5;
						ctx.fillStyle = '#0f0';
						ctx.fillRect(sx+i*25-chip_x,sy+j*25-chip_y,mSIZE,mSIZE);
						ctx.globalAlpha = 1;
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
		if(mot>2)mot = 1;
		//ctx.fillRect(x+5,y+25,18,15);
		ctx.lineWidth="1";
		ctx.strokeStyle="red";
		ctx.rect(x,y+15,10+MainChara.width,10+MainChara.height);
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
		ctx.fillStyle = '#ccc';
		ctx.fillRect(x+5,y+25,18,15);
		ctx.drawImage(Enemy[num].img,20*mot,0,20,28,x,y,28,38);
	}

	function moveDoneCheck(){
		if(imap[Math.round(MainChara.x/mSIZE)][Math.round(MainChara.y/mSIZE)]==5){
			addMes("地下へ降りた！");
			floor++;
			setMapRandom();
			resetEnemy();
		}	
	}

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

	// draw system
	//////////////////////////////////////////////////////////////////////////////////

	function drawMenu(){
		var ax = 15;
		var ay = 480;
		ctx.fillStyle = '#ddd';
		ctx.fillRect(ax,ay,635,105)//下フレーム
		ctx.fillRect(ax,25,130,445);//左フレーム
		ctx.fillRect(ax+645,25,125,560);//右フレーム

		//左枠メニュー描画
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

		var sx = 30, sy = 350;
		ctx.fillStyle = '#577';
		ctx.fillRect(sx,sy,100,1);
		ctx.fillRect(sx,sy,1,100);
		ctx.fillRect(sx+100,sy,1,100);
		ctx.fillRect(sx,sy+100,100+1,1);
		ctx.fillStyle = '#999';
		for(var i = 0; i < 100; i++){
			var compr = Math.floor(cROW*i/100);
			for(var j = 0; j < 100; j++){
				var compc = Math.floor(cCOL*j/100);
				if(map[compr][compc]){
					ctx.fillRect(sx+i,sy+j,1,1);
				}else{
					//ctx.fillRect(sx+i*2,sy+j*2,2,2);
				}
			}
		}
		/*
		var sx = 30, sy = 350;
		ctx.fillStyle = '#577';
		ctx.fillRect(sx,sy,cROW,1);
		ctx.fillRect(sx,sy,1,cCOL);
		ctx.fillRect(sx+cROW,sy,1,cCOL);
		ctx.fillRect(sx,sy+cCOL,cROW+1,1);
		ctx.fillStyle = '#999';
		for(var i = 0; i < cROW; i++){
			for(var j = 0; j < cCOL; j++){
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
		*/
		if(floor<2){
			ctx.fillStyle = '#a33';
			ctx.fillRect(sx+Math.floor(100*MainChara.x/25/cROW)-2,sy+Math.floor(100*MainChara.y/25/cCOL)-2,4,4);
		}
		if(floor<4){
			ctx.fillStyle = '#3a3';
			ctx.globalAlpha = MainChara.mwait%100/100;
			ctx.fillRect(sx+Enemy[0].x-2,sy+Enemy[0].y-2,4,4);
			ctx.globalAlpha = 1.0;
		}


		//message描画
		ctx.font= 'bold 15px Meiryo';
		if(on_key[76]){
			if(mes_wait<80)mes_wait += 8;
			if(mes_wait<88)mes_wait += 2;
			if(mes_wait<96)mes_wait += 2;
			if(mes_wait<100)mes_wait += 2;
		}else if(mes_wait>0){
			if(mes_wait>20)mes_wait -= 8;
			if(mes_wait>12)mes_wait -= 2;
			if(mes_wait>4)mes_wait -= 2;
			if(mes_wait>0)mes_wait -= 2;
		}
		//描画領域拡張
		if(mes_wait>0){
			var a = mes_wait/100;
			//console.log(a);
			ctx.fillStyle = '#ddd';

			//クリッピングマスク
			ctx.save();
			ctx.beginPath();
			ctx.rect(ax,ay-Math.floor(455*a),635,105+Math.floor(455*a));
			ctx.clip();

			ctx.fillRect(ax,ay-Math.floor(455*a),635,105+Math.floor(455*a))//下フレーム拡張
			ctx.fillStyle = '#333';
			for(var i = 0; i < 27; i++){
				ctx.fillText(message[i],20,578-i*20);
			}

			//クリッピングマスクここまで
			ctx.restore();
		}else{
			ctx.fillStyle = '#333';
			for(var i = 0; i < 5; i++){
				ctx.fillText(message[i],20,578-i*20);
			}
		}
	}

	// action system
	//////////////////////////////////////////////////////////////////////////

	//o
	function rotate(){
		var range1 = calcBeamArea(30,30,8);
		var range2 = calcBeamArea(30,30,2);
		calcEnemyDamagedRange(range1.sx,range1.gy,range2.gx,range2.gy,70);
		addMainCharaEffect("");

	}

	//p
	function slash(){
		//set attack interval
		MainChara.attack_interval = MainChara.delay;

		console.log("MAIN "+MainChara.x+" "+MainChara.y+" "+MainChara.dir);

		var d = MainChara.dir;
		var range = calcBeamArea(60,20,d);
		calcEnemyDamagedRange(range.sx,range.sy,range.gx,range.gy,170);
		if(d==4){
			//calcEnemyDamagedRange(MainChara.x-MainChara.width-5,MainChara.y-5,MainChara.x-MainChara.width-5+60,MainChara.y+MainChara.height+5,100);	
			addReservedMove(-1,0,26,1);
			addReservedMove(-1,0,8,5);
			addReservedMove(-1,0,4,5);
			addReservedMove(-1,0,2,5);
			addReservedMove(-1,0,1,5);
		}else if(d==2){
			//calcEnemyDamagedRange(MainChara.x-10,MainChara.y-10,MainChara.x+20,MainChara.y+60,100);
			addReservedMove(0,1,26,1);
			addReservedMove(0,1,8,5);
			addReservedMove(0,1,4,5);
			addReservedMove(0,1,2,5);
			addReservedMove(0,1,1,5);
		}else if(d==6){
			//calcEnemyDamagedRange(MainChara.x-25,MainChara.y-10,MainChara.x+60,MainChara.y+20,100);
			addReservedMove(1,0,26,1);
			addReservedMove(1,0,8,5);
			addReservedMove(1,0,4,5);
			addReservedMove(1,0,2,5);
			addReservedMove(1,0,1,5);
		}else{
			//calcEnemyDamagedRange(MainChara.x-10,MainChara.y-10,MainChara.x+20,MainChara.y+60,100);
			addReservedMove(0,-1,26,1);
			addReservedMove(0,-1,8,5);
			addReservedMove(0,-1,4,5);
			addReservedMove(0,-1,2,5);
			addReservedMove(0,-1,1,5);
		}
		addMainCharaEffect("");
	}

	function calcBeamArea(range,width,dir){
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
		return {sx,sy,gx,gy};
	}

	function calcEnemyDamagedRange(sx,sy,gx,gy,dmg){
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
					calcEnemyDamaged(n,dmg);
					/*
					var rx = Enemy[n].x;
					var ry = Enemy[n].y;
					var xhit = false;
					var yhit = false;
					if(sx<rx-20 && rx+20<gx)
						xhit = true;
					if(rx-20<sx && sx<rx+20)
						xhit = true;
					if(rx-20<gx && gx<rx+20)
						xhit = true;
					if(sy<ry-10 && ry+10<gy)
						yhit = true;
					if(ry-10<sy && sy<ry+10)
						yhit = true;
					if(ry-10<gy && gy<ry+10)
						yhit = true;
					if(xhit && yhit){
					*/
				}
			}
		}
	}

	function calcEnemyDamaged(num,dmg){
		console.log("hit damage!!!!!!!");
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
	}

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
		
		//console.log("[act target mass] ("+tx+" ,"+ty+")");
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

	//行動予約によって
	//移動アニメーションを実現
	function addReservedMove(x,y,s,cnt){
		//x,y : 移動方向
		//s : 移動量
		//cnt : 繰り返し回数

		//stacks　数以上の登録は弾く
		if(rm_stacks + cnt >= rm_num)
			return 0;
		for(var i = 0; i < cnt; i++){
			rm[rm_stacks].x = x;
			rm[rm_stacks].y = y;
			rm[rm_stacks].s = s;
			rm[rm_stacks].done = false;
			rm_stacks++;
		}
	}

	//メッセージ追加
	function addMes(str){
		for(var i = mes_num　- 2; i > -1 ; i--){
			message[i+1] = message[i];
		}
		message[0] = str;
	}

	//改行せずにメッセージ挿入
	function insertMes(str){
		var pos = 42;
		message[0] += str;
		var len = message[0].length;
		if(len > pos){
			var tmp = message[0];
			message[0] = tmp.substring(0,pos);
			addMes(tmp.substring(pos,len));
		}
	}

	function reset(){
		MainChara.hp = 100;
		MainChara.mn = 80;
		MainChara.dir = 2;
		MainChara.hung = 100;
		MainChara.steps = 0;

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
		on_key[key] = true;
	};

	document.onkeyup = function (e){
		var key = e.keyCode;
		on_key[key] = false;
	};
	
})();