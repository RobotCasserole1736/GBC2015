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
    	Stack4 = new stacks(0,0,0,0);					// array for stack objects 
    //Tstacks[0] = new stacks(0,0,0,0,0);			// a stereotypical stack object set to zero...
       
    var human_tote_loader = 0;						// did they have a human player loading totes?
    var human_litter_loader = 0;					// did they have a human player loading litter from slot?
    var human_litter_thrower = 0;    				// did they have a human player throwing litter across the field? 

    var tele_driving = 0;							// slider for driving ability 
    var tele_robot_litter_time = 0;					// time this bot spent dealing with litter cleanup to landfill
    var post_overallrating = 0;						// slider for general rating for this bot
    

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
	// get info
	this.totes= totes;											// stacks start with totes. 
    this.bins = bins;											// bins on tote stacks 
    this.litter = litter;										// litter in a stacked bin	
    this.knockedover = knockedover; 							// sadly no points if this is true...
}

function stackpoints(totes, bins, litter, knockedover) 
{   
    var points = 0;
    
    // calculate points
    points = this.totes;  								// 2 points for each tote in this stack on scoring platform  
    points = points + (this.bins * (this.totes * 4));   // 4 points per level for bins on scored tote stacks  
    //points = points + (litter * 6);					// points for litter in a scored bin
    //if (this.knockedover)
    //	{points = 0;}										// all that work for NOTHING!
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
 * Update Scoring Data
 */
function update_data()
{ 
	   /* autonomous data */
       /*        
        auto_starting_ball = document.getElementById('starting_ball').checked;
        auto_floor_ball = document.getElementById('floor_pickup').checked;
        auto_in_area = document.getElementById('in_area').checked;
       */  
        
    /* teleop data */
       
        human_tote_loader = document.getElementById('Human_feedsTotes').checked;
        human_litter_loader = document.getElementById('Human_feedsLitter').checked;
        human_litter_thrower = document.getElementById('Human_throwsLitter').checked;

		Stack1.totes = document.getElementById('S1Totes').value;
		Stack1.bin = document.getElementById('S1Bin').checked;
		Stack1.litter = document.getElementById('S1Litter').checked;
		Stack1.knockedover = document.getElementById('S1KnockedOver').checked;					

/*
        tele_front_court = document.frm_shooting_location.shooting_location[0];
        tele_full_court = document.frm_shooting_location.shooting_location[1];

        tele_human_loading = document.frm_loading_location.loading_location[0];
        tele_floor_loading = document.frm_loading_location.loading_location[1];
        
        tele_driving = document.getElementById('driving_ability').value;
        tele_robot_block = document.getElementById('robot_block').value;
        tele_robot_block_time = document.getElementById('robot_block_time').value;
        
        
        pass_catch = document.getElementById('pass_catch').checked;
        truss_catch = document.getElementById('truss_catch').checked;

        post_overallrating = document.getElementById('Overall_Rating').value;
		*/
    /* update points */
    /* update_points();  */
    
    /* update display */
    disp_update();
}

/* 
 * Updates the page displays
 */
function disp_update()
{
   /* autonomous */
   /*
     document.getElementById("auto_pts_display").innerHTML = auto_goals[0].points;   /* points made in auton */
   /*  document.getElementById("auto_miss_display").innerHTML = auto_goals[1].points;  /* points missed in auton */
    
    /* teleop */
    /* document.getElementById("tele_pts_display").innerHTML = tele_goals[0].points;   /* points made in teleop */
    /* document.getElementById("tele_miss_display").innerHTML = tele_goals[1].points;  /* points missed in teleop */
   
   /*
    document.getElementById("pass_made_display").innerHTML = tele_attempts_made[0];
    document.getElementById("pass_miss_display").innerHTML = tele_attempts_miss[0];
    document.getElementById("truss_throw_made_display").innerHTML = tele_attempts_made[1];
    document.getElementById("truss_throw_miss_display").innerHTML = tele_attempts_miss[1];
    document.getElementById("truss_catch_made_display").innerHTML = tele_attempts_made[2];
    document.getElementById("truss_catch_miss_display").innerHTML = tele_attempts_miss[2];
     
    */
   document.getElementById("S1points").innerHTML = stackpoints(Stack1.totes, Stack1.bin, Stack1.litter, Stack1.KnockedOver);
   
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
    
    
    
    /* penalty */
   /*
    document.getElementById("penalty_display1").innerHTML = penalty;
    document.getElementById("technical_display1").innerHTML = technical;
    document.getElementById("penalty_display2").innerHTML = penalty;
    document.getElementById("technical_display2").innerHTML = technical;
	*/
    switch(post_overallrating)
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
/*    matchData += (document.getElementById("starting_ball").checked ? "T" : "F") + ",";
    matchData += (document.getElementById("floor_pickup").checked ? "T" : "F") + ",";
    matchData += (document.getElementById("in_area").checked ? "T" : "F") + ",";
    matchData += document.getElementById("auto_pts_display").innerHTML + ",";
    matchData += document.getElementById("auto_miss_display").innerHTML + ",";
    matchData += document.getElementById("penalty_display1").innerHTML + ",";
    matchData += document.getElementById("technical_display1").innerHTML + ",";
    matchData += document.getElementById("Location").value + ",";
  // teleop tab fields
    matchData += (document.getElementById("Front_shoot").checked ? "T" : "F") + ",";
    matchData += (document.getElementById("Full_shoot").checked ? "T" : "F") + ",";
    matchData += (document.getElementById("Human_load").checked ? "T" : "F") + ",";
    matchData += (document.getElementById("Floor_load").checked ? "T" : "F") + ",";
    matchData += document.getElementById("tele_pts_display").innerHTML + ",";
    matchData += document.getElementById("tele_miss_display").innerHTML + ",";
    matchData += document.getElementById("penalty_display2").innerHTML + ",";
    matchData += document.getElementById("technical_display2").innerHTML + ",";
    matchData += document.getElementById("driving_ability").value + ",";
    matchData += document.getElementById("robot_block").value + ",";
    matchData += document.getElementById("robot_block_time").value + ",";
    matchData += tele_attempts_made[0] + ",";
    matchData += tele_attempts_miss[0] + ",";
    matchData += tele_attempts_made[1] + ",";
    matchData += tele_attempts_miss[1] + ",";
    matchData += tele_attempts_made[2] + ",";
    matchData += tele_attempts_miss[2] + ",";
    matchData += (document.getElementById("human_feedsTotes").checked ? "T" : "F") + ",";
    matchData += (document.getElementById("human_feedsLitter").checked ? "T" : "F") + ",";
    matchData += (document.getElementById("human_throwsLitter").checked ? "T" : "F") + ",";
    matchData += (document.getElementById("deadball").checked ? "T" : "F") + ",";
    matchData += (document.getElementById("brokedown").checked ? "T" : "F") + ",";
    matchData += document.getElementById("Overall_Rating").value + ",";
    
    var sharedData = document.getElementById("scout_name_in").value + ",";
    sharedData += document.getElementById("team_number_in").value + ",";
    sharedData += document.getElementById("match_number_in").value + ",";
    sharedData += document.getElementById("match_type").value + ",";
  // autonomous tab fields 
    sharedData += (document.getElementById("starting_ball").checked ? "T" : "F") + ",";
    sharedData += (document.getElementById("floor_pickup").checked ? "T" : "F") + ",";
    sharedData += (document.getElementById("in_area").checked ? "T" : "F") + ",";
    sharedData += document.getElementById("auto_pts_display").innerHTML + ",";
    sharedData += document.getElementById("auto_miss_display").innerHTML + ",";
    sharedData += document.getElementById("penalty_display1").innerHTML + ",";
    sharedData += document.getElementById("technical_display1").innerHTML + ",";
    sharedData += document.getElementById("Location").value + ",";
  // teleop tab fields
    sharedData += (document.getElementById("Front_shoot").checked ? "T" : "F") + ",";
    sharedData += (document.getElementById("Full_shoot").checked ? "T" : "F") + ",";
    sharedData += (document.getElementById("Human_load").checked ? "T" : "F") + ",";
    sharedData += (document.getElementById("Floor_load").checked ? "T" : "F") + ",";
    sharedData += document.getElementById("tele_pts_display").innerHTML + ",";
    sharedData += document.getElementById("tele_miss_display").innerHTML + ",";
    sharedData += document.getElementById("penalty_display2").innerHTML + ",";
    sharedData += document.getElementById("technical_display2").innerHTML + ",";
    sharedData += document.getElementById("driving_ability").value + ",";
    sharedData += document.getElementById("robot_block").value + ",";
    sharedData += document.getElementById("robot_block_time").value + ",";
    sharedData += tele_attempts_made[0] + ",";
    sharedData += tele_attempts_miss[0] + ",";
    sharedData += tele_attempts_made[1] + ",";
    sharedData += tele_attempts_miss[1] + ",";
    sharedData += tele_attempts_made[2] + ",";
    sharedData += tele_attempts_miss[2] + ",";
    sharedData += (document.getElementById("pos_Inbounder").checked ? "T" : "F") + ",";
    sharedData += (document.getElementById("Pos_MidCourt").checked ? "T" : "F") + ",";
    sharedData += (document.getElementById("Pos_Shooter").checked ? "T" : "F") + ",";
    sharedData += (document.getElementById("deadball").checked ? "T" : "F") + ",";
    sharedData += (document.getElementById("brokedown").checked ? "T" : "F") + "\n";


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
*/    
    var existingSharedData = localStorage.getItem("SharedData");
    if(existingSharedData == null)
        localStorage.setItem("SharedData",sharedData);
    else
        localStorage.setItem("SharedData",existingSharedData + sharedData);
    document.getElementById("SharedDataCSV").value = localStorage.getItem("SharedData");
    

     
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


    