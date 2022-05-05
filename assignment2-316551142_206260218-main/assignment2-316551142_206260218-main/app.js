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
const keys={"left":37, "right":39, "up":38,"down":40}
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
var places=[[0,0],[0,9],[9,0],[9,9]];


$(document).ready(function() {
	context = canvas.getContext("2d");
	$('#welcome').removeClass('operation');
	tabs= document.querySelectorAll('.tab');
	ghosts=document.querySelectorAll('.imgGhost');
	// Start();
});

function Start() {
	board = new Array();
	score = 0;
	ghostArray=[];
	pac_color = "yellow";
	var cnt = 100;
	var pacman_remain = 1;
	var foodS=parseInt(food_remain*0.6);
	var foodM=parseInt(food_remain*0.3);
	var foodL=parseInt(food_remain*0.1);
	start_time = new Date();
	for (let i=0;i<10;i++){
		board[i] = new Array();
		for (let j=0;j<10;j++)
			board[i][j]=0;
	}
	for (var i = 0; i < 10; i++) {
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 10; j++) {
			if (
				(i == 3 && j == 3) ||
				(i == 3 && j == 4) ||
				(i == 3 && j == 5) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2)
			) {
				board[i][j] = 4; //גבולות
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
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2;
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
	// while(ghosts_remain>0){
	// 	var emptyCell = findRandomEmptyCell(board);
	// 	board[emptyCell[0]][emptyCell[1]] = 6;
	// 	ghosts_remain--;
	// 	let g=new Object();
	// 	g.i=emptyCell[0];
	// 	g.j=emptyCell[1];
	// 	ghostArray.push(g);
	// }
	for (let q=0;q<ghosts_remain;q++){
		let g=new Object();
		board[places[q][0]][places[q][1]] = 6;
		g.i=places[q][0];
		g.j=places[q][1];
		ghostArray.push(g);
	}
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
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
	interval = setInterval(UpdatePosition, 500);
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
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
	colorGhosts=["red","#FF9500","#00D5FF","#F2CFE8"];
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
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
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = large; //color
				context.fill();
				context.fillStyle = "white";
				context.fillText('25', center.x-5, center.y+5);
			} else if (board[i][j] == 4) { //גבולות
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}else if (board[i][j] == 3) {//אוכל
				context.beginPath();
				context.arc(center.x, center.y, 8, 0, 2 * Math.PI); // circle
				context.fillStyle = small; //color
				context.fill();
				context.fillStyle = "white";
				context.fillText('5', center.x-2, center.y+3);
			} else if (board[i][j] == 5) {//אוכל
				context.beginPath();
				context.arc(center.x, center.y, 12, 0, 2 * Math.PI); // circle
				context.fillStyle = medium; //color
				context.fill();
				context.fillStyle = "white";
				context.fillText('15', center.x-5, center.y+3);
			} 
			else if(board[i][j]==6){//מפלצות
				let c=colorGhosts[0];
				colorGhosts.shift();
				let feet =  4;
				let head_radius = 20 * 0.8;//16
				let foot_radius = head_radius / feet;//4
				context.save();
				context.strokeStyle =  "black";
				context.fillStyle = c;
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
		}
	}
}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	let x = GetKeyPressed();
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
			direct=x;
		}
	}
	if (x == 2) {
		if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
			direct=x;
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
			direct=x;
		}
	}
	if (x == 4) {
		if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
			direct=x;
		}
	}
	for (let k=0;k<parseInt(numberOfGhosts);k++){
		board[ghostArray[k].i][ghostArray[k].j]=0;
		let dx=ghostArray[k].i-shape.i;
		let dy=ghostArray[k].j-shape.j;
		if (Math.abs(dx)<Math.abs(dy) && dx!=0){
			if (dx>0 && board[ghostArray[k].i - 1][ghostArray[k].j] != 4)
				ghostArray[k].i--;
			else if(board[ghostArray[k].i + 1][ghostArray[k].j] != 4)
				ghostArray[k].i++;
		}
		else{
			if (dy==0){
				if (dx>0 && board[ghostArray[k].i - 1][ghostArray[k].j] != 4)
					ghostArray[k].i--;
				else if(board[ghostArray[k].i + 1][ghostArray[k].j] != 4)
					ghostArray[k].i++;
			}
			else{
				if (dy>0 && board[ghostArray[k].i][ghostArray[k].j-1] != 4)
					ghostArray[k].j--;
				else if(board[ghostArray[k].i][ghostArray[k].j+1] != 4)
					ghostArray[k].j++;
			}
		}
		if(ghostArray[k].i==shape.i &&ghostArray[k].j==shape.j){
			score-=10;
			for (let a=0;a<parseInt(numberOfGhosts);a++){
				board[ghostArray[a].i][ghostArray[a].j]=0;
				ghostArray[a].i=places[a][0];
				ghostArray[a].j=places[a][1];
				board[ghostArray[a].i][ghostArray[a].j]=6;
			}
			break;
		}
		board[ghostArray[k].i][ghostArray[k].j]=6;
	}
	if (board[shape.i][shape.j] == 1) {
		score+=25;
	}
	if (board[shape.i][shape.j] == 3) {
		score+=5;
	}
	if (board[shape.i][shape.j] == 5) {
		score+=15;
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	// if (time_elapsed >=timeforfinish && tabActive==="game"){
	// 	console.log("finish game");
	// 	changeOperator("welcome");
	// }
	// if (score >= 20 && time_elapsed <= 10) {
	// 	pac_color = "green";
	// }
	// if (score == 50) {
	// 	window.clearInterval(interval);
	// 	window.alert("Game completed");
	// } else {
		Draw(direct);
	// }
}





