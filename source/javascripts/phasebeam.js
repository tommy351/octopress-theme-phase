(function($){
	var canvas = $('#phasebeam').children('canvas'),
		background = canvas[0],
		foreground = canvas[1],
		config = {
			fps: 16,
			circle: {
				amount: 24,
				layer: 3,
				color: [157, 97, 207],
				alpha: 0.3
			},
			line: {
				amount: 12,
				layer: 3,
				color: [255, 255, 255],
				alpha: 0.3
			},
			speed: 1,
			angle: 20
		};

	if (foreground.getContext){
		var bctx = background.getContext('2d'),
			fctx = foreground.getContext('2d'),
			degree = config.angle/360*Math.PI*2,
			circles = lines = timer = [],
			wWidth, wHeight;

		var setCanvasHeight = function(){
			wWidth = $(window).width();
			wHeight = $(window).height(),

			background.width = wWidth;
			background.height = wHeight;
			foreground.width = wWidth;
			foreground.height = wHeight;
		};

		var drawCircle = function(x, y, radius, color, alpha){
			var gradient = fctx.createRadialGradient(x, y, radius, x, y, 0);
			gradient.addColorStop(0, 'rgba('+color[0]+','+color[1]+','+color[2]+','+alpha+')');
			gradient.addColorStop(1, 'rgba('+color[0]+','+color[1]+','+color[2]+','+(alpha-0.1)+')');

			fctx.beginPath();
			fctx.arc(x, y, radius, 0, Math.PI*2, true);
			fctx.fillStyle = gradient;
			fctx.fill();
		};

		var drawLine = function(x, y, width, color, alpha){
			var endX = x+Math.sin(degree)*width,
				endY = y-Math.cos(degree)*width,
				gradient = fctx.createLinearGradient(x, y, endX, endY);
			gradient.addColorStop(0, 'rgba('+color[0]+','+color[1]+','+color[2]+','+alpha+')');
			gradient.addColorStop(1, 'rgba('+color[0]+','+color[1]+','+color[2]+','+(alpha-0.1)+')');

			fctx.beginPath();
			fctx.moveTo(x, y);
			fctx.lineTo(endX, endY);
			fctx.lineWidth = 3;
			fctx.lineCap = 'round';
			fctx.strokeStyle = gradient;
			fctx.stroke();
		};

		var drawBack = function(){
			bctx.clearRect(0, 0, wWidth, wHeight);

			var gradient = [];
			
			gradient[0] = bctx.createRadialGradient(wWidth*0.3, wHeight*0.1, 0, wWidth*0.3, wHeight*0.1, wWidth*0.9);
			gradient[0].addColorStop(0, 'rgb(0, 26, 77)');
			gradient[0].addColorStop(1, 'transparent');

			bctx.translate(wWidth, 0);
			bctx.scale(-1,1);
			bctx.beginPath();
			bctx.fillStyle = gradient[0];
			bctx.fillRect(0, 0, wWidth, wHeight);

			gradient[1] = bctx.createRadialGradient(wWidth*0.1, wHeight*0.1, 0, wWidth*0.3, wHeight*0.1, wWidth);
			gradient[1].addColorStop(0, 'rgb(0, 150, 240)');
			gradient[1].addColorStop(0.8, 'transparent');

			bctx.translate(wWidth, 0);
			bctx.scale(-1,1);
			bctx.beginPath();
			bctx.fillStyle = gradient[1];
			bctx.fillRect(0, 0, wWidth, wHeight);

			gradient[2] = bctx.createRadialGradient(wWidth*0.1, wHeight*0.5, 0, wWidth*0.1, wHeight*0.5, wWidth*0.5);
			gradient[2].addColorStop(0, 'rgb(40, 20, 105)');
			gradient[2].addColorStop(1, 'transparent');

			bctx.beginPath();
			bctx.fillStyle = gradient[2];
			bctx.fillRect(0, 0, wWidth, wHeight);
		};

		var animate = function(){
			fctx.clearRect(0, 0, wWidth, wHeight);
			if (config.circle.amount > 0 && config.circle.layer > 0){
				for (var i=0; i<circles.length; i++){
					var item = circles[i];
					if (item.x > wWidth + item.radius){
						item.x = -item.radius;
					} else if (item.x < -item.radius){
						item.x = wWidth + item.radius
					} else {
						item.x = item.x+Math.sin(degree)*item.speed;
					}

					if (item.y > wHeight + item.radius){
						item.y = -item.radius;
					} else if (item.y < -item.radius){
						item.y = wHeight + item.radius;
					} else {
						item.y = item.y-Math.cos(degree)*item.speed;
					}

					drawCircle(item.x, item.y, item.radius, item.color, item.alpha);
				}
			}

			if (config.line.amount > 0 && config.line.layer > 0){
				for (var j=0; j<lines.length; j++){
					var item = lines[j];
					if (item.x > wWidth + item.width * Math.sin(degree)){
						item.x = -item.width * Math.sin(degree);
					} else if (item.x < -item.width * Math.sin(degree)){
						item.x = wWidth + item.width * Math.sin(degree);
					} else {
						item.x = item.x+Math.sin(degree)*item.speed;
					}

					if (item.y > wHeight + item.width * Math.cos(degree)){
						item.y = -item.width * Math.cos(degree);
					} else if (item.y < -item.width * Math.cos(degree)){
						item.y = wHeight + item.width * Math.cos(degree);
					} else {
						item.y = item.y-Math.cos(degree)*item.speed;
					}
					
					drawLine(item.x, item.y, item.width, item.color, item.alpha);
				}
			}
		};

		var draw = function(){
			circles = [];
			lines = [];

			if (config.circle.amount > 0 && config.circle.layer > 0){
				for (var i=0; i<config.circle.amount/config.circle.layer; i++){
					for (var j=0; j<config.circle.layer; j++){
						circles.push({
							x: Math.random() * wWidth,
							y: Math.random() * wHeight,
							radius: Math.random()*(20+j*5)+(20+j*5),
							color: config.circle.color,
							alpha: Math.random()*0.2+(config.circle.alpha-j*0.1),
							speed: config.speed*(1+j*0.5)
						});
					}
				}
			}

			if (config.line.amount > 0 && config.line.layer > 0){
				for (var m=0; m<config.line.amount/config.line.layer; m++){
					for (var n=0; n<config.line.layer; n++){
						lines.push({
							x: Math.random() * wWidth,
							y: Math.random() * wHeight,
							width: Math.random()*(20+n*5)+(20+n*5),
							color: config.line.color,
							alpha: Math.random()*0.2+(config.line.alpha-n*0.1),
							speed: config.speed*(1+n*0.5)
						});
					}
				}
			}

			clearInterval(timer[0]);
			timer[0] = setInterval(animate, 1000 / config.fps);
			drawBack();
		};

		$(document).ready(function(){
			setCanvasHeight();
			draw();
		});
		$(window).resize(function(){
			setCanvasHeight();
			clearTimeout(timer[1]);
			timer[1] = setTimeout(draw, 500);
		});
	}
})(jQuery);