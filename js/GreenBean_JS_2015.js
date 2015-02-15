/*
 * GreenBean_JS_2015.JS
 *
 */

/******************************************************************************
 *
 * Object Definitions
 *
 ******************************************************************************/

window.onload=function() { Hide_Tabs(); update_data();};

/* global variables */

/* Penalty Variables */
    var penalty = 0;
    var technical = 0;

    var penalty_stack = new Array();

/* autonomous */
    //var auto_sets = new autostacks(0,0,0,0,0,0);  	// auto-sets - robot sets, tote sets, stacked sets, bin sets

    var auto_in_area = 0;						  	// true if this robot was in the auto zone by end of autonomous
    var auto_totes = 0; 							// # yellow totes this bot got into auto zone in autonomous
    var auto_stacks = 0; 							// # yellow totes stacked by this bot in auto zone in autonomous
    var auto_bins = 0;								// # bins this bot got into auto zone in autonomous

/* teleoperated */

	var Stack = [];
	for (var i = 1; i < 22; i++){
    	Stack.push( new stacks(0,0,0,0) );
    }

//:)
    var human_tote_loader = 0;						// did they have a human player loading totes?
    var human_litter_loader = 0;					// did they have a human player loading litter from slot?
    var human_litter_thrower = 0;    				// did they have a human player throwing litter across the field?

    var tele_driving = 0;							// slider for driving ability
    var tele_robot_litter_time = 0;					// time this bot spent dealing with litter cleanup to landfill
    var post_overallrating = 0;						// slider for general rating for this bot
	var bin_feeding = 0;							// slider for how fast bins fed by human player

/******************************************************************************
 * Internal Functions
 *      These functions are to be handled internally in this .js file. Do not
 *      call these externally.
 ******************************************************************************/

/* constructor for stack objects
 *
 *   stacks function calculates points for stacks on scoring platforms
 *   totes - number of totes  [# of scored totes in a stack (0-6)]
 *   bins  - is there a bin on this stack? 0 or 1
 *   litter - is there litter in the bin?  0 or 1
 *   knockedover - did they build it up only for it to get knocked over? 0 or 1
 *   points (output?) - calculated points for this stack
 *
 * */
function stacks(totes, bins, litter, knockedover)
{
	// constructor for stacks objects
	this.totes= totes;											// stacks start with totes.
    this.bins = bins;											// bins on tote stacks
    this.litter = litter;										// litter in a stacked bin
    this.knockedover = knockedover;
  																// sadly no points if this is true...
  	this.stackpoints = function()
  	{
    	var points = 0;

    	// calculate points for stacks during telop
    	if (this.totes != "") {
    		points = this.totes * 2;  					// 2 points for each tote in this stack on scoring platform
	    	if (this.totes > 0) {
	    	 	if (this.bins) 	{
	    			points = points + (this.totes * 4); // 4 points per level for bins on scored tote stacks
	    			}
	         	if (this.litter && this.bins)  	{
	    			points = points + 6; 	    		// points for litter in a scored bin
	    			}
		    	 if (this.knockedover)  	{
		    		points = 0;							// all that work for NOTHING!
		    		}
				}
			}
		return points;
	};

	this.csvData = function(){
		var csv_Data = "";
		csv_Data += this.totes + ",";
		csv_Data += this.bins + ",";
		csv_Data += this.litter + ",";
		csv_Data += this.knockedover + ",";
		return csv_Data;
	};
}

