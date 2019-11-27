


window.onload = function(){
	document.getElementById("userInput").focus();
};



// Set the default argMap (and arrays)
var argMap = currentWords;
var keysArray;
var valuesArray;
function setArrays(mapToUse){
	keysArray = Object.keys(mapToUse);
	valuesArray = Object.values(mapToUse);
}
setArrays(argMap);


var mode = 'span2eng';
var currentWord = keysArray[Math.floor(Math.random()*keysArray.length)];
document.getElementById("currentWordDiv").innerHTML = "<h4>" + currentWord + "</h4>";


var inputTextField = document.getElementById("userInput");
var streak = 0;
var highScore = 0;
var misses = [];

renderHighScore();

function changeArgMap(chosenWords){
	argMap = chosenWords;
	setArrays(argMap);
	resetCurrentWord();
	inputTextField.focus();
}

function checkAnswer(mapToUse){
	var userInput = inputTextField.value.toLowerCase();
	// If user accidentally presses enter twice, do nothing
	if (userInput == "" || userInput == null){
		return;
	}
	
	// SPANISH TO ENGLISH MODE (Key to value)--------------------------------
	if (mode == "span2eng"){
		// If user enters correct answer:
		if (userInput == mapToUse[currentWord].toLowerCase()){
			document.getElementById("resultsDiv").innerHTML = "<p style='color:#666'>Correct!</p>";
			streak += 1;
			renderStreak(streak);
			renderHighScore();
			resetCurrentWord();
			resetInput();
		// If user is wrong:
		} else {
			document.getElementById("resultsDiv").innerHTML = "<p><strong style='color:salmon'>Wrong!</strong> The correct answer was: <em style='font-size: 20px;color:#666;padding: 1px 6px 1px 6px'>" + mapToUse[currentWord] + "</em></p>";	
			streak = 0;
			renderStreak(streak);
			//misses.push(currentWord + " - " + mapToUse[currentWord] + ". You said: " + userInput);
			misses.push({"currentWord": currentWord, "translation": mapToUse[currentWord], "userInput": userInput});
			renderMisses();
			resetCurrentWord();
			resetInput();
		}	
	// ENGLISH TO SPANISH MODE (Value to key)--------------------------------
	} else if (mode == "eng2span"){
		var currentMatchingKeysArray = getKeysByValue(mapToUse, currentWord);
		var cmkaToString = currentMatchingKeysArray.join(', ');
		console.log(currentMatchingKeysArray);
		// If user enters correct answer:
		if (currentMatchingKeysArray.includes(userInput)){
			document.getElementById("resultsDiv").innerHTML = "<p style='color:#666;display:inline-block'>Correct!</p>";
			if (currentMatchingKeysArray.length > 1){
				document.getElementById("resultsDiv").innerHTML += "<p style='color:#666;display:inline-block;padding-left:10px'><span style='background-color:aqua;padding:1px 5px 1px 5px'>All correct answers:</span> <strong>" + cmkaToString + "</strong></p>";				
			}
			streak += 1;
			renderStreak(streak);
			renderHighScore();
			resetCurrentWord();
			resetInput();
		// If user is wrong:
		} else {
			document.getElementById("resultsDiv").innerHTML = "<p><strong style='color:salmon'>Wrong!</strong> The correct answer was: <em style='font-size:20px;color:#666;padding: 1px 6px 1px 6px'>" + currentMatchingKeysArray.join(" or ") + "</em></p>";	
			streak = 0;
			renderStreak(streak);
			//misses.push(currentWord + " - " + currentMatchingKeysArray.join(" or ") + ". You said: " + userInput);
			misses.push({"currentWord": currentWord, "translation": currentMatchingKeysArray.join(" or "), "userInput": userInput})
			renderMisses();
			resetCurrentWord();
			resetInput();
		}	
	}
}

function resetInput(){
	inputTextField.value = "";
	inputTextField.focus();
}

