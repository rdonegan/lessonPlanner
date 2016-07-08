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
            tx.executeSql('CREATE TABLE IF NOT EXISTS lessonplans (id integer primary key, teachername text, school text, startdate text, enddate text, grade integer, quarter integer, section text, subject text, standards text, objectives text, indicators text, resources text, notes text, subobjective text)', [], 
                function(tx,result){
                    // alert("inner result: " + JSON.stringify(result))
                })
        }, function(error){
            // alert("transaction error: " + error.message);
            myApp.alert("This is awkward - we couldn't load your lesson plans. Try restarting the app.", "Lesson Planner")
        }, function(){
            // alert("transaction ok");
            
        });


    }, function (error){
        alert('Open database ERROR: ' + JSON.stringify(error));
    }); 
    
    myApp.init() //now you should be able to create databases from within because the deviceisready
  };

  // Wait for Cordova to load
  document.addEventListener("deviceready", onDeviceReady, false);


//deletes update from file system and reverts to default db shipped with install
$$(document).on('click', '.resetData', function(e){
    myApp.confirm("Are you sure you want to reset the curriculum database? This will restore all standards, objectives, resources, indicators, and sub-objectives to their original options. Your saved lesson plans will not be affected.", "Curriculum Reset", function(){
        var store = cordova.file.dataDirectory;
        var fileName = "curriculum.csv";

        window.resolveLocalFileSystemURL(store + fileName, function(file){
            
            file.remove(function(){
                // alert("file deleted")
                window.sqlitePlugin.deleteDatabase({name: 'curriculum.db', location: 'default'}, function(){
                    formdb = window.sqlitePlugin.openDatabase({name: "curriculum.db", location: 'default', createFromLocation: 1}, function(){
                        myApp.alert("Standards, objectives, resources, and indicator data successfully reset", "Lesson Planner")
                        mainView.router.refreshPage()
                    });
                });
                 
            })
        })
    })

    

})



//FOR TESTING ONLY. DELETE BEFORE PRODUCTION
function showTable(){
    
    $(".dailyLessons").html("")
    lpdb.transaction(function(tx) {
      tx.executeSql('SELECT * FROM lessonplans', [], function (tx, results) {
       
           var len = results.rows.length, i;
           for (i = 0; i < len; i++){
              $(".dailyLessons").append("id: "+results.rows.item(i).id+" teacher: "+results.rows.item(i).teachername+" school: "+results.rows.item(i).school+" subject: "+results.rows.item(i).subject+ " standards: " + (JSON.parse(results.rows.item(i).standards))[0] + " objectives: " + results.rows.item(i).objectives + " section: "+ results.rows.item(i).section + " STARTDATE: " + results.rows.item(i).startdate); //+ "standards: " + result.rows.item(i).standards + " OBJECTIVES: " + result.rows.item(i).objectives);
            // $(".dailyLessons").append(results.rows.item(i).subject)
           }

        }, null);
      });
}

    

// Read CSV and return object array
function readCSV(){
    alert("here")
    $.ajax({
    url: "https://www.dropbox.com/s/tzebmr8asnrgaih/updated-curric-database.csv?dl=0",
    async: true,
    success: function (csvd) {
        var curricSpecs = $.csv.toObjects(csvd);
        alert(curricspecs)
        // console.log(curricSpecs);
        // console.log(items[0].eval)
        // console.log(curricSpecs)
        // return curricSpecs;
        //var jsonobject = JSON.stringify(items);
        //alert(jsonobject);
    },
    dataType: "text",
    complete: function () {
        // call a function on complete 
        // console.log(items);
        alert("in success")
    }
})
}


// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
    
});


