
	//
	function addReservedAttack(sx,sy,gx,gy,dmg,delay){
		//sx,sy,gx,gy : 攻撃範囲
		//dmg : ダメージ量
		//delay : 遅延フレーム数

		//stacks 数以上の登録は弾く
		if(ra_stacks >= ra_num)
			return 0;

		ra[ra_stacks].sx = sx;
		ra[ra_stacks].sy = sy;
		ra[ra_stacks].gx = gx;
		ra[ra_stacks].gy = gy;
		ra[ra_stacks].dmg = dmg;
		ra[ra_stacks].delay = delay;
		ra[ra_stacks].done = false;
		ra_stacks++;
	}

	//行動予約によって
	//移動アニメーションを実現
	function addReservedMove(x,y,s,cnt){
		//x,y : 移動方向
		//s : 移動量
		//cnt : 繰り返し回数

		//stacks 数以上の登録は弾く
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
