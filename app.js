var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var food_remain=50;
var ghosts_remain;

const users={};
users["k"]="k";
const keys={"left":37, "right":39, "up":38,"down":40};
var username;
var large="blue";
var small="green";
var medium="red";
var tabs;
var tabActive="welcome"
var ghosts;
var numberOfGhosts=1;
var timeforfinish=60;
var direct=4;
var colorGhosts=["red","#FF9500","#00D5FF","#F2CFE8"];
var ghostArray=[];
var places=[[0,0],[15,0],[0,7],[15,7]];
var borders=[[1,1],[1,2],[1,3],[2,1],[2,2],[1,6],[5,0],[5,1],[3,5],[3,6],[3,7],[4,3],[5,3],[5,4],[5,5],[5,6],[6,6],[7,2],[7,3],[8,1],[8,2],[8,7],[10,0],[10,3],[10,4],[10,5],[9,5],[12,1],[13,1],[14,1],[14,2],[14,3],[12,4],[12,5],[12,6],[12,7],[14,6]];
var startKey=false;
var lives=5;
var cherries =new Object();
var medicineLives=new Object();
var medicineGhost=new Object();
var countfreeGhost=26;
var hiddenGhost=false;
var eye=false;
var intervalGhost;
var intervalChrries;
var objWellcom;
var objCherry;
var objDeath;
var objEatfood;
var objFreeghost;
var objGhosteat;
var slowMotion=new Object();
var countInterval=10;
var food;


$(document).ready(function() {
	context = canvas.getContext("2d");
	$('#welcome').removeClass('operation');
	$('#game').removeClass('gameT');
	tabs= document.querySelectorAll('.tab');
	ghosts=document.querySelectorAll('.imgGhost');
	objWellcom=document.getElementById("start");
	objWellcom.loop="loop";
	objWellcom.volume=0.2;
	objCherry=document.getElementById("cherry");
	objDeath=document.getElementById("death");
	objEatfood=document.getElementById("eatfood");
	objFreeghost=document.getElementById("freeghost");
	objFreeghost.volume=0.5;
	objGhosteat=document.getElementById("ghosteat");
	// Start();
});

function randomPosition(){
	let x=Math.floor(Math.random()*13)+1;
	let y=Math.floor(Math.random()*5)+1;
	while(borders.some(r=> r.every((value, index) => [x,y][index] == value))){
		x=Math.floor(Math.random()*13)+1;
		y=Math.floor(Math.random()*5)+1;
	}
	return [x,y];
}

function Start() {
	objWellcom.play();
	board = new Array();
	score = 0;
	ghostArray=[];
	countfreeGhost=26;
	countInterval=10;
	startKey=false;
	hiddenGhost=false;
	pac_color = "yellow";
	lives=5;
	var cnt = 128;
	var foodS=parseInt(food_remain*0.6);
	var foodM=parseInt(food_remain*0.3);
	var foodL=parseInt(food_remain*0.1);
	food=foodS+foodM+foodL;
	start_time = new Date();
	for (let i=0;i<16;i++){
		board[i] = new Array();
		for (let j=0;j<8;j++)
			board[i][j]=0;
	}

	let pos=randomPosition();
	shape.i = pos[0];
	shape.j = pos[1];
	shape.dead=0;
	board[pos[0]][pos[1]] = 2;

	pos=randomPosition();
	cherries.i=pos[0];
	cherries.j=pos[1];
	cherries.eaten=false;
	cherries.last=null;

	pos=randomPosition();
	medicineLives.i=pos[0];
	medicineLives.j=pos[1];
	medicineLives.eaten=false;

	pos=randomPosition();
	medicineGhost.i=pos[0];
	medicineGhost.j=pos[1];
	medicineGhost.eaten=false;


	// pos=randomPosition();
	// slowMotion.i=pos[0];
	// slowMotion.j=pos[1];
	// slowMotion.eaten=false;
	// board[slowMotion.i][slowMotion.j] = 10;

	for (var i = 0; i < 16; i++) {
		for (var j = 0; j < 8; j++) {
			if (borders.some(r=> r.every((value, index) => [i,j][index] == value))) {
				board[i][j] = 4; 
			} else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;
					var rNum=Math.floor(Math.random()*2)+1;
					if (rNum===1 && foodS>0){
						foodS--;
						board[i][j] = 3;
					}
					if (rNum===2 && foodL>0){
						foodL--;
						board[i][j] = 1;
					}
					if(rNum===3 && foodM>0){
						foodM--;
						board[i][j] = 5;
					}
				} 
				cnt--;
			}
		}
	}
	while (foodL > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		foodL--;
		food_remain--;
	}

	while (foodS > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 3;
		foodS--;
		food_remain--;
	}
	while (foodM > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 5;
		foodM--;
		food_remain--;
	}
	pos=findRandomEmptyCell(board);
	slowMotion.i=pos[0];
	slowMotion.j=pos[1];
	slowMotion.eaten=false;
	board[slowMotion.i][slowMotion.j] = 10;

	for (let q=0;q<ghosts_remain;q++){
		let g=new Object();
		g.i=places[q][0];
		g.j=places[q][1];
		g.color=colorGhosts[q];
		g.num=q+6;
		g.last=null;
		ghostArray.push(g);
	}
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
			if([32, 37, 38, 39, 40].some(c => c === e.keyCode)) {
				e.preventDefault();
			}
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	interval = setInterval(UpdatePosition, 200);
	intervalGhost = setInterval(UpdatePositionGhost, 400);
	intervalChrries = setInterval(UpdatePositionChrries, 600);
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 16);
	var j = Math.floor(Math.random() * 8);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 16);
		j = Math.floor(Math.random() * 8);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[keys["up"]]) {
		return 1;
	}
	if (keysDown[keys["down"]]) {
		return 2;
	}
	if (keysDown[keys["left"]]) {
		return 3;
	}
	if (keysDown[keys["right"]]) {
		return 4;
	}
}

