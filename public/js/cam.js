 
(function (app) {
	var cam, intervalId, canvas, canvasCtx, ascii, btnStart, btnStop;
/*
	var loopSpeed = 300;
	var width = 160;
	var height = 120;*/
	var res_div = 2;
	var loopSpeed = 1000/10;  //FPS
	var width = 160/res_div;
	var height = 120/res_div/1.5;
	var record=false;
	var mirrored=false; //flip img horizontally
	var white_on_black = false; //reverse color of cam stream
	var ascii_style = 'signs';
	var styles = { //charachters, from lightest to darkest perceptive value
	  lines: '▁▂▃▄▅▆▇',
	  classic: ' `:*+#W@',
	  signs: ' .:-=+*#%@',
	  pat: ' ░▒▓█',
	  signs2: " .',;\"oO%8@#"

          
	  
	}
	
	/*
  # = 23
      @ = 40
      8 = 38
      % = 25
      O = 4F
      o = 6F
      " = 22
      ; = 3B
      , = 2C
      ' = 27
      . = 2E
        = 20*/
        
	recordedFrames = [];
	
	var chars = styles[ascii_style].split(''); ///line styles

 app.init = function () {
		//Get all the page element we need
        cam = document.getElementById('cam');
        ascii = document.getElementById("asciiText");
		    canvas = document.createElement("canvas");
		    canvasCtx = canvas.getContext("2d");
		    btnStart = document.getElementById('startbtn');
        btnStop = document.getElementById('stopbtn');
        
        //Init events
        btnStart.addEventListener('click',app.startCam);
        btnStop.addEventListener('click',app.stopCam);
        
        /*
        btnExpand = document.getElementById('expand');
        btnExpand.addEventListener('click',function(ev){
          //console.log('btn');
          if(! $('body').hasClass('cam') ){
            app.startCam(ev)
          }else{
            app.stopCam(ev)
          }
          
        });*/
 };

 app.startCam = function (e) {
      clearInterval(intervalId);//get rid of playing loop.
		// Get specific vendor methods
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

		// If browser supports user media
		if (navigator.getUserMedia) {
			navigator.getUserMedia({video: true, toString: function() { return "video"; } },
				function successCallback(stream) {
					if(navigator.getUserMedia==navigator.mozGetUserMedia) {
						cam.src = stream;
					} else {
						cam.src = window.URL.createObjectURL(stream) || stream;
					}
					cam.play();
					intervalId = setInterval(app.loop, loopSpeed);
					btnStart.style.display = "none";
					btnStop.style.display = "inline-block";
					$('body').addClass('cam');
				},
				function errorCallback(error) {
					alert("An error ocurred getting user media. Code:" + error.code);
				});
		}else{
			//Browser doesn't support user media
			alert("Your browser does not support user media");
		}
		e.preventDefault();
 };




 app.stopCam = function (e) {
		clearInterval(intervalId);
		cam.src = "";
		if(e) e.preventDefault();
		btnStop.style.display = "none";
		btnStart.style.display = "inline-block";
		$('body').removeClass('cam');
		if(record) $('#recordedFrames').removeClass('hidden').html(JSON.stringify(recordedFrames));  //if we were recording, output to a textarea!
    };

//The generation of the ascii text was taken from this great sample from thecodeplayer:
//http://thecodeplayer.com/walkthrough/cool-ascii-animation-using-an-image-sprite-canvas-and-javascript
    
 app.playSequence = function(arSequence){
      //app.stopCam();//if it was already playin...
      	clearInterval(intervalId);
      sequenceCounter = 30;
      intervalId = setInterval(function() { 
        if(sequenceCounter++ >= arSequence.length-1) {sequenceCounter=30;}
        app.showFrame( arSequence[sequenceCounter] ); 
        }, loopSpeed);
 };
    
app.showFrame = function (frameSTR) {
  ascii.innerHTML = frameSTR;
};
    
    
app.loop = function () {
		var r, g, b, gray, shade,frameSTR;
		var character, line = "";//clear canvas
		canvasCtx.clearRect (0, 0, width, height);	//draw the video frame
		canvasCtx.drawImage(cam, 0, 0, width, height);//accessing pixel data
		var pixels = canvasCtx.getImageData(0, 0, width, height);
		var colordata = pixels.data;
		ascii.innerHTML = ''; //clear contents
		var shade_increments = 255/ (chars.length-1);
		frameSTR = '';
		for(var i = 0; i < colordata.length; i = i+4){
			r = colordata[i];
			g = colordata[i+1];
			b = colordata[i+2];
			//converting the pixel into grayscale
			gray = r*0.2126 + g*0.7152 + b*0.0722;//??: would it be faster to skip these math and use a single channel?
			shade = Math.round(gray / shade_increments);
	
			if(!white_on_black){
			  character = chars[chars.length  -1- shade ] || '?';
			}else{
			  character = chars[shade] || '?';
			}

			//newlines and injection into dom
			if(i !== 0 && (i/4)%width === 0){ //if the pointer reaches end of pixel-line
			  frameSTR +=line+'<br>'; //only for saving purpose, slower than DOM object...
			  line = "";//emptying line for the next row of pixels.
			  //ascii.appendChild(document.createTextNode(line)); //newline
        //ascii.appendChild(document.createElement("br"));
			}
			if(mirrored){ //append char to line
			  line =  character + line;
			}else{
			  line += character;
			}
		}//eo for loop
		now.showFrame( JSON.stringify(frameSTR), 'xxx'); //send to server!!
		app.showFrame(frameSTR);
		
		if(record) recordedFrames.push(frameSTR);
};
    
app.init();

}(window.asciicam = window.asciicam || {}));