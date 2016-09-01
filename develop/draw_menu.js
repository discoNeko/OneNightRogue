
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
			ctx.fillRect(sx+Math.floor(100*Enemy[0].x/25/cROW)-2,sy+Math.floor(100*Enemy[0].y/25/cCOL)-2,4,4);
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
