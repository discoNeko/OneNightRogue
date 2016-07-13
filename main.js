(function(){
	var w = 800, h = 600;
	var requestId;

	var map_chip = new Image();
	map_chip.src = 'img/map.png';

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
		this.dir = 8;
		this.hp = 100;
		this.mn = 100;
		this.exist = true;
		this.img = new Image();
		this.img.src = 'img/1.png';
		this.mwait = 0;
	}
	var MainChara = new Chara();
	var e_num = 150;
	var Enemy = [];

	var emap = [];

	var move_now = -1;

	var row = 50;
	var col = 50;
	var map = [];
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
	}

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
					emap[x][y] = i;
					break;
				}
			}
		}
		Enemy[0].img.src = 'img/3.png';
	}

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

	function setMapRandom(){

		for(var i = 0; i < row; i++){
			map[i] = [];
		}

		var r = Math.floor(Math.random()*30+10);
		var c = Math.floor(Math.random()*30+10);
		genSpace(0,0,r,c);
		genSpace(r,0,row,c);
		genSpace(0,c,r,col);
		genSpace(r,c,row,col);
		

		/*
		for(var i = 0; i < row; i++){
			for(var j = 0; j < col; j++){
				map[i][j] = true;
			}	
		}
		*/
		requestId = window.requestAnimationFrame(renderTitle); 
	}

	function genSpace(sx,sy,gx,gy){
		if(sx<5)sx+=5;
		if(sy<5)sy+=5;
		if(gx>row-5)gx-=5;
		if(gy>col-5)gy-=5;
		var dx = gx - sx;
		var dy = gy - sy;
		var r = Math.floor(Math.random()*dx)+sx+5;
		var c = Math.floor(Math.random()*dy)+sy+5;
		for(var i = sx; i < r; i++){
			for(var j = sy; j < c; j++){
				console.log(i+" "+j);
				map[i][j] = true;
			}
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
			//drawMoveChar();
			moveDoneCheck();
			//drawMoveEnemy();
		}else{
			drawMap();
			drawChar();
			drawEnemy();
		}


		

		//drawMenu();

		//debug
		//ctx.fillStyle = '#fff';
		//ctx.fillText("move : ASDW",150,520);
		//ctx.fillText("attack : Enter",150,570);

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

/*

	//移動中の滑らかな移動を描画
	function drawMoveMap(){
		move_now += 10;
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
		//補正値
		sx += dd*dx[d];
		sy += dd*dy[d];
		for(var i = 0; i < 21; i++){
			for(var j = 0; j < 19; j++){
				var pos = drawMoveMapLimitCheck(mx,my);
				mx = pos.mx;
				my = pos.my;
				var xx = mx + i;
				var yy = my + j;
				//ループの最初と最後はタイルが見切れるので、補正を入れる
				if(cx == xx && cy == yy){
					ctx.fillStyle = '#a00';
					ctx.drawImage(map_chip,0,0,32,32,(i-1)*25+sx,(j-1)*25+sy,24,24);
				}else if(map[xx][yy]){
					ctx.fillStyle = '#a0a';
					ctx.drawImage(map_chip,0,0,32,32,(i-1)*25+sx,(j-1)*25+sy,24,24);
				}else{
					ctx.fillStyle = '#aa0';
					ctx.drawImage(map_chip,0,0,32,32,(i-1)*25+sx,(j-1)*25+sy,24,24);
					ctx.drawImage(map_chip,224,0,32,32,(i-1)*25+sx,(j-1)*25+sy,24,24);
				}
				//ctx.fillRect(i*25+sx,j*25+sy,24,24);
			}
		}
	}
*/

	//移動中の滑らかな移動を描画
	//描画位置を一括で計算して、map,chara,enemyそれぞれに値を渡す
	function drawMoveCalc(){
		move_now += 10;
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
		//補正値
		//var hx = dd*dx[d];
		//var hy = dd*dy[d];
		var pos = drawMoveMapLimitCheck(mx,my);
		for(var i = 0; i < 21; i++){
			for(var j = 0; j < 19; j++){
				//var pos = drawMoveMapLimitCheck(mx,my);
				//mx = pos.mx;
				//my = pos.my;
				//var xx = mx + i;
				//var yy = my + j;
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
				drawMoveMap(xx,yy,hi*25+sx+hx,hj*25+sy+hy);
				//ループの最初と最後はタイルが見切れるので、補正を入れる
			}
		}

		//タイル描画後にchara,enemyを描画
		//charaが画面端に寄っているときは、
		//タイルを移動させずにcharaを移動させる
		for(var i = 0; i < 21; i++){
			for(var j = 0; j < 19; j++){
				//var pos = drawMoveMapLimitCheck(mx,my);
				//mx = pos.mx;
				//my = pos.my;
				//var xx = mx + i;
				//var yy = my + j;
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
	}
/*

	function drawMoveChar(){
		var dir = MainChara.dir;

		var posx = 0, posy = 0;
		var sx = 165;
		var sy = 35;
		var cx = MainChara.x | 0;
		var cy = MainChara.y | 0;
		var mx = cx - 9;
		var my = cy - 8;
		for(var i = 0; i < 19; i++){
			for(var j = 0; j < 17; j++){
				var pos = drawMapLimitCheck(mx,my);
				mx = pos.mx;
				my = pos.my;
				var xx = mx + i;
				var yy = my + j;
				if(cx == xx && cy == yy){
					posx = i*25+sx-2;
					posy = j*25+sy-15;
					break;
				}
			}
		}
		var mot = Math.floor(MainChara.mwait / 100);
		if(mot>2)mot = 1;
		switch(dir){
			case 2 : //down
				ctx.drawImage(MainChara.img,20*mot,0,20,28,posx,posy,28,38);
				break;
			case 4 : //left
				ctx.drawImage(MainChara.img,20*mot,28,20,28,posx,posy,28,38);
				break;
			case 6 : //right
				ctx.drawImage(MainChara.img,20*mot,56,20,28,posx,posy,28,38);
				break;
			case 8 : //up
				ctx.drawImage(MainChara.img,20*mot,84,20,28,posx,posy,28,38);
				break;
		}
	}


*/


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

/*

	function drawMoveEnemy(){
		var posx = 0, posy = 0;
		var sx = 165;
		var sy = 35;
		var cx = MainChara.x | 0;
		var cy = MainChara.y | 0;
		var mx = cx - 9;
		var my = cy - 8;
		var mot = Math.floor(MainChara.mwait / 100);
		if(mot>2)mot = 1;
		for(var i = 0; i < 19; i++){
			for(var j = 0; j < 17; j++){
				var pos = drawMapLimitCheck(mx,my);
				mx = pos.mx;
				my = pos.my;
				var xx = mx + i;
				var yy = my + j;
				if(emap[xx][yy]!=-1){
					posx = i*25+sx-2;
					posy = j*25+sy-15;
					ctx.drawImage(Enemy[emap[xx][yy]].img,20*mot,0,20,28,posx,posy,28,38);
				}
			}
		}
	}
	*/

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
		}
	}








	function moveChar(mx,my,dir){
		if(canMove(mx,my)){
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
			console.log("xx false");
			return false;
		}
		if(my!=0 && (0>yy || yy>col-1)){
			console.log("yy false");
			return false;
		}
		if(collisionEnemy(xx,yy)){
			v = false;
		}
		return v;
	}

	function collisionEnemy(x,y){
		var v = false;
		if(emap[x][y]!=-1)
			v = true;
		return v;
	}

	function moveEnemy(){
		for(var i = 0; i < 15; i++){

		}
	}

	function drawMap(){
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
		for(var i = 0; i < 19; i++){
			for(var j = 0; j < 17; j++){
				var pos = drawMapLimitCheck(mx,my);
				mx = pos.mx;
				my = pos.my;
				var xx = mx + i;
				var yy = my + j;
				if(cx == xx && cy == yy){
					ctx.fillStyle = '#a00';
					ctx.drawImage(map_chip,0,0,32,32,i*25+sx,j*25+sy,24,24);
				}else if(map[xx][yy]){
					ctx.fillStyle = '#a0a';
					ctx.drawImage(map_chip,0,0,32,32,i*25+sx,j*25+sy,24,24);
				}else{
					ctx.fillStyle = '#aa0';
					ctx.drawImage(map_chip,0,0,32,32,i*25+sx,j*25+sy,24,24);
					ctx.drawImage(map_chip,224,0,32,32,i*25+sx,j*25+sy,24,24);
				}
				//ctx.fillRect(i*25+sx,j*25+sy,24,24);
			}
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
	}

	function drawChar(){
		var dir = MainChara.dir;

		var posx = 0, posy = 0;
		var sx = 165;
		var sy = 35;
		var cx = MainChara.x | 0;
		var cy = MainChara.y | 0;
		var mx = cx - 9;
		var my = cy - 8;
		for(var i = 0; i < 19; i++){
			for(var j = 0; j < 17; j++){
				var pos = drawMapLimitCheck(mx,my);
				mx = pos.mx;
				my = pos.my;
				var xx = mx + i;
				var yy = my + j;
				if(cx == xx && cy == yy){
					posx = i*25+sx-2;
					posy = j*25+sy-15;
					break;
				}
			}
		}
		var mot = Math.floor(MainChara.mwait / 100);
		if(mot>2)mot = 1;
		switch(dir){
			case 2 : //down
				ctx.drawImage(MainChara.img,20*mot,0,20,28,posx,posy,28,38);
				break;
			case 4 : //left
				ctx.drawImage(MainChara.img,20*mot,28,20,28,posx,posy,28,38);
				break;
			case 6 : //right
				ctx.drawImage(MainChara.img,20*mot,56,20,28,posx,posy,28,38);
				break;
			case 8 : //up
				ctx.drawImage(MainChara.img,20*mot,84,20,28,posx,posy,28,38);
				break;
		}
	}

	function drawEnemy(){
		var posx = 0, posy = 0;
		var sx = 165;
		var sy = 35;
		var cx = MainChara.x | 0;
		var cy = MainChara.y | 0;
		var mx = cx - 9;
		var my = cy - 8;
		var mot = Math.floor(MainChara.mwait / 100);
		if(mot>2)mot = 1;
		for(var i = 0; i < 19; i++){
			for(var j = 0; j < 17; j++){
				var pos = drawMapLimitCheck(mx,my);
				mx = pos.mx;
				my = pos.my;
				var xx = mx + i;
				var yy = my + j;
				if(emap[xx][yy]!=-1){
					posx = i*25+sx-2;
					posy = j*25+sy-15;
					ctx.drawImage(Enemy[emap[xx][yy]].img,20*mot,0,20,28,posx,posy,28,38);
				}
			}
		}
	}

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
		if(-1<tx && tx<row && -1<ty && ty<col && emap[tx][ty]!=-1){
			appEffect();
			Enemy[emap[tx][ty]].exist = false;
		}
		scanEnemyPos();

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
		if(move_now!=-1)return 0;
		on_key[key] = true;
		
		if(on_key[65]){
			//a
			moveChar(-1,0,4);
			modCharDir(4);
		}
		if(on_key[83]){
			//s
			moveChar(0,1,2);
			modCharDir(2);
		}
		if(on_key[68]){
			//d
			moveChar(1,0,6);
			modCharDir(6);
		}
		if(on_key[87]){
			//w
			moveChar(0,-1,8);
			modCharDir(8);
		}
		if(on_key[13]){
			//enter
			attack();
		}
		

	};

	document.onkeyup = function (e){
		var key = e.keyCode;
		on_key[key] = false;
		on_key_done[key] = false;
	};
	
})();