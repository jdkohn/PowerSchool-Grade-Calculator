/*

This is a Google Chrome Extension for the PowerSchool website
It is intended to help students calculate what grade they need on their finals to obtain a certain grade
Created by Jacob Kohn, 2016

*/


/////////  HELPER FUNCTIONS//////////////////////////

function getGrade(grade) {
	
	var intGrade = grade;

	if(intGrade >= .93) {
		return "A";
	} else if(intGrade >= .90) {
		return "A-";
	} else if(intGrade >= .87) {
		return "B+";
	} else if(intGrade >= .83) {
		return "B";
	} else if(intGrade >= .80) {
		return "B-";
	} else if(intGrade >= .77) {
		return "C+";
	} else if(intGrade >= .73) {
		return "C";
	} else if(intGrade >= .70) {
		return "C-";
	} else if(intGrade >= .67) {
		return "D+";
	} else if(intGrade >= .63) {
		return "D";
	} else if(intGrade >= .60) {
		return "D-";
	} else {
		return "E";
	}
}


////////////////////////////////////////////////////////////////////

//find desired table in page

var captions = document.getElementsByTagName("caption");

var captionIndex = -1

for(var i=0; i<captions.length; i++) {
	if(captions[i].textContent == "Assignment Categories") {
		captionIndex = i;
	}
}

var tbl = captions[captionIndex].parentNode;

var chNodes = tbl.childNodes;

//find body of table: rows that contain grade information
var tHeadIndex = -1;
var tBodyIndex = -1;

for(var i=0; i<chNodes.length; i++) {
	if(tbl.childNodes[i].tagName == "TBODY") {
		tBodyIndex = i
	}
	if(tbl.childNodes[i].tagName == "THEAD") {
		tHeadIndex = i
	}
}
var tBody = chNodes[tBodyIndex].childNodes;

//get rows that actually correspond with grades
var rowIndecies = []
for(var i=0; i<tBody.length; i++) {
	if(tBody[i].tagName == "TR") {
		rowIndecies.push(i);
	}
}

//set array of objects which contain information about each section of grading
var categories = [];
for(var i=0; i<rowIndecies.length; i++) {
	tCells = tBody[rowIndecies[i]].childNodes;
	
	var cat = {}

	for(var l=0; l<tCells.length; l++) {
		if(l == 1) {
			cat["section"] = tCells[l].innerHTML;
		} else if(l == 3) {
			cat["weight"] = tCells[l].innerHTML;
		} else if(l == 5) {
			cat["assignments"] = tCells[l].innerHTML;
		} else if(l == 7) {
			cat["possible"] = tCells[l].innerHTML;
		} else if(l == 9) {
			cat["earned"] = tCells[l].innerHTML;
		} else if(l == 11) {
			cat["grade"] = tCells[l].innerHTML;
		}
	}
	categories.push(cat);
}

//add up earned and possible points
var earned = 0;
var possible = 0;

for(var i=0; i<categories.length; i++) {
	earned += parseInt(categories[i]["earned"]);
	possible += parseInt(categories[i]["possible"]);
}
var currentGrade = earned/possible;

//insert new row category

var row = tbl.insertRow(tbl.rows.length);
var catCell = row.insertCell(0);

var iHT = '<select id="category">';

for(var i=0; i<categories.length; i++) {
	iHT = iHT + "<option value=" + i + ">" + categories[i]["section"] + "</option>"; 
}

iHT = iHT + "</select>";

catCell.innerHTML = iHT;

var weightCell = row.insertCell(1);
var numCell = row.insertCell(2);
var possibleCell = row.insertCell(3);
var earnedCell = row.insertCell(4);
var gradeCell = row.insertCell(5);

weightCell.innerHTML = categories[0]["weight"];
numCell.innerHTML = "1";
possibleCell.innerHTML = '<input type="text" id="possible">';
earnedCell.innerHTML = '<input type="text" id="earned">';
gradeCell.innerHTML = "";

var categoryChooser = document.getElementById("category");
var possibleTextField = document.getElementById("possible");
var earnedTextField = document.getElementById("earned");



//Total Row

var totalRow = tbl.insertRow(tbl.rows.length);

var totalCell = totalRow.insertCell(0);
var totalWeightCell = totalRow.insertCell(1);
var totalNumCell = totalRow.insertCell(2);
var totalPossibleCell = totalRow.insertCell(3);
var totalEarnedCell = totalRow.insertCell(4);
var totalGradeCell = totalRow.insertCell(5);

totalCell.innerHTML = "Total";
totalWeightCell.innerHTML = "";
totalWeightCell.innerHTML = "";
totalPossibleCell.innerHTML = possible;
totalEarnedCell.innerHTML = earned;
totalGradeCell.innerHTML = getGrade(currentGrade);

//ON CHANGE METHODS

categoryChooser.onchange = function() {
	weightCell.innerHTML = categories[categoryChooser.value]["weight"];
}

possibleTextField.onchange = function() {
	var str = possibleTextField.value;

    if(!str.match(/\S/){
    	earnedTextField.innerHTML = 0;

    } else {
		totalPossibleCell.innerHTML = possible + parseInt(possibleTextField.value);
		totalGradeCell.innerHTML = getGrade((earned + parseInt(earnedTextField.value)) / (possible + parseInt(possibleTextField.value)));
		gradeCell.innerHTML = getGrade(parseInt(earnedTextField.value) / parseInt(possibleTextField.value));
    }

}

earnedTextField.onchange = function() {
	var str = earnedTextField.value;

    if(!str.match(/\S/){
    	earnedTextField.innerHTML = 0;
    }
	totalEarnedCell.innerHTML = earned + parseInt(earnedTextField.value);
	totalGradeCell.innerHTML = getGrade((earned + parseInt(earnedTextField.value)) / (possible + parseInt(possibleTextField.value)));
	gradeCell.innerHTML = getGrade(parseInt(earnedTextField.value) / parseInt(possibleTextField.value));


}	

