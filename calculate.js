/*

This is a Google Chrome Extension for the PowerSchool website
It is intended to help students calculate what grade they need on their finals to obtain a certain grade
Created by Jacob Kohn, 2016

*/


/////////  HELPER FUNCTIONS//////////////////////////
if(document.title == "Class Score Detail") {




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

	function updateByGradeRow() {
		var gradeSelector = document.getElementById("getGrade");
		var possiblePointsTextField = document.getElementById("possiblePoints");

		var desiredGrade = percentages[gradeSelector.value];
		var pointsPossible = possiblePointsTextField.value;

		gradeEarnedCell.innerHTML = getNecessaryPoints(desiredGrade, pointsPossible);
	}

	function addAssignment() {

		var section = categoryChooser.value

		var rowIndecies = []
		for(var i=0; i<tBody.length; i++) {
			if(tBody[i].tagName == "TR") {
				rowIndecies.push(i);
			}
		}

		tCells = tBody[rowIndecies[section]].childNodes;
		
		if(possibleTextField.value.match(/\S/) && earnedTextField.value.match(/\S/)) {
			tCells[5].innerHTML = parseInt(tCells[5].innerHTML) + 1;
		}

		if(possibleTextField.value.match(/\S/)) {
	        tCells[7].innerHTML = parseInt(tCells[7].innerHTML) + parseInt(possibleTextField.value);
	    }

	    if(earnedTextField.value.match(/\S/)) {
	        tCells[9].innerHTML = parseInt(tCells[9].innerHTML) + parseInt(earnedTextField.value);
	    }

		tCells[11].innerHTML = getGrade(parseInt(tCells[9].innerHTML)/parseInt(tCells[7].innerHTML));

		possibleTextField.value = "0";
		earnedTextField.value = "0";

		calculate();

		updateByGradeRow();
	}

	function calculate() {
		categories = [];
		earned = 0; 
		possible = 0;
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

		for(var i=0; i<categories.length; i++) {
			earned += parseInt(categories[i]["earned"]);
			possible += parseInt(categories[i]["possible"]);
		}
		currentGrade = earned/possible;
	}

	function getNecessaryPoints(desiredGrade, pointsPossible) {

		var totalPossible = parseInt(pointsPossible) + parseInt(possible);

		var necessary = (desiredGrade * totalPossible) - earned;

		return Math.ceil(necessary);
	}

	function toggleAddRow() {
		console.log("!");
		console.log(row);
		if(row.style.display == "none") {
			row.style.display = "";
		} else {
			row.style.display = "none"
		}
	}

	var percentages = [.93,.90,.87,.83,.80,.77,.73,.70,.67,.63,.60];

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

	var categories = [];
	var earned = 0;
	var possible = 0;
	var currentGrade = 0;

	calculate();

	//insert new row category

	var row = tbl.insertRow(tbl.rows.length);

	row.style.display = 'none';

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
	var addCell = row.insertCell(6);

	weightCell.innerHTML = categories[0]["weight"];
	numCell.innerHTML = "1";
	possibleCell.innerHTML = '<input type="text" id="possible">';
	earnedCell.innerHTML = '<input type="text" id="earned">';
	gradeCell.innerHTML = "";
	addCell.innerHTML = '<input class="addButton" type="submit" value="+" id="add"	/>';

	var categoryChooser = document.getElementById("category");
	var possibleTextField = document.getElementById("possible");
	var earnedTextField = document.getElementById("earned");


	////////// BY GRADE ROW /////////

	var gradeRow = tbl.insertRow(tbl.rows.length);

	var descriptionCell = gradeRow.insertCell(0);
	var gradeWeightCell = gradeRow.insertCell(1);
	var gradeNumCell = gradeRow.insertCell(2);
	var gradePossibleCell = gradeRow.insertCell(3);
	var gradeEarnedCell = gradeRow.insertCell(4);
	var gradeCheckCell = gradeRow.insertCell(5);
	var addAssignCell = gradeRow.insertCell(6);

	descriptionCell.innerHTML = "Calculate By Grade";
	gradeWeightCell.innerHTML = "-";
	gradeNumCell.innerHTML = "-";
	gradePossibleCell.innerHTML = '<input type="text" id="possiblePoints">';
	gradeEarnedCell.innerHTML = "";
	gradeCheckCell.innerHTML = '<select id="getGrade"><option value="0">A</option> <option value="1">A-</option> <option value="2">B+</option> <option value="3">B</option> <option value="4">B-</option> <option value="5">C+</option> <option value="6">C</option> <option value="7">C-</option> <option value="8">D+</option> <option value="9">D</option> <option value="10">D-</option>';
	addAssignCell.innerHTML = '<input class="addButton" type="submit" value="Add Assignment" id="addAssign"	/>';


	/////// Total Row /////////

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

	/////// ON CHANGE METHODS //////////

	categoryChooser.onchange = function() {
		weightCell.innerHTML = categories[categoryChooser.value]["weight"];
	}

	//checks to see which fields are blank so not dividing by zero

	possibleTextField.onchange = function() {
		var str = possibleTextField.value;
		var str2 = earnedTextField.value;

	    if(!str.match(/\S/)) {
			possibleTextField.value = "0";
	    }
	    if(!str.match(/\S/) && !str2.match(/\S/)) {
			gradeCell.innerHTML = "";
	    }
		totalPossibleCell.innerHTML = possible + parseInt(possibleTextField.value);
		totalGradeCell.innerHTML = getGrade((earned + parseInt(earnedTextField.value)) / (possible + parseInt(possibleTextField.value)));
		gradeCell.innerHTML = getGrade(parseInt(earnedTextField.value) / parseInt(possibleTextField.value));
	}

	earnedTextField.onchange = function() {
		var str = earnedTextField.value;
		var str2 = possibleTextField.value;

	    if(!str.match(/\S/)) {
	    	earnedTextField.value = "0";
	    }
	    if(!str.match(/\S/) && !str2.match(/\S/)) {
			gradeCell.innerHTML = "";
	    }
		totalEarnedCell.innerHTML = earned + parseInt(earnedTextField.value);
		totalGradeCell.innerHTML = getGrade((earned + parseInt(earnedTextField.value)) / (possible + parseInt(possibleTextField.value)));
		gradeCell.innerHTML = getGrade(parseInt(earnedTextField.value) / parseInt(possibleTextField.value));
	}


	gradePossibleCell.onchange = function() {
		updateByGradeRow()
	}

	var gradeChooser = document.getElementById("getGrade")

	gradeChooser.onchange = function() {
		updateByGradeRow()
	}


	/////// EVENT LISTENERS /////////

	document.getElementById("add").addEventListener("click", addAssignment);
	document.getElementById("addAssign").addEventListener("click", toggleAddRow);
}