

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

		//if(eff_on)
		//	drawEffect();

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
		updateEnemyDamagedEffect();
		runReservedMove();
		runReservedAttack();
	}

	function runReservedAttack(){
		var done = true;
		for(var i = 0; i < ra_stacks; i++){
			if(!ra[i].done){
				done = false;
				if(ra[i].delay>0){
					ra[i].delay--;
				}else{
					ra[i].done = true;
					calcEnemyHitAoE(ra[i].sx,ra[i].sy,ra[i].gx,ra[i].gy,ra[i].dmg);
				}
			}
		}
		// garbage collection
		if(done){
			ra_stacks = 0;
		}
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
		// garbage collection
		if(done){
			rm_stacks = 0;
		}
	}

	function updateEnemyDamagedEffect(){
		for(var i = 0; i < e_num; i++){
			if(Enemy[i].damaged>0)
				Enemy[i].damaged -= 5;
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
		//i
		if(on_key[73]){
			if(MainChara.attack_interval==0 && rm_stacks==0){
				insertMes("flash！　");
				flash();
			}
		}
		//o
		if(on_key[79]){
			if(MainChara.attack_interval==0 && rm_stacks==0){
				insertMes("回転！　");
				rotate();
			}
		}
		//p
		if(on_key[80]){
			if(MainChara.attack_interval==0 && rm_stacks==0){
				if(message[0].indexOf('ダッシュ！') != -1){
					insertMes("ダッシュ！　");
				}else{
					addMes("ダッシュ！　");
				}
				slash();
			}
		}
	}