function Draw(x) {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	l="";
	for (var i=0; i<lives;i++){
		l+="&#128151";

	}
	document.getElementById('lblLives').innerHTML="Lives:"+l ;
	context.lineWidth = 5;
	context.strokeStyle="rgb(0, 126, 151)";
	context.strokeRect(0,0,965,485);
	var center = new Object();
	for (var i = 0; i < 16; i++) {
		for (var j = 0; j < 8; j++) {
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) { //פאקמן
				switch(x){
					case 1:
						context.beginPath();
						context.arc(center.x,center.y, 30, 1.35 * Math.PI, 1.65 * Math.PI,true); // half circle
						context.lineTo(center.x,center.y);
						context.fillStyle = "yellow"; //color
						context.fill();
						context.beginPath();
						context.arc(center.x -14, center.y-3, 5, 0, 2 * Math.PI); // circle
						context.fillStyle = "black"; //color
						context.fill();
						break;
					case 2:
						context.beginPath();
						context.arc(center.x,center.y, 30, 0.35 * Math.PI, 0.65 * Math.PI,true); // half circle
						context.lineTo(center.x,center.y);
						context.fillStyle = "yellow"; //color
						context.fill();
						context.beginPath();
						context.arc(center.x -14, center.y+2, 5, 0, 2 * Math.PI); // circle
						context.fillStyle = "black"; //color
						context.fill();
						break;
					case 3:
						context.beginPath();
						context.arc(center.x,center.y, 30, 0.85 * Math.PI, 1.15 * Math.PI,true); // half circle
						context.lineTo(center.x,center.y);
						context.fillStyle = "yellow"; //color
						context.fill();
						context.beginPath();
						context.arc(center.x - 1, center.y - 15, 5, 0, 2 * Math.PI); // circle
						context.fillStyle = "black"; //color
						context.fill();
						break;
					case 4:
						context.beginPath();
						context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
						context.lineTo(center.x, center.y);
						context.fillStyle = pac_color; //color
						context.fill();
						context.beginPath();
						context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
						context.fillStyle = "black"; //color
						context.fill();
						break;
					default:
						console.log(x);
				}
				
			} else if (board[i][j] == 1) {//אוכל
				context.beginPath();
				context.arc(center.x+3, center.y-2, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = large; //color
				context.fill();
				context.fillStyle = "black";
				context.font = "16px Arial";
				context.fillText('25', center.x-5, center.y+5);
			} else if (board[i][j] == 4) { //גבולות
				context.beginPath();
				context.rect(center.x - 26, center.y - 26, 46, 46);
				context.stroke()
				context.fillStyle = "#b0e0e6d1";; //color
				context.fill();
				context.lineWidth = 4;
				context.strokeStyle="rgba(0, 126, 151, 0.68)";
				context.stroke();
			}else if (board[i][j] == 3) {//אוכל
				context.beginPath();
				context.arc(center.x+2, center.y-2, 8, 0, 2 * Math.PI); // circle
				context.fillStyle = small; //color
				context.fill();
				context.fillStyle = "black";
				context.font = "12px Arial";
				context.fillText('5', center.x-2, center.y+3);
			} else if (board[i][j] == 5) {//אוכל
				context.beginPath();
				context.arc(center.x+3, center.y-3, 12, 0, 2 * Math.PI); // circle
				context.fillStyle = medium; //color
				context.fill();
				context.fillStyle = "black";
				context.font = "14px Arial";

				context.fillText('15', center.x-5, center.y+3);
			} 
		}
	}
	if (medicineLives.eaten==false){
		center.x = medicineLives.i * 60 + 30;
		center.y = medicineLives.j * 60 + 30;
		context.clearRect(medicineLives.i * 60,medicineLives.j * 60,60,60);
		context.beginPath();
		context.ellipse(center.x, center.y, 10, 20, Math.PI / 4, 0,  Math.PI,true);
		context.fillStyle='red';
		context.fill();
		context.closePath();
		context.beginPath();
		context.ellipse(center.x, center.y, 10, 20, Math.PI / 4, 0,  Math.PI);
		context.fillStyle='white';
		context.fill();
		context.closePath();
	}
	if (medicineGhost.eaten==false){
		center.x = medicineGhost.i * 60 + 30;
		center.y = medicineGhost.j * 60 + 30;
		context.clearRect(medicineGhost.i * 60,medicineGhost.j * 60,60,60);
		context.beginPath();
		context.ellipse(center.x, center.y, 10, 20, Math.PI / 4, 0,  Math.PI,true);
		context.fillStyle='green';
		context.fill();
		context.closePath();
		context.beginPath();
		context.ellipse(center.x, center.y, 10, 20, Math.PI / 4, 0,  Math.PI);
		context.fillStyle='white';
		context.fill();
		context.closePath();
	}

	if (slowMotion.eaten==false){
		center.x = slowMotion.i * 60 + 30;
		center.y = slowMotion.j * 60 + 30;
		context.beginPath();
		context.fillStyle="white";
		context.arc(center.x,center.y, 25, 0, 2 * Math.PI);//100, 75
		context.font = "14px Arial";
		context.fillText("slow", center.x-16,center.y-8);//83, 65
		context.fillText("motion", center.x-21,center.y+9);//80, 85
		context.lineWidth = 5;
		context.strokeStyle="white";
		context.stroke();
	}


	for (let i=1;i<numberOfGhosts;i++){
		center.x = ghostArray[i].i * 60 + 30;
		center.y = ghostArray[i].j * 60 + 30;
		let feet =  4;
		let head_radius = 20 * 0.8;//16
		let foot_radius = head_radius / feet;//4
		context.save();
		context.strokeStyle =  "black";
		context.fillStyle = ghostArray[i].color;
		if(hiddenGhost==true){
			context.fillStyle="#0108D5";
		}
		context.lineWidth = 20 * 0.05;
		context.beginPath();
        context.arc(center.x+12,center.y+16,foot_radius, 0, Math.PI);
        context.arc(center.x+4,center.y+16,foot_radius, 0, Math.PI);
        context.arc(center.x-4,center.y+16,foot_radius, 0, Math.PI);
        context.arc(center.x-12,center.y+16,foot_radius, 0, Math.PI);
		context.lineTo(center.x-head_radius, center.y+20 - foot_radius);
		context.arc(center.x+0, center.y+head_radius - 20, head_radius, Math.PI, 2 * Math.PI);
		context.closePath();
		context.fill();
		context.stroke();
		
		context.fillStyle = "white";
		context.beginPath();
		context.arc(center.x+-head_radius / 2.5,center.y -head_radius / 2, head_radius / 3, 0, 2 * Math.PI);
		context.fill();
		context.beginPath();
		context.arc(center.x+head_radius / 3.5, center.y-head_radius / 2, head_radius / 3, 0, 2 * Math.PI);
		context.fill();
							   
		context.fillStyle = "black";
		context.beginPath();
		context.arc(center.x-head_radius / 2, center.y-head_radius / 2.2, head_radius / 8, 0, 2 * Math.PI);
		context.fill();
		context.beginPath();
		context.arc(center.x+head_radius / 4, center.y-head_radius / 2.2, head_radius / 8, 0, 2 * Math.PI);
		context.fill();
	}

	//special ghost
	center.x = ghostArray[0].i * 60 + 30;
	center.y = ghostArray[0].j * 60 + 30;
	let head_radius = 15;
	let foot_radius = 5;
	context.save();
	context.strokeStyle =  "black";
	if(hiddenGhost==true){
		context.fillStyle="#0108D5";
	}
	else
	context.fillStyle =getRandomColor();
	context.lineWidth = 20 * 0.05;
	context.beginPath();
	context.arc(center.x+10,center.y+16,foot_radius, 0, Math.PI);
	context.arc(center.x,center.y+16,foot_radius, 0, Math.PI);
	context.arc(center.x-10,center.y+16,foot_radius, 0, Math.PI);
	context.lineTo(center.x-head_radius, center.y+20 - foot_radius);
	context.arc(center.x+0, center.y+head_radius - 20, head_radius, Math.PI, 2 * Math.PI);
	context.closePath();
	context.fill();
	context.stroke();

	context.fillStyle = "white";
	context.beginPath();
	context.arc(center.x,center.y -head_radius / 4, head_radius / 1.5, 0, 2 * Math.PI);
	context.fill();
	
	context.fillStyle = "black";
	context.beginPath();
	if (eye){
		context.arc(center.x-head_radius / 6, center.y-head_radius / 7, head_radius / 3.5, 0, 2 * Math.PI);
		eye=!eye;
	}
	else{
		context.arc(center.x+head_radius / 6, center.y-head_radius / 7, head_radius / 3.5, 0, 2 * Math.PI);
		eye=!eye;
	}
	context.fill();


	if (cherries.eaten==false){
		center.x = cherries.i * 60 + 30;
		center.y = cherries.j * 60 + 30;
		context.clearRect(cherries.i * 60+1,cherries.j * 60+1,58,58);
		context.beginPath();
		let radius=10;
		context.moveTo(center.x-10, center.y);
    	context.bezierCurveTo(center.x, center.y-35, center.x+15, center.y-25, center.x+20, center.y-20);
    	context.lineWidth = 1;
		context.strokeStyle = '#006600';
    	context.stroke();
		context.beginPath();
    	context.arc(center.x-10, center.y, radius, 0, 2 * Math.PI, false);
    	context.fillStyle = 'red';
    	context.fill();
     	context.lineWidth = 1;
    	context.strokeStyle = '#000000';
    	context.stroke();
		context.beginPath();
      	context.moveTo(center.x,center.y+4);
      	context.bezierCurveTo(center.x, center.y-28, center.x+10, center.y-25, center.x+20, center.y-20);
      	context.lineWidth = 1;
	  	context.strokeStyle = '#006600';
      	context.stroke();

      	context.beginPath();
      	context.arc(center.x,center.y+4, radius, 0, 2 * Math.PI, false);
      	context.fillStyle = 'red';
      	context.fill();
 		context.lineWidth = 1;
      	context.strokeStyle = '#000000';
      	context.stroke();
	}
	
}

