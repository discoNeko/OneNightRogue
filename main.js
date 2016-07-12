(function(){
	var w = 800, h = 600;
	var requestId;

	var Chara = function (){
		this.x = 9;
		this.y = 12;
		this.hp = 100;
		this.mn = 100;
	}
	var MainChara = new Chara();

	var row = 50;
	var col = 50;
	var map = [];
	var on_key = [];



	var canvas = document.getElementById('canvas');
	canvas.addEventListener("click", onClick, false);
	canvas.addEventListener('mousemove', onMove, false);
	var ctx = canvas.getContext('2d');
	
	init();
	requestId = window.requestAnimationFrame(renderTitle); 

	function init(){
		setInitMap();
	}

	function setInitMap(){
		for(var i = 0; i < row; i++){
			map[i] = [];
			for(var j = 0; j < col; j++){
				var rnd = Math.floor(Math.random()*2);
				if(rnd==0)
					map[i][j] = true;
			}
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

		onKeyCheck();
		drawMap();
		drawMenu();
		drawChar();

		//debug
		ctx.fillStyle = '#fff';
		ctx.fillText("move : ASDW",150,555);


		requestId = window.requestAnimationFrame(renderTitle); 
	}

	function onKeyCheck(){
		if(on_key[65])moveChar(-1,0);//a
		if(on_key[83])moveChar(0,1);//s
		if(on_key[68])moveChar(1,0);//d
		if(on_key[87])moveChar(0,-1);//w
	}

	function moveChar(mx,my){
		//console.log(mx+my);
		var xx = MainChara.x;
		//console.log(xx);
		if(canMove(mx,my)){
			MainChara.x += mx;
			MainChara.y += my;
		}
		console.log("now "+MainChara.x+" "+MainChara.y);
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

	function drawMap(){
		var ax = 155;
		var ay = 80;
		ctx.fillStyle = '#ddd';
		ctx.fillRect(ax,ay-55,w-2*ax+5,h-2*ay+5);

		var sx = 165;
		var sy = 35;
		var cx = MainChara.x | 0;
		var cy = MainChara.y | 0;
		var mx = cx - 9;
		var my = cy - 8;
		for(var i = 0; i < 19; i++){
			for(var j = 0; j < 17; j++){
				if(mx<0)
					mx = 0;
				if(mx+19>50)
					mx = 31;
				if(my<0)
					my = 0;
				if(my+17>50)
					my = 33;
				var xx = mx+i;
				var yy = my+j;
				if(cx == xx && cy == yy){
					ctx.fillStyle = '#a00';
				}else if(map[xx][yy]){
					ctx.fillStyle = '#a0a';
				}else{
					ctx.fillStyle = '#aa0';
				}
				ctx.fillRect(i*25+sx,j*25+sy,24,24);
			}
		}

	}

	function drawMenu(){
		var ax = 150;
		var ay = 100;
		ctx.fillStyle = '#ddd';
		//ctx.fillRect(ax,ay-50,w-2*ax,h-2*ay);

	}

	function drawChar(){

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
	};

	document.onkeyup = function (e){
		var key = e.keyCode;
		on_key[key] = false;
	};
	
})();