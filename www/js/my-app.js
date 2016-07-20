// Initialize your app
var myApp = new Framework7({
    init:false,
    material: true,
    swipePanel: 'left',
    template7Pages: true,
    precompileTemplates: true
});


// Export selectors engine
var $$ = Dom7;

//Initialize Form database
var formdb;

//Initialize database for all saved lesson plans
var lpdb;

var logOb; //file object

// Cordova is ready
  function onDeviceReady() {
    //curriculum.db is only pre-populated if that database doesn't already exist (AKA on first run)
    formdb = window.sqlitePlugin.openDatabase({name: "curriculum.db", location: 'default', createFromLocation: 1});//, checkForUpdates);
    //initialize lesson plan database 
    lpdb = window.sqlitePlugin.openDatabase({name: "plans.db", location: 'default'}, function(lpdb){
        lpdb.transaction(function(tx){
            tx.executeSql('CREATE TABLE IF NOT EXISTS lessonplans (id integer primary key, teachername text, school text, startdate text, enddate text, grade integer, quarter integer, section text, subject text, standards text, objectives text, indicators text, resources text, notes text, subobjective text, sequence text)', [])
        }, function(error){
            // alert("transaction error: " + error.message);
            myApp.alert("This is awkward - we couldn't load your lesson plans. Try restarting the app.", "Lesson Planner")
        }, function(){
            // alert("transaction ok");
            //run testInsert() here
            testInsert()
            
        });


    }, function (error){
        alert('Open database ERROR: ' + JSON.stringify(error));
    }); 
    
    myApp.init() //now you should be able to create databases from within because the deviceisready
  };

  // Wait for Cordova to load
  document.addEventListener("deviceready", onDeviceReady, false);


  //for testing only DELETE ON PRODUCTION
  function testInsert(){
    // alert("success")

    if (window.localStorage.getItem("loggedIn") != 1){
      window.localStorage.setItem("loggedIn", 1)

      var startArray = ["", "2016-07-19", "2016-08-20", "2016-10-10","2016-11-04", "2016-03-06"]
      var endArray = ["","2016-07-22", "2016-09-04", "2016-10-10", "2016-11-04", "2016-03-06"]
      var gradeArray = [1,1,2,3,4]
      var subjectArray=["","english","math","science"]


      lpdb.transaction(function(tx){


        for(var i=0; i <80; i++){
          var teachername = "Ryan Donegan"
          var school = "Koror Elementary"
          var startdate = startArray[Math.floor((Math.random() * 5)+1)]//"2016-07-13"
          var enddate = endArray[Math.floor((Math.random() * 5)+1)]//"2016-07-14"
          var grade = gradeArray[Math.floor((Math.random() * 4) + 1)]//3
          var quarter = 1
          var section = "A"
          var subject = subjectArray[Math.floor((Math.random() * 3) + 1)]//"english"
          var standards = "[\"1sample standard\", \"2sample standard\"]"
          var objectives = "[\"1sample object\", \"2sample objective\"]"
          var indicators = "[]"
          var resources = "[\"1sample resource\", \"2sample resources\"]"
          var notes = "Note here"
          var subobjectives = "[]"
          var sequence = "sequence here"
            // alert("standards: " + standards + " subject: " + subject)
            // alert("lpdb right now: " + JSON.stringify(lpdb))
            var executeQuery = "INSERT INTO lessonplans (teachername, school, startdate, enddate, grade, quarter, section, subject, standards, objectives, indicators, resources, notes, subobjective, sequence) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
            // var executeQuery = "INSERT INTO lessonplans (subject) VALUES (?)"
            tx.executeSql(executeQuery, [teachername, school, startdate, enddate, grade, quarter, section, subject, standards, objectives, indicators, resources, notes, subobjectives, sequence],
                // tx.executeSql("INSERT INTO lessonplans (subject, section, standards) VALUES (?, ?, ?)", [subject, section, standards],
                function(tx, result){
                 // alert("success")
                    
                },
                function(error){
                    // alert("Error occurred. Couldn't save lesson plan.")
                    myApp.alert("Error occurred. Couldn't save lesson plan.", "Lesson Planner")
                })

        }
        
      })
    }
    else{
      alert("not running not for first time")

    }


  }    

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
    
});