function checkGhost(x,y){
	for (let i=0;i<numberOfGhosts;i++){
		if (ghostArray[i].i==x && ghostArray[i].j==y)
			return false;
	}
	return true;
}

function UpdatePositionGhost(){
	for (let k=0;k<parseInt(numberOfGhosts);k++){
		let dx=ghostArray[k].i-shape.i;
		let dy=ghostArray[k].j-shape.j;
		let r=Math.random();
		let locations={};
		if (ghostArray[k].i>0 &&  board[ghostArray[k].i-1][ghostArray[k].j]!=4 && (ghostArray[k].last!="right" ) && checkGhost(ghostArray[k].i-1,ghostArray[k].j))
			locations["left"]=[-1,0];
		if (ghostArray[k].i<15 &&  board[ghostArray[k].i+1][ghostArray[k].j]!=4 && (ghostArray[k].last!="left") && checkGhost(ghostArray[k].i+1,ghostArray[k].j))
			locations["right"]=[1,0];
		if (ghostArray[k].j>0 &&  board[ghostArray[k].i][ghostArray[k].j-1]!=4 && (ghostArray[k].last!="down") && checkGhost(ghostArray[k].i,ghostArray[k].j-1))
			locations["up"]=[0,-1];
		if (ghostArray[k].j<7 &&  board[ghostArray[k].i][ghostArray[k].j+1]!=4 && (ghostArray[k].last!="up") && checkGhost(ghostArray[k].i,ghostArray[k].j+1))
			locations["down"]=[0,1];
		console.log("locB",locations);
		if (Object.keys(locations).length==0)
		{
			if (ghostArray[k].i>0 &&  board[ghostArray[k].i-1][ghostArray[k].j]!=4 && checkGhost(ghostArray[k].i-1,ghostArray[k].j))
				locations["left"]=[-1,0];
			if (ghostArray[k].i<15 &&  board[ghostArray[k].i+1][ghostArray[k].j]!=4 && checkGhost(ghostArray[k].i+1,ghostArray[k].j))
				locations["right"]=[1,0];
			if (ghostArray[k].j>0 &&  board[ghostArray[k].i][ghostArray[k].j-1]!=4 && checkGhost(ghostArray[k].i,ghostArray[k].j-1))
				locations["up"]=[0,-1];
			if (ghostArray[k].j<7 &&  board[ghostArray[k].i][ghostArray[k].j+1]!=4 && checkGhost(ghostArray[k].i,ghostArray[k].j+1))
				locations["down"]=[0,1];	
		}
		let index;
		let key;
		let pos;
		
		while (Object.keys(locations).length>0){
			index=Math.floor(Math.random()*Object.keys(locations).length);
			key=Object.keys(locations)[index];
			pos=locations[key];
			if (Math.abs(ghostArray[k].i+pos[0] - shape.i) < Math.abs(ghostArray[k].i - shape.i) ||
			Math.abs(ghostArray[k].j+pos[1] - shape.j) < Math.abs(ghostArray[k].j - shape.j)){
				break;
			}
			if (Object.keys(locations).length>1)
				delete locations[key];
			else break;
		}
		console.log("locA",locations);
		if (pos==undefined || Object.keys(locations).length===0)
			continue;
		ghostArray[k].i+=pos[0];
		ghostArray[k].j+=pos[1];
		ghostArray[k].last=key;	
		console.log("ghost",ghostArray[k]);
	}
}