/* constr

}

function stackpoints(totes, bins, litter, knockedover)
{
    var points = 0;

    // calculate points for stacks during telop
    points = totes * 2;  					// 2 points for each tote in this stack on scoring platform
    if (totes > 0)
    {  if (bins)
    	{ points = points + (totes * 4); } 	// 4 points per level for bins on scored tote stacks
       if (litter && bins)
    	{ points = points + 6; }
    }		// points for litter in a scored bin
    if (knockedover)
    	{ points = 0; }						// all that work for NOTHING!


    return points;
}





/* constructor for autostack objects
 *
 *   stacks function calculates points for stacks on scoring platforms
 * 	 bots - bool - true if all robots in auto zone at end of autonomous
 *   totes - number of totes in auto zone at end of autonomous
 *   stackedtotes - bool - true if all totes are in a stack at end of autonomous
 *   bins  - number of bins in auto zone at end of autonomous
 *
 *   points (output?) - calculated points for this stack
 * 		if all robots in autozone = 4 pts
 * 		if all 3 yellow totes in autozone = 6 pts
 * 		if all 3 yellow totes stacked in autozone = 20 pts
 * 		if all 3 bins in autozone = 8 pts
 *
 * */
function autostacks(bots, totes, stackedtotes, bins, points)
{
	// get the information
	this.bots = bots;
	this.totes= totes;
	this.stackedtotes = stackedtotes;
    this.bins = bins;

    // calculate points...
    if (this.bots)								// true if all bots in auto zone
    	{this.points = 4;	}  					// 4 points for robot set
    if (this.totes = 3)							//must have all 3 yellow totes in auto zone
    { if (this.stackedtotes) 					// true if all 3 yellow totes are stacked
    	{this.points = this.points + 20;	} 	// add 20 if stacked tote set!
    	else
    	{this.points = this.points + 6;	}		// otherwise add 6 points for tote set
    }
    if (this.bins = 3)
    {
    	this.points = this.points + 8			// 8 points for bin set
    }
    return this.points;


}
/*
 * Update Data from input elements
 */
function update_data()
{
	   /* autonomous data */

        robotinautozone = document.getElementById('in_area').checked;
        yellowTotesToAuto = document.getElementById('AutoTotes').value;

        goodYelStackedTotes = document.getElementById('AutoStacks_succeeded').value;
        badYelStackedTotes = document.getElementById('AutoStacks_failed').value;

        goodBinsToAuto = document.getElementById('AutoBins_succeeded').value;
        badBinsToAuto = document.getElementById('AutoBins_failed').value;

        StartLocation = document.getElementById('Location').value;



    /* teleop data */
/*
        humanfeedslitter = document.getElementById('human_feedsLitter').checked;
        humanthrowslitter = document.getElementById('human_throwsLitter').checked;

        humanfeedstotes = document.getElementById('human_feedsTotes').value;
        driverability = document.getElementById('driving_ability').value;
        totefeedspeed = document.getElementById('ToteFeedSpeed').value;
*/
		// stacks data

	for (var i = 1; i < 20; i++){
			var toteval= "S" + i + "Totes";
			var binval= "S" + i + "Bin";
			var litterval= "S" + i + "Litter";
			var KOval= "S" + i + "KnockedOver";


		Stack[i].totes = document.getElementById(toteval).value;
		Stack[i].bins = document.getElementById(binval).checked;
		Stack[i].litter = document.getElementById(litterval).checked;
		Stack[i].knockedover = document.getElementById(KOval).checked;

		}


    /* update display */
    disp_update();
}

/*
 * Calculate any points based on what data was input.
 * called from update_data().
 */
