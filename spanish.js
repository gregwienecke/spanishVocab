


window.onload = function(){
	document.getElementById("userInput").focus();
};



// Set the default argMap (and arrays)
var argMap = currentWords;
var keysArray;
var valuesArray;
var sessionHistoryArray = new Array();
function setArrays(mapToUse){
	keysArray = Object.keys(mapToUse);
	valuesArray = Object.values(mapToUse);
}
setArrays(argMap);


var mode = 'span2eng';
var currentWord = keysArray[Math.floor(Math.random()*keysArray.length)];
addToSessionHistory(currentWord);
console.log("To view all words used during the current session, call the viewSessionHistory() function");
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

		//Before doing the regular check, check if a slash is involved in the answer and check accordingly:
		//currentWord gives the *key* but user will be entering definition which is the corresponding *value* (so mapToUse[currentWord])
		//Check if both the current word and user input contain a slash. No need to check for other cases; if user doesn't enter the right input, it will be caught in the next condition.
		if (stringContainsOneSlash(mapToUse[currentWord]) && stringContainsOneSlash(userInput)){
			//If yes, separate the words into respective arrays
			var currentWordsArray = separateWords(mapToUse[currentWord]);
			var userInputWordsArray = separateWords(userInput);
			
			//For each word in the currentWordsArray, check if there is a match in the userInputWordsArray.
			var count = 0;
			for (var i=0; i < currentWordsArray.length; i++){
				for (var j=0; j <userInputWordsArray.length; j++){
					if (currentWordsArray[i] == userInputWordsArray[j]){
						count += 1;
					}
				}
			}
			//If each word in the currentWordsArray has a corresponding match, correct result, else, incorrect
			if (count == 2){
				runCorrectAnswerSequence();
			} else {
				runWrongAnswerSequence(currentWord, mapToUse[currentWord], userInput);
			}
		//Now do the regular check if both answers do NOT contain slashes:
		//If the current word(s) and user input word(s) did NOT contain slashes, but they both still match:
		} else if (userInput == mapToUse[currentWord].toLowerCase()){
			runCorrectAnswerSequence();
		// If user is wrong:
		} else {
			runWrongAnswerSequence(currentWord, mapToUse[currentWord], userInput)
		}	
	// ENGLISH TO SPANISH MODE (Value to key)--------------------------------
	} else if (mode == "eng2span"){
		var currentMatchingKeysArray = getKeysByValue(mapToUse, currentWord);
		var cmkaToString = currentMatchingKeysArray.join(', ');
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

// Run this function from inside of Check Answer - Spanish Mode if user has entered correct answer
function runCorrectAnswerSequence(){
	document.getElementById("resultsDiv").innerHTML = "<p style='color:#666'>Correct!</p>";
	streak += 1;
	renderStreak(streak);
	renderHighScore();
	resetCurrentWord();
	resetInput();
}

// Run this function from inside of Check Answer - Spanish Mode if user has entered wrong answer
function runWrongAnswerSequence(currentWord, correctAnswer, userInput){
	document.getElementById("resultsDiv").innerHTML = "<p><strong style='color:salmon'>Wrong!</strong> The correct answer was: <em style='font-size: 20px;color:#666;padding: 1px 6px 1px 6px'>" + correctAnswer + "</em></p>";	
	streak = 0;
	renderStreak(streak);
	//misses.push(currentWord + " - " + mapToUse[currentWord] + ". You said: " + userInput);
	misses.push({"currentWord": currentWord, "translation": correctAnswer, "userInput": userInput});
	renderMisses();
	resetCurrentWord();
	resetInput();
}

function resetInput(){
	inputTextField.value = "";
	inputTextField.focus();
}

function resetCurrentWord(){
	if (mode == 'span2eng'){
		currentWord = keysArray[Math.floor(Math.random()*keysArray.length)];	
		//Keep track of words in case user wants to view them for any reason
		addToSessionHistory(currentWord);
		
	} else if (mode == 'eng2span'){
		currentWord = valuesArray[Math.floor(Math.random()*valuesArray.length)];		
		//Keep track of words in case user wants to view them for any reason
		addToSessionHistory(currentWord);
}
	
	//Check if the list of words actually has any words in it currently
	//When user selects a db of words, if that particular list is empty, then the current word displayed on the screen will say 'undefined'
	//This section of the function checks for that case and displays "No Words" instead
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



//I found that sometimes I wanted to be able to go back and see a word I had used, but forgot, so these functions are for viewing every word used during the session in the console
function addToSessionHistory(wrd){
	sessionHistoryArray.push(wrd);
}

function viewSessionHistory(){
	for (var i=0; i<sessionHistoryArray.length; i+=1){
		console.log(sessionHistoryArray[i]);
	}
}



//These functions are for records containing two words divided by a slash so user can enter either word first and second and doesn't have to enter them in the exact order as in the db
//*****This will only be necessary is Spanish to English mode. There are no slashes in the Spanish side to user would only ever enter a slash when entering English words.*****

//First need function to check if the current db word contains one slash
//Then need a function to compare two different strings each containing one slash (and compare the words on either side of the slash)

//Check if a string contains one slash
function stringContainsOneSlash(stringToCheckForSlash){
	var slashCount = 0;
	
	for (var i=0; i < stringToCheckForSlash.length; i+=1){
		if (stringToCheckForSlash.charAt(i) == "/"){
			slashCount += 1;
		}
	}
	
	if (slashCount == 1){
		return true;
	} else {
		return false;
	}
}

function separateWords(wordsWithSlash){
	var res = wordsWithSlash.split('/');
	return res;
}