function UpdatePositionChrries(){
	let locations={};
	if (cherries.i>0 &&  board[cherries.i-1][cherries.j]!=4)
		locations["left"]=[-1,0];
	if (cherries.i<15 &&  board[cherries.i+1][cherries.j]!=4)
		locations["right"]=[1,0];
	if (cherries.j>0 &&  board[cherries.i][cherries.j-1]!=4)
		locations["up"]=[0,-1];
	if (cherries.j<7 &&  board[cherries.i][cherries.j+1]!=4)
		locations["down"]=[0,1];
	let index=Math.floor(Math.random()*Object.keys(locations).length);
	let key=Object.keys(locations)[index];
	cherries.i+=locations[key][0];
	cherries.j+=locations[key][1];	
}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	let x = GetKeyPressed();
	if (x==undefined &&startKey)
		x=direct;
	let flag=false;
	for (let k=0;k<numberOfGhosts;k++){
		if(hiddenGhost==false){

			/*&&(( ghostArray[k].i==shape.i &&ghostArray[k].j+1==shape.j && x==1) ||
			(ghostArray[k].i==shape.i &&ghostArray[k].j-1==shape.j && x==2)||
			(ghostArray[k].i+1==shape.i &&ghostArray[k].j==shape.j && x==3)||
			(ghostArray[k].i-1==shape.i &&ghostArray[k].j==shape.j && x==4)||
			(ghostArray[k].i==shape.i &&ghostArray[k].j==shape.j))*/
			let bingo=false;
			if (ghostArray[k].i==shape.i &&ghostArray[k].j+1==shape.j && x==1){
				bingo=true;
				if (board[ghostArray[k].i][ghostArray[k].j]==1 || board[ghostArray[k].i][ghostArray[k].j]==3 || board[ghostArray[k].i][ghostArray[k].j]==5)
					food--;
			}
			else if(ghostArray[k].i==shape.i &&ghostArray[k].j-1==shape.j && x==2){
				bingo=true;
				if (board[ghostArray[k].i][ghostArray[k].j]==1 || board[ghostArray[k].i][ghostArray[k].j]==3 || board[ghostArray[k].i][ghostArray[k].j]==5)
					food--;
			}
			else if(ghostArray[k].i+1==shape.i &&ghostArray[k].j==shape.j && x==3){
				bingo=true;
				if (board[ghostArray[k].i][ghostArray[k].j]==1 || board[ghostArray[k].i][ghostArray[k].j]==3 || board[ghostArray[k].i][ghostArray[k].j]==5)
					food--;
			}
			else if(ghostArray[k].i-1==shape.i &&ghostArray[k].j==shape.j && x==4){
				bingo=true;
				if (board[ghostArray[k].i][ghostArray[k].j]==1 || board[ghostArray[k].i][ghostArray[k].j]==3 || board[ghostArray[k].i][ghostArray[k].j]==5)
					food--;
			}
			else if(ghostArray[k].i==shape.i &&ghostArray[k].j==shape.j)
				bingo=true;
			if (bingo){

			if(ghostArray[k].num==6){ //ghost's special
				score-=10;
				lives--;
			}
			score-=10;
			lives--;
			shape.dead++;
			if (lives<=0){
				objDeath.play();
				$('#over').css("display","block");
				window.clearInterval(interval);
				window.clearInterval(intervalChrries);
				window.clearInterval(intervalGhost);
				objWellcom.pause();
			}
			startKey=false;
			for (let a=0;a<parseInt(numberOfGhosts);a++){
				ghostArray[a].i=places[a][0];
				ghostArray[a].j=places[a][1];
				ghostArray[a].last=null;
			}
			
			let m=Math.floor(Math.random()*14)+1;
			let n=Math.floor(Math.random()*6)+1;
			while(board[m][n]!=0){
				m=Math.floor(Math.random()*14)+1;
				n=Math.floor(Math.random()*6)+1;
			}
			shape.i = m;
			shape.j = n;
			board[shape.i][shape.j]=2;
			objGhosteat.play();
			flag=true;
		}
		}
	}
	if (flag==false && x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
			direct=x;
			startKey=true;
		}
	}
	if (flag==false && x == 2) {
		if (shape.j < 7 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
			direct=x;
			startKey=true;
		}
	}
	if (flag==false && x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
			direct=x;
			startKey=true;
		}
	}
	if (flag==false && x == 4) {
		if (shape.i < 15 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
			direct=x;
			startKey=true;
		}
	}	
	
	if(cherries.eaten==false && ((cherries.i==shape.i &&cherries.j==shape.j)||
	(cherries.i==shape.i && cherries.j==shape.j+1 && direct==1)||
	(cherries.i==shape.i && cherries.j==shape.j-1 && direct==2)||
	(cherries.j==shape.j && cherries.i==shape.i+1 && direct==3)||
	(cherries.j==shape.j && cherries.i==shape.i-1 && direct==4))){
		score+=50;
		cherries.eaten=true;
		objCherry.play();
	}

	if (hiddenGhost){
		countfreeGhost--;
	}
	if (countfreeGhost==0){
		hiddenGhost=false;
	}
	if (slowMotion.eaten){
		countInterval--;
	}
	if (countInterval==0){
		window.clearInterval(intervalGhost);
		intervalGhost = setInterval(UpdatePositionGhost, 400);
	}


	if (medicineLives.i==shape.i && medicineLives.j==shape.j && medicineLives.eaten==false){
		lives++;
		medicineLives.eaten=true;
	}
	if (slowMotion.i==shape.i && slowMotion.j==shape.j && slowMotion.eaten==false){
		slowMotion.eaten=true;
		window.clearInterval(intervalGhost);
		intervalGhost = setInterval(UpdatePositionGhost, 800);
	}
	if (countfreeGhost==26 && medicineGhost.i==shape.i && medicineGhost.j==shape.j && medicineGhost.eaten==false){
		hiddenGhost=true;
		medicineGhost.eaten=true;
		objFreeghost.play();
	}
	if (board[shape.i][shape.j] == 1) {
		score+=25;
		food--;
		if (!hiddenGhost){
		objEatfood.play();
		}
	}
	if (board[shape.i][shape.j] == 3) {
		food--;
		if (!hiddenGhost){
			objEatfood.play();
			}
		score+=5;
	}
	if (board[shape.i][shape.j] == 5) {
		food--;
		if (!hiddenGhost){
			objEatfood.play();
			}
		score+=15;
	}
	if (food==0){
		window.clearInterval(interval);
		window.clearInterval(intervalChrries);
		window.clearInterval(intervalGhost);
		objWellcom.pause();
		$('#winner').css("display","block");
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (time_elapsed >=timeforfinish && tabActive==="game"){
		if (score<100){
			// window.alert(`You are better than ${score} points!`);
			$('#betterP').text(`than ${score} points!`);
			$('#better').css("display","block");
		}
		else{
			$('#winner').css("display","block");
		}
		window.clearInterval(interval);
		window.clearInterval(intervalChrries);
		window.clearInterval(intervalGhost);
		objWellcom.pause();
		// changeOperator("welcome");
	}
	Draw(direct);
}





