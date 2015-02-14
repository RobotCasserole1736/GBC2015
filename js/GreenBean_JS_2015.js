/*
 * GreenBean_JS_2015.JS
 *
 */

/******************************************************************************
 *
 * Object Definitions
 *
 ******************************************************************************/



window.onload=function(){Update_Stuff(); Hide_Tabs();};


/* global variables */

/* Penalty Variables */
    var penalty = 0;
    var technical = 0;

    var penalty_stack = new Array();

/* autonomous */
    var auto_sets = new autostacks(0,0,0,0,0,0);  	// auto-sets - robot sets, tote sets, stacked sets, bin sets

    var auto_in_area = 0;						  	// true if this robot was in the auto zone by end of autonomous
    var auto_totes = 0; 							// # yellow totes this bot got into auto zone in autonomous
    var auto_stacks = 0; 							// # yellow totes stacked by this bot in auto zone in autonomous
    var auto_bins = 0;								// # bins this bot got into auto zone in autonomous

/* teleoperated */
    var Stack1 = new stacks(0,0,0,0),
    	Stack2 = new stacks(0,0,0,0),
    	Stack3 = new stacks(0,0,0,0),
    	Stack4 = new stacks(0,0,0,0);
    	Stack5 = new stacks(0,0,0,0);
    	Stack6 = new stacks(0,0,0,0);
    	Stack7 = new stacks(0,0,0,0);
    	Stack8 = new stacks(0,0,0,0);
    	Stack9 = new stacks(0,0,0,0);
    	Stack10 = new stacks(0,0,0,0);
        Stack11 = new stacks(0,0,0,0),
    	Stack12 = new stacks(0,0,0,0),
    	Stack13 = new stacks(0,0,0,0),
    	Stack14 = new stacks(0,0,0,0);
    	Stack15 = new stacks(0,0,0,0);
    	Stack16 = new stacks(0,0,0,0);
    	Stack17 = new stacks(0,0,0,0);
    	Stack18 = new stacks(0,0,0,0);
    	Stack19 = new stacks(0,0,0,0);
    	Stack20 = new stacks(0,0,0,0);

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
function stack(totes, bins, litter, knockedover)
{
	// constructor for stacks objects
	this.totes= totes;											// stacks start with totes.
    this.bins = bins;											// bins on tote stacks
    this.litter = litter;										// litter in a stacked bin
    this.knockedover = knockedover; 
  																// sadly no points if this is true...
  	this.stackpoints = function(totes, bins, litter, knockedover)
  	{
    	var points = 0;

    	// calculate points for stacks during telop
    	points = totes * 2;  					// 2 points for each tote in this stack on scoring platform
	    if (totes > 0)
	    {  
	    	if (bins)
	    	{
	    		// 4 points per level for bins on scored tote stacks 
	    		points = points + (totes * 4); 
	    	}
	    	
	        if (litter && bins)
	    	{ 
	    		// points for litter in a scored bin
	    		points = points + 6; 
	    	}
	    	
	    	if (knockedover)
	    	{ 
	    		points = 0; 
	    	}						// all that work for NOTHING!
	
			return points;
		}
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
    return this.points


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

        human_tote_loader = document.getElementById('Human_feedsTotes').checked;
        human_litter_loader = document.getElementById('Human_feedsLitter').checked;
        human_litter_thrower = document.getElementById('Human_throwsLitter').checked;

        tele_driving = document.getElementById('driving_ability').value;
        bin_feeding = document.getElementById('Tote_Feed_Speed').value;

		Stack1.totes = document.getElementById('S1Totes').value;
		Stack1.bins = document.getElementById('S1Bin').checked;
		Stack1.litter = document.getElementById('S1Litter').checked;
		Stack1.knockedover = document.getElementById('S1KnockedOver').checked;

		Stack2.totes = document.getElementById('S2Totes').value;
		Stack2.bins = document.getElementById('S2Bin').checked;
		Stack2.litter = document.getElementById('S2Litter').checked;
		Stack2.knockedover = document.getElementById('S2KnockedOver').checked;

		Stack3.totes = document.getElementById('S3Totes').value;
		Stack3.bins = document.getElementById('S3Bin').checked;
		Stack3.litter = document.getElementById('S3Litter').checked;
		Stack3.knockedover = document.getElementById('S3KnockedOver').checked;

		Stack4.totes = document.getElementById('S4Totes').value;
		Stack4.bins = document.getElementById('S4Bin').checked;
		Stack4.litter = document.getElementById('S4Litter').checked;
		Stack4.knockedover = document.getElementById('S4KnockedOver').checked;

		Stack5.totes = document.getElementById('S5Totes').value;
		Stack5.bins = document.getElementById('S5Bin').checked;
		Stack5.litter = document.getElementById('S5Litter').checked;
		Stack5.knockedover = document.getElementById('S5KnockedOver').checked;

		Stack6.totes = document.getElementById('S6Totes').value;
		Stack6.bins = document.getElementById('S6Bin').checked;
		Stack6.litter = document.getElementById('S6Litter').checked;
		Stack6.knockedover = document.getElementById('S6KnockedOver').checked;

		Stack7.totes = document.getElementById('S7Totes').value;
		Stack7.bins = document.getElementById('S7Bin').checked;
		Stack7.litter = document.getElementById('S7Litter').checked;
		Stack7.knockedover = document.getElementById('S7KnockedOver').checked;

		Stack8.totes = document.getElementById('S8Totes').value;
		Stack8.bins = document.getElementById('S8Bin').checked;
		Stack8.litter = document.getElementById('S8Litter').checked;
		Stack8.knockedover = document.getElementById('S8KnockedOver').checked;

		Stack9.totes = document.getElementById('S9Totes').value;
		Stack9.bins = document.getElementById('S9Bin').checked;
		Stack9.litter = document.getElementById('S9Litter').checked;
		Stack9.knockedover = document.getElementById('S9KnockedOver').checked;

		Stack10.totes = document.getElementById('S10Totes').value;
		Stack10.bins = document.getElementById('S10Bin').checked;
		Stack10.litter = document.getElementById('S10Litter').checked;
		Stack10.knockedover = document.getElementById('S10KnockedOver').checked;

		Stack11.totes = document.getElementById('S11Totes').value;
		Stack11.bins = document.getElementById('S11Bin').checked;
		Stack11.litter = document.getElementById('S11Litter').checked;
		Stack11.knockedover = document.getElementById('S11KnockedOver').checked;

		Stack12.totes = document.getElementById('S12Totes').value;
		Stack12.bins = document.getElementById('S12Bin').checked;
		Stack12.litter = document.getElementById('S12Litter').checked;
		Stack12.knockedover = document.getElementById('S12KnockedOver').checked;

		Stack13.totes = document.getElementById('S13Totes').value;
		Stack13.bins = document.getElementById('S13Bin').checked;
		Stack13.litter = document.getElementById('S13Litter').checked;
		Stack13.knockedover = document.getElementById('S13KnockedOver').checked;

		Stack14.totes = document.getElementById('S14Totes').value;
		Stack14.bins = document.getElementById('S14Bin').checked;
		Stack14.litter = document.getElementById('S14Litter').checked;
		Stack14.knockedover = document.getElementById('S14KnockedOver').checked;

		Stack15.totes = document.getElementById('S15Totes').value;
		Stack15.bins = document.getElementById('S15Bin').checked;
		Stack15.litter = document.getElementById('S15Litter').checked;
		Stack15.knockedover = document.getElementById('S15KnockedOver').checked;

		Stack16.totes = document.getElementById('S16Totes').value;
		Stack16.bins = document.getElementById('S16Bin').checked;
		Stack16.litter = document.getElementById('S16Litter').checked;
		Stack16.knockedover = document.getElementById('S16KnockedOver').checked;

		Stack17.totes = document.getElementById('S17Totes').value;
		Stack17.bins = document.getElementById('S17Bin').checked;
		Stack17.litter = document.getElementById('S17Litter').checked;
		Stack17.knockedover = document.getElementById('S17KnockedOver').checked;

		Stack18.totes = document.getElementById('S18Totes').value;
		Stack18.bins = document.getElementById('S18Bin').checked;
		Stack18.litter = document.getElementById('S18Litter').checked;
		Stack18.knockedover = document.getElementById('S18KnockedOver').checked;

		Stack19.totes = document.getElementById('S19Totes').value;
		Stack19.bins = document.getElementById('S19Bin').checked;
		Stack19.litter = document.getElementById('S19Litter').checked;
		Stack19.knockedover = document.getElementById('S19KnockedOver').checked;

		Stack20.totes = document.getElementById('S20Totes').value;
		Stack20.bins = document.getElementById('S20Bin').checked;
		Stack20.litter = document.getElementById('S20Litter').checked;
		Stack20.knockedover = document.getElementById('S20KnockedOver').checked;

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

   document.getElementById("S1points").innerHTML =  stackpoints(Stack1.totes, Stack1.bins, Stack1.litter, Stack1.knockedover);
   document.getElementById("S2points").innerHTML =  stackpoints(Stack2.totes, Stack2.bins, Stack2.litter, Stack2.knockedover);
   document.getElementById("S3points").innerHTML =  stackpoints(Stack3.totes, Stack3.bins, Stack3.litter, Stack3.knockedover);
   document.getElementById("S4points").innerHTML =  stackpoints(Stack4.totes, Stack4.bins, Stack4.litter, Stack4.knockedover);
   document.getElementById("S5points").innerHTML =  stackpoints(Stack5.totes, Stack5.bins, Stack5.litter, Stack5.knockedover);
   document.getElementById("S6points").innerHTML =  stackpoints(Stack6.totes, Stack6.bins, Stack6.litter, Stack6.knockedover);
   document.getElementById("S7points").innerHTML =  stackpoints(Stack7.totes, Stack7.bins, Stack7.litter, Stack7.knockedover);
   document.getElementById("S8points").innerHTML =  stackpoints(Stack8.totes, Stack8.bins, Stack8.litter, Stack8.knockedover);
   document.getElementById("S9points").innerHTML =  stackpoints(Stack9.totes, Stack9.bins, Stack9.litter, Stack9.knockedover);
   document.getElementById("S10points").innerHTML =  stackpoints(Stack10.totes, Stack10.bins, Stack10.litter, Stack10.knockedover);

   document.getElementById("S11points").innerHTML =  stackpoints(Stack11.totes, Stack11.bins, Stack11.litter, Stack11.knockedover);
   document.getElementById("S12points").innerHTML =  stackpoints(Stack12.totes, Stack12.bins, Stack12.litter, Stack12.knockedover);
   document.getElementById("S13points").innerHTML =  stackpoints(Stack13.totes, Stack13.bins, Stack13.litter, Stack13.knockedover);
   document.getElementById("S14points").innerHTML =  stackpoints(Stack14.totes, Stack14.bins, Stack14.litter, Stack14.knockedover);
   document.getElementById("S15points").innerHTML =  stackpoints(Stack15.totes, Stack15.bins, Stack15.litter, Stack15.knockedover);
   document.getElementById("S16points").innerHTML =  stackpoints(Stack16.totes, Stack16.bins, Stack16.litter, Stack16.knockedover);
   document.getElementById("S17points").innerHTML =  stackpoints(Stack17.totes, Stack17.bins, Stack17.litter, Stack17.knockedover);
   document.getElementById("S18points").innerHTML =  stackpoints(Stack18.totes, Stack18.bins, Stack18.litter, Stack18.knockedover);
   document.getElementById("S19points").innerHTML =  stackpoints(Stack19.totes, Stack19.bins, Stack19.litter, Stack19.knockedover);
   document.getElementById("S20points").innerHTML =  stackpoints(Stack20.totes, Stack20.bins, Stack20.litter, Stack20.knockedover);

	document.getElementById("TotalPoints").innerHTML = document.getElementById('S1points').value + document.getElementById('S2points').value
		+ document.getElementById('S3points').value + document.getElementById('S4points').value + document.getElementById('S5points').value
		+ document.getElementById('S6points').value + document.getElementById('S7points').value + document.getElementById('S8points').value
		+ document.getElementById('S9points').value + document.getElementById('S10points').value + document.getElementById('S11points').value
		+ document.getElementById('S12points').value + document.getElementById('S13points').value + document.getElementById('S14points').value
		+ document.getElementById('S15points').value + document.getElementById('S16points').value + document.getElementById('S17points').value
		+ document.getElementById('S18points').value + document.getElementById('S19points').value + document.getElementById('S20points').value;


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

		matchData += robotinautozone + ",";
		matchData += yellowTotesToAuto + ",";
		matchData += goodYelStackedTotes + ",";
		matchData += badYelStackedTotes + ",";
		matchData += goodBinsToAuto  + ",";
		matchData += badBinsToAuto + ",";
		matchData += StartLocation + ",";


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

		matchData += Stack1.totes + ",";
		matchData += Stack1.bins + ",";
		matchData += Stack1.litter + ",";
		matchData += Stack1.knockedover + ",";

		matchData += Stack2.totes + ",";
		matchData += Stack2.bins + ",";
		matchData += Stack2.litter + ",";
		matchData += Stack2.knockedover + ",";

		matchData += Stack3.totes + ",";
		matchData += Stack3.bins + ",";
		matchData += Stack3.litter + ",";
		matchData += Stack3.knockedover + ",";

		matchData += Stack4.totes + ",";
		matchData += Stack4.bins + ",";
		matchData += Stack4.litter + ",";
		matchData += Stack4.knockedover + ",";

		matchData += Stack5.totes + ",";
		matchData += Stack5.bins + ",";
		matchData += Stack5.litter + ",";
		matchData += Stack5.knockedover + ",";

		matchData += Stack6.totes + ",";
		matchData += Stack6.bins + ",";
		matchData += Stack6.litter + ",";
		matchData += Stack6.knockedover + ",";

		matchData += Stack7.totes + ",";
		matchData += Stack7.bins + ",";
		matchData += Stack7.litter + ",";
		matchData += Stack7.knockedover + ",";

		matchData += Stack8.totes + ",";
		matchData += Stack8.bins + ",";
		matchData += Stack8.litter + ",";
		matchData += Stack8.knockedover + ",";

		matchData += Stack9.totes + ",";
		matchData += Stack9.bins + ",";
		matchData += Stack9.litter + ",";
		matchData += Stack9.knockedover + ",";

		matchData += Stack10.totes + ",";
		matchData += Stack10.bins + ",";
		matchData += Stack10.litter + ",";
		matchData += Stack10.knockedover + ",";

		matchData += Stack11.totes + ",";
		matchData += Stack11.bins + ",";
		matchData += Stack11.litter + ",";
		matchData += Stack11.knockedover + ",";

		matchData += Stack12.totes + ",";
		matchData += Stack12.bins + ",";
		matchData += Stack12.litter + ",";
		matchData += Stack12.knockedover + ",";

		matchData += Stack13.totes + ",";
		matchData += Stack13.bins + ",";
		matchData += Stack13.litter + ",";
		matchData += Stack13.knockedover + ",";

		matchData += Stack14.totes + ",";
		matchData += Stack14.bins + ",";
		matchData += Stack14.litter + ",";
		matchData += Stack14.knockedover + ",";

		matchData += Stack15.totes + ",";
		matchData += Stack15.bins + ",";
		matchData += Stack15.litter + ",";
		matchData += Stack15.knockedover + ",";

		matchData += Stack16.totes + ",";
		matchData += Stack16.bins + ",";
		matchData += Stack16.litter + ",";
		matchData += Stack16.knockedover + ",";

		matchData += Stack17.totes + ",";
		matchData += Stack17.bins + ",";
		matchData += Stack17.litter + ",";
		matchData += Stack17.knockedover + ",";

		matchData += Stack18.totes + ",";
		matchData += Stack18.bins + ",";
		matchData += Stack18.litter + ",";
		matchData += Stack18.knockedover + ",";

		matchData += Stack19.totes + ",";
		matchData += Stack19.bins + ",";
		matchData += Stack19.litter + ",";
		matchData += Stack19.knockedover + ",";

		matchData += Stack20.totes + ",";
		matchData += Stack20.bins + ",";
		matchData += Stack20.litter + ",";
		matchData += Stack20.knockedover + ",";




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
   //document.getElementById("match_type").value = "Qualification";
	/*
    document.getElementById("team_number_in").value = "";
    document.getElementById("match_number_in").value = parseInt(document.getElementById("match_number_in").value) + 1;
    document.getElementById("starting_ball").value = 0;
    document.getElementById("floor_pickup").value = 0;

    auto_score_stack = new Array();
    tele_attempt_stack = new Array();

    document.getElementById("starting_ball").checked = false;
    document.getElementById("floor_pickup").checked = false;
    document.getElementById("in_area").checked = false;
    document.getElementById("Location").value = "A";
    auto_goals[0] = new goal_t(0,0,0,0,0);
    auto_goals[1] = new goal_t(0,0,0,0,0);

    tele_score_stack = new Array();
    document.getElementById("Front_shoot").checked = false;
    document.getElementById("Full_shoot").checked = false;
    document.getElementById("Human_load").checked = false;
    document.getElementById("Floor_load").checked = false;
    tele_goals[0] = new goal_t(0,0,0,0,0);
    tele_goals[1] = new goal_t(0,0,0,0,0);
    tele_attempts_made = [0,0,0];
	tele_attempts_miss = [0,0,0];
    tele_front_court = 0;
    tele_full_court = 0;
    tele_human_loading = 0;
    tele_driving = 0;
    tele_robot_block_time = 0;
    document.getElementById("driving_ability").value = 0;
    document.getElementById("robot_block").value = 0;
    document.getElementById("robot_block_time").value = 0;
    document.getElementById("pos_Inbounder").checked = false;
    document.getElementById("Pos_MidCourt").checked = false;
    document.getElementById("Pos_Shooter").checked = false;
    document.getElementById('Overall_Rating').value = 0;
    document.getElementById("deadball").checked = false;
    document.getElementById("brokedown").checked = false;

    penalty_stack = new Array();
    penalty = 0;
    technical = 0;
    document.getElementById("Comments").value="";

    document.getElementById("drive_type").value = "";
    document.getElementById("drive_speed").value = "";
    document.getElementById("number_wheels").value = "";
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
}


