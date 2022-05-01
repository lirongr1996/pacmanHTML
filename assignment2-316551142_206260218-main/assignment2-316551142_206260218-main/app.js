var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var food_remain=50;
var ghosts_remain=1;

const users={};
users["k"]="k";
const keys={"left":37, "right":39, "up":38,"down":40}
var large="blue";
var small="green";
var medium="red";
var tabs;
var ghosts;


$(document).ready(function() {
	context = canvas.getContext("2d");
	$('#welcome').removeClass('operation');
	tabs= document.querySelectorAll('.tab');
	ghosts=document.querySelectorAll('.imgGhosts');
	Start();
});

function Start() {
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 100;
	var pacman_remain = 1;
	var foodS=parseInt(food_remain*0.6);
	var foodM=parseInt(food_remain*0.3);
	var foodL=parseInt(food_remain*0.1);
	start_time = new Date();
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
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
					if (rNum===1){
						foodS--;
						board[i][j] = 3;
					}
					if (rNum===2){
						foodL--;
						board[i][j] = 1;
					}
					if(rNum===3){
						foodM--;
						board[i][j] = 5;
					}
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2;
				} else {
					board[i][j] = 0;
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
	while(ghosts_remain>0){
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 6;
		ghosts_remain--;
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
	interval = setInterval(UpdatePosition, 250);
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
	if (keysDown[38]) {
		return 1;
	}
	if (keysDown[40]) {
		return 2;
	}
	if (keysDown[37]) {
		return 3;
	}
	if (keysDown[39]) {
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) { //פאקמן
				context.beginPath();
				context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
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
				// var img = new Image();
				// img.onload = function() {
				// 	context.drawImage(img, i+60,j+60,30,30);
				//   };
				//   img.src = 'img/1ghosts.jpg';
			}
		}
	}
}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (x == 2) {
		if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (x == 4) {
		if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
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
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if (score == 50) {
		window.clearInterval(interval);
		window.alert("Game completed");
	} else {
		Draw();
	}
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
		$('#username').prop('placeholder',"Please fill in the required field");
		confirm=false;
	}
	if($('#day').val()==="day" || $('#year').val()==="year" || $('#month').val()==="month"){
		confirm=false;
	}
	if(!$('#fullname').val()){
		$('#fullname').css("border-color", "#FF0000");
		$('#fullname').prop('placeholder',"Please fill in the required field");
		confirm=false;
	}
	if(!$('#email').val()){
		$('#email').css("border-color", "#FF0000");
		$('#email').prop('placeholder',"Please fill in the required field");
		confirm=false;
	}
	let passw1=/[A-Za-z]/g;
	let passw2=/[1-9]/g; 
	if ( $('#password').val().match(passw1)==null || $('#password').val().match(passw2)==null){
		$('#password').prop('placeholder',"Password must contain at least one character and one digit");
		confirm=false;
	}
	if($('#password').val().length<6){
		$('#password').val('');
		$('#password').prop('placeholder',"Password must contain at least six characters");
	}
	if(!$('#password').val()){
		$('#password').css("border-color", "#FF0000");
		$('#password').prop('placeholder',"Please fill in the required field");
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
	console.log(small);
}



function changeOperator(op){
	console.log(op);
	console.log(tabs);
	tabs.forEach(t => t.classList.add('operation'));
	console.log(document.querySelector(`#${op}`));
	document.querySelector(`#${op}`).classList.remove('operation');
	if (op==="definition"){
		document.querySelector(`.imgGhosts1`).classList.remove('imgGhosts');
	}
}

function changeGhosts(val){
	ghosts.forEach(t => t.classList.add('imgGhosts'));
	console.log(val);
	console.log(document.querySelector(`.imgGhosts${val}`));
	document.querySelector(`.imgGhosts${val}`).classList.remove('imgGhosts')
	ghosts_remain=val;
}