




var inputTextField = document.getElementById("dictionaryInput");
var defDiv = document.getElementById("definitionDiv");

window.onload = function(){
	document.getElementById("dictionaryInput").focus();
};




//Printing results to screen---------------------
function getDef(){
	var userInput = inputTextField.value.toLowerCase();
	
	//check if the input is an ENGLISH word
	if (isInputInEnglishDB(userInput)){	
		//if yes, get the spanish equivalent(s)
		var spanishKeys = returnSpanishKeysFromEnglishInput(userInput);
		var spanishKeysToString = spanishKeys.join(', ');
		console.log(spanishKeys);
		//print results to screen
		resetInput();
		defDiv.innerHTML += "<div class='intenseDiv'><span class='intense'><strong style='color:salmon'>" + userInput + ": </strong></span> <span style='margin-left: 10px'>" + spanishKeysToString + "</span></div>";

	//else, check if the input is a SPANISH word
	} else if (isInputInSpanishDB(userInput)){
		//if yes, get the english equivalent
		//print results to screen
		resetInput();
		
		var engVal = returnEnglishValueFromSpanishInput(userInput);
		
		defDiv.innerHTML += "<div class='intenseDiv'><span class='intense'><strong style='color:salmon'>" + userInput + ": </strong></span> <span style='margin-left: 10px'>" + engVal + "</span></div>";
	
	//else (NEITHER), print "not found" to screen
	} else {
		resetInput();
		defDiv.innerHTML += "<div class='intenseDiv'><span class='intense'><strong style='color:salmon'>" + userInput + ": </strong> </span><span style='margin-left: 10px; color:#ff6333'>" + "NOT FOUND" + "</span></div>";
	}
}




//ENGLISH LOGIC---------------------------------------------------------------------------------------------------
// There can be multiple Spanish word equivalents (the db keys) for one English word (the db values)

// Function that first finds if the user's input is in English by checking each db for results
function isInputInEnglishDB(inputText){
	var oldWordsKeysArrayResult = getKeysByValue(oldWords, inputText);
	var reviewWordsKeysArrayResult = getKeysByValue(reviewWords, inputText);
	var currentWordsKeysArrayResult = getKeysByValue(currentWords, inputText);
	var onDeckKeysArrayResult = getKeysByValue(onDeck, inputText);
	
	if (oldWordsKeysArrayResult.length > 0){
		console.log("found result in old words");
		return true;
	} else if (reviewWordsKeysArrayResult.length > 0){
		console.log("found result in review words");
		return true;		
	} else if(currentWordsKeysArrayResult.length > 0){
		console.log("found result in current words");
		return true;		
	} else if (onDeckKeysArrayResult.length > 0){
		console.log("found result in onDeck");
		return true;		
	}
	return false;
}

//Helper function for testing if the user's input is in english ^
function getKeysByValue(theObject, theValue){
	var matchingKeys = [];
	for(var key in theObject){
		if(theObject[key] == theValue){
			matchingKeys.push(key.toLowerCase());
		}
	}
	return matchingKeys;
}

// Function that is then called using the english input to return the spanish key(s) from all dbs
function returnSpanishKeysFromEnglishInput(inputText){
	
	var oldWordsKeysArray = getKeysByValue(oldWords, inputText);
	var reviewWordsKeysArray = getKeysByValue(reviewWords, inputText);
	var currentWordsKeysArray = getKeysByValue(currentWords, inputText);
	var onDeckKeysArray = getKeysByValue(onDeck, inputText);
	
	var allSpanishKeysArray = [];
	
	if (oldWordsKeysArray.length > 0){
		addToArray(allSpanishKeysArray, oldWordsKeysArray);
	}
	
	if (reviewWordsKeysArray.length > 0){
		addToArray(allSpanishKeysArray, reviewWordsKeysArray);
	} 
	
	if(currentWordsKeysArray.length > 0){
		addToArray(allSpanishKeysArray, currentWordsKeysArray);
	} 
	
	if (onDeckKeysArray.length > 0){
		addToArray(allSpanishKeysArray, onDeckKeysArray);
	}
	
	return allSpanishKeysArray;
}

// Helper function for the above^
function addToArray(addToArray, addFromArray){
	for (var i = 0; i < addFromArray.length; i++){
		addToArray.push(addFromArray[i]);
	}
} 







//SPANISH LOGIC-----------------------------------------------------------------------------------------------------
// Function that first finds if the user's input is in Spanish by checking each db for a result
function isInputInSpanishDB(inputText){
	var oldWordsDBResult = oldWords[inputText];
	var reviewWordsDBResult = reviewWords[inputText];
	var currentWordsDBResult = currentWords[inputText];
	var onDeckDBResult = onDeck[inputText];
	
	if (oldWordsDBResult){
		return true;
	} else if (reviewWordsDBResult){
		return true;
	} else if (currentWordsDBResult){
		return true;
	} else if (onDeckDBResult){
		return true;
	}
	return false;
}

// Function that is then called using the spanish input to return the english value from the given db
function returnEnglishValueFromSpanishInput(inputText){
	var engVal;
	if (oldWords[inputText]){
		engVal = oldWords[inputText];
	} else if (reviewWords[inputText]){
		engVal = reviewWords[inputText];
	} else if (currentWords[inputText]){
		engVal = currentWords[inputText];
	} else if (onDeck[inputText]){
		engVal = onDeck[inputText];
	}
	return engVal;
}



















//Other-----------------------------------

function resetInput(){
	inputTextField.value = "";
	//calling focus for some reason causes the whole function to fire twice...? so i'm leaving it out for now, possibly better for this case anyway
	//inputTextField.focus();
}

// If user presses Enter key instead of clicking Submit button
document.getElementById("dictionaryInput").addEventListener("keyup", function(event){
	event.preventDefault();
	if(event.keyCode === 13){
		getDef();
	}
});