function disp_update()
{
	var overallrating = 0;

   /* autonomous */
   /*
     document.getElementById("auto_pts_display").innerHTML = auto_goals[0].points;   /* points made in auton */
   /*  document.getElementById("auto_miss_display").innerHTML = auto_goals[1].points;  /* points missed in auton */

    /* teleop */
	var totpoints = 0;
	var newpoints = 0;
   	for (var i = 1; i < 21; i++){
			var pointval= "S" + i + "points";
			newpoints = Stack[i].stackpoints();
   			document.getElementById(pointval).innerHTML =  newpoints;
			totpoints = totpoints + newpoints;
		}


	document.getElementById("TotalPoints").innerHTML = totpoints;

    switch(tele_driving)
    {
        case '0':
            document.getElementById("tele_driving_display").innerHTML = "Little or No Movement";
            break;
        case '1':
            document.getElementById("tele_driving_display").innerHTML = "Poor Driving";
            break;
        case '2':
            document.getElementById("tele_driving_display").innerHTML = "Good Driving";
            break;
        case '3':
            document.getElementById("tele_driving_display").innerHTML = "Exceptional Driving";
            break;
    }

    switch(bin_feeding)
    {
        case '0':
            document.getElementById("ToteFeedSpeed").innerHTML = "No Bins";
            break;
        case '1':
            document.getElementById("ToteFeedSpeed").innerHTML = "Slow";
            break;
        case '2':
            document.getElementById("ToteFeedSpeed").innerHTML = "Average";
            break;
        case '3':
            document.getElementById("ToteFeedSpeed").innerHTML = "Fast";
            break;
    }


    /* penalty */
   /*
    document.getElementById("penalty_display1").innerHTML = penalty;
    document.getElementById("technical_display1").innerHTML = technical;
    document.getElementById("penalty_display2").innerHTML = penalty;

    tele_driving = document.getElementById('driving_ability').value
	*/

    overallrating = document.getElementById("Overall_Rating").value;
	switch(overallrating)
    {
        case '0':
            document.getElementById("post_overallrating").innerHTML = "Do Not Pick";
            break;
        case '1':
            document.getElementById("post_overallrating").innerHTML = "Below Average";
            break;
        case '2':
            document.getElementById("post_overallrating").innerHTML = "Average";
            break;
        case '3':
            document.getElementById("post_overallrating").innerHTML = "Top Team";
            break;
    }

}



function save_data()
{
    var matchData = document.getElementById("scout_name_in").value + ",";
    matchData += document.getElementById("team_number_in").value + ",";
    matchData += document.getElementById("match_number_in").value + ",";
    matchData += document.getElementById("match_type").value + ",";
  // autonomous tab fields
/*
		matchData += robotinautozone + ",";
		matchData += yellowTotesToAuto + ",";
		matchData += goodYelStackedTotes + ",";
		matchData += badYelStackedTotes + ",";
		matchData += goodBinsToAuto  + ",";
		matchData += badBinsToAuto + ",";
		matchData += StartLocation + ",";
*/

  // teleop tab fields

  /*
    matchData += (human_tote_loader) ? "T" : "F") + ",";
    matchData += (human_litter_loader) ? "T" : "F") + ",";
    matchData += (human_litter_thrower) ? "T" : "F") + ",";
    matchData += document.getElementById("driving_ability").value + ",";

        human_tote_loader = document.getElementById('Human_feedsTotes').checked;
        human_litter_loader = document.getElementById('Human_feedsLitter').checked;
        human_litter_thrower = document.getElementById('Human_throwsLitter').checked;

        tele_driving = document.getElementById('driving_ability').value;
*/
	for (var i = 1; i < 21; i++){

		matchData += Stack[i].csvData();

}

    var comments = document.getElementById("Comments").value;
    comments = comments.replace(",","_"); //Get rid of commas so we don't mess up CSV
    comments = comments.replace(/(\r\n|\n|\r)/gm,"  ");  // get rid of any newline characters
    matchData += comments + "\n";  // add a single newline at the end of the data
    var existingData = localStorage.getItem("MatchData");
    if(existingData == null)
        localStorage.setItem("MatchData",matchData);
    else
        localStorage.setItem("MatchData",existingData + matchData);
    document.getElementById("HistoryCSV").value = localStorage.getItem("MatchData");
/*
    var existingSharedData = localStorage.getItem("SharedData");
    if(existingSharedData == null)
        localStorage.setItem("SharedData",sharedData);
    else
        localStorage.setItem("SharedData",existingSharedData + sharedData);
    document.getElementById("SharedDataCSV").value = localStorage.getItem("SharedData");
*/


}

