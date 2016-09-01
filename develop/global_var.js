(function(){
	//game display num
	var w = 800, h = 600;
	var requestId;
	var floor = 0;
	var hunt = 0;
	var dig = 0;

	//game static num
	var cROW = 250;//chip map size : x
	var cCOL = 250;//chip map size : y
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
		this.img.src = 'eff/eff0.png';
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

		this.name = "sample";
		this.hp = 100;
		this.mn = 80;
		this.hung = 100;
		this.steps = 0;
		this.exp = 0;
		
		this.exist = true;
		this.img_num = 1;
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

		this.damaged = 0;

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

	var dIMG_num = 3;
	var dIMG = [];



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
	var rm_stacks = 0;//現在の予約済み数
	var rm_exist = false;//予約が存在するかどうか
	var rm_num = 500;//最大予約数
	var rm = [];
	for(var i = 0; i < rm_num; i++)
		rm[i] = new rMove();

	//reserved attack
	var rAttack = function (){
		this.sx = 0;
		this.sy = 0;
		this.gx = 0;
		this.gy = 0;
		this.dmg = 0;
		this.delay = 0;
		this.done = false;
	}
	var ra_stacks = 0;//現在の予約済み数
	var ra_exist = false;//予約が存在するかどうか
	var ra_num = 500;//最大予約数
	var ra = [];
	for(var i = 0; i < ra_num; i++)
		ra[i] = new rAttack();

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
})();