function resetCurrentWord(){
	if (mode == 'span2eng'){
		currentWord = keysArray[Math.floor(Math.random()*keysArray.length)];	
	} else if (mode == 'eng2span'){
		currentWord = valuesArray[Math.floor(Math.random()*valuesArray.length)];	
	}
	
	//Check if the list of words actually has any words in it currently
	if (typeof currentWord == 'undefined'){
		document.getElementById("currentWordDiv").innerHTML = "<h4>" + "No words" + "</h4>";
	} else {
		document.getElementById("currentWordDiv").innerHTML = "<h4>" + currentWord + "</h4>";
	}
}

function renderMisses(){
	document.getElementById("missesDiv").innerHTML = "<h3>Misses</h3>";
	for (var i = 0; i < misses.length; i++){
		//document.getElementById("missesDiv").innerHTML += "<p>"+ misses[i] +"</p>";		
		console.log(misses[i]);
		document.getElementById("missesDiv").innerHTML += 
			"<div style='font-weight:bold;font-size:16px;background-color:#999;color:#fff;padding-left:5px;border-bottom:.5px solid #fff'>" + misses[i].currentWord + "</div>" +
			"<div style='margin-left: 18px;font-weight:bold'>" + misses[i].translation + "</div>" +
			"<div style='width:260px'>You said: <span style='color:salmon;font-size:16px'>" + misses[i].userInput + "</span></div><br>";
	}
}

function renderStreak(streakNumber){
	if (streakNumber == 0){
		document.getElementById("streakDiv").innerHTML = "<p>Streak: <span id='streakNumber' style='color:#fff;background-color:salmon'>" + streakNumber + "</span></p>";
	} else {
		document.getElementById("streakDiv").innerHTML = "<p>Streak: <span id='streakNumber' style='background-color:aqua'>" + streakNumber + "</span></p>";	
	}
}

function renderHighScore(){
	console.log("streak: " + streak);
	console.log("high score: " + highScore);
	if (streak > highScore) {
		highScore = streak;
		document.getElementById("highScoreDiv").innerHTML = "<p style='background-color:aqua;padding:2px 10px 2px 7px;font-size:34px;color:#fff'>" + highScore + "</p>";
	}
}

// If user presses Enter key instead of clicking Submit button
document.getElementById("userInput").addEventListener("keyup", function(event){
	event.preventDefault();
	if(event.keyCode === 13){
		checkAnswer(argMap);
	}
});

function setMode(modeChoice){
	// If user selects already current mode, do nothing
	if (modeChoice == mode){
		resetInput();
	} else if (modeChoice == 'span2eng'){
		// Set the global variable
		mode = 'span2eng';
				
		// Set the mode header
		document.getElementById("modeDiv").innerHTML = "";
		document.getElementById("modeDiv").innerHTML = "<h2>Spanish to English</h2>";
		
		// Set the current word
		currentWord = keysArray[Math.floor(Math.random()*keysArray.length)];
		document.getElementById("currentWordDiv").innerHTML = "<h4>" + currentWord + "</h4>";
		
		// Return focus to the text input
		resetInput();
		
	} else if (modeChoice == 'eng2span'){
		// Set the global variable
		mode = 'eng2span';
		
		// Set the mode header
		document.getElementById("modeDiv").innerHTML = "";
		document.getElementById("modeDiv").innerHTML = "<h2>English to Spanish</h2>";
		
		// Set the current word
		currentWord = valuesArray[Math.floor(Math.random()*valuesArray.length)];
		document.getElementById("currentWordDiv").innerHTML = "<h4>" + currentWord + "</h4>";
		
		// Return focus to the text input
		resetInput();
	}
}

// Helper function to get all keys from a value (Every key is unique, but there can be multiple matching values)
function getKeysByValue(theObject, theValue){
	var matchingKeys = [];
	for(var key in theObject){
		if(theObject[key] == theValue){
			matchingKeys.push(key.toLowerCase());
		}
	}
	return matchingKeys;
}





// Toggle which buttons show as active/inactive
$('.langBtn').click(function(){
	if ( ! $(this).hasClass('currentLangBtn') ){
		$(this).toggleClass('currentLangBtn');	
		$(this).siblings().removeClass('currentLangBtn');
	}
});

$('.listBtn').click(function(){
	if ( ! $(this).hasClass('currentListBtn') ){
		$(this).toggleClass('currentListBtn');	
		$(this).siblings().removeClass('currentListBtn');
	}	
});