function save_pit_data()
{

    var pitData = document.getElementById("scout_name_in").value + ",";
    pitData += document.getElementById("team_number_in").value + ",";
    pitData += document.getElementById("match_number_in").value + ",";
    pitData += document.getElementById("match_type").value + ",";
// features tab datasave

/*    pitData += document.getElementById("drive_type").value + ",";
    pitData += document.getElementById("drive_speed").value + ",";
    pitData += document.getElementById("number_wheels").value + ",";
    pitData += (document.getElementById("low_pass").checked ? "T" : "F") + ","; // chkbox
    pitData += (document.getElementById("high_pass").checked ? "T" : "F") + ","; // chkbox
    pitData += (document.getElementById("high_goal").checked ? "T" : "F") + ",";  // chkbox
    pitData += (document.getElementById("low_goal").checked ? "T" : "F") + ",";  // chkbox
    pitData += (document.getElementById("low_top").checked ? "T" : "F") + ",";  // chkbox
    pitData += document.getElementById("truss_throw").value + ",";
    pitData += (document.getElementById("pass_catch").checked ? "T" : "F") + ","; // chkbox
    pitData += (document.getElementById("truss_catch").checked ? "T" : "F") + ",";  // chkbox
    pitData += document.getElementById("defense").value + ",";


    var comments = document.getElementById("DriveTrain_Comments").value;
    comments = comments.replace(",","_"); //Get rid of commas so we don't mess up CSV
    comments = comments.replace(/(\r\n|\n|\r)/gm,"  "); // get rid of any newline characters
    pitData += comments + ",";

    comments = document.getElementById("Shooter_Comments").value;
     comments = comments.replace(",","_"); //Get rid of commas so we don't mess up CSV
     comments = comments.replace(/(\r\n|\n|\r)/gm,"  "); // get rid of any newline characters
    pitData += comments + ",";

    comments = document.getElementById("General_Comments").value;
     comments = comments.replace(",","_"); //Get rid of commas so we don't mess up CSV
     comments = comments.replace(/(\r\n|\n|\r)/gm,"  "); // get rid of any newline characters
    pitData += comments + "\n";  // add a single newline at the end of the data
*/
    var existingData = localStorage.getItem("PitData");
    if(existingData == null)
        localStorage.setItem("PitData",pitData);
    else
        localStorage.setItem("PitData",existingData + pitData);
    document.getElementById("PitHistoryCSV").value = localStorage.getItem("PitData");

}

//Clears all data in the form.
//Do not call this unless it is ok to actually clear all data.
//This only resets stuff Nick felt should be reset
function reset_form()
{
// match data reset
/*
    document.getElementById("team_number_in").value = "";
    document.getElementById("match_number_in").value = parseInt(document.getElementById("match_number_in").value) + 1;



    document.getElementById("Location").value = "A";

// autonomous data reset


// teleop data reset



// pit data reset
    document.getElementById("drive_type").value = "";
    document.getElementById("drive_speed").value = "";
    document.getElementById("number_wheels").value = "";
*/


	/*

leftovers from last year - kept temporarily for reference...



    document.getElementById("starting_ball").value = 0;
    document.getElementById("floor_pickup").value = 0;

    auto_score_stack = new Array();
    tele_attempt_stack = new Array();

    document.getElementById("starting_ball").checked = false;
    document.getElementById("floor_pickup").checked = false;

    tele_score_stack = new Array();
    document.getElementById("Front_shoot").checked = false;
    tele_goals[0] = new goal_t(0,0,0,0,0);
    tele_goals[1] = new goal_t(0,0,0,0,0);

    penalty_stack = new Array();
    penalty = 0;
    technical = 0;
    document.getElementById("Comments").value="";

    document.getElementById("low_pass").checked = false;
    document.getElementById("high_pass").checked = false;
    document.getElementById("high_goal").checked = false;
    document.getElementById("low_goal").checked = false;
    document.getElementById("low_top").checked = false;
    document.getElementById("truss_throw").value = 0;
    document.getElementById("pass_catch").checked = false;
    document.getElementById("truss_catch").checked = false;
    document.getElementById("defense").value = 0;

    document.getElementById("DriveTrain_Comments").value="";
    document.getElementById("Shooter_Comments").value="";
    document.getElementById("General_Comments").value="";
    */
    update_data();
}


