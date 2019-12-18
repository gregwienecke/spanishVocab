
var inputTextField = document.getElementById("dictionaryInput");
var defDiv = document.getElementById("definitionDiv");

window.onload = function(){
	document.getElementById("dictionaryInput").focus();
};

function resetInput(){
	inputTextField.value = "";
	//calling focus for some reason causes the whole function to fire twice...? so I'm leaving it out for now, possibly better for this case anyway (it's not a bug, it's a feature)
	//inputTextField.focus();
}

// If user presses Enter key instead of clicking Submit button
document.getElementById("dictionaryInput").addEventListener("keyup", function(event){
	event.preventDefault();
	if(event.keyCode === 13){
		getDef();
	}
});



function getDef(){	
	var matchesObject = new Object();
	var userInput = inputTextField.value.toLowerCase();

	if (userInput == "" || userInput == null){
		return;
	} else {	
		var userInput = inputTextField.value.toLowerCase();
	}
	
	checkForMatches(reviewWords, matchesObject, userInput);
	checkForMatches(oldWords, matchesObject, userInput);
	checkForMatches(currentWords, matchesObject, userInput);
	checkForMatches(onDeck, matchesObject, userInput);
	
	printToScreen(matchesObject, userInput);
	resetInput();
}

function checkForMatches(checkObject, newObject, userInput){
	// Loop through an object and add matches to a new Object
	// (Used to loop through each object in the db, and add any matches found to the matchesObject)
	
	// Loop through the properties first, adding matches to new object
	for (var prop in checkObject){
		if (prop.includes(userInput)){
			newObject[prop] = checkObject[prop];
		} 
	}
	
	// Next loop through the values, adding matches to new object
	for(var prop in checkObject){
		if(checkObject[prop].includes(userInput)){
			newObject[prop] = checkObject[prop];

		}
	}
}


// Check if object is empty (no matches were found from user input)
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
           return false;
    }
    return true;
}


// Print the matches to the screen
function printToScreen(theObject, userInput){
	if (isEmpty(theObject)){
		defDiv.innerHTML += "<div class='intenseDiv'><span class='intense'><strong style='color:salmon'>" + userInput + ": </strong> </span><span style='margin-left: 10px; color:#ff6333'>" + "NOT FOUND" + "</span></div>";
	} else {
		for (prop in theObject){
			if (prop){
				console.log("prop: " + prop + " value: " + theObject[prop]);
				defDiv.innerHTML += "<div class='intenseDiv'><span class='intense'><strong style='color:salmon'>" + prop + ": </strong></span> <span style='margin-left: 10px'>" + theObject[prop] + "</span></div>";
			}
		}
	}
}

function clearResults(){
	defDiv.innerHTML = "";
}














