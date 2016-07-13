(function(){
	var w = 800, h = 600;
	var requestId;
	var floor = 0;
	var hunt = 0;
	var dig = 0;

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
		this.x = 9;
		this.y = 12;
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
	var e_num = 150;
	var Enemy = [];

	var emap = [];

	var message = [];

	var move_now = -1;

	var row = 50;
	var col = 50;
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
		for(var i = 0; i < row; i++){
			emap[i] = [];
			for(var j = 0; j < col; j++){
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
			ssx[1] = Math.floor(Math.random()*row);
			if((ssx[1]>=sx && ssx[1]<gx) || (ssx[1]+r[1]>=sx && ssx[1]+r[1]<gx))
				break;
		}
		ssx[2] = gx;
		while(true){
			ssx[3] = Math.floor(Math.random()*row);
			if((ssx[3]>=sx && ssx[3]<gx) || (ssx[3]+r[3]>=sx && ssx[3]+r[3]<gx))
				break;
		}

		while(true){
			ssy[0] = Math.floor(Math.random()*row);
			if((ssy[0]>=sy && ssy[0]<gy) || (ssy[0]+c[0]>=sy && ssy[0]+c[0]<gy))
				break;
		}
		ssy[1] = sy - c[1];
		while(true){
			ssy[2] = Math.floor(Math.random()*row);
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
					if(-1<j && j<row && -1<k && k<col && !map[j][k]){
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
		for(var i = 0; i < row; i++){
			map[i] = [];
			imap[i] = [];
		}

		var sx = Math.floor(Math.random()*10)+row/2;
		var sy = Math.floor(Math.random()*10)+col/2;
		var gx = Math.floor(Math.random()*10)+1+sx;
		var gy = Math.floor(Math.random()*10)+1+sy;
		for(var i = sx; i < gx; i++){
			for(var j = sy; j < gy; j++){
				map[i][j] = true;
			}
		}
		genRoom(sx,sy,gx,gy,-1);
		for(var i = 0; i < row; i++){
			map[i][0] = false;
			map[0][i] = false;
			map[i][col-1] = false;
			map[row-1][i] = false;
		}

		//chara set
		while(true){
			var x = Math.floor(Math.random()*row);
			var y = Math.floor(Math.random()*col);
			if(map[x][y]){
				MainChara.x = x;
				MainChara.y = y;
				break;
			}
		}

		for(var i = 0; i < row; i++){
			var s = "";
			for(var j = 0; j < col; j++){
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
		for(var i = 0; i < row; i++){
			for(var j = 0; j < col; j++){
				imap[i][j] = -1;
			}
		}

		var num = Math.floor(Math.random()*20)+10;
		while(num>0){
			var x = Math.floor(Math.random()*row);
			var y = Math.floor(Math.random()*col);
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
		for(var i = 0; i < row; i++){
			map[i] = [];
			dmap[i] = data[i].split(',');
		}
		for(var i = 0; i < row; i++){
			for(var j = 0; j < col; j++){
				if(dmap[j][i]==0)
					map[i][j]=true;
			}
		}
		/*
		//map確認
		for(var i = 0; i < row; i++){
			var s = "";
			for(var j = 0; j < col; j++){
				if(map[i][j]){
					s += "O";
				}else{
					s += "X";
				}
			}
			console.log(s);
		}
		*/
		requestId = window.requestAnimationFrame(renderTitle); 
	}

	//enemy初期化
	function setEnemy(){
		for(var i = 0; i < e_num; i++){
			Enemy[i] = new Chara();
			Enemy[i].img.src = 'img/2.png';
			while(true){
				var x = Math.floor(Math.random()*row);
				var y = Math.floor(Math.random()*col);
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
		for(var i = 0; i < row; i++){
			for(var j = 0; j < col; j++){
				emap[i][j] = -1;
			}
		}
		for(var i = 0; i < e_num; i++){
			while(true){
				var x = Math.floor(Math.random()*row);
				var y = Math.floor(Math.random()*col);
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

		//onKeyCheck();
		if(move_now!=-1){
			drawMoveCalc();
			moveDoneCheck();
		}else{
			drawCalc();
		}

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
		MainChara.mwait+=2;
		if(MainChara.mwait>400)
			MainChara.mwait = 0;
	}

/*
	function onKeyCheck(){
		//a
		if(on_key[65]){
			moveChar(-1,0);
			modCharDir(4);
			on_key[65] = false;
		}
		//s
		if(on_key[83]){
			moveChar(0,1);
			modCharDir(2);
			on_key[83] = false;
		}
		//d
		if(on_key[68]){
			moveChar(1,0);
			modCharDir(6);
			on_key[68] = false;
		}
		//w
		if(on_key[87]){
			moveChar(0,-1);
			modCharDir(8);
			on_key[87] = false;
		}
		//enter
		if(on_key[13]){
			attack();
			on_key[13] = false;
		}
	}

*/

	//移動中の滑らかな移動を描画
	//描画位置を一括で計算して、map,chara,enemyそれぞれに値を渡す
	function drawMoveCalc(){
		move_now += 25;
		var dd = Math.floor(24*move_now/100);
		var d = Math.floor(MainChara.dir/2) - 1;
		var dx = [0,1,-1,0];
		var dy = [-1,0,0,1];

		var ax = 155;
		var ay = 80;
		ctx.fillStyle = '#070';
		ctx.fillRect(ax,ay-55,w-2*ax+5,h-2*ay+5);

		var sx = 165;
		var sy = 35;
		var cx = MainChara.x | 0;
		var cy = MainChara.y | 0;
		var mx = cx - 10;
		var my = cy - 9;
		var pos = drawMoveMapLimitCheck(mx,my);
		for(var i = 0; i < 21; i++){
			for(var j = 0; j < 19; j++){
				var xx = pos.mx + i;
				var yy = pos.my + j;
				//補正値　タイルの描画開始位置
				var hi = i, hj = j;
				//補正値 タイルが動く場合
				var hx = 0, hy = 0;
				if(pos.xhit==1){
					hi = i-2;
				}else if(pos.xhit==0){
					hi = i-1;
					hx = dd*dx[d];
				}
				if(pos.yhit==1){
					hj = j-2;
				}else if(pos.yhit==0){
					hj = j-1;
					hy = dd*dy[d];
				}

				//画面端 -> 中央へ移動時 hit判定を解除する
				var dir = MainChara.dir;
				if(dir==2 && MainChara.y==8)
					hy = dd*dy[d];
				if(dir==4 && MainChara.x==40)
					hx = dd*dx[d];
				if(dir==6 && MainChara.x==9)
					hx = dd*dx[d];
				if(dir==8 && MainChara.y==41)
					hy = dd*dy[d];

				//タイル描画
				drawMoveMap(xx,yy,hi*25+sx+hx,hj*25+sy+hy);
				//ループの最初と最後はタイルが見切れるので、補正を入れる
			}
		}

		//タイル描画後にchara,enemyを描画
		//charaが画面端に寄っているときは、
		//タイルを移動させずにcharaを移動させる
		for(var i = 0; i < 21; i++){
			for(var j = 0; j < 19; j++){
				var xx = pos.mx + i;
				var yy = pos.my + j;
				//補正値　タイルの描画開始位置
				var hi = i, hj = j;
				//補正値 タイルが動く場合
				var hx = 0, hy = 0;
				//補正値 charaが動く場合
				var chx = dd*dx[d], chy = dd*dy[d];
				if(pos.xhit==1){
					hi = i-2;
				}else if(pos.xhit==0){
					hi = i-1;
					hx = dd*dx[d];
					chx = 0;
				}
				if(pos.yhit==1){
					hj = j-2;
				}else if(pos.yhit==0){
					hj = j-1;
					hy = dd*dy[d];
					chy = 0;
				}

				//画面端 -> 中央へ移動時 hit判定を解除する
				var dir = MainChara.dir;
				if(dir==2 && MainChara.y==8){
					hy = dd*dy[d];
					chy = 0;
				}
				if(dir==4 && MainChara.x==40){
					hx = dd*dx[d];
					chx = 0;
				}
				if(dir==6 && MainChara.x==9){
					hx = dd*dx[d];
					chx = 0;
				}
				if(dir==8 && MainChara.y==41){
					hy = dd*dy[d];
					chy = 0;
				}

				//chara,enemy描画
				if(emap[xx][yy] != -1){
					drawMoveEnemy(xx,yy,hi*25+sx-2+hx,hj*25+sy-15+hy);
				}
				if(cx == xx && cy == yy){
					drawMoveChar(hi*25+sx-2-chx,hj*25+sy-15-chy);
				}
			}
		}

		//枠線上書き
		ctx.fillStyle = '#070';
		ctx.fillRect(155,25,495,10);
		ctx.fillRect(155,25,10,445);
		ctx.fillRect(640,25,10,445);
		ctx.fillRect(155,460,495,10);

		ctx.fillStyle = '#222';
		ctx.fillRect(0,0,155,600);
		ctx.fillRect(0,0,800,25);
		ctx.fillRect(0,470,800,130);
		ctx.fillRect(650,0,150,600);

		ctx.fillStyle = '#aaa';
		ctx.fillRect(0,0,5,600);
		ctx.fillRect(0,0,800,5);
		ctx.fillRect(0,595,800,5);
		ctx.fillRect(795,0,5,600);
		

	}

	function drawMoveMapLimitCheck(mx,my){
		//hit マップの端にcharaが居るときを判定
		var xhit = 0, yhit = 0;
		if(mx < 0){
			mx = 0;
			xhit = -1;
		}
		if(mx + 21 > 50){
			mx = 29;
			xhit = 1;
		}
		if(my < 0){
			my = 0;
			yhit = -1;
		}
		if(my + 19 > 50){
			my = 31;
			yhit = 1;
		}
		return {mx,my,xhit,yhit};
	}

	function drawMoveMap(r,c,x,y){
/*
		if(MainChara.x == r && MainChara.y == c){
			ctx.fillStyle = '#a00';
			ctx.drawImage(map_chip,0,0,32,32,x,y,24,24);
		}else 
*/
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
			//MainChara.x += mx;
			//MainChara.y += my;
		}
		moveEnemy();
		scanEnemyPos();
		console.log("now "+MainChara.x+" "+MainChara.y);
	}

	function modCharDir(dir){
		MainChara.mwait += 100;
		MainChara.dir = dir;
	}

	function canMove(mx,my){
		var v = true;
		var xx = MainChara.x + mx;
		var yy = MainChara.y + my;
		console.log("move "+xx+" "+yy);
		if(mx!=0 && (0>xx || xx>row-1)){
			return false;
		}
		if(my!=0 && (0>yy || yy>col-1)){
			return false;
		}
		if(collisionEnemy(xx,yy)){
			v = false;
		}
		if(collisionObject(xx,yy)){
			v = false;
		}
		return v;
	}

	function collisionEnemy(x,y){
		if(emap[x][y]!=-1)
			return true;
		return false;
	}

	function collisionObject(x,y){
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
		if(mx + 19 > 50)
			mx = 31;
		if(my < 0)
			my = 0;
		if(my + 17 > 50)
			my = 33;
		return {mx,my};
	}

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

		ctx.fillStyle = '#999';
		var sx = 30, sy = 350;
		for(var i = 0; i < row; i++){
			for(var j = 0; j < col; j++){
				if(map[i][j]){
					ctx.fillRect(sx+i*2,sy+j*2,2,2);
				}else{
					//ctx.fillRect(sx+i*2,sy+j*2,2,2);
				}
			}
		}
		if(floor<2){
			ctx.fillStyle = '#a33';
			ctx.fillRect(sx+MainChara.x*2-2,sy+MainChara.y*2-2,4,4);
		}
		if(floor<4){
			ctx.fillStyle = '#3a3';
			ctx.globalAlpha = MainChara.mwait%100/100;
			ctx.fillRect(sx+Enemy[0].x*2-2,sy+Enemy[0].y*2-2,4,4);
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
		for(var i = 0; i < row; i++){
			for(var j = 0; j < col; j++){
				emap[i][j] = -1;
			}
		}
		for(var i = 0; i < e_num; i++){
			if(Enemy[i].exist)
				emap[Enemy[i].x][Enemy[i].y] = i;
		}
	}

	function attack(){
		var tx = MainChara.x;
		var ty = MainChara.y;
		var d = MainChara.dir;
		switch(d){
			case 2 : ty++; break;
			case 4 : tx--; break;
			case 6 : tx++; break;
			case 8 : ty--; break;
		}
		//exception対策
		if(-1<tx && tx<row && -1<ty && ty<col){
			if(emap[tx][ty]!=-1 && MainChara.mn>4){
				//attack
				appEffect();
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
				appEffect();
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
				appEffect();
				map[tx][ty] = true;
				if(imap[tx][ty]==0)
					imap[tx][ty]=-1;
				MainChara.mn -= 3;
				dig++;
				addMes("壁を壊した！");
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
		if(move_now!=-1)return 0;
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