//$(document).ready(function() {


/*

stationname:	array of station names 


*/

//var nameStation = new Array("Platform 9 3/4", "Kings Cross", "Cheshire", "Taw Valley", "Hogsmead");


//var now = moment();

//start; options to try listed above??// 

$(document).ready(function(){


	var config = {
	    apiKey: "AIzaSyALyUg4r50I07XEyIhyReiZVJI0V8RHlJo",
	    authDomain: "train-schedule-5e847.firebaseapp.com",
	    databaseURL: "https://train-schedule-5e847.firebaseio.com",
	    storageBucket: "train-schedule-5e847.appspot.com",
	    messagingSenderId: "531555123225"
	  };
	  firebase.initializeApp(config);


	//  firebase
	var trainData = firebase.dataBase();

	//  adding trains button
	$("#addTrainBtn").on("click", function(){

		// variables/assign input
		var trainName = $("#trainNameInput").val().trim();
		var lineName = $("#lineInput").val().trim();
		var destination = $("#destinationInput").val().trim();
		var trainTimeInput = moment($("#trainTimeInput").val().trim(), "HH:mm").subtract(10, "years").format("X");
		var frequencyInput = $("#frequencyInput").val().trim();

		
		console.log(trainName);
		console.log(lineName);
		console.log(destination);
		console.log(trainTimeInput);
		console.log(frequencyInput);

		// local (temp) object for train info
		// this will push to firebase
		var newTrain = {
			name:  trainName,
			line: lineName,
			destination: destination,
			trainTime: trainTimeInput,
			frequency: frequencyInput,
		}

		// pushing trainInfo to firebase
		trainData.ref().push(newTrain);

		// clear text-boxes
		$("#trainNameInput").val("");
		$("#lineInput").val("");
		$("#destinationInput").val("");
		$("#trainInput").val("");
		$("#frequencyInput").val("");

		// prevents page from refreshing
		return false;
	});

	trainData.on("child_added", function(childSnapshot, prevChildKey){

		console.log(childSnapshot.val());

		// assign firebase variables to snapshots.
		var firebaseName = childSnapshot.val().name;
		var firebaseLine = childSnapshot.val().line;
		var firebaseDestination = childSnapshot.val().destination;
		var firebaseTrainTimeInput = childSnapshot.val().trainTime;
		var firebaseFrequency = childSnapshot.val().frequency;
		
		var diffTime = moment().diff(moment.unix(firebaseTrainTimeInput), "minutes");
		var timeRemainder = moment().diff(moment.unix(firebaseTrainTimeInput), "minutes") % firebaseFrequency ;
		var minutes = firebaseFrequency - timeRemainder;

		var nextTrainArrival = moment().add(minutes, "m").format("hh:mm A"); 
		
		// checking for correct times and info
		console.log(minutes);
		console.log(nextTrainArrival);
		console.log(moment().format("hh:mm A"));
		console.log(nextTrainArrival);
		console.log(moment().format("X"));

		// appending train info to table on page
		$("#trainTable > tbody").append("<tr><td>" + firebaseName + "</td><td>" + firebaseLine + "</td><td>"+ firebaseDestination + "</td><td>" + firebaseFrequency + " mins" + "</td><td>" + nextTrainArrival + "</td><td>" + minutes + "</td></tr>");

	});
});