function CheckDetails(){
	let confirm=true;
	if(!$('#username').val()){
		$('#username').css("border-color", "#FF0000");
		confirm=false;
	}
	if($('#day').val()==="day" || $('#year').val()==="year" || $('#month').val()==="month"){
		confirm=false;
	}
	if(!$('#fullname').val()){
		$('#fullname').css("border-color", "#FF0000");
		confirm=false;
	}
	if(!$('#email').val()){
		$('#email').css("border-color", "#FF0000");
		confirm=false;
	}
	let passw1=/[A-Za-z]/g;
	let passw2=/[1-9]/g; 
	if ( $('#password').val().match(passw1)==null || $('#password').val().match(passw2)==null){
		confirm=false;
	}
	if($('#password').val().length<6){
		$('#password').val('');
	}
	if(!$('#password').val()){
		$('#password').css("border-color", "#FF0000");
		confirm=false;
	}
	if ($('#fullname').val().match(passw2)!==null)
	{
		confirm=false;
	}
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	if (!emailReg.test( $('#email').val() )){
	}

	if (!$('#birthday').val()){
		$('#birthday').css("border-color", "#FF0000");
		confirm=false;
	}


	if(confirm){
		users[$('#username').val()]=$('#password').val();
		tabs.forEach(t => t.classList.add('operation'));
		clearTextRegister();
		document.querySelector(`#login`).classList.remove('operation');
	}
}