var Days = [31,28,31,30,31,30,31,31,30,31,30,31];// index => month [0-11]
$(document).ready(function(){
    var option = '<option value="day">day</option>';
    var selectedDay="day";
    for (var i=1;i <= Days[0];i++){ //add option days
        option += '<option value="'+ i + '">' + i + '</option>';
    }
    $('#day').append(option);
    $('#day').val(selectedDay);

    var option = '<option value="month">month</option>';
    var selectedMon ="month";
    for (var i=1;i <= 12;i++){
        option += '<option value="'+ i + '">' + i + '</option>';
    }
    $('#month').append(option);
    $('#month').val(selectedMon);

    var option = '<option value="month">month</option>';
    var selectedMon ="month";
    for (var i=1;i <= 12;i++){
        option += '<option value="'+ i + '">' + i + '</option>';
    }
    $('#month2').append(option);
    $('#month2').val(selectedMon);
  
    var d = new Date();
    var option = '<option value="year">year</option>';
    selectedYear ="year";
    for (var i=1930;i <= d.getFullYear();i++){// years start i
        option += '<option value="'+ i + '">' + i + '</option>';
    }
    $('#year').append(option);
    $('#year').val(selectedYear);
});
function isLeapYear(year) {
    year = parseInt(year);
    if (year % 4 != 0) {
	      return false;
	  } else if (year % 400 == 0) {
	      return true;
	  } else if (year % 100 == 0) {
	      return false;
	  } else {
	      return true;
	  }
}

function change_year(select)
{
    if( isLeapYear( $(select).val() ) )
	  {
		    Days[1] = 29;
    }
    else {
        Days[1] = 28;
    }
    if( $("#month").val() == 2)
		    {
			       var day = $('#day');
			       var val = $(day).val();
			       $(day).empty();
			       var option = '<option value="day">day</option>';
			       for (var i=1;i <= Days[1];i++){ //add option days
				         option += '<option value="'+ i + '">' + i + '</option>';
             }
			       $(day).append(option);
			       if( val > Days[ month ] )
			       {
				          val = 1;
			       }
			       $(day).val(val);
		     }
  }

function change_month(select) {
    var day = $('#day');
    var val = $(day).val();
    $(day).empty();
    var option = '<option value="day">day</option>';
    var month = parseInt( $(select).val() ) - 1;
    for (var i=1;i <= Days[ month ];i++){ //add option days
        option += '<option value="'+ i + '">' + i + '</option>';
    }
    $(day).append(option);
    if( val > Days[ month ] )
    {
        val = 1;
    }
    $(day).val(val);
}



function CheckDetails(){
	let confirm=true;
	if(!$('#username').val()){
		$('#username').css("border-color", "#FF0000");
		$('#username').css("border-radius", "10px");
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
		console.log("yes")
	}

	if(confirm){
		users[$('#username').val()]=$('#password').val();
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
		console.log("yes");
	}
	else{
		window.alert("The user or the password are incorrect");
	}
}


function setKey(direction){
	$('#myModal').css("display","block");
	$(document).one('keydown', (event) => {
		keys[direction]=event.keyCode;
		$('#myModal').css("display","none");
		let n='#'+direction;
		document.querySelector(n).innerHTML=event.key;
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



function changeOperator(op){
	tabs.forEach(t => t.classList.add('operation'));
	document.querySelector(`#${op}`).classList.remove('operation');
	tabActive=op;
	if (op==="definition"){
		ghosts.forEach(t => t.classList.add('imgGhosts'));
		document.querySelector(`.imgGhosts${numberOfGhosts}`).classList.remove('imgGhosts');
	}
}



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
	tabs.forEach(t => t.classList.add('operation'));
	document.querySelector(`#game`).classList.remove('operation');
	tabActive="game";
	Start();
};