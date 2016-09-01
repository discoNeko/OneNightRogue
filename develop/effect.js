
	// effect method
	//////////////////////////////////////////////////////////////////////////////

	//effect 初期化
	function setEffect(){
		for(var i = 0; i < eff_num; i++){
			eff[i] = new Effect();
		}
	}

	function addEnemyDamagedEffect(n){
		var x = Enemy[n].x;
		var y = Enemy[n].y;
		addEffect(x,y,40,40,5,2,0);
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
		//dash x
		if(n<4){
			n = d/2-1;
			if(n==1 || n==2){
				addEffect(x-60,y-15,150,50,n,2,0);
				addEffect(x-60,y-20,150,50,n,2,0);
				addEffect(x-60,y-5,150,50,n,2,0);
				addEffect(x-60,y,150,50,n,2,0);
				return 0;
			}
			//dash y
			if(n==0 || n==3){
				addEffect(x-15,y-60,50,150,n,2,0);
				addEffect(x-20,y-60,50,150,n,2,0);
				addEffect(x-5,y-60,50,150,n,2,0);
				addEffect(x,y-60,50,150,n,2,0);
				return 0;
			}
		}

		if(n==4){
			x = MainChara.x-75;
			y = MainChara.y-30;
			addEffect(x,y,180,100,n,2,0);
			addEffect(x,y-35,180,100,n,2,0);
			addEffect(x-35,y+20,180,100,n,2,0);
			addEffect(x+35,y+20,180,100,n,2,0);

			addEffect(x,y+35,180,100,n,3,15);
			addEffect(x-35,y-20,180,100,n,3,15);
			addEffect(x+35,y-20,180,100,n,3,15);
			
			addEffect(x,y-35-35,180,100,n,3,40);
			addEffect(x-35-35,y+20+20,180,100,n,3,40);
			addEffect(x+35+35,y+20+20,180,100,n,3,40);
			return 0;
		}
		if(n==6){
			addEffect(x-50,y-40,120,80,n,2,0);
		}
	}

	//effect 追加
	function addEffect(x,y,sx,sy,n,spd,delay){
		//x,y : dot 座標
		//n : effect　番号
		//sx,sy : 描画サイズ
		//spd : 描画速度
		//delay : 描画遅延
		for(var i = 0; i < eff_num; i++){
			if(!eff[i].exist){
				eff[i].exist = true;
				eff[i].x = x;//dot 座標 表示位置 x
				eff[i].y = y;//dot 座標 表示位置 y
				eff[i].sizex = sx;//effectの描画サイズ
				eff[i].sizey = sy;//effectの描画サイズ
				eff[i].num = n;
				eff[i].img.src = 'eff/eff'+n+'.png';
				var div = divEffect(n);//分割数
				eff[i].divx = div.x;
				eff[i].divy = div.y;
				eff[i].width = Math.floor(eff[i].img.width/div.x);//横 : 一コマあたりの大きさ
				eff[i].height = Math.floor(eff[i].img.height/div.y);//縦 : 一コマあたりの大きさ
				//console.log(eff[i].width+" "+eff[i].height);
				if(spd<1)spd = 1;
				eff[i].spd = spd;
				eff[i].delay = delay;
				eff[i].mwait = 0;
				eff_on = true;
				break;
			}
		}
	}

	//あとでjson読み込み式にする
	function divEffect(n){
		var width = 1, height = 1;
		switch(n){
			case 0 :
				width = 9;
				height = 1;
				break;
			case 1 :
				width = 9;
				height = 1;
				break;
			case 2 :
				width = 9;
				height = 1;
				break;
			case 3 :
				width = 9;
				height = 1;
				break;
			case 4 :
				width = 1;
				height = 9;
				break;
			case 5 :
				width = 5;
				height = 1;
				break;
			case 6 :
				width = 7;
				height = 1;
				break;
		}
		return {x:width,y:height};
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

		for(var i = 0; i < eff_num; i++){
			if(eff[i].exist){
				if(eff[i].delay>0){
					eff[i].delay--;
					continue;
				}
				//console.log(i);
				eff[i].mwait ++;
				var ew = eff[i].width;
				var eh = eff[i].height;
				var edx = eff[i].divx;
				var edy = eff[i].divy;
				var emw = eff[i].mwait;
				var es = eff[i].spd;
				//描画対象コマを計算
				var massx = Math.floor(emw/es)%edx;
				var massy = Math.floor(Math.floor(emw/es)/edx);
				//ソース画像の切り出し位置
				var src_sx = massx * ew;
				var src_sy = massy * eh;
				//描画位置
				var dx = sx + eff[i].x - xx;
				var dy = sy + eff[i].y - yy;
				//console.log(massx+" "+massy+" "+src_sx+" "+src_sy+" "+" "+dx+" "+dy+" "+eff[i].sizex+" "+eff[i].sizey);
				ctx.drawImage(eff[i].img,src_sx,src_sy,ew,eh,dx,dy,eff[i].sizex,eff[i].sizey);

				if(emw>=edx*edy*es-1)
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