function startWrite(field){
	$(`#${field}`).css("border-color", "black");
}


function login(){
	let confirm=true;
	if(!$('#usernamelogin').val()){
		$('#usernamelogin').css("border-color", "#FF0000");
		$('#usernamelogin').css("border-radius", "10px");
		$('#usernamelogin').prop('placeholder',"Please fill in the required field");
		confirm=false;
	}
	if(!$('#passwordlogin').val()){
		$('#passwordlogin').css("border-color", "#FF0000");
		$('#passwordlogin').prop('placeholder',"Please fill in the required field");
		confirm=false;
	}

	if (confirm && users[$('#usernamelogin').val()]===$('#passwordlogin').val()){
		tabs.forEach(t => t.classList.add('operation'));
		username=$('#usernamelogin').val();
		clearTextLogin();
		document.querySelector(`#definition`).classList.remove('operation');
		ghosts.forEach(t => t.classList.add('imgGhosts'));
		document.querySelector(`.imgGhosts${numberOfGhosts}`).classList.remove('imgGhosts');
	}
	else{
		window.alert("The user or the password are incorrect");
	}
}


function setKey(direction){
	$('#pressKey').css("display","block");
	$(document).one('keydown', (event) => {
		keys[direction]=event.keyCode;
		$('#pressKey').css("display","none");
		let n='#'+direction;
		switch(event.keyCode){//[32, 37, 38, 39, 40]
			case 37:
				document.querySelector(n).innerHTML='&larr;';
				break;
			case 38:
				document.querySelector(n).innerHTML='&uarr;';
				break;
			case 39:
				document.querySelector(n).innerHTML='&rarr;';
				break;
			case 40:
				document.querySelector(n).innerHTML='&darr;';
				break;
			default:
				document.querySelector(n).innerHTML=event.key;
		}
	});
}


