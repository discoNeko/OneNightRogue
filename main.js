(function(){
	var w = 800, h = 600;
	var requestId;

	var map_chip = new Image();
	map_chip.src = 'img/map.png';

	var Chara = function (){
		this.x = 9;
		this.y = 12;
		this.dir = 8;
		this.hp = 100;
		this.mn = 100;
		this.img = new Image();
		this.img.src = 'img/1.png';
		this.mwait = 0;
	}
	var MainChara = new Chara();
	var e_num = 150;
	var Enemy = [];

	var emap = [];

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
		drawMap();
		drawMenu();
		drawChar();
		drawEnemy();

		//debug
		ctx.fillStyle = '#fff';
		ctx.fillText("move : ASDW",150,555);

		requestId = window.requestAnimationFrame(renderTitle); 
	}

	function motionChar(){
		MainChara.mwait+=2;
		if(MainChara.mwait>400)
			MainChara.mwait = 0;
	}

	function onKeyCheck(){
		//a
		if(on_key[65] && !on_key_done[65]){
			on_key_done[65] = true;
			moveChar(-1,0);
		}
		//s
		if(on_key[83] && !on_key_done[83]){
			on_key_done[83] = true;
			moveChar(0,1);
		}
		//d
		if(on_key[68] && !on_key_done[68]){
			on_key_done[68] = true;
			moveChar(1,0);
		}
		//w
		if(on_key[87] && !on_key_done[87]){
			on_key_done[87] = true;
			moveChar(0,-1);
		}
	}

	function moveChar(mx,my){
		if(canMove(mx,my)){
			MainChara.x += mx;
			MainChara.y += my;
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
			v = false;
		}
		if(my!=0 && (0>yy || yy>col-1)){
			console.log("yy false");
			v = false;
		}
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
		var ax = 150;
		var ay = 100;
		ctx.fillStyle = '#ddd';
		//ctx.fillRect(ax,ay-50,w-2*ax,h-2*ay);

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
			emap[Enemy[i].x][Enemy[i].y] = i;
		}
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
		//console.log(key);
		on_key[key] = true;
		if(on_key[65]){
			moveChar(-1,0);
			modCharDir(4);
		}//a
		if(on_key[83]){
			moveChar(0,1);
			modCharDir(2);
		}//s
		if(on_key[68]){
			moveChar(1,0);
			modCharDir(6);
		}//d
		if(on_key[87]){
			moveChar(0,-1);
			modCharDir(8);
		}//w

	};

	document.onkeyup = function (e){
		var key = e.keyCode;
		on_key[key] = false;
		on_key_done[key] = false;
	};
	
})();