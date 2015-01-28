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
    var auto_goals = new Array();
    auto_goals[0] = new goal_t(0,0,0,0,0,0);
    auto_goals[1] = new goal_t(0,0,0,0,0,0);

	var tele_attempts_made = [0,0,0];
	var tele_attempts_miss = [0,0,0];

    var auto_starting_ball = 0;
    var auto_floor_ball = 0;
    var auto_in_area = 0;
    
    var auto_score_stack = new Array();

/* teleoperated */
    var tele_stacks = new Array();
    tele_stacks[0] = new stacks(0,0,0,0);
       
    var tele_front_court = 0;
    var tele_full_court = 0;
    var tele_human_loading = 0;    
    var tele_floor_loading = 0;
    
    var low_pass = 0;
    var high_pass = 0;
    var high_goal = 0;
    var low_goal = 0;
    var low_top = 0;
    
    var pass_catch = 0;
    var truss_catch = 0;
    
    var tele_driving = 0;
    var tele_robot_block = 0;
    var tele_robot_block_time = 0;
    var post_overallrating = 0;
    
    var tele_score_stack = new Array();
    var tele_attempts_score_stack = new Array();

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
 *   points (output?) - calculated points for this stack
 * */
function stacks(totes, bins, litter, points)
{
	this.totes= totes;
    this.bins = bins;
    this.litter = litter;
    this.points = this.totes*2  							/* points for totes on scoring platform  */
    this.points = this.points + this.bins*(this.totes*4);   /* points for bins on scored tote stacks  */
    this.points = this.points + (litter * 6)
    
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
       /*
        tele_front_court = document.frm_shooting_location.shooting_location[0];
        tele_full_court = document.frm_shooting_location.shooting_location[1];

        tele_human_loading = document.frm_loading_location.loading_location[0];
        tele_floor_loading = document.frm_loading_location.loading_location[1];
        
        tele_driving = document.getElementById('driving_ability').value;
        tele_robot_block = document.getElementById('robot_block').value;
        tele_robot_block_time = document.getElementById('robot_block_time').value;
        
        low_pass = document.getElementById('low_pass').checked;
        high_pass = document.getElementById('high_pass').checked;
		high_goal = document.getElementById('high_goal').checked;
        low_goal = document.getElementById('low_goal').checked;
        low_top = document.getElementById('low_top').checked;
        
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

/*
 * Updates the points values
 */
function update_points()
{
    /* update the autonomous point total */
    sum_points(auto_goals[0]);
    sum_points(auto_goals[1]);
    /* update the teleop point total */
    sum_points(tele_goals[0]);
    sum_points(tele_goals[1]);
}

/* 
 * summation of points
 */
function sum_points(var_config)
{
    /* hot goal in auton */
    if (var_config === auto_goals[0] || var_config === auto_goals[1] )
    {
    	var_config.points = 20 * var_config.hot_high +
    						15 * var_config.high +
    						11 * var_config.hot_low +
                        	6 * var_config.low +
                        	5 * var_config.in_area;
    }
    else
    {
		var_config.points = 10 * var_config.high +
                        	1 * var_config.low;
    }
}

// Replaced new_ball_score so that an undo score function could be easily added
function new_ball_score(period, status, goal)
{
    score_change(period, status, goal, 1);
}

/* 
 * new_ball_score
 */
function score_change(period, status, goal, change)
{
    var status_l;
    
    switch(status)
    {
    case 'make':
        status_l = 0; break;
    case 'miss':
        status_l = 1; break;
    }
            
    /* autonomous */
    if ( period === 'autonomous')
    {
        if(change > 0)
            auto_score_stack.push([status, goal]);
        auto_goals[status_l][goal]=auto_goals[status_l][goal]+change;
    }
    
    /* teleoperated */
    if ( period === 'teleop')
    {
        if(change > 0)
            tele_score_stack.push([status, goal]);
        tele_goals[status_l][goal]=tele_goals[status_l][goal]+change;
    }

}            

function tele_attempt_change(status, type, change)
{   
	change = parseInt(change);
    if(change > 0)
    {
    	tele_attempts_score_stack.push([status, type]);
    }
    else if(change < 0)
    {
    	var undo_values = tele_attempts_score_stack.pop();
    	status = undo_values[0];
    	type = undo_values[1];
    }

    if(status === "made")
    {
    	tele_attempts_made[type] = tele_attempts_made[type] + change;
    }
    else if(status === "miss")
    {
    	tele_attempts_miss[type] = tele_attempts_miss[type] + change;
    }
    
    Update_Stuff();
}

/*
 * Assess a penalty
 */
function new_penalty(type)
{
    switch(type)
    {
        case 'penalty':
            penalty =++ penalty; penalty_stack.push('penalty');break;
        case 'technical':
            technical =++ technical; penalty_stack.push('technical'); break;
    }
    
}

function save_data()
{
    var matchData = document.getElementById("scout_name_in").value + ",";
    matchData += document.getElementById("team_number_in").value + ",";
    matchData += document.getElementById("match_number_in").value + ",";
    matchData += document.getElementById("match_type").value + ",";
  // autonomous tab fields 
    matchData += (document.getElementById("starting_ball").checked ? "T" : "F") + ",";
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

    pitData += document.getElementById("drive_type").value + ",";
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

/*
 * Ball scored.
 */
function Ball_Score(period, status, goal)
{
    /* a ball is scored */
    new_ball_score(period, status, goal);
    
    /* update point totals */
    Update_Stuff();                 
}

function Mobility_Score()
{
	Update_Stuff();
	
	if(auto_in_area)
	{
		Ball_Score('autonomous', 'make', 'in_area');
	}
	else
	{
		Undo_Score('autonomous');
	}
}
            
/*
 * Penalty comitted
 */
function Penalty(type)
{
    new_penalty(type);
 
    /* update point totals */
    Update_Stuff();
}

//Undo a score if possible
function Undo_Score(period)
{
    switch(period)
    {
        case 'autonomous':
            if(auto_score_stack.length > 0)
            {
                var scoreData = auto_score_stack.pop();
                score_change(period, scoreData[0], scoreData[1], -1);
            }
            break;
        case 'teleop':
            if(tele_score_stack.length > 0)
            {
                var scoreData = tele_score_stack.pop();
                score_change(period, scoreData[0], scoreData[1], -1);
            }
            break;
    }
    update_data();
}

//Undo a penalty if possible
function Undo_Penalty()
{
    if(penalty_stack.length > 0)
    {
        var type = penalty_stack.pop();
        switch(type)
        {
        case 'penalty':
            penalty--; break;
        case 'technical':
            technical--; break;
        }
    }
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


    