function changeNumber(val){
	document.querySelector('.foodAns').textContent = val;
	food_remain=val;
}


function setColor(val,type){
	switch (type){
		case "s":
			small=val;
			break;
		case "m":
			medium=val;
			break;
		case "l":
			large=val;
	}
}

function clearTextLogin(){
	$('#usernamelogin').val('');
	$('#passwordlogin').val('');
	$(`#usernamelogin`).css("border-color", "black");
	$(`#passwordlogin`).css("border-color", "black");
	$('#usernamelogin').prop('placeholder',"");
	$('#passwordlogin').prop('placeholder',"");
}

function clearTextRegister(){
	$('#username').val('');
	$('#password').val('');
	$('#fullname').val('');
	$('#email').val('');
	$(`#username`).css("border-color", "black");
	$(`#password`).css("border-color", "black");
	$(`#fullname`).css("border-color", "black");
	$(`#email`).css("border-color", "black");
	$(`#birthday`).css("border-color", "black");
}


function changeOperator(op){
	$('#over').css("display","none");
	$('#winner').css("display","none");
	$('#better').css("display","none");
	$('#game').removeClass('gameT');
	if (op!="about")
		tabs.forEach(t => t.classList.add('operation'));
	document.querySelector(`#${op}`).classList.remove('operation');
	if (tabActive==="game"){
		window.clearInterval(interval);
		window.clearInterval(intervalChrries);
		window.clearInterval(intervalGhost);
		objWellcom.pause();
		objCherry.pause();
		objFreeghost.pause();
		objDeath.pause();
		objEatfood.pause();
		objGhosteat.pause();
	}
	if (tabActive=="login"){
		clearTextLogin();
	}
	if (tabActive=="register"){
		clearTextRegister();
	}
	if (op!="about")
		tabActive=op;
}