/*
 * functions to be called from outside this .js file
 *
 */

/*
 * Call when inputs change
 */
function Update_Stuff()
{
    update_data();
}



function Submit_Report()
{
    save_data();

	$("#PitDataButton").hide(100,null);
	$("#AutonomousDataButton").show(100,null);
	$("#TeleOpDataButton").show(100,null);
	$("#MatchDataButton").show(100,null);

    reset_form();
}

function Submit_Pit_Report()
{
    save_pit_data();

	$("#PitDataButton").show(100,null);
	$("#AutonomousDataButton").hide(100,null);
	$("#TeleOpDataButton").hide(100,null);
	$("#MatchDataButton").hide(100,null);

    reset_form();
}

function Clear_History()
{
    if(document.getElementById("history_password").value == "Beans")
    {
        localStorage.clear();
        document.getElementById("HistoryCSV").value = "";
        document.getElementById("PitHistoryCSV").value = "";
        document.getElementById("SharedDataCSV").value = "";
        $("#HistoryPass").hide(100,null);
    }
    else
    {
        document.getElementById("history_password").value = "Incorrect Password";
    }
}

function Hide_Tabs()
{
	if(document.getElementById("match_type").value == "PitScouting")
	{
		$("#PitDataButton").show(100,null);
		$("#AutonomousDataButton").hide(100,null);
		$("#TeleOpDataButton").hide(100,null);
		$("#MatchDataButton").hide(100,null);
	}
	else
	{
		$("#PitDataButton").hide(100,null);
		$("#AutonomousDataButton").show(100,null);
		$("#TeleOpDataButton").show(100,null);
		$("#MatchDataButton").show(100,null);
	}

	// initialize HTML for stacks

	for (var i = 1; i < 21; i++){
		var litterid = "S"+ i + "Litter";
		var binid = "S"+ i + "Bin";
		var toteid = "S"+ i + "Totes";
		var KOid = "S"+ i + "KnockedOver";
		var pointid = "S"+ i + "points";

		var htmlstring = "Stack" + i;
		var headertxt = document.createTextNode(htmlstring);
		var brk = document.createElement("BR");

		var inLitter = document.createElement("input");
			inLitter.setAttribute('type',"checkbox");
			inLitter.setAttribute('id',litterid);
			inLitter.setAttribute('onchange',"update_data();");

		var inBin = document.createElement("input");
			inBin.setAttribute('type',"checkbox");
			inBin.setAttribute('id',binid);
			inBin.setAttribute('onchange',"update_data();");

		var inTote = document.createElement("input");
			inTote.setAttribute('type',"number");
			inTote.setAttribute('id',toteid);
			inTote.setAttribute('onchange',"update_data();");
			inTote.setAttribute('min',0);
			inTote.setAttribute('max',6);
			inTote.setAttribute('size',8);

		var inKO = document.createElement("input");
			inKO.setAttribute('type',"checkbox");
			inKO.setAttribute('id',KOid);
			inKO.setAttribute('onchange',"update_data();");

		var inpoints = document.createElement("a");
			inpoints.setAttribute('id', pointid);

		document.getElementById(htmlstring).appendChild(headertxt);

		document.getElementById(htmlstring).appendChild(inBin);
		document.getElementById(htmlstring).appendChild(brk);
		document.getElementById(htmlstring).appendChild(brk);

		document.getElementById(htmlstring).appendChild(inLitter);
		document.getElementById(htmlstring).appendChild(brk);
		document.getElementById(htmlstring).appendChild(brk);

		document.getElementById(htmlstring).appendChild(inTote);
		document.getElementById(htmlstring).appendChild(brk);

		document.getElementById(htmlstring).appendChild(inKO);
		document.getElementById(htmlstring).appendChild(brk);
		document.getElementById(htmlstring).appendChild(brk);

		document.getElementById(htmlstring).appendChild(inpoints);
		document.getElementById(htmlstring).appendChild(brk);

	}


}