$(document).keydown(function(e) {
	console.log("yes");
    if (e.keyCode === 27) {
        document.querySelector("#about").classList.add('operation');
    }
});


function changeGhosts(val){
	ghosts.forEach(t => t.classList.add('imgGhosts'));
	document.querySelector(`.imgGhosts${val}`).classList.remove('imgGhosts');
	ghosts_remain=val;
	numberOfGhosts=val;
}


function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
	  color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
  }

function randomChange(){
	//food
	let numf=Math.floor(Math.random()*40)+50;
	document.querySelector(".numberBalls").value=numf;
	document.querySelector('.foodAns').textContent = numf;
	timeforfinish=numf;

	//time
	let numt=Math.floor(Math.random()*240)+60;
	document.querySelector(".finishtime").value=numt;
	document.querySelector('.timeAns').textContent = numt;
	timeforfinish=numt;

	//colors 
	let randomColor=getRandomColor();
	document.querySelector("#colorSmall").value=randomColor;
	setColor(randomColor,"s");
	randomColor=getRandomColor();
	document.querySelector("#colorMedium").value=randomColor;
	setColor(randomColor,"m");
	randomColor=getRandomColor();
	document.querySelector("#colorLarge").value=randomColor;
	setColor(randomColor,"l");

	//ghosts
	let numg=Math.floor(Math.random()*4)+1;
	document.querySelector(".numberGhosts").value=numg;
	ghosts.forEach(t => t.classList.add('imgGhosts'));
	document.querySelector(`.imgGhosts${numg}`).classList.remove('imgGhosts');
	ghosts_remain=numg;
	numberOfGhosts=numg;
}


function setTime(val){
	document.querySelector('.timeAns').textContent = val;
	timeforfinish=val;
}


function startGame(){
	food_remain=$('.numberBalls').val();
	small=$('#colorSmall').val();
	medium=$('#colorMedium').val();
	large=$('#colorLarge').val();
	timeforfinish=$('.finishtime').val();
	ghosts_remain=$('.numberGhosts').val();
	numberOfGhosts=ghosts_remain;
	$('#myUp').text(document.querySelector("#up").innerHTML);
	$('#myDown').text(document.querySelector("#down").innerHTML);
	$('#myLeft').text(document.querySelector("#left").innerHTML);
	$('#myRight').text(document.querySelector("#right").innerHTML);
	$('#myFood').text(`Food: ${food_remain}`);
	$('#mySmall').css("color",small);
	$('#myMedium').css("color",medium);
	$('#myLarge').css("color",large);
	$('#myTime').text(`Game's duration: ${timeforfinish}`);
	$('#myGhost').text(`Ghosts: ${ghosts_remain}`);
	$('#myName').text(`User: ${username}`);
	$('#lblName').text(`User: ${username}`);
	tabs.forEach(t => t.classList.add('operation'));
	document.querySelector(`#game`).classList.add('gameT');
	tabActive="game";
	Start();
};



window.onclick = function(event) {
	if (event.target == document.getElementById("about")) {
		document.querySelector("#about").classList.add('operation');
	}
	if (event.target == document.getElementById("pressKey")){
		$('#pressKey').css("display","none");
	}
}

function closeAbout() {
	document.querySelector("#about").classList.add('operation');
}

function closeKey() {
	document.querySelector("#pressKey").style.display = "none";
	
}

function closeGame(){
	document.querySelector("#over").style.display="none";
	document.querySelector("#winner").style.display="none";
	document.querySelector("#better").style.display="none";
	changeOperator("welcome